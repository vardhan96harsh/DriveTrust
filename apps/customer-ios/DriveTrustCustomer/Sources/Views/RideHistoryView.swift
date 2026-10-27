import SwiftUI

struct RideHistoryView: View {
    @State private var downloadInvoiceMsg: String? = nil

    private let pastRides = [
        PastRideRecord(
            bookingCode: "DT-991204",
            dateString: "Today, 14:10 PM",
            serviceLabel: "Night Safe-Drop",
            pickup: "Vidisha Railway Station Road, Vidisha (M.P.)",
            dropoff: "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)",
            fare: 390.00,
            driverName: "Rajesh Sharma",
            driverRating: 4.96,
            vehicleSummary: "Toyota Fortuner 4x4 (MP-40-CA-4921)"
        ),
        PastRideRecord(
            bookingCode: "DT-984110",
            dateString: "Yesterday, 19:40 PM",
            serviceLabel: "Hourly Chauffeur (4h)",
            pickup: "Betwa River Ghat / Charans Tirth, Vidisha",
            dropoff: "Tilak Chowk / Hospital Rd, Vidisha",
            fare: 750.00,
            driverName: "Vikram Aditya",
            driverRating: 5.0,
            vehicleSummary: "BMW 330Li M Sport (MP-04-BK-8822)"
        ),
        PastRideRecord(
            bookingCode: "DT-971008",
            dateString: "24 Oct 2026, 11:15 AM",
            serviceLabel: "Outstation Trip",
            pickup: "Vidisha Civil Lines",
            dropoff: "Raja Bhoj International Airport, VIP Road, Bhopal",
            fare: 1850.00,
            driverName: "Suresh Patel",
            driverRating: 4.92,
            vehicleSummary: "Toyota Fortuner 4x4 (MP-40-CA-4921)"
        )
    ]

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            VStack(spacing: 0) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Chauffeur Ride History")
                            .font(.system(size: 20, weight: .black))
                            .foregroundColor(.white)
                        Text("3 Verified Commercial Rides • GST Compliant")
                            .font(.system(size: 11))
                            .foregroundColor(.slate400)
                    }
                    Spacer()
                }
                .padding(16)
                .background(Color.midnightCard)

                if let msg = downloadInvoiceMsg {
                    Text(msg)
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.emerald400)
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.emerald400.opacity(0.12))
                }

                ScrollView {
                    VStack(spacing: 14) {
                        ForEach(pastRides) { ride in
                            VStack(alignment: .leading, spacing: 10) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(ride.serviceLabel)
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.white)
                                        Text("\(ride.bookingCode) • \(ride.dateString)")
                                            .font(.system(size: 10))
                                            .foregroundColor(.slate400)
                                    }
                                    Spacer()
                                    Text("₹\(Int(ride.fare))")
                                        .font(.system(size: 16, weight: .black))
                                        .foregroundColor(.gold500)
                                }

                                Divider().background(Color.midnightBorder)

                                // Route
                                VStack(alignment: .leading, spacing: 6) {
                                    HStack(spacing: 6) {
                                        Circle().fill(Color.emerald400).frame(width: 8, height: 8)
                                        Text(ride.pickup)
                                            .font(.system(size: 11))
                                            .foregroundColor(.slate300)
                                            .lineLimit(1)
                                    }
                                    HStack(spacing: 6) {
                                        Rectangle().fill(Color.red).frame(width: 8, height: 8).cornerRadius(2)
                                        Text(ride.dropoff)
                                            .font(.system(size: 11))
                                            .foregroundColor(.slate300)
                                            .lineLimit(1)
                                    }
                                }

                                HStack {
                                    HStack(spacing: 4) {
                                        Image(systemName: "person.circle.fill")
                                            .foregroundColor(.gold500)
                                        Text("\(ride.driverName) (★ \(String(format: "%.1f", ride.driverRating)))")
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(.slate300)
                                    }
                                    Spacer()
                                    Button(action: {
                                        downloadInvoiceMsg = "Invoice #INV-\(ride.bookingCode).pdf saved to Documents."
                                    }) {
                                        HStack(spacing: 4) {
                                            Image(systemName: "arrow.down.doc.fill")
                                            Text("GST Invoice")
                                                .font(.system(size: 10, weight: .bold))
                                        }
                                        .foregroundColor(.gold500)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.midnightDark)
                                        .cornerRadius(6)
                                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.midnightBorder, lineWidth: 1))
                                    }
                                }
                            }
                            .padding(14)
                            .background(Color.midnightCard)
                            .cornerRadius(16)
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.midnightBorder, lineWidth: 1))
                        }
                    }
                    .padding(16)
                    .padding(.bottom, 80)
                }
            }
        }
    }
}
