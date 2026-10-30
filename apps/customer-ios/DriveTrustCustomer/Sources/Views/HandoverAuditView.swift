import SwiftUI

struct HandoverAuditView: View {
    var carModel: String
    var carPlate: String
    var driverName: String
    var onConfirmHandover: () -> Void
    var onBack: () -> Void

    @State private var bumperFront: Bool = true
    @State private var bumperRear: Bool = true
    @State private var glassPanels: Bool = true
    @State private var cabinClean: Bool = true
    @State private var odoReading: String = "42,150 km"
    @State private var fuelLevel: String = "85% Full"

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: onBack) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.customerTextPrimary)
                    }
                    Text("Pre-Trip Handover Inspection")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.customerTextPrimary)
                    Spacer()
                }
                .padding(16)
                .background(Color.midnightCard)

                ScrollView {
                    VStack(spacing: 16) {
                        // Vehicle Card
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(carModel)
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.customerTextPrimary)
                                Text("Chauffeur: \(driverName)")
                                    .font(.system(size: 11))
                                    .foregroundColor(.customerTextSecondary)
                            }
                            Spacer()
                            Text(carPlate)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.mint600)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.mint50)
                                .cornerRadius(6)
                                .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.mint500.opacity(0.4), lineWidth: 1))
                        }
                        .padding(14)
                        .background(Color.midnightCard)
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.midnightBorder, lineWidth: 1))
                        .shadow(color: Color.black.opacity(0.03), radius: 4, x: 0, y: 1)

                        // 360 Checklist
                        VStack(alignment: .leading, spacing: 10) {
                            Text("360° VEHICLE AUDIT CHECKLIST")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold600)
                                .tracking(1)

                            ForEach([
                                ("Front & Rear Bumpers Checked", "Clear of fresh scratches", $bumperFront),
                                ("Left & Right Door Panels & Glass", "Clean and intact", $bumperRear),
                                ("Cabin Cleanliness & Fuel Level", "Pristine luxury standard", $cabinClean)
                            ], id: \.0) { item in
                                Toggle(isOn: item.2) {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.0)
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.customerTextPrimary)
                                        Text(item.1)
                                            .font(.system(size: 11))
                                            .foregroundColor(.mint600)
                                    }
                                }
                                .toggleStyle(SwitchToggleStyle(tint: .mint500))
                                .padding(12)
                                .background(Color.midnightCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                                .shadow(color: Color.black.opacity(0.02), radius: 4, x: 0, y: 1)
                            }
                        }

                        // Baseline readings
                        HStack(spacing: 10) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("STARTING ODOMETER")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.customerTextSecondary)
                                TextField("Odometer", text: $odoReading)
                                    .font(.system(size: 13))
                                    .foregroundColor(.customerTextPrimary)
                                    .padding(10)
                                    .background(Color.midnight950)
                                    .cornerRadius(8)
                            }
                            VStack(alignment: .leading, spacing: 4) {
                                Text("FUEL / BATTERY")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.customerTextSecondary)
                                TextField("Fuel Level", text: $fuelLevel)
                                    .font(.system(size: 13))
                                    .foregroundColor(.customerTextPrimary)
                                    .padding(10)
                                    .background(Color.midnight950)
                                    .cornerRadius(8)
                            }
                        }

                        Button(action: onConfirmHandover) {
                            HStack(spacing: 6) {
                                Image(systemName: "checkmark.circle.fill")
                                Text("Confirm Vehicle Handover & Start Drive")
                                    .font(.system(size: 13, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.mint500)
                            .cornerRadius(12)
                        }
                    }
                    .padding(16)
                }
            }
        }
    }
}
