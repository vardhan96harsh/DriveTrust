# DriveTrust Mobile Clients Directory

This directory contains the production native mobile applications for **Customers** and **Driver Partners**, alongside web versions that can be tested immediately in any browser or on your phone.

---

## 📱 Applications Overview

| Application | Platform | Tech Stack | Source Code Location | Instant Browser Link |
| :--- | :--- | :--- | :--- | :--- |
| **Customer App** | Android | Kotlin + Jetpack Compose + Material 3 | `apps/customer-android/app/src/main/java/com/drivetrust/customer/` | [Open in Web App](http://localhost:3000/customers) |
| **Driver Terminal App** | Android | Kotlin + Jetpack Compose + Foreground Service | `apps/driver-android/app/src/main/java/com/drivetrust/driver/` | [Open in Web App](http://localhost:3000/drivers) |
| **Customer App** | iOS | Swift + SwiftUI + ActivityKit | `apps/customer-ios/DriveTrustCustomer/Sources/` | [Open Simulator](http://localhost:3000/simulator) |
| **Dual-App Simulator** | Web / PWA | Next.js 14 + Tailwind + Leaflet | `web/admin-portal/src/app/simulator/page.tsx` | [Open Dual Phone Simulator](http://localhost:3000/simulator) |

---

## 📂 Modular Architecture Breakdown

### 1. Customer Android App (`apps/customer-android`)
```
apps/customer-android/app/src/main/
├── AndroidManifest.xml
├── res/values/
│   ├── strings.xml
│   └── colors.xml
└── java/com/drivetrust/customer/
    ├── data/
    │   ├── CustomerPreferences.kt      <-- Session, auth token, emergency contacts
    │   └── CustomerRepository.kt       <-- Booking creation, past trips, SOS alerts
    ├── service/
    │   └── CustomerRideNotificationService.kt <-- Arrival, status & emergency alerts
    ├── screens/
    │   ├── LoginScreen.kt              <-- OTP sign-in & phone authentication
    │   ├── RegisterScreen.kt           <-- Profile & emergency contact registration
    │   ├── BookingScreen.kt            <-- 3 mobility modes, garage car, fare calculator
    │   ├── TrackingScreen.kt           <-- Live chauffeur location, OTP card, call driver
    │   ├── HandoverAuditScreen.kt      <-- 4-point vehicle pre-trip checklist
    │   ├── CompletedRatingScreen.kt    <-- 5-star rating, UPI tipping, bookmarking
    │   ├── RideHistoryScreen.kt        <-- Past completed rides & GST invoices
    │   └── SafetyCenterScreen.kt       <-- 24x7 Safety Shield, trusted contacts, 112 police
    ├── components/
    │   ├── TopAppBar.kt                <-- Branded top bar with SOS trigger
    │   ├── SosEmergencyDialog.kt       <-- Police 112 emergency alert modal
    │   ├── QuickChatDialog.kt          <-- In-ride chat with 1-tap quick replies
    │   └── WhatsAppShareDialog.kt      <-- 1-click live tracking link generator
    ├── model/
    │   ├── User.kt                     <-- Customer vehicles & profile models
    │   └── Trip.kt                     <-- Trip booking & service types
    ├── theme/
    │   ├── Color.kt                    <-- Slate, Sky, Emerald, Amber palette
    │   └── Theme.kt                    <-- Jetpack Compose Material 3 theme
    └── ui/
        └── MainActivity.kt             <-- Single Activity navigation coordinator
```

---

### 2. Driver Partner Android App (`apps/driver-android`)
```
apps/driver-android/app/src/main/
├── AndroidManifest.xml
├── res/values/
│   ├── strings.xml
│   └── colors.xml
└── java/com/drivetrust/driver/
    ├── data/
    │   ├── DriverPreferences.kt        <-- Driver session, DL, badge, UPI settings
    │   ├── DriverRepository.kt         <-- Duty toggle, strict KYC guard, offers, wallet
    │   └── OfflineTelemetryQueue.kt    <-- Room DB for offline sensor telemetry
    ├── service/
    │   ├── LocationForegroundService.kt<-- 1-second background GPS telemetry service
    │   └── RideOfferAlarmHelper.kt     <-- High-priority audio/vibration dispatch alert
    ├── screens/
    │   ├── LoginScreen.kt              <-- Commercial chauffeur terminal login
    │   ├── OnboardingScreen.kt         <-- DL, commercial badge & police verification
    │   ├── DocumentUploadScreen.kt     <-- MoRTH commercial license photo uploads
    │   ├── TerminalScreen.kt           <-- Online/Offline switch & KYC radar scanner
    │   ├── ActiveTripScreen.kt         <-- GPS turn-by-turn navigation & passenger OTP
    │   ├── HandoverInspectionScreen.kt <-- 4-point vehicle handover inspection audit
    │   ├── PerformanceScreen.kt        <-- 98/100 telematics safety scorecard & perks
    │   └── WalletScreen.kt             <-- Earnings breakdown, tip ledger & instant UPI
    ├── components/
    │   ├── DriverTopBar.kt             <-- Duty toggle & chauffeur badge
    │   ├── AdminVerificationBanner.kt  <-- Warning banner if KYC pending with Admin
    │   └── IncomingOfferDialog.kt      <-- 30-second accept/reject countdown dialog
    ├── model/
    │   ├── DriverProfile.kt            <-- KYC status, ratings, total trips
    │   └── RideOffer.kt                <-- Dispatch offer model & pricing
    ├── theme/
    │   ├── Color.kt
    │   └── Theme.kt
    └── ui/
        └── MainActivity.kt             <-- Clean navigation coordinator
```

---

## 🚀 How to Run & Test

### Option 1: Instant Browser / Mobile Wi-Fi (No Android Studio required)
The entire platform is running live right now!
- **Dual-App Live Simulator:** Open `http://localhost:3000/simulator` (or `http://192.168.29.200:3000/simulator` on your smartphone).
- **Customer App Portal:** Open `http://localhost:3000/customers` (Login with phone + OTP, manage cars, book chauffeur).
- **Driver Terminal:** Open `http://localhost:3000/drivers` (Chauffeur login, KYC status, duty switch, instant wallet).
- **Admin KYC Vault:** Open `http://localhost:3000/kyc` (Admin approves/rejects driver commercial licenses).

### Option 2: Open in Android Studio
1. Open **Android Studio**.
2. Select **File -> Open...** and choose `apps/customer-android` or `apps/driver-android`.
3. Gradle will automatically sync and you can click the green **Run ▶** button on any connected Android device or emulator!
