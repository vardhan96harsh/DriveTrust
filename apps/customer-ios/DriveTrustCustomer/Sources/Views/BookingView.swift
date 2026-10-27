import SwiftUI

struct BookingView: View {
    var customerName: String
    var carModel: String
    var carPlate: String
    var preferredDriverName: String?
    var onBookChauffeur: (ServiceType, String, String, Double) -> Void
    var onOpenSafety: () -> Void
    var onOpenNotifications: () -> Void
    var onOpenSupport: () -> Void
    var onLogout: () -> Void

    @State private var selectedService: ServiceType = .nightSafeDrop
    @State private var pickupAddress: String = "Vidisha Railway Station Road, Vidisha (M.P.)"
    @State private var dropoffAddress: String = "Collectorate Civil Lines, Vidisha (M.P.)"

    @State private var isScheduleMode: Bool = false
    @State private var scheduledTime: String = "06:30 AM"

    @State private var appliedPromoCode: String = "WELCOME50"
    @State private var promoDiscount: Double = 150.0

    @State private var selectedPaymentType: String = "DT Wallet"
    @State private var showLocationModal: Bool = false
    @State private var locationTarget: String = "PICKUP"
    @State private var showPricingModal: Bool = false
    @State private var showPaymentModal: Bool = false
    @State private var showPromoModal: Bool = false
    @State private var showScheduleModal: Bool = false
    @State private var showSimulatedPaymentModal: Bool = false
    @State private var isPaymentProcessing: Bool = false

    private var distanceKm: Double { 4.2 }
    private var etaMinutes: Int { 8 }

    private var grossFare: Double {
        switch selectedService {
        case .nightSafeDrop: return 540.0
        case .hourlyChauffeur: return 399.0
        case .outstation: return 1799.0
        }
    }

    private var finalFare: Double {
        max(grossFare - promoDiscount, 149.0)
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            // Scrollable Content
            VStack(spacing: 0) {
                CustomTopBar(
                    customerName: customerName,
                    onOpenSafety: onOpenSafety,
                    onOpenNotifications: onOpenNotifications,
                    onLogout: onLogout
                )

                ScrollView {
                    VStack(spacing: 14) {
                        // Active Vehicle Card
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(Color.gold500.opacity(0.15))
                                    .frame(width: 40, height: 40)
                                    .overlay(Circle().stroke(Color.gold500.opacity(0.4), lineWidth: 1))
                                Image(systemName: "car.fill")
                                    .foregroundColor(.gold500)
                            }

                            VStack(alignment: .leading, spacing: 2) {
                                Text(carModel)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                Text("\(carPlate) • Automatic Fleet")
                                    .font(.system(size: 11))
                                    .foregroundColor(.slate400)
                            }

                            Spacer()

                            HStack(spacing: 4) {
                                Image(systemName: "checkmark.shield.fill")
                                    .font(.system(size: 11))
                                    .foregroundColor(.emerald400)
                                Text("₹10L Insured")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.emerald400)
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.midnightDark)
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.emerald400.opacity(0.3), lineWidth: 1))
                        }
                        .padding(14)
                        .background(Color.midnightCard)
                        .cornerRadius(16)
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.midnightBorder, lineWidth: 1))

                        // STEP 1: ROUTE PICKER
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("TRIP ROUTE")
                                    .font(.system(size: 10, weight: .black))
                                    .foregroundColor(.gold500)
                                    .tracking(1)
                                Spacer()
                                HStack(spacing: 4) {
                                    Image(systemName: "clock.fill")
                                        .font(.system(size: 11))
                                        .foregroundColor(.emerald400)
                                    Text("~\(String(format: "%.1f", distanceKm)) km • ~\(etaMinutes) mins ETA")
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(.emerald400)
                                }
                            }

                            // Pickup
                            HStack(spacing: 10) {
                                Circle()
                                    .fill(Color.emerald400)
                                    .frame(width: 10, height: 10)

                                TextField("Pickup Point", text: $pickupAddress)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(.white)

                                Button(action: {
                                    locationTarget = "PICKUP"
                                    showLocationModal = true
                                }) {
                                    Image(systemName: "magnifyingglass")
                                        .foregroundColor(.gold500)
                                }
                            }
                            .padding(12)
                            .background(Color.midnightDark)
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))

                            // Dropoff
                            HStack(spacing: 10) {
                                Rectangle()
                                    .fill(Color.red)
                                    .frame(width: 10, height: 10)
                                    .cornerRadius(2)

                                TextField("Destination Point", text: $dropoffAddress)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(.white)

                                Button(action: {
                                    locationTarget = "DROPOFF"
                                    showLocationModal = true
                                }) {
                                    Image(systemName: "magnifyingglass")
                                        .foregroundColor(.gold500)
                                }
                            }
                            .padding(12)
                            .background(Color.midnightDark)
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))

                            // Quick Landmark Chips
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach([
                                        ("Station Rd", "Vidisha Railway Station Road, Vidisha (M.P.)"),
                                        ("Civil Lines", "Collectorate Civil Lines, Vidisha (M.P.)"),
                                        ("Betwa Ghat", "Betwa River Ghat / Charans Tirth, Vidisha"),
                                        ("Sanchi Stupa", "Sanchi Stupa Heritage Junction (SH-19)"),
                                        ("Bhopal Airport", "Raja Bhoj Airport, VIP Road, Bhopal")
                                    ], id: \.0) { chip in
                                        Button(action: { dropoffAddress = chip.1 }) {
                                            Text("+ \(chip.0)")
                                                .font(.system(size: 11, weight: .medium))
                                                .foregroundColor(.slate300)
                                                .padding(.horizontal, 10)
                                                .padding(.vertical, 5)
                                                .background(Color.midnightDark)
                                                .cornerRadius(20)
                                                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.midnightBorder, lineWidth: 1))
                                        }
                                    }
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.midnightCard)
                        .cornerRadius(18)
                        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.midnightBorder, lineWidth: 1))

                        // STEP 2: SERVICE PACKAGES
                        VStack(alignment: .leading, spacing: 8) {
                            Text("SELECT CHAUFFEUR PACKAGE")
                                .font(.system(size: 10, weight: .black))
                                .foregroundColor(.gold500)
                                .tracking(1)

                            ForEach(ServiceType.allCases) { s in
                                let isSelected = selectedService == s
                                Button(action: { selectedService = s }) {
                                    HStack(spacing: 12) {
                                        ZStack {
                                            Circle()
                                                .fill(isSelected ? Color.gold500.opacity(0.2) : Color.midnightBorder.opacity(0.3))
                                                .frame(width: 36, height: 36)
                                            Image(systemName: s.iconName)
                                                .font(.system(size: 15))
                                                .foregroundColor(isSelected ? .gold500 : .slate400)
                                        }

                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(s.rawValue)
                                                .font(.system(size: 13, weight: .bold))
                                                .foregroundColor(isSelected ? .white : .slate300)
                                            Text(s.subtitle)
                                                .font(.system(size: 11))
                                                .foregroundColor(.slate400)
                                        }

                                        Spacer()

                                        Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                                            .foregroundColor(isSelected ? .gold500 : .slate500)
                                    }
                                    .padding(14)
                                    .background(isSelected ? Color.midnightDark : Color.midnightCard)
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(isSelected ? Color.gold500 : Color.midnightBorder, lineWidth: 1.5)
                                    )
                                }
                            }
                        }

                        // STEP 3: PREFERENCES ROW
                        HStack(spacing: 8) {
                            // Payment Chip
                            Button(action: { showPaymentModal = true }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "creditcard.fill")
                                        .foregroundColor(.gold500)
                                    VStack(alignment: .leading, spacing: 1) {
                                        Text("PAYMENT")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundColor(.slate400)
                                        Text(selectedPaymentType)
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                            .lineLimit(1)
                                    }
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.midnightCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                            }

                            // Promo Chip
                            Button(action: { showPromoModal = true }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "tag.fill")
                                        .foregroundColor(.emerald400)
                                    VStack(alignment: .leading, spacing: 1) {
                                        Text("PROMO")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundColor(.slate400)
                                        Text(appliedPromoCode)
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.emerald400)
                                            .lineLimit(1)
                                    }
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.midnightCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                            }

                            // Timing Chip
                            Button(action: {
                                isScheduleMode.toggle()
                                if isScheduleMode { showScheduleModal = true }
                            }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "clock.badge.checkmark")
                                        .foregroundColor(isScheduleMode ? .gold500 : .slate400)
                                    VStack(alignment: .leading, spacing: 1) {
                                        Text("TIME")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundColor(.slate400)
                                        Text(isScheduleMode ? scheduledTime : "Now (~8m)")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(isScheduleMode ? .gold500 : .white)
                                            .lineLimit(1)
                                    }
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.midnightCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(isScheduleMode ? Color.gold500 : Color.midnightBorder, lineWidth: 1))
                            }
                        }

                        // Preferred Driver Card
                        if let pref = preferredDriverName {
                            HStack(spacing: 8) {
                                Image(systemName: "star.fill")
                                    .foregroundColor(.gold500)
                                Text("Preferred Chauffeur: \(pref)")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.gold500)
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.midnightCard)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gold500.opacity(0.3), lineWidth: 1))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 10)
                    .padding(.bottom, 160) // Generous space so content is never blocked by sticky Book Now bar
                }
            }

            // PERSISTENT FLOATING STICKY BOOKING BAR
            FloatingBookingBar(
                fare: finalFare,
                grossFare: grossFare,
                isScheduleMode: isScheduleMode,
                onOpenPricingDetails: { showPricingModal = true },
                onBookNow: {
                    showSimulatedPaymentModal = true
                }
            )
        }
        // Simulated Payment Sheet
        .sheet(isPresented: $showSimulatedPaymentModal) {
            ZStack {
                Color.midnightCard.edgesIgnoringSafeArea(.all)

                VStack(spacing: 20) {
                    Circle()
                        .fill(Color.gold500.opacity(0.15))
                        .frame(width: 54, height: 54)
                        .overlay(Image(systemName: "shield.fill").foregroundColor(.gold500).font(.system(size: 26)))

                    Text("Payment Authorization")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(.white)

                    Text("Simulated Bank Gateway • Amount: ₹\(Int(finalFare)).00")
                        .font(.system(size: 12))
                        .foregroundColor(.slate400)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("METHOD: \(selectedPaymentType)")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.gold500)
                        Text("REF: TXN-\(Int.random(in: 100000...999999))")
                            .font(.system(size: 10))
                            .foregroundColor(.slate400)
                    }
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.midnightDark)
                    .cornerRadius(12)

                    if isPaymentProcessing {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .gold500))
                            .scaleEffect(1.3)
                        Text("Authorizing transaction...")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.gold500)
                    } else {
                        Button(action: {
                            isPaymentProcessing = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                                isPaymentProcessing = false
                                showSimulatedPaymentModal = false
                                onBookChauffeur(selectedService, pickupAddress, dropoffAddress, finalFare)
                            }
                        }) {
                            Text("AUTHORIZE PAYMENT (₹\(Int(finalFare)))")
                                .font(.system(size: 14, weight: .black))
                                .foregroundColor(.midnightDark)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.gold500)
                                .cornerRadius(12)
                        }
                    }
                }
                .padding(24)
            }
        }
        // Pricing Modal
        .sheet(isPresented: $showPricingModal) {
            ZStack {
                Color.midnightCard.edgesIgnoringSafeArea(.all)

                VStack(alignment: .leading, spacing: 16) {
                    Text("Pricing Breakdown")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(.white)

                    HStack {
                        Text("Base Chauffeur Package")
                            .foregroundColor(.slate300)
                        Spacer()
                        Text("₹\(Int(grossFare)).00")
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                    }

                    if promoDiscount > 0 {
                        HStack {
                            Text("Promo Discount (\(appliedPromoCode))")
                                .foregroundColor(.emerald400)
                            Spacer()
                            Text("-₹\(Int(promoDiscount)).00")
                                .foregroundColor(.emerald400)
                                .fontWeight(.black)
                        }
                    }

                    HStack {
                        Text("Transit Guarantee (₹10L Policy)")
                            .foregroundColor(.emerald400)
                        Spacer()
                        Text("₹0.00 (Included)")
                            .foregroundColor(.emerald400)
                            .fontWeight(.bold)
                    }

                    Divider().background(Color.midnightBorder)

                    HStack {
                        Text("TOTAL NET FARE")
                            .font(.system(size: 14, weight: .black))
                            .foregroundColor(.gold500)
                        Spacer()
                        Text("₹\(Int(finalFare)).00")
                            .font(.system(size: 20, weight: .black))
                            .foregroundColor(.gold500)
                    }
                    .padding(14)
                    .background(Color.midnightDark)
                    .cornerRadius(12)

                    Button("Done") {
                        showPricingModal = false
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color.slate800)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                .padding(24)
            }
        }
    }
}
