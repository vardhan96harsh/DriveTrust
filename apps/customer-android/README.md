# DriveTrust Customer Android App

Native Android application for DriveTrust Ultra passengers and vehicle owners, built using modern **Jetpack Compose**, **Kotlin Coroutines**, and **Material Design 3**.

---

## 📂 Source Code Files Location

The Kotlin code files are located in the package directory:

1. **Main UI & Navigation (315 lines):**  
   [`app/src/main/java/com/drivetrust/customer/ui/MainActivity.kt`](app/src/main/java/com/drivetrust/customer/ui/MainActivity.kt)
   - Phone Login with 6-digit OTP verification.
   - Profile & Garage Registration (Owner Name, Phone, Car Brand/Model, Plate).
   - Booking Flow (Hourly, Night-Drop, Outstation).
   - Real-time Chauffeur Tracking & Security Handshake OTP.

2. **Tracking Screen:**  
   [`app/src/main/java/com/drivetrust/customer/ui/CustomerTrackingScreen.kt`](app/src/main/java/com/drivetrust/customer/ui/CustomerTrackingScreen.kt)

3. **Android Manifest & Permissions:**  
   [`app/src/main/AndroidManifest.xml`](app/src/main/AndroidManifest.xml)

4. **Gradle Build Configuration:**  
   [`app/build.gradle.kts`](app/build.gradle.kts) and [`settings.gradle.kts`](settings.gradle.kts)

---

## 🌐 Instant Testing in Browser
You can test the Customer App immediately in your browser or phone without installing Android Studio:
- Customer Portal: **[http://localhost:3000/customers](http://localhost:3000/customers)**
- Dual-App Simulator: **[http://localhost:3000/simulator](http://localhost:3000/simulator)**
