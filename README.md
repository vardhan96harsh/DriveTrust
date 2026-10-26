# DriveTrust Ultra: Tier-1 On-Demand Verified Driver Platform

**Platform:** DriveTrust Ultra  
**Standard:** Tier-1 Mobility Engineering (Uber / Grab Benchmark)  
**Version:** 1.0.0-PROD  

---

## 🌟 Executive Architecture Overview

DriveTrust Ultra is an enterprise-grade, high-concurrency mobility platform engineered for **on-demand verified chauffeur and personal driver dispatches**. It provides sub-second dispatch latency across three operational modes: **Hourly Chauffeur Packages**, **Night Safe-Drop**, and **Outstation Long-Distance**.

```
                           ┌──────────────────────────────┐
                           │      Public Clients          │
                           │  iOS (Swift) / Android (KT)  │
                           └──────────────┬───────────────┘
                                          │ HTTPS / WSS
                                          ▼
                           ┌──────────────────────────────┐
                           │     Go API Gateway (8080)    │
                           │  RS256 JWT, Idempotency, WSS │
                           └──────────────┬───────────────┘
                                          │
         ┌──────────────────┬─────────────┼──────────────────┬─────────────────┐
         ▼                  ▼             ▼                  ▼                 ▼
 ┌──────────────┐   ┌──────────────┐ ┌─────────┐   ┌──────────────────┐ ┌──────────────┐
 │ Auth Service │   │ Dispatch Svc │ │ Booking │   │  Telematics Svc  │ │ Billing Svc  │
 │ Phone OTP &  │   │ Uber H3 Grid │ │ State   │   │  Kafka 12-Part   │ │ Multi-Zone   │
 │ RS256 JWKS   │   │ Redlock 30s  │ │ Machine │   │  ClickHouse ODS  │ │ Split Payout │
 └──────────────┘   └──────┬───────┘ └─────────┘   └─────────┬────────┘ └──────────────┘
                           │                                 │
                           ▼                                 ▼
                    ┌──────────────┐                 ┌───────────────┐
                    │ Redis 7 ODS  │                 │  ClickHouse   │
                    │ Spatial Ring │                 │ 8,192 Index   │
                    └──────────────┘                 └───────────────┘
```

---

## 📁 Monorepo Layout

```
.
├── .github/workflows/          # CI/CD Workflows for Backend, Admin Portal & Mobile Apps
├── proto/                      # Canonical Protocol Buffers (Common, Dispatch, Telematics, Billing)
├── deploy/
│   ├── docker/                 # Production Docker Compose (PostGIS, Redis, Kafka, ClickHouse, MinIO)
│   │   ├── postgres/           # init.sql with PostGIS & indexing
│   │   ├── clickhouse/         # init-clickhouse.sql with partitioned MergeTree
│   │   ├── redis/              # lock_driver.lua atomic Redlock script
│   │   └── kafka/              # create-topics.sh (12-partition telemetry pipeline)
│   └── k8s/                    # Production Kubernetes Helm Charts
├── backend/                    # Go High-Concurrency Microservices
│   ├── pkg/
│   │   ├── h3util/             # Uber H3 Hexagonal spatial quantization & k-ring expansion
│   │   ├── rediscache/         # Redis 7 Redlock driver locks & spatial registry
│   │   ├── logger/             # Structured JSON telemetry logger
│   │   └── pgxpool/            # PostgreSQL 16 PostGIS connection pool
│   └── services/
│       ├── api-gateway/        # Public API Gateway (HTTP/REST + WebSocket Hub)
│       ├── auth-service/       # Phone OTP, RS256 JWT, JWKS endpoint
│       ├── dispatch-service/   # Uber H3 Hexagonal matching engine & candidate scoring
│       ├── booking-service/    # 6-state trip lifecycle state machine & OTP verification
│       ├── telematics-service/ # IMU sensor analysis, harsh braking, crash alerts
│       └── billing-service/    # Multi-zone dynamic pricing & driver split payouts
├── web/
│   └── admin-portal/           # Next.js 14 App Router (Tailwind CSS, Glassmorphic UI)
│       ├── src/app/            # Executive Dashboard, KYC Vault, Live Radar, Race Debugger, Pricing
│       └── src/components/     # DocumentViewer, SpatialRadar, MetricCard
├── apps/
│   ├── driver-android/         # Kotlin + Jetpack Compose Driver Partner App
│   │   ├── LocationForegroundService.kt (Partial WakeLock, persistent notification)
│   │   ├── RideOfferAlarmHelper.kt (USAGE_ALARM silent override & locked screen wakeup)
│   │   ├── IncomingRideDialog.kt (30-second animated circular countdown)
│   │   └── OfflineTelemetryQueue.kt (Encrypted Room SQLite offline buffer)
│   ├── customer-ios/           # SwiftUI + ActivityKit Customer App
│   │   ├── CustomerRideTrackingView.swift (3-mode booking selector & SOS alert)
│   │   └── TripActivityWidget.swift (ActivityKit Dynamic Island & Live Activity)
│   └── customer-android/       # Jetpack Compose Customer App
└── scripts/
    └── test-e2e.js             # 10-step End-to-End Mobility Verification Suite
```

---

## 🚀 Quickstart & Execution

### 1. Spin up Infrastructure via Docker Compose
```bash
cd deploy/docker
docker compose -f docker-compose.prod.yml up -d
```

### 2. Run Go Microservices Test Suite
```bash
cd backend
go test -v ./...
```

### 3. Launch the Next.js 14 Admin Portal
```bash
cd web/admin-portal
npm run dev
# Open http://localhost:3000 to interact with:
# - Executive Operations Dashboard
# - Uber H3 Spatial Radar & Dispatch Simulator
# - MoRTH / Parivahan Driver KYC Document Inspector
# - Trip State Machine & Concurrent Race Condition Debugger
# - Multi-Zone Dynamic Pricing Matrix
```

### 4. Run the 10-Step End-to-End Mobility Test Suite
```bash
node scripts/test-e2e.js
```
