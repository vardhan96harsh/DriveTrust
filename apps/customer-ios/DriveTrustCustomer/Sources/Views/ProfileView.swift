import SwiftUI

struct ProfileView: View {
    var customerName: String
    var onOpenSafety: () -> Void
    var onOpenSupport: () -> Void
    var onLogout: () -> Void

    @State private var isCorporateMode: Bool = false
    @State private var gstin: String = "23AAAAA0000A1Z5"
    @State private var companyName: String = "Harshvardhan Enterprises Pvt Ltd"
    @State private var showSavedAlert: Bool = false

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            ScrollView {
                VStack(spacing: 16) {
                    // Profile Header Card
                    VStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(Color.gold500.opacity(0.15))
                                .frame(width: 64, height: 64)
                                .overlay(Circle().stroke(Color.gold500, lineWidth: 1.5))
                            Text(String(customerName.prefix(2)).uppercased())
                                .font(.system(size: 24, weight: .black))
                                .foregroundColor(.gold500)
                        }

                        VStack(spacing: 4) {
                            Text(customerName)
                                .font(.system(size: 18, weight: .black))
                                .foregroundColor(.white)
                            Text("+91 98450 12345 • client@drivetrust.in")
                                .font(.system(size: 11))
                                .foregroundColor(.slate400)
                        }

                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(.emerald400)
                            Text("Aadhaar Verified Client (Vidisha, MP-40)")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.emerald400)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.emerald400.opacity(0.12))
                        .cornerRadius(20)
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity)
                    .background(Color.midnightCard)
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.midnightBorder, lineWidth: 1))

                    // Emergency Contacts Card
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Image(systemName: "heart.fill")
                                .foregroundColor(.red)
                            Text("SAFETY & GUARDIAN CONTACT")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold500)
                                .tracking(1)
                        }
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Family Emergency Contact")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Text("+91 99801 11223 (Auto-shared on ride start)")
                                    .font(.system(size: 11))
                                    .foregroundColor(.slate400)
                            }
                            Spacer()
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.emerald400)
                        }
                        .padding(12)
                        .background(Color.midnightDark)
                        .cornerRadius(10)
                    }
                    .padding(16)
                    .background(Color.midnightCard)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.midnightBorder, lineWidth: 1))

                    // Corporate 18% ITC Billing Switch
                    VStack(alignment: .leading, spacing: 12) {
                        Toggle(isOn: $isCorporateMode) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Corporate Business Profile")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Generate 18% GST ITC invoices for tax claims")
                                    .font(.system(size: 11))
                                    .foregroundColor(.slate400)
                            }
                        }
                        .toggleStyle(SwitchToggleStyle(tint: .gold500))

                        if isCorporateMode {
                            VStack(alignment: .leading, spacing: 8) {
                                TextField("Company Legal Name", text: $companyName)
                                    .font(.system(size: 12))
                                    .foregroundColor(.white)
                                    .padding(10)
                                    .background(Color.midnightDark)
                                    .cornerRadius(8)

                                TextField("GSTIN Number", text: $gstin)
                                    .font(.system(size: 12))
                                    .foregroundColor(.white)
                                    .padding(10)
                                    .background(Color.midnightDark)
                                    .cornerRadius(8)
                            }
                        }
                    }
                    .padding(16)
                    .background(Color.midnightCard)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.midnightBorder, lineWidth: 1))

                    // Quick Actions
                    VStack(spacing: 8) {
                        Button(action: onOpenSafety) {
                            HStack {
                                Image(systemName: "shield.checkered")
                                    .foregroundColor(.red)
                                Text("Safety Vault & Police 112 Settings")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Spacer()
                                Image(systemName: "chevron.right").foregroundColor(.slate500)
                            }
                            .padding(14)
                            .background(Color.midnightCard)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        Button(action: onOpenSupport) {
                            HStack {
                                Image(systemName: "questionmark.circle.fill")
                                    .foregroundColor(.gold500)
                                Text("24x7 Safety Command Helpline")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Spacer()
                                Image(systemName: "chevron.right").foregroundColor(.slate500)
                            }
                            .padding(14)
                            .background(Color.midnightCard)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        Button(action: onLogout) {
                            HStack {
                                Image(systemName: "rectangle.portrait.and.arrow.right")
                                    .foregroundColor(.red)
                                Text("Sign Out of DriveTrust")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.red)
                                Spacer()
                            }
                            .padding(14)
                            .background(Color.midnightCard)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.red.opacity(0.3), lineWidth: 1))
                        }
                    }
                }
                .padding(16)
                .padding(.bottom, 80)
            }
        }
    }
}
