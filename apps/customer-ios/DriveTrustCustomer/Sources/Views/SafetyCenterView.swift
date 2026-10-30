import SwiftUI

struct SafetyCenterView: View {
    var onBack: () -> Void

    @State private var showDialAlert: Bool = false

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
                    Text("Safety Command Center")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.customerTextPrimary)
                    Spacer()
                }
                .padding(16)
                .background(Color.midnightCard)

                ScrollView {
                    VStack(spacing: 16) {
                        // Emergency 112 Banner
                        VStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(Color.red.opacity(0.12))
                                    .frame(width: 56, height: 56)
                                Image(systemName: "sos.circle.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.red)
                            }

                            Text("Emergency SOS Dispatch")
                                .font(.system(size: 18, weight: .black))
                                .foregroundColor(.customerTextPrimary)

                            Text("One-tap trigger dials MP Police 112 and instantly broadcasts live vehicle telemetry, client name, and commercial DL to state emergency desks.")
                                .font(.system(size: 11))
                                .foregroundColor(.customerTextSecondary)
                                .multilineTextAlignment(.center)

                            Button(action: { showDialAlert = true }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "phone.fill")
                                    Text("TRIGGER 112 POLICE SOS")
                                        .font(.system(size: 13, weight: .black))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.red)
                                .cornerRadius(12)
                            }
                        }
                        .padding(20)
                        .background(Color.midnightCard)
                        .cornerRadius(20)
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.red.opacity(0.35), lineWidth: 1.5))
                        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)

                        // Features List
                        VStack(alignment: .leading, spacing: 12) {
                            Text("ACTIVE TRIP PROTECTIONS")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gold600)
                                .tracking(1)

                            ForEach([
                                ("MoRTH Sarathi Verification", "Every driver holds verified commercial badge and clean criminal record", "checkmark.shield.fill"),
                                ("Real-Time Telematics Tracking", "Live speed limit compliance & G-force smooth driving monitored", "speedometer"),
                                ("Zero-Cancellation Guarantee", "Assigned chauffeur partner cannot cancel after booking acceptance", "car.badge.gearshape.fill")
                            ], id: \.0) { item in
                                HStack(alignment: .top, spacing: 12) {
                                    Image(systemName: item.2)
                                        .foregroundColor(.mint500)
                                        .font(.system(size: 18))

                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(item.0)
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.customerTextPrimary)
                                        Text(item.1)
                                            .font(.system(size: 11))
                                            .foregroundColor(.customerTextSecondary)
                                    }
                                }
                                .padding(14)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.midnightCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                                .shadow(color: Color.black.opacity(0.03), radius: 4, x: 0, y: 1)
                            }
                        }
                    }
                    .padding(16)
                }
            }
        }
        .alert("Call Police 112?", isPresented: $showDialAlert) {
            Button("Call 112 Now", role: .destructive) {}
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Simulated emergency call initiated. In production, this dials emergency services directly.")
        }
    }
}
