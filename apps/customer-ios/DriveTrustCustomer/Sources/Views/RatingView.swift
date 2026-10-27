import SwiftUI

struct RatingView: View {
    var booking: TripBooking
    var onBookAnotherRide: () -> Void

    @State private var rating: Int = 5
    @State private var tipAmount: Int = 50
    @State private var addToFavorites: Bool = true
    @State private var feedbackText: String = "Pristine luxury driving, very smooth gear changes."

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            ScrollView {
                VStack(spacing: 20) {
                    // Success Icon
                    ZStack {
                        Circle()
                            .fill(Color.emerald400.opacity(0.15))
                            .frame(width: 64, height: 64)
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 36))
                            .foregroundColor(.emerald400)
                    }
                    .padding(.top, 24)

                    VStack(spacing: 4) {
                        Text("Trip Completed Safely")
                            .font(.system(size: 22, weight: .black))
                            .foregroundColor(.white)
                        Text("Chauffeur handed keys back. Thank you for choosing DriveTrust.")
                            .font(.system(size: 11))
                            .foregroundColor(.slate400)
                            .multilineTextAlignment(.center)
                    }

                    // Chauffeur Card & Star Rating
                    VStack(spacing: 14) {
                        Text("RATE YOUR CHAUFFEUR")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gold500)
                            .tracking(1)

                        Text(booking.assignedDriverName)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)

                        HStack(spacing: 10) {
                            ForEach(1...5, id: \.self) { star in
                                Button(action: { rating = star }) {
                                    Image(systemName: star <= rating ? "star.fill" : "star")
                                        .font(.system(size: 28))
                                        .foregroundColor(.gold500)
                                }
                            }
                        }

                        // Tip selector
                        Text("ADD A CHAUFFEUR GRATUITY (100% TO DRIVER)")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.slate400)
                            .padding(.top, 6)

                        HStack(spacing: 8) {
                            ForEach([0, 50, 100, 200], id: \.self) { tip in
                                Button(tip == 0 ? "No Tip" : "₹\(tip)") {
                                    tipAmount = tip
                                }
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(tipAmount == tip ? .midnightDark : .white)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(tipAmount == tip ? Color.gold500 : Color.midnightDark)
                                .cornerRadius(8)
                            }
                        }
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity)
                    .background(Color.midnightCard)
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.midnightBorder, lineWidth: 1))

                    // Bookmark as Favorite Driver
                    Toggle(isOn: $addToFavorites) {
                        HStack(spacing: 8) {
                            Image(systemName: "star.circle.fill")
                                .foregroundColor(.gold500)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Add to Favorite Chauffeurs")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Priority dispatch on your future bookings")
                                    .font(.system(size: 11))
                                    .foregroundColor(.slate400)
                            }
                        }
                    }
                    .toggleStyle(SwitchToggleStyle(tint: .gold500))
                    .padding(14)
                    .background(Color.midnightCard)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.midnightBorder, lineWidth: 1))

                    Button(action: onBookAnotherRide) {
                        HStack(spacing: 8) {
                            Image(systemName: "car.fill")
                            Text("Book Another Chauffeur")
                                .font(.system(size: 14, weight: .bold))
                        }
                        .foregroundColor(.midnightDark)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.gold500)
                        .cornerRadius(12)
                    }
                }
                .padding(20)
            }
        }
    }
}
