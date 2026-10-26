-- DriveTrust Ultra: Production PostgreSQL + PostGIS Initialization Schema
-- Version: 1.0.0-PROD

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Global Enumerations
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CUSTOMER', 'DRIVER', 'ADMIN', 'DISPATCHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transmission_type AS ENUM ('MANUAL', 'AUTOMATIC', 'EV', 'LUXURY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_category AS ENUM ('HATCHBACK', 'SEDAN', 'SUV', 'LUXURY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('PENDING_DOCS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_service_type AS ENUM ('HOURLY', 'NIGHT_DROP', 'OUTSTATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'SEARCHING', 'DISPATCHED', 'ACCEPTED', 
        'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'REFUNDED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    status account_status DEFAULT 'ACTIVE',
    profile_photo_url TEXT,
    fcm_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Customer Vehicles Table
CREATE TABLE IF NOT EXISTS customer_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    transmission transmission_type NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON customer_vehicles(customer_id);

-- 3. Driver Profiles Table
CREATE TABLE IF NOT EXISTS driver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    experience_years INT NOT NULL,
    supported_transmissions transmission_type[] NOT NULL,
    service_tags VARCHAR(30)[] NOT NULL,
    kyc_status kyc_status DEFAULT 'PENDING_DOCS',
    kyc_rejection_reason TEXT,
    rating_avg NUMERIC(3, 2) DEFAULT 5.00,
    total_trips INT DEFAULT 0,
    safety_telematics_score INT DEFAULT 100,
    is_online BOOLEAN DEFAULT FALSE,
    current_h3_index VARCHAR(20),
    last_location GEOMETRY(Point, 4326),
    last_location_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_drivers_online ON driver_profiles(is_online) WHERE is_online = TRUE;
CREATE INDEX IF NOT EXISTS idx_drivers_h3 ON driver_profiles(current_h3_index);
CREATE INDEX IF NOT EXISTS idx_drivers_location ON driver_profiles USING GIST(last_location);

-- 4. Driver KYC Documents
CREATE TABLE IF NOT EXISTS driver_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES driver_profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- LICENSE_FRONT, LICENSE_BACK, AADHAAR_FRONT, POLICE_CLEARANCE, BIOMETRIC_REF
    file_url TEXT NOT NULL,
    parivahan_verified BOOLEAN DEFAULT FALSE,
    parivahan_data JSONB,
    admin_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_docs_driver ON driver_documents(driver_id);

-- 5. Pricing Zones (City-Based Multi-Zone Engine)
CREATE TABLE IF NOT EXISTS pricing_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Mode A: Hourly
    hourly_base_hours INT DEFAULT 2,
    hourly_base_fare NUMERIC(10, 2) NOT NULL,
    hourly_extra_hour_rate NUMERIC(10, 2) NOT NULL,
    hourly_extra_km_rate NUMERIC(10, 2) NOT NULL,
    
    -- Mode B: Night Safe-Drop
    night_base_fare NUMERIC(10, 2) NOT NULL,
    night_per_km_rate NUMERIC(10, 2) NOT NULL,
    night_surcharge_multiplier NUMERIC(3, 2) DEFAULT 1.25,
    driver_return_allowance NUMERIC(10, 2) NOT NULL,
    
    -- Mode C: Outstation
    outstation_daily_rate NUMERIC(10, 2) NOT NULL,
    outstation_driver_allowance NUMERIC(10, 2) NOT NULL,
    outstation_night_fee NUMERIC(10, 2) DEFAULT 250.00,
    
    -- Platform Cut
    platform_commission_percent NUMERIC(5, 2) DEFAULT 20.00,
    convenience_fee NUMERIC(10, 2) DEFAULT 30.00,
    cancellation_fee NUMERIC(10, 2) DEFAULT 100.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pricing_city ON pricing_zones(city_name, state_name);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(12) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES driver_profiles(id),
    vehicle_id UUID REFERENCES customer_vehicles(id),
    service_type booking_service_type NOT NULL,
    transmission_required transmission_type NOT NULL,
    
    pickup_address TEXT NOT NULL,
    pickup_location GEOMETRY(Point, 4326) NOT NULL,
    pickup_h3_index VARCHAR(20) NOT NULL,
    dropoff_address TEXT,
    dropoff_location GEOMETRY(Point, 4326),
    
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    package_hours INT,
    
    start_otp VARCHAR(4) NOT NULL,
    status booking_status DEFAULT 'SEARCHING',
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_h3 ON bookings(pickup_h3_index);

-- 7. Fares & Invoices Table
CREATE TABLE IF NOT EXISTS fares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    base_fare NUMERIC(10, 2) NOT NULL,
    extra_time_fare NUMERIC(10, 2) DEFAULT 0.00,
    distance_fare NUMERIC(10, 2) DEFAULT 0.00,
    night_surge_fare NUMERIC(10, 2) DEFAULT 0.00,
    driver_return_allowance NUMERIC(10, 2) DEFAULT 0.00,
    convenience_fee NUMERIC(10, 2) NOT NULL,
    total_customer_fare NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL,
    driver_earnings NUMERIC(10, 2) NOT NULL,
    payment_status payment_status DEFAULT 'PENDING',
    payment_gateway_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fares_payment_status ON fares(payment_status);

-- 8. Driver Wallets & Automated Settlements
CREATE TABLE IF NOT EXISTS driver_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID UNIQUE NOT NULL REFERENCES driver_profiles(id) ON DELETE CASCADE,
    balance NUMERIC(10, 2) DEFAULT 0.00 CHECK (balance >= 0),
    total_withdrawn NUMERIC(10, 2) DEFAULT 0.00,
    bank_account_number VARCHAR(35),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES driver_wallets(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'CREDIT', 'DEBIT'
    description TEXT NOT NULL,
    settlement_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet ON wallet_transactions(wallet_id);

-- 9. Seed Default Pricing Zones
INSERT INTO pricing_zones (
    city_name, state_name, hourly_base_hours, hourly_base_fare, 
    hourly_extra_hour_rate, hourly_extra_km_rate, night_base_fare, 
    night_per_km_rate, night_surcharge_multiplier, driver_return_allowance, 
    outstation_daily_rate, outstation_driver_allowance, platform_commission_percent
) VALUES (
    'Bangalore', 'Karnataka', 2, 349.00, 99.00, 12.00, 299.00, 14.00, 1.25, 150.00, 1799.00, 350.00, 20.00
), (
    'Mumbai', 'Maharashtra', 2, 399.00, 119.00, 14.00, 349.00, 16.00, 1.30, 200.00, 1999.00, 400.00, 20.00
), (
    'Delhi NCR', 'Delhi', 2, 349.00, 99.00, 12.00, 299.00, 14.00, 1.25, 150.00, 1799.00, 350.00, 20.00
) ON CONFLICT (city_name, state_name) DO NOTHING;

-- 10. Auto-Update Timestamp Function and Triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_drivers ON driver_profiles;
CREATE TRIGGER set_timestamp_drivers BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_bookings ON bookings;
CREATE TRIGGER set_timestamp_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
