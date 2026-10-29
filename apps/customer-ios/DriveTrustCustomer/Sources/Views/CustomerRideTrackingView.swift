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
                        Text("\(driverName) • En Route (~4.8 km travel)")
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
                            .background(selectedMode == mode ? Color.mint500 : Color.midnight950)
                            .foregroundColor(selectedMode == mode ? Color.white : Color.slate500)
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
                            .foregroundColor(.mint500)
                        Text(bookingStatus.replacingOccurrences(of: "_", with: " "))
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.customerTextPrimary)
                        Text("ETA: ~20-25 Mins (Chauffeur Traveling to Location)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.gold500)
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

                Divider().background(Color.midnightBorder)

                // Driver Details & Start OTP Pill
                HStack {
                    Circle()
                        .fill(Color.mint50)
                        .frame(width: 48, height: 48)
                        .overlay(
                            Text("RS")
                                .font(.system(size: 16, weight: .black))
                                .foregroundColor(.mint500)
                        )

                    VStack(alignment: .leading, spacing: 2) {
                        Text(driverName)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.customerTextPrimary)
                        Text("★ \(String(format: "%.2f", driverRating)) • 1,420 Verified Trips (MP-40)")
                            .font(.system(size: 11))
                            .foregroundColor(.customerTextSecondary)
                    }

                    Spacer()

                    // Customer 4-digit OTP Pill
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("START OTP")
                            .font(.system(size: 9, weight: .black))
                            .foregroundColor(.customerTextSecondary)
                        Text(startOTP)
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                            .foregroundColor(.mint500)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.mint50)
                            .cornerRadius(8)
                    }
                }

                // Fare Card
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("ESTIMATED FARE")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.customerTextSecondary)
                        Text("₹\(String(format: "%.2f", estimatedFare))")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.customerTextPrimary)
                    }

                    Spacer()

                    Text("Includes Night Surcharge & Return")
                        .font(.system(size: 10))
                        .foregroundColor(.customerTextSecondary)
                }
                .padding(12)
                .background(Color.midnight950)
                .cornerRadius(12)
            }
            .padding(20)
            .background(Color.white)
            .cornerRadius(24, corners: [.topLeft, .topRight])
            .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: -4)
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
