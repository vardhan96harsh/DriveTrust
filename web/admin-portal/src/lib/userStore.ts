"use client";

export interface CustomerVehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  transmission: "AUTOMATIC" | "MANUAL" | "LUXURY";
  color?: string;
  year?: number;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  vehicles: CustomerVehicle[];
  createdAt: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  verificationStatus?: "VERIFIED" | "PENDING" | "UNVERIFIED";
  permanentPin: string; // 4-digit permanent unique Sathi PIN
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  phoneVerified?: boolean;
  verifiedAt?: string;
  notes?: string;
}

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  licenseNumber: string;
  licenseExpiry: string;
  rto: string;
  experienceYears: number;
  transmissions: ("MANUAL" | "AUTOMATIC" | "LUXURY")[];
  aadhaarNumber: string;
  upiId: string;
  kycStatus: "APPROVED" | "UNDER_REVIEW" | "REJECTED";
  rating: number;
  totalTrips: number;
  walletBalance: number;
  isOnline: boolean;
  createdAt: string;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  policeVerificationStatus?: "CLEARED" | "PENDING" | "REJECTED";
  isDlVerified?: boolean;
  verifiedAt?: string;
  notes?: string;
}

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "cust-01",
    fullName: "Harshvardhan",
    phone: "+91 98450 12345",
    email: "harsh@example.com",
    city: "Vidisha",
    address: "Station Road, Civil Lines, Vidisha (M.P.)",
    emergencyContact: "Family Contact (Vidisha)",
    emergencyPhone: "+91 94251 09876",
    isBlocked: false,
    verificationStatus: "VERIFIED",
    permanentPin: "4892",
    aadhaarNumber: "XXXX-XXXX-8921",
    aadhaarVerified: true,
    phoneVerified: true,
    verifiedAt: "2024-01-16",
    notes: "Primary account holder • Registered Fortuner & BMW",
    vehicles: [
      {
        id: "veh-01",
        brand: "Toyota",
        model: "Fortuner 4x4",
        plate: "MP-40-CA-4921",
        transmission: "AUTOMATIC",
        color: "Pearl White",
        year: 2023,
      },
      {
        id: "veh-02",
        brand: "BMW",
        model: "330Li M Sport",
        plate: "MP-04-BK-8822",
        transmission: "LUXURY",
        color: "Mineral Grey",
        year: 2024,
      },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: "cust-02",
    fullName: "Priya Sharma",
    phone: "+91 99801 77332",
    email: "priya.sharma@example.com",
    city: "Bhopal",
    address: "Arera Colony, E-3, Bhopal (M.P.)",
    emergencyContact: "Dr. Sharma",
    emergencyPhone: "+91 98930 11223",
    isBlocked: false,
    verificationStatus: "VERIFIED",
    permanentPin: "7332",
    aadhaarNumber: "XXXX-XXXX-4412",
    aadhaarVerified: true,
    phoneVerified: true,
    verifiedAt: "2024-02-21",
    notes: "Regular Bhopal-Vidisha commuter",
    vehicles: [
      {
        id: "veh-03",
        brand: "Hyundai",
        model: "Creta SX(O)",
        plate: "MP-04-AB-1290",
        transmission: "AUTOMATIC",
        color: "Phantom Black",
        year: 2022,
      },
    ],
    createdAt: "2024-02-20",
  },
  {
    id: "cust-03",
    fullName: "Rajesh Chouhan",
    phone: "+91 97412 88901",
    email: "rajesh.chouhan@example.com",
    city: "Vidisha",
    address: "Durga Nagar, Vidisha (M.P.)",
    emergencyContact: "Sunil Chouhan",
    emergencyPhone: "+91 97555 44332",
    isBlocked: false,
    verificationStatus: "PENDING",
    permanentPin: "8890",
    aadhaarNumber: "XXXX-XXXX-7721",
    aadhaarVerified: false,
    phoneVerified: true,
    notes: "Requires Aadhaar e-KYC document re-verification",
    vehicles: [
      {
        id: "veh-04",
        brand: "Mahindra",
        model: "Scorpio-N 4x4",
        plate: "MP-40-MB-7788",
        transmission: "AUTOMATIC",
        color: "Deep Forest",
        year: 2023,
      },
    ],
    createdAt: "2024-03-10",
  },
];

export const DEFAULT_DRIVERS: Driver[] = [
  {
    id: "drv-01",
    fullName: "Rajesh Sharma",
    phone: "+91 99801 84920",
    city: "Vidisha",
    licenseNumber: "MP4020190012345",
    licenseExpiry: "2038-04-12",
    rto: "MP-40 (Vidisha, MP)",
    experienceYears: 8,
    transmissions: ["AUTOMATIC", "MANUAL", "LUXURY"],
    aadhaarNumber: "7821-9920-1123",
    upiId: "rajesh.sharma@okhdfcbank",
    kycStatus: "APPROVED",
    rating: 4.96,
    totalTrips: 1420,
    walletBalance: 1850,
    isOnline: true,
    createdAt: "2023-11-01",
    isBlocked: false,
    policeVerificationStatus: "CLEARED",
    isDlVerified: true,
    verifiedAt: "2023-11-05",
    notes: "Senior chauffeur • 5-star rating on Vidisha-Bhopal route",
  },
  {
    id: "drv-02",
    fullName: "Mukesh Patel",
    phone: "+91 98451 22340",
    city: "Bhopal",
    licenseNumber: "MP0420180094821",
    licenseExpiry: "2040-09-18",
    rto: "MP-04 (Bhopal, MP)",
    experienceYears: 7,
    transmissions: ["MANUAL", "AUTOMATIC"],
    aadhaarNumber: "6234-8812-9011",
    upiId: "mukesh.patel@paytm",
    kycStatus: "APPROVED",
    rating: 4.91,
    totalTrips: 1120,
    walletBalance: 1420,
    isOnline: true,
    createdAt: "2024-01-10",
    isBlocked: false,
    policeVerificationStatus: "CLEARED",
    isDlVerified: true,
    verifiedAt: "2024-01-12",
    notes: "Bhopal city specialist • Luxury automatic certified",
  },
  {
    id: "drv-03",
    fullName: "Dharmendra Lodhi",
    phone: "+91 98450 12345",
    city: "Vidisha",
    licenseNumber: "MP4020210049281",
    licenseExpiry: "2039-08-15",
    rto: "MP-40 (Vidisha, MP)",
    experienceYears: 6,
    transmissions: ["MANUAL", "AUTOMATIC"],
    aadhaarNumber: "5544-3322-1100",
    upiId: "dharmendra.lodhi@oksbi",
    kycStatus: "UNDER_REVIEW",
    rating: 4.86,
    totalTrips: 512,
    walletBalance: 980,
    isOnline: false,
    createdAt: "2024-04-05",
    isBlocked: false,
    policeVerificationStatus: "PENDING",
    isDlVerified: false,
    notes: "Background check verification underway",
  },
  {
    id: "drv-04",
    fullName: "Sunil Verma",
    phone: "+91 97654 32100",
    city: "Bhopal",
    licenseNumber: "MP0420200034819",
    licenseExpiry: "2036-11-20",
    rto: "MP-04 (Bhopal, MP)",
    experienceYears: 10,
    transmissions: ["AUTOMATIC", "MANUAL", "LUXURY"],
    aadhaarNumber: "8899-7766-5544",
    upiId: "sunil.verma@icici",
    kycStatus: "UNDER_REVIEW",
    rating: 4.93,
    totalTrips: 2150,
    walletBalance: 2450,
    isOnline: false,
    createdAt: "2024-05-12",
    isBlocked: false,
    policeVerificationStatus: "PENDING",
    isDlVerified: true,
    notes: "Awaiting local police commissionerate clearance",
  },
];

const CUSTOMERS_KEY = "sathi_customers_v1";
const DRIVERS_KEY = "sathi_drivers_v1";
const ACTIVE_CUSTOMER_KEY = "sathi_active_customer_id";
const ACTIVE_DRIVER_KEY = "sathi_active_driver_id";

// Safe localStorage access helper
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// ============================================================================
// CUSTOMER STORE API (CRUD + BLOCK/UNBLOCK + VERIFY)
// ============================================================================

// Helper to generate a unique 4-digit Sathi PIN guaranteed not to collide with existing users
export function generateUniqueCustomerPin(existing?: Customer[]): string {
  const current = existing || getCustomers();
  const takenPins = new Set(current.map((c) => c.permanentPin).filter(Boolean));

  for (let attempt = 0; attempt < 5000; attempt++) {
    const candidate = String(Math.floor(1000 + Math.random() * 9000));
    if (!takenPins.has(candidate)) {
      return candidate;
    }
  }
  // Fallback timestamp 4-digits
  return String(Date.now()).slice(-4);
}

export function isPinTaken(pin: string, excludeCustomerId?: string): boolean {
  if (!pin) return false;
  const current = getCustomers();
  return current.some((c) => c.permanentPin === pin && c.id !== excludeCustomerId);
}

export function getCustomers(): Customer[] {
  const rawCustomers = getStorageItem<Customer[]>(CUSTOMERS_KEY, DEFAULT_CUSTOMERS);
  // Ensure every customer has a permanentPin (backwards compatibility with existing localStorage)
  let changed = false;
  const migrated = rawCustomers.map((cust, idx) => {
    if (!cust.permanentPin) {
      changed = true;
      const defaultPin = DEFAULT_CUSTOMERS.find((d) => d.id === cust.id)?.permanentPin;
      return {
        ...cust,
        permanentPin: defaultPin || generateUniqueCustomerPin(rawCustomers.slice(0, idx)),
      };
    }
    return cust;
  });

  if (changed && typeof window !== "undefined") {
    setStorageItem(CUSTOMERS_KEY, migrated);
  }

  return migrated;
}

export function saveCustomer(customer: Omit<Customer, "id" | "createdAt"> & { id?: string }): Customer {
  const current = getCustomers();
  const id = customer.id || `cust-${Date.now().toString().slice(-4)}`;
  const permanentPin = customer.permanentPin || generateUniqueCustomerPin(current);
  const newCustomer: Customer = {
    ...customer,
    id,
    permanentPin,
    createdAt: customer.id ? (current.find((c) => c.id === id)?.createdAt || new Date().toISOString().split("T")[0]) : new Date().toISOString().split("T")[0],
    isBlocked: customer.isBlocked ?? false,
    verificationStatus: customer.verificationStatus ?? "VERIFIED",
    phoneVerified: customer.phoneVerified ?? true,
    aadhaarVerified: customer.aadhaarVerified ?? true,
  };

  const existingIndex = current.findIndex((c) => c.id === id);
  let updated: Customer[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...current[existingIndex], ...newCustomer };
  } else {
    updated = [newCustomer, ...current];
  }

  setStorageItem(CUSTOMERS_KEY, updated);
  setActiveCustomerId(id);
  return newCustomer;
}

export function updateCustomerProfile(id: string, updates: Partial<Customer>): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updated: Customer = {
    ...customers[index],
    ...updates,
    id, // protect ID
  };
  customers[index] = updated;
  setStorageItem(CUSTOMERS_KEY, customers);
  return updated;
}

export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  if (filtered.length === customers.length) return false;

  setStorageItem(CUSTOMERS_KEY, filtered);
  if (getActiveCustomerId() === id) {
    setActiveCustomerId(filtered[0]?.id || null);
  }
  return true;
}

export function blockCustomer(id: string, reason: string): Customer | null {
  return updateCustomerProfile(id, {
    isBlocked: true,
    blockReason: reason || "Administrative suspension / Terms violation",
    blockedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
  });
}

export function unblockCustomer(id: string): Customer | null {
  return updateCustomerProfile(id, {
    isBlocked: false,
    blockReason: undefined,
    blockedAt: undefined,
  });
}

export function verifyCustomerData(id: string, method: string = "Aadhaar e-KYC & Mobile OTP"): Customer | null {
  return updateCustomerProfile(id, {
    verificationStatus: "VERIFIED",
    aadhaarVerified: true,
    phoneVerified: true,
    verifiedAt: new Date().toISOString().split("T")[0],
    notes: `Identity verified via ${method}`,
  });
}

export function rejectCustomerVerification(id: string, reason: string = "Document mismatch / unverified details"): Customer | null {
  return updateCustomerProfile(id, {
    verificationStatus: "UNVERIFIED",
    aadhaarVerified: false,
    notes: `Verification rejected: ${reason}`,
  });
}

export function addVehicleToCustomer(customerId: string, vehicle: Omit<CustomerVehicle, "id">): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  const newVehicle: CustomerVehicle = {
    ...vehicle,
    id: `veh-${Date.now().toString().slice(-4)}`,
  };

  const updatedCustomer = {
    ...customers[index],
    vehicles: [...customers[index].vehicles, newVehicle],
  };

  customers[index] = updatedCustomer;
  setStorageItem(CUSTOMERS_KEY, customers);
  return updatedCustomer;
}

export function updateCustomerVehicle(customerId: string, vehicle: CustomerVehicle): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  const customer = customers[index];
  const vehicleIndex = customer.vehicles.findIndex((v) => v.id === vehicle.id);
  if (vehicleIndex === -1) return null;

  const updatedVehicles = [...customer.vehicles];
  updatedVehicles[vehicleIndex] = vehicle;

  const updatedCustomer = {
    ...customer,
    vehicles: updatedVehicles,
  };

  customers[index] = updatedCustomer;
  setStorageItem(CUSTOMERS_KEY, customers);
  return updatedCustomer;
}

export function deleteCustomerVehicle(customerId: string, vehicleId: string): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  const customer = customers[index];
  const updatedVehicles = customer.vehicles.filter((v) => v.id !== vehicleId);

  const updatedCustomer = {
    ...customer,
    vehicles: updatedVehicles,
  };

  customers[index] = updatedCustomer;
  setStorageItem(CUSTOMERS_KEY, customers);
  return updatedCustomer;
}

export function getActiveCustomerId(): string {
  if (typeof window === "undefined") return DEFAULT_CUSTOMERS[0].id;
  const id = localStorage.getItem(ACTIVE_CUSTOMER_KEY);
  return id || DEFAULT_CUSTOMERS[0].id;
}

export function setActiveCustomerId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(ACTIVE_CUSTOMER_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CUSTOMER_KEY);
  }
}

export function getActiveCustomer(): Customer | null {
  const customers = getCustomers();
  const activeId = getActiveCustomerId();
  return customers.find((c) => c.id === activeId) || customers[0] || null;
}

// ============================================================================
// DRIVER STORE API (CRUD + BLOCK/UNBLOCK + VERIFY)
// ============================================================================

export function getDrivers(): Driver[] {
  return getStorageItem<Driver[]>(DRIVERS_KEY, DEFAULT_DRIVERS);
}

export function saveDriver(driver: Omit<Driver, "id" | "createdAt" | "kycStatus" | "rating" | "totalTrips" | "walletBalance" | "isOnline"> & { id?: string; kycStatus?: Driver["kycStatus"] }): Driver {
  const current = getDrivers();
  const id = driver.id || `drv-${Date.now().toString().slice(-4)}`;
  const existing = current.find((d) => d.id === id);

  const newDriver: Driver = {
    ...driver,
    id,
    kycStatus: driver.kycStatus || existing?.kycStatus || "UNDER_REVIEW",
    rating: existing?.rating ?? 5.0,
    totalTrips: existing?.totalTrips ?? 0,
    walletBalance: existing?.walletBalance ?? 0,
    isOnline: existing?.isOnline ?? false,
    isBlocked: existing?.isBlocked ?? false,
    policeVerificationStatus: existing?.policeVerificationStatus ?? "PENDING",
    isDlVerified: existing?.isDlVerified ?? false,
    createdAt: existing?.createdAt || new Date().toISOString().split("T")[0],
  };

  const existingIndex = current.findIndex((d) => d.id === id);
  let updated: Driver[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...current[existingIndex], ...newDriver };
  } else {
    updated = [newDriver, ...current];
  }

  setStorageItem(DRIVERS_KEY, updated);
  setActiveDriverId(id);
  return newDriver;
}

export function updateDriverProfile(id: string, updates: Partial<Driver>): Driver | null {
  const drivers = getDrivers();
  const index = drivers.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const updated: Driver = {
    ...drivers[index],
    ...updates,
    id, // protect ID
  };
  drivers[index] = updated;
  setStorageItem(DRIVERS_KEY, drivers);
  return updated;
}

export function deleteDriver(id: string): boolean {
  const drivers = getDrivers();
  const filtered = drivers.filter((d) => d.id !== id);
  if (filtered.length === drivers.length) return false;

  setStorageItem(DRIVERS_KEY, filtered);
  if (getActiveDriverId() === id) {
    setActiveDriverId(filtered[0]?.id || null);
  }
  return true;
}

export function blockDriver(id: string, reason: string): Driver | null {
  return updateDriverProfile(id, {
    isBlocked: true,
    isOnline: false, // automatically force offline when blocked
    blockReason: reason || "Safety incident / Administrative disciplinary action",
    blockedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
  });
}

export function unblockDriver(id: string): Driver | null {
  return updateDriverProfile(id, {
    isBlocked: false,
    blockReason: undefined,
    blockedAt: undefined,
  });
}

export function verifyDriverData(id: string): Driver | null {
  return updateDriverProfile(id, {
    kycStatus: "APPROVED",
    policeVerificationStatus: "CLEARED",
    isDlVerified: true,
    verifiedAt: new Date().toISOString().split("T")[0],
    notes: "MoRTH Sarathi DL & MP Police criminal verification CLEARED",
  });
}

export function updateDriverKYCStatus(driverId: string, status: "APPROVED" | "UNDER_REVIEW" | "REJECTED"): void {
  const drivers = getDrivers();
  const updated = drivers.map((d) => (d.id === driverId ? { ...d, kycStatus: status } : d));
  setStorageItem(DRIVERS_KEY, updated);
}

export function toggleDriverOnline(driverId: string): { success: boolean; isOnline: boolean; error?: string } {
  const drivers = getDrivers();
  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) return { success: false, isOnline: false, error: "Driver not found" };

  // STRICT BLOCK ENFORCEMENT
  if (driver.isBlocked) {
    return {
      success: false,
      isOnline: false,
      error: `ACCESS SUSPENDED: Chauffeur profile is BLOCKED by Admin. Reason: ${driver.blockReason || "Administrative disciplinary action"}. Contact Sathi Operations.`,
    };
  }

  // STRICT ADMIN VERIFICATION ENFORCEMENT
  if (driver.kycStatus !== "APPROVED") {
    return {
      success: false,
      isOnline: false,
      error: "ACCESS RESTRICTED: Admin verification required! Your chauffeur profile is currently UNDER REVIEW in the Admin KYC Vault. Admin must approve your profile before you can go online.",
    };
  }

  const newState = !driver.isOnline;
  const updated = drivers.map((d) => (d.id === driverId ? { ...d, isOnline: newState } : d));
  setStorageItem(DRIVERS_KEY, updated);
  return { success: true, isOnline: newState };
}

export function getActiveDriverId(): string {
  if (typeof window === "undefined") return DEFAULT_DRIVERS[0].id;
  const id = localStorage.getItem(ACTIVE_DRIVER_KEY);
  return id || DEFAULT_DRIVERS[0].id;
}

export function setActiveDriverId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(ACTIVE_DRIVER_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_DRIVER_KEY);
  }
}

export function getActiveDriver(): Driver | null {
  const drivers = getDrivers();
  const activeId = getActiveDriverId();
  return drivers.find((d) => d.id === activeId) || drivers[0] || null;
}

// ============================================================================
// LIVE BOOKINGS & DISPATCH STORE
// ============================================================================

export interface LiveBooking {
  id: string;
  bookingCode: string;
  serviceType: "NIGHT_DROP" | "HOURLY" | "OUTSTATION";
  driverName: string;
  driverPhone: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  vehiclePlate: string;
  state: "SEARCHING" | "ACCEPTED" | "DRIVER_ARRIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  fare: number;
  otp: string;
  startedAt: string;
  pickup: string;
  dropoff: string;
}

const BOOKINGS_KEY = "sathi_live_bookings_v1";

const DEFAULT_BOOKINGS: LiveBooking[] = [
  {
    id: "book-01",
    bookingCode: "ST-849102",
    serviceType: "NIGHT_DROP",
    driverName: "Rajesh Sharma",
    driverPhone: "+91 99801 84920",
    customerName: "Harshvardhan",
    customerPhone: "+91 98450 12345",
    vehicleModel: "Toyota Fortuner 4x4",
    vehiclePlate: "MP-40-CA-4921",
    state: "IN_PROGRESS",
    fare: 540,
    otp: "8492",
    startedAt: "14m ago",
    pickup: "Vidisha Railway Station Road, Vidisha (M.P.)",
    dropoff: "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)",
  },
  {
    id: "book-02",
    bookingCode: "ST-849098",
    serviceType: "HOURLY",
    driverName: "Mukesh Patel",
    driverPhone: "+91 98451 22340",
    customerName: "Priya Sharma",
    customerPhone: "+91 99801 77332",
    vehicleModel: "Hyundai Creta SX",
    vehiclePlate: "MP-04-AB-1290",
    state: "DRIVER_ARRIVED",
    fare: 745,
    otp: "3910",
    startedAt: "4m ago",
    pickup: "DB City Mall, MP Nagar Zone-1, Bhopal (M.P.)",
    dropoff: "Raja Bhoj International Airport, VIP Road, Bhopal (M.P.)",
  },
  {
    id: "book-03",
    bookingCode: "ST-849085",
    serviceType: "OUTSTATION",
    driverName: "Dharmendra Lodhi",
    driverPhone: "+91 97412 55441",
    customerName: "Rajesh Chouhan",
    customerPhone: "+91 97412 88901",
    vehicleModel: "Mahindra Scorpio-N 4x4",
    vehiclePlate: "MP-40-MB-7788",
    state: "COMPLETED",
    fare: 2150,
    otp: "6612",
    startedAt: "1h ago",
    pickup: "MP Nagar Zone-1, Bhopal (M.P.)",
    dropoff: "Vidisha Railway Station (via SH-19 / Sanchi)",
  },
];

export function getLiveBookings(): LiveBooking[] {
  return getStorageItem<LiveBooking[]>(BOOKINGS_KEY, DEFAULT_BOOKINGS);
}

export function saveLiveBooking(booking: Omit<LiveBooking, "id"> & { id?: string }): LiveBooking {
  const current = getLiveBookings();
  const id = booking.id || `book-${Date.now().toString().slice(-4)}`;
  const newBooking: LiveBooking = { ...booking, id };
  const existingIndex = current.findIndex((b) => b.id === id || b.bookingCode === booking.bookingCode);
  let updated: LiveBooking[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = newBooking;
  } else {
    updated = [newBooking, ...current];
  }
  setStorageItem(BOOKINGS_KEY, updated);
  return newBooking;
}

export function updateBookingState(bookingCode: string, state: LiveBooking["state"]): void {
  const current = getLiveBookings();
  const updated = current.map((b) => (b.bookingCode === bookingCode ? { ...b, state } : b));
  setStorageItem(BOOKINGS_KEY, updated);
}

export function reassignBookingDriver(
  bookingCode: string,
  newDriverName: string,
  newDriverPhone: string
): boolean {
  const current = getLiveBookings();
  const booking = current.find((b) => b.bookingCode === bookingCode);
  if (!booking) return false;
  const updated = current.map((b) =>
    b.bookingCode === bookingCode
      ? {
          ...b,
          driverName: newDriverName,
          driverPhone: newDriverPhone,
        }
      : b
  );
  setStorageItem(BOOKINGS_KEY, updated);
  return true;
}

// ============================================================================
// EMERGENCY SOS INCIDENTS STORE
// ============================================================================

export interface SOSIncident {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  driverName: string;
  vehiclePlate: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: "ACTIVE_POLICE_DISPATCHED" | "RESOLVED";
  policeAckRef: string;
}

const SOS_KEY = "sathi_sos_incidents_v1";

const DEFAULT_INCIDENTS: SOSIncident[] = [];

export function getSOSIncidents(): SOSIncident[] {
  return getStorageItem<SOSIncident[]>(SOS_KEY, DEFAULT_INCIDENTS);
}

export function triggerSOSIncident(incident: Omit<SOSIncident, "id" | "timestamp" | "status" | "policeAckRef">): SOSIncident {
  const current = getSOSIncidents();
  const newIncident: SOSIncident = {
    ...incident,
    id: `sos-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString(),
    status: "ACTIVE_POLICE_DISPATCHED",
    policeAckRef: `ERSS112-BLR-${Math.floor(100000 + Math.random() * 900000)}`,
  };
  setStorageItem(SOS_KEY, [newIncident, ...current]);
  return newIncident;
}

export function resolveSOSIncident(incidentId: string): void {
  const current = getSOSIncidents();
  const updated = current.map((inc) => (inc.id === incidentId ? { ...inc, status: "RESOLVED" as const } : inc));
  setStorageItem(SOS_KEY, updated);
}

