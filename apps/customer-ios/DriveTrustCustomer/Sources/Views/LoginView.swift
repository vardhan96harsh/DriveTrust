import SwiftUI

struct LoginView: View {
    var onLoginSuccess: (String) -> Void
    var onGoToRegister: () -> Void

    @State private var phoneInput: String = "+91 98450 12345"
    @State private var otpSent: Bool = false
    @State private var enteredOtp: String = ""
    @State private var generatedOtp: String = "849201"
    @State private var errorMessage: String? = nil

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            VStack(spacing: 24) {
                Spacer()

                // Card Container
                VStack(alignment: .leading, spacing: 20) {
                    // Monogram DT
                    HStack {
                        ZStack {
                            Circle()
                                .fill(Color.midnightDark)
                                .frame(width: 50, height: 50)
                                .overlay(Circle().stroke(Color.gold500, lineWidth: 1.5))
                            Text("DT")
                                .font(.system(size: 18, weight: .black))
                                .foregroundColor(.gold500)
                        }
                        Spacer()
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text("DriveTrust Executive")
                            .font(.system(size: 22, weight: .black))
                            .foregroundColor(.white)
                        Text("Sign in to request verified luxury chauffeurs for your personal car")
                            .font(.system(size: 12))
                            .foregroundColor(.slate400)
                    }

                    if !otpSent {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("MOBILE PHONE NUMBER")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold500)
                                .tracking(1)

                            HStack {
                                Image(systemName: "phone.fill")
                                    .foregroundColor(.gold500)
                                TextField("Enter Phone", text: $phoneInput)
                                    .foregroundColor(.white)
                                    .keyboardType(.phonePad)
                            }
                            .padding(14)
                            .background(Color.midnightDark)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        Button(action: {
                            if phoneInput.count >= 10 {
                                generatedOtp = "\(Int.random(in: 100000...999999))"
                                otpSent = true
                                errorMessage = nil
                            }
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "key.fill")
                                Text("Send 6-Digit Security OTP")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .foregroundColor(.midnightDark)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.gold500)
                            .cornerRadius(12)
                        }
                    } else {
                        // OTP Dispatched Pill
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("SECURITY CODE DISPATCHED")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.emerald400)
                                    .tracking(1)
                                Text("OTP: \(generatedOtp)")
                                    .font(.system(size: 17, weight: .black, design: .monospaced))
                                    .foregroundColor(.white)
                            }
                            Spacer()
                            Button("Auto-Fill") {
                                enteredOtp = generatedOtp
                            }
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.emerald400)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color.emerald400.opacity(0.15))
                            .cornerRadius(8)
                        }
                        .padding(12)
                        .background(Color.emerald400.opacity(0.1))
                        .cornerRadius(12)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.emerald400.opacity(0.3), lineWidth: 1))

                        HStack {
                            Image(systemName: "lock.fill")
                                .foregroundColor(.gold500)
                            TextField("Enter 6-Digit OTP", text: $enteredOtp)
                                .foregroundColor(.white)
                                .keyboardType(.numberPad)
                        }
                        .padding(14)
                        .background(Color.midnightDark)
                        .cornerRadius(12)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))

                        if let err = errorMessage {
                            Text(err)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(.red)
                        }

                        Button(action: {
                            if enteredOtp == generatedOtp {
                                onLoginSuccess(phoneInput)
                            } else {
                                errorMessage = "Invalid security code. Please check SMS."
                            }
                        }) {
                            Text("Verify & Open DriveTrust")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.emerald600)
                                .cornerRadius(12)
                        }
                    }

                    Divider().background(Color.midnightBorder)

                    HStack {
                        Spacer()
                        Text("New vehicle owner?")
                            .font(.system(size: 12))
                            .foregroundColor(.slate400)
                        Button("Register Car") {
                            onGoToRegister()
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.gold500)
                        Spacer()
                    }
                }
                .padding(24)
                .background(Color.midnightCard)
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.midnightBorder, lineWidth: 1))
                .padding(.horizontal, 20)

                Spacer()
            }
        }
    }
}
