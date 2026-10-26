import SwiftUI

enum BookingServiceMode: String, CaseIterable, Identifiable {
    case hourly = "Hourly Package"
    case nightDrop = "Night Safe-Drop"
    case outstation = "Outstation Chauffeur"

    var id: String { rawValue }
    var icon: String {
        switch self {
        case .hourly: return "clock.fill"
        case .nightDrop: return "moon.stars.fill"
        case .outstation: return "map.fill"
        }
    }
}

struct CustomerRideTrackingView: View {
    @State private var selectedMode: BookingServiceMode = .nightDrop
    @State private var bookingStatus: String = "DRIVER_ARRIVED"
    @State private var driverName: String = "Rajesh Sharma"
    @State private var driverRating: Double = 4.96
    @State private var startOTP: String = "8492"
    @State private var estimatedFare: Double = 540.00
    @State private var showEmergencySOS: Bool = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // Simulated Map Canvas
            Color(red: 0.05, green: 0.07, blue: 0.12)
                .edgesIgnoringSafeArea(.all)
                .overlay(
                    VStack {
                        Spacer()
                        Image(systemName: "car.circle.fill")
                            .resizable()
                            .frame(width: 44, height: 44)
                            .foregroundColor(.green)
                            .shadow(color: .green.opacity(0.5), radius: 10)
                        Text("\(driverName) (0.4 km)")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(6)
                        Spacer()
                    }
                )

            // Top Mode Switcher Bar
            VStack {
                HStack(spacing: 8) {
                    ForEach(BookingServiceMode.allCases) { mode in
                        Button(action: { selectedMode = mode }) {
                            HStack(spacing: 4) {
                                Image(systemName: mode.icon)
                                Text(mode.rawValue)
                                    .font(.system(size: 11, weight: .bold))
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 8)
                            .background(selectedMode == mode ? Color.green : Color(red: 0.11, green: 0.15, blue: 0.24))
                            .foregroundColor(selectedMode == mode ? Color.black : Color.gray)
                            .cornerRadius(12)
                        }
                    }
                }
                .padding(.top, 10)

                Spacer()
            }

            // Bottom Trip Control Sheet
            VStack(spacing: 16) {
                // Header with SOS button
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(selectedMode.rawValue.uppercased())
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.green)
                        Text(bookingStatus.replacingOccurrences(of: "_", with: " "))
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                    }

                    Spacer()

                    Button(action: { showEmergencySOS = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "sos.circle.fill")
                            Text("SOS")
                                .font(.system(size: 12, weight: .black))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.red)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                }

                Divider().background(Color.gray.opacity(0.3))

                // Driver Details & Start OTP Pill
                HStack {
                    Circle()
                        .fill(Color.blue.opacity(0.2))
                        .frame(width: 48, height: 48)
                        .overlay(
                            Text("RS")
                                .font(.system(size: 16, weight: .black))
                                .foregroundColor(.blue)
                        )

                    VStack(alignment: .leading, spacing: 2) {
                        Text(driverName)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                        Text("★ \(String(format: "%.2f", driverRating)) • 1,420 Verified Trips (MP-40)")
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }

                    Spacer()

                    // Customer 4-digit OTP Pill
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("START OTP")
                            .font(.system(size: 9, weight: .black))
                            .foregroundColor(.gray)
                        Text(startOTP)
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                            .foregroundColor(.green)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.green.opacity(0.15))
                            .cornerRadius(8)
                    }
                }

                // Fare Card
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("ESTIMATED FARE")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text("₹\(String(format: "%.2f", estimatedFare))")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                    }

                    Spacer()

                    Text("Includes Night Surcharge & Return")
                        .font(.system(size: 10))
                        .foregroundColor(.gray)
                }
                .padding(12)
                .background(Color(red: 0.11, green: 0.15, blue: 0.24))
                .cornerRadius(12)
            }
            .padding(20)
            .background(Color(red: 0.08, green: 0.11, blue: 0.18))
            .cornerRadius(24, corners: [.topLeft, .topRight])
        }
        .alert("Emergency SOS Triggered", isPresented: $showEmergencySOS) {
            Button("Call Police (112)", role: .destructive) {}
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Your live GPS telemetry and driver identification (Rajesh Sharma) have been transmitted to DriveTrust MP Emergency Response Desk and MP Police 112 Dispatch.")
        }
    }
}

// Corner radius extension
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}
