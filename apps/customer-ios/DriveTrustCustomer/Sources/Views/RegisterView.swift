import SwiftUI

struct RegisterView: View {
    var onRegisterSuccess: (String, String, CustomerVehicle) -> Void
    var onBackToLogin: () -> Void

    @State private var fullName: String = "Harshvardhan"
    @State private var phone: String = "+91 98450 12345"
    @State private var carBrand: String = "Toyota"
    @State private var carModel: String = "Fortuner 4x4"
    @State private var carPlate: String = "MP-40-CA-4921"
    @State private var carTransmission: String = "AUTOMATIC"

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            ScrollView {
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 18) {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(Color.gold500.opacity(0.15))
                                    .frame(width: 44, height: 44)
                                    .overlay(Circle().stroke(Color.gold500.opacity(0.4), lineWidth: 1))
                                Image(systemName: "person.badge.shield.checkmark.fill")
                                    .foregroundColor(.gold500)
                            }
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Client Registration")
                                    .font(.system(size: 20, weight: .black))
                                    .foregroundColor(.white)
                                Text("Register your personal vehicle for chauffeur service")
                                    .font(.system(size: 11))
                                    .foregroundColor(.slate400)
                            }
                        }

                        // Personal Fields
                        VStack(alignment: .leading, spacing: 6) {
                            Text("FULL NAME")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold500)
                                .tracking(1)
                            TextField("Full Name", text: $fullName)
                                .foregroundColor(.white)
                                .padding(12)
                                .background(Color.midnightDark)
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("PHONE NUMBER")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold500)
                                .tracking(1)
                            TextField("Phone", text: $phone)
                                .foregroundColor(.white)
                                .padding(12)
                                .background(Color.midnightDark)
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        Divider().background(Color.midnightBorder)

                        Text("PRIMARY VEHICLE DETAILS")
                            .font(.system(size: 11, weight: .black))
                            .foregroundColor(.white)

                        HStack(spacing: 10) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("BRAND")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.slate400)
                                TextField("e.g. Toyota", text: $carBrand)
                                    .foregroundColor(.white)
                                    .padding(12)
                                    .background(Color.midnightDark)
                                    .cornerRadius(10)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                            }
                            VStack(alignment: .leading, spacing: 6) {
                                Text("MODEL")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.slate400)
                                TextField("e.g. Fortuner", text: $carModel)
                                    .foregroundColor(.white)
                                    .padding(12)
                                    .background(Color.midnightDark)
                                    .cornerRadius(10)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                            }
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("LICENSE PLATE NUMBER")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.slate400)
                            TextField("e.g. MP-40-CA-4921", text: $carPlate)
                                .foregroundColor(.white)
                                .padding(12)
                                .background(Color.midnightDark)
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                        }

                        // Transmission picker
                        VStack(alignment: .leading, spacing: 6) {
                            Text("TRANSMISSION TYPE")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.slate400)
                            HStack(spacing: 8) {
                                ForEach(["AUTOMATIC", "MANUAL", "LUXURY"], id: \.self) { trans in
                                    let isSelected = carTransmission == trans
                                    Button(action: { carTransmission = trans }) {
                                        Text(trans)
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(isSelected ? .midnightDark : .slate300)
                                            .frame(maxWidth: .infinity)
                                            .padding(.vertical, 10)
                                            .background(isSelected ? Color.gold500 : Color.midnightDark)
                                            .cornerRadius(8)
                                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.midnightBorder, lineWidth: 1))
                                    }
                                }
                            }
                        }

                        // Legal Shield Guarantee
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.shield.fill")
                                .foregroundColor(.emerald400)
                            Text("All client vehicles are covered under DriveTrust Transit Shield (₹10L Policy) during active bookings.")
                                .font(.system(size: 11))
                                .foregroundColor(.slate300)
                                .lineLimit(2)
                        }
                        .padding(12)
                        .background(Color.midnightDark)
                        .cornerRadius(10)

                        Button(action: {
                            if !fullName.isEmpty && !carPlate.isEmpty {
                                let vehicle = CustomerVehicle(
                                    brand: carBrand,
                                    model: carModel,
                                    plate: carPlate,
                                    transmission: carTransmission,
                                    color: "Pearl White",
                                    year: 2023
                                )
                                onRegisterSuccess(fullName, phone, vehicle)
                            }
                        }) {
                            Text("Complete Registration & Enter")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.midnightDark)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.gold500)
                                .cornerRadius(12)
                        }

                        Button("Back to Sign In") {
                            onBackToLogin()
                        }
                        .font(.system(size: 12))
                        .foregroundColor(.slate400)
                        .frame(maxWidth: .infinity)
                    }
                    .padding(24)
                    .background(Color.midnightCard)
                    .cornerRadius(24)
                    .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.midnightBorder, lineWidth: 1))
                    .padding(20)
                }
            }
        }
    }
}
