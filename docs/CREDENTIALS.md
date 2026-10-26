# 🛡️ Sathi & DriveTrust Platform — Master Credentials & Access Document

> **Confidential Document**  
> Contains administrative logins, customer profiles, chauffeur test accounts, and database credentials for the Sathi / DriveTrust mobility platform.

---

## 1. 🛡️ Admin Command Center Portals & Staff Logins

* **Local Login URL:** [http://localhost:3000/login](http://localhost:3000/login)  
* **Local Network URL:** `http://192.168.29.200:3000/login`

| Role | Login Email ID | Password | Permissions & Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin (HQ)** | `admin@sathi.in` | `DriveAdmin@2026` | **Exclusive Pricing Control**, multi-zone matrix, platform commission, settlements, full master audit |
| **Super Admin (Founder)** | `harsh@sathi.in` | `DriveAdmin@2026` | Founder & Executive HQ Master Access (Full Read/Write) |
| **Region Manager (Vidisha MP-40)** | `ankit.mp40@sathi.in` | `VidishaOps@2026` | Vidisha hub ops, driver roster, local garage audits. **Pricing: READ-ONLY (Super Admin governed)** |
| **Region Manager (Bhopal MP-04)** | `sunita.mp04@sathi.in` | `BhopalOps@2026` | Bhopal metro ops, driver relations, local escalations. **Pricing: READ-ONLY (Super Admin governed)** |
| **Dispatch Desk** | `dispatch@sathi.in` | `DispatchDesk@2026` | Manual chauffeur override, spatial dispatch radar, driver chat (Pricing: Read-Only) |
| **KYC Auditor** | `kyc@sathi.in` | `KycAuditor@2026` | MoRTH Sarathi verification, DL approvals, police NOC |
| **Safety 112 Desk** | `safety@sathi.in` | `SafetyDesk@2026` | Emergency SOS live incidents, telematics crash alerts |

> 🔒 **Pricing Governance Policy:** As mandated, **multi-zone tariff rates, per-km fees, night surcharges, and platform commissions can ONLY be configured and published by Super Admin**. Region Managers have read-only visibility for live trip simulation and audit, but cannot alter tariff values.

---

## 2. 🚗 Customer App (Car Owner / Chauffeur Booking)

* **App URL:** [http://localhost:3000/book](http://localhost:3000/book)  
* **Universal Test OTP:** `729401`

| Customer Profile | Mobile Number | Login OTP | Permanent Sathi PIN | Registered Vehicle in Garage |
| :--- | :--- | :--- | :--- | :--- |
| **Harshvardhan (Primary)** | `+91 98450 12345` | `729401` | **`4892`** | Toyota Fortuner 4x4 (`MP-40-CA-4921`) |
| **Priya Sharma** | `+91 99801 77332` | `729401` | **`7332`** | Hyundai Creta SX Automatic (`MP-04-AB-1290`) |
| **Rajesh Chouhan (VIP)** | `+91 97412 88901` | `729401` | **`8890`** | Mahindra Scorpio-N 4x4 (`MP-40-MB-7788`) |

---

## 3. 📱 Driver Partner Cockpit (Chauffeur Duty & Earnings)

* **App URL:** [http://localhost:3000/driver](http://localhost:3000/driver)  
* **Universal Test OTP:** `729401`

| Chauffeur Name | Mobile Number | Login OTP | Handover Start OTP | RTO & Vehicle Qualification |
| :--- | :--- | :--- | :--- | :--- |
| **Rajesh Sharma (Lead)** | `+91 98765 43211` | `729401` | `8492` (or trip OTP) | MP-40 Vidisha (Manual & Automatic Cleared) |
| **Mukesh Patel** | `+91 98451 22340` | `729401` | `3910` (or trip OTP) | MP-04 Bhopal (Manual & Automatic Cleared) |
| **Dharmendra Lodhi** | `+91 97412 55441` | `729401` | `6612` (or trip OTP) | MP-40 Highway / Sanchi Outstation Specialist |

---

## 4. 📡 Portal Direct URLs & Monitoring

| Service / Portal | URL | Purpose / Description |
| :--- | :--- | :--- |
| **Live Tracking Radar** | [http://localhost:3000/track](http://localhost:3000/track) | Real-time map tracking of active trips |
| **Customer Live Share** | [http://localhost:3000/track/ST-849102](http://localhost:3000/track/ST-849102) | Public link shared via WhatsApp with family |
| **Dispatch Simulator** | [http://localhost:3000/simulator](http://localhost:3000/simulator) | End-to-end sandbox simulator (Customer + Driver) |
| **Mobile App Install Hub** | [http://localhost:3000/install](http://localhost:3000/install) | QR code page to install Customer & Partner PWAs |
| **Chauffeur Settlements** | [http://localhost:3000/payouts](http://localhost:3000/payouts) | Instant 1-click UPI and IMPS driver payout approvals |
| **GST Invoices & Reports** | [http://localhost:3000/reports](http://localhost:3000/reports) | Export GST SAC 9966 invoices and driver telematics |

---

## 5. ⚙️ Database & Infrastructure Credentials

### A. Local Development Environment
| Service | Port | Username | Password / Secret | Database / Context |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL 16** | `5432` | `driver_app` | `postgres_secret_2026` | `driver_db` |
| **Redis 7** | `6379` | `default` | *(No password in local VPC)* | DB 0 (Cache & Redlocks) |
| **MinIO S3** | `9000` / `9001` | `minioadmin` | `minioadmin_secret_2026` | Buckets: `driver-inspections`, `kyc-docs` |
| **ClickHouse** | `8123` / `9000` | `default` | `clickhouse_secret_2026` | `telematics_db` |
| **RabbitMQ** | `5672` / `15672` | `guest` | `guest` | vhost: `/` (Telematics queues) |
| **Go API Gateway** | `8080` | REST/JSON API | RS256 JWT Token | `services/api-gateway` |

### B. Production Docker Compose (`deploy/docker/docker-compose.prod.yml`)
| Service | Port | Username | Password / Secret | Database / Mount |
| :--- | :--- | :--- | :--- | :--- |
| **PostGIS (Postgres 16)** | `5432` | `drivetrust_admin` | `SecretProdPassword123!` | `drivetrust_db` |
| **Redis 7.2** | `6379` | `default` | `RedisAuthSecret123!` | Redis spatial cache |
| **Kafka 7.6.0** | `9092` | N/A (Internal) | Plaintext | `kafkadata` (Cluster ID: `MkU3OEVBNTcwNTJENDM2Qk`) |
| **ClickHouse 24.3** | `8123` / `9002` | `default` | `init-clickhouse.sql` | `clickhousedata` |
| **MinIO Object Storage** | `9000` / `9001` | `minioadmin` | `MinioSecretPassword123!` | `miniodata` |

---

## 🔒 6. Security & SMS Notes
1. **Universal Test OTP:** In testing/demo mode, any phone login accepts OTP **`729401`**.
2. **Production SMS:** For commercial deployments, SMS gateways (Fast2SMS, MSG91, Twilio) should be configured in `services/auth-service`.
