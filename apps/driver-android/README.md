# DriveTrust Chauffeur Partner Android App

Native Android application for DriveTrust Ultra commercial chauffeurs, built using **Jetpack Compose**, **Foreground Location Services**, **Telematics Engine**, and **Material Design 3**.

---

## 📂 Source Code Files Location

The Kotlin code files are located in the package directory:

1. **Terminal UI & Navigation (391 lines):**  
   [`app/src/main/java/com/drivetrust/driver/ui/MainActivity.kt`](app/src/main/java/com/drivetrust/driver/ui/MainActivity.kt)
   - Chauffeur Phone Login + 6-digit OTP.
   - Professional Onboarding (Name, Commercial DL, RTO Authority, Transmission Expertise, UPI ID).
   - Admin KYC Clearance status badge (Under Review vs. Approved).
   - Online/Offline Duty switch with Admin KYC approval enforcement.
   - 30-Second Dispatch Offer card & Countdown.
   - 4-Digit Security OTP handshake verification.
   - Instant Payout Wallet with earnings breakdown.

2. **Background Telematics & GPS Tracking Service:**  
   [`app/src/main/java/com/drivetrust/driver/service/LocationForegroundService.kt`](app/src/main/java/com/drivetrust/driver/service/LocationForegroundService.kt)
   - Continuous foreground GPS tracking with partial wake lock.

3. **Android Manifest & Permissions:**  
   [`app/src/main/AndroidManifest.xml`](app/src/main/AndroidManifest.xml)

4. **Gradle Build Configuration:**  
   [`app/build.gradle.kts`](app/build.gradle.kts) and [`settings.gradle.kts`](settings.gradle.kts)

---

## 🌐 Instant Testing in Browser
You can test the Chauffeur Terminal immediately in your browser or phone without installing Android Studio:
- Chauffeur Terminal: **[http://localhost:3000/drivers](http://localhost:3000/drivers)**
- Admin KYC Vault: **[http://localhost:3000/kyc](http://localhost:3000/kyc)**
- Dual-App Simulator: **[http://localhost:3000/simulator](http://localhost:3000/simulator)**
