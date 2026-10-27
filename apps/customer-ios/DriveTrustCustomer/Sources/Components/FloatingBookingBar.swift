import SwiftUI

struct FloatingBookingBar: View {
    var fare: Double
    var grossFare: Double
    var isScheduleMode: Bool
    var onOpenPricingDetails: () -> Void
    var onBookNow: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Fare Summary
            Button(action: onOpenPricingDetails) {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text("₹\(Int(fare))")
                            .font(.system(size: 24, weight: .black))
                            .foregroundColor(.gold500)

                        if grossFare > fare {
                            Text("₹\(Int(grossFare))")
                                .font(.system(size: 13, weight: .medium))
                                .strikethrough()
                                .foregroundColor(.slate400)
                        }
                    }

                    Text("Price Details ℹ • GST Included")
                        .font(.system(size: 10))
                        .foregroundColor(.slate400)
                }
            }

            Spacer()

            // Big Bold Golden Book Button
            Button(action: onBookNow) {
                HStack(spacing: 8) {
                    Image(systemName: "car.fill")
                        .font(.system(size: 15, weight: .bold))

                    Text(isScheduleMode ? "CONFIRM SCHEDULE" : "BOOK CHAUFFEUR NOW")
                        .font(.system(size: 13, weight: .black))
                        .tracking(0.5)

                    Image(systemName: "arrow.right")
                        .font(.system(size: 13, weight: .bold))
                }
                .foregroundColor(.midnightDark)
                .padding(.horizontal, 16)
                .padding(.vertical, 14)
                .background(Color.gold500)
                .cornerRadius(14)
                .shadow(color: Color.gold500.opacity(0.35), radius: 8, x: 0, y: 3)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.midnightCard)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.gold500.opacity(0.5), lineWidth: 1.5)
        )
        .shadow(color: Color.black.opacity(0.6), radius: 18, x: 0, y: 8)
        .padding(.horizontal, 14)
        .padding(.bottom, 72) // Sits directly on top of the 5-tab bottom navigation bar
    }
}
