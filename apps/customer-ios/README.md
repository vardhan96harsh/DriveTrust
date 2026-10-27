# DriveTrust Customer iOS Application

An ultra-premium, native **SwiftUI (iOS 16.0+)** customer application matching all features and screens of the Android customer app. Built with the **Obsidian & Champagne Gold** luxury design system, dynamic Island & Lock Screen Live Activities via ActivityKit, 5-tab persistent navigation, streamlined 3-step booking flow, and simulated UPI payments.

---

## 📱 Features & Screen Portfolio

1. **Authentication Flow**
   - [LoginView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/LoginView.swift): 10-digit Indian mobile number validation with country code selector (`+91`), 60s resend timer, 6-digit auto-fill OTP simulator (`123456`), and fast sandbox guest bypass.
   - [RegisterView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/RegisterView.swift): Full name, email, phone, city, and initial vehicle registration (Make, Model, Registration Number, Fuel/Transmission).

2. **Core 5-Tab Navigation**
   - **Tab 1: Chauffeur** - [BookingView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/BookingView.swift):
     - Quick landmark chips (e.g. `IGI Airport T3`, `Cyber City`, `Khan Market`, `Noida Sector 62`).
     - Real-time pickup & drop location inputs with live reverse geocode simulation.
     - Active garage car selector with ₹10,00,000 comprehensive transit insurance badge.
     - 3 Service Packages: City Driving, Outstation Roundtrip, and Night Safe Chauffeur.
     - **Sticky Floating Action Bar**: Persistent bottom bar with live calculated fare (e.g. `₹390`) and glowing gold `BOOK CHAUFFEUR NOW →` button.
     - Sandbox payment sheet (DT Wallet, UPI Google Pay/PhonePe/Paytm, Cash to Driver).
   - **Tab 2: My Garage** - [MyGarageView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/MyGarageView.swift):
     - Active vehicle toggle with transmission (Automatic / Manual) and fuel type badges.
     - Quick vehicle onboarding modal to add family or corporate cars.
     - ₹10 Lakh insurance coverage verification status.
   - **Tab 3: DT Wallet** - [WalletView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/WalletView.swift):
     - Available balance card with instant top-up chips (`+₹500`, `+₹1000`, `+₹2000`).
     - Simulated UPI payment sheet with instant ledger balance credit.
     - Linked VPAs (`@okhdfcbank`, `@paytm`) with quick unlink actions.
     - Immutable transaction history ledger with status indicators.
   - **Tab 4: Ride History** - [RideHistoryView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/RideHistoryView.swift):
     - Complete past trip log with chauffeur details, vehicle used, route, and fare breakdown.
     - Instant GST invoice download simulator with notification confirmation.
   - **Tab 5: Client Profile** - [ProfileView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/ProfileView.swift):
     - DriveTrust Club Tier status (`ELITE MEMBER`).
     - Primary emergency SOS contact management.
     - Corporate GSTIN & Company billing switch (18% Input Tax Credit).
     - Privacy and security settings.

3. **Specialized Modals & Trip Lifecycle**
   - **Safety Vault** - [SafetyCenterView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/SafetyCenterView.swift): Direct 112 Police Emergency SOS trigger with simulated live dispatch, safety protocols, and 24/7 security control room.
   - **4-Point Handover Audit** - [HandoverAuditView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/HandoverAuditView.swift): Pre-trip vehicle walkaround checklist (Odometer, Fuel gauge, Scratches/Dents, Valuables).
   - **Live Ride Tracking** - [CustomerRideTrackingView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/CustomerRideTrackingView.swift): Live MapKit route rendering, real-time ETA countdown, 4-digit start OTP handshake, chauffeur call/message, and emergency SOS button.
   - **Post-Trip Review & Gratuity** - [RatingView.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/Sources/Views/RatingView.swift): 5-star rating, gratuity tip selector (`₹50`, `₹100`, `₹200`), compliment badges, and favorite chauffeur bookmarking.
   - **Dynamic Island & Lock Screen** - [TripActivityWidget.swift](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer/LiveActivityWidget/TripActivityWidget.swift): Native iOS ActivityKit Live Activities showing driver status, start OTP, live ETA, and driver contact.

---

## 🛠️ Project Structure

```
apps/customer-ios/
├── DriveTrustCustomer.xcodeproj/       # Standard Xcode project file (Open in Xcode)
│   └── project.pbxproj
├── Package.swift                       # Swift Package Manager manifest
├── README.md                           # This documentation
└── DriveTrustCustomer/
    ├── Info.plist                      # Permissions (Location, Camera) & Live Activity support
    ├── LiveActivityWidget/             # ActivityKit Dynamic Island & Lock Screen widget
    │   └── TripActivityWidget.swift
    └── Sources/
        ├── App/
        │   ├── DriveTrustApp.swift     # @main SwiftUI App entrypoint
        │   └── AppCoordinator.swift    # Global navigation & state coordinator
        ├── Components/
        │   ├── CustomTopBar.swift      # Top bar with monogram & safety shield
        │   ├── CustomBottomNavBar.swift# 5-tab luxury bottom navigation bar
        │   └── FloatingBookingBar.swift# Sticky Book Now floating bar with live fare
        ├── Models/
        │   ├── UserModels.swift        # CustomerProfile, CustomerVehicle
        │   └── TripModels.swift        # ServiceType, TripBooking, PastRideRecord
        ├── Theme/
        │   └── ThemeColors.swift       # MidnightDark (#0B0F19), Gold500, Emerald, Slate
        ├── Views/
        │   ├── BookingView.swift       # 3-step streamlined booking with sticky bar
        │   ├── HandoverAuditView.swift # 4-point handover audit
        │   ├── LoginView.swift         # Phone + OTP authentication
        │   ├── MyGarageView.swift      # Vehicle garage management
        │   ├── ProfileView.swift       # User profile & corporate GST billing
        │   ├── RatingView.swift        # 5-star rating and gratuity tipping
        │   ├── RegisterView.swift      # Client registration
        │   ├── RideHistoryView.swift   # Trip logs with GST invoices
        │   ├── SafetyCenterView.swift  # 112 Emergency SOS safety vault
        │   └── WalletView.swift        # Digital wallet & simulated UPI top-ups
        ├── CustomerRideTrackingView.swift # Live MapKit ride tracking
        └── TripActivityAttributes.swift   # ActivityKit data model
```

---

## 🚀 How to Run & Build

### Option 1: On macOS using Xcode (Recommended for Local Dev)
1. Double-click [DriveTrustCustomer.xcodeproj](file:///d:/Harsh/Harsh%20Projecat/Driver/apps/customer-ios/DriveTrustCustomer.xcodeproj) to open in Xcode 15 or 16.
2. Select target **DriveTrustCustomer** and an iOS Simulator (e.g. **iPhone 15 Pro** or **iPhone 16 Pro**).
3. Press **Cmd + R** to Build & Run.

### Option 2: Command Line (macOS)
```bash
cd apps/customer-ios
xcodebuild -project DriveTrustCustomer.xcodeproj \
  -scheme DriveTrustCustomer \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug \
  CODE_SIGNING_ALLOWED=NO \
  build
```

### Option 3: Automated Cloud Build via GitHub Actions
A GitHub Actions workflow is provided at [.github/workflows/release-apps.yml](file:///d:/Harsh/Harsh%20Projecat/Driver/.github/workflows/release-apps.yml):
1. Navigate to **Actions** in your GitHub repository.
2. Select **Mobile Apps Build & Release Pipeline**.
3. Click **Run workflow** -> Select `main` branch.
4. The pipeline runs on `macos-14`, builds the iOS simulator app using `xcodebuild`, compiles both Android APKs, and uploads the artifacts.
