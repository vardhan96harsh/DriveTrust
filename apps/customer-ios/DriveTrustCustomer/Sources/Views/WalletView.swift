import SwiftUI

struct WalletView: View {
    @State private var balance: Double = 1240.50
    @State private var showTopUpModal: Bool = false
    @State private var topUpAmount: String = "500"
    @State private var isProcessing: Bool = false
    @State private var successMessage: String? = nil

    var body: some View {
        ZStack {
            Color.midnightDark.edgesIgnoringSafeArea(.all)

            ScrollView {
                VStack(spacing: 16) {
                    // Balance Card
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Text("DRIVETRUST DIGITAL WALLET")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.mint600)
                                .tracking(1)
                            Spacer()
                            HStack(spacing: 4) {
                                Circle().fill(Color.mint500).frame(width: 8, height: 8)
                                Text("Auto-Debit Active")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.mint600)
                            }
                        }

                        Text("₹\(String(format: "%.2f", balance))")
                            .font(.system(size: 38, weight: .black))
                            .foregroundColor(.customerTextPrimary)

                        Text("Instant 1-tap checkout for chauffeur dispatches")
                            .font(.system(size: 11))
                            .foregroundColor(.customerTextSecondary)

                        if let msg = successMessage {
                            Text(msg)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(.mint600)
                                .padding(8)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.mint50)
                                .cornerRadius(8)
                        }

                        Button(action: { showTopUpModal = true }) {
                            HStack(spacing: 6) {
                                Image(systemName: "plus.circle.fill")
                                Text("Top Up Wallet via UPI")
                                    .font(.system(size: 13, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.mint500)
                            .cornerRadius(10)
                        }
                    }
                    .padding(20)
                    .background(Color.midnightCard)
                    .cornerRadius(20)
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.midnightBorder, lineWidth: 1))
                    .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)

                    // Linked Payment Methods
                    VStack(alignment: .leading, spacing: 12) {
                        Text("SAVED PAYMENT INSTRUMENTS")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.mint600)
                            .tracking(1)

                        ForEach([
                            ("HDFC Bank •••• 9812", "UPI AutoPay Linked", "building.columns.fill"),
                            ("Google Pay (client@okhdfcbank)", "Primary UPI VPA", "qrcode"),
                            ("Apple Pay / Cards", "Zero Convenience Fee", "creditcard.fill")
                        ], id: \.0) { item in
                            HStack(spacing: 12) {
                                Image(systemName: item.2)
                                    .foregroundColor(.mint600)
                                    .frame(width: 32, height: 32)
                                    .background(Color.mint50)
                                    .clipShape(Circle())

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.0)
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.customerTextPrimary)
                                    Text(item.1)
                                        .font(.system(size: 10))
                                        .foregroundColor(.customerTextSecondary)
                                }
                                Spacer()
                                Image(systemName: "checkmark")
                                    .foregroundColor(.mint600)
                                    .font(.system(size: 11, weight: .bold))
                            }
                            .padding(12)
                            .background(Color.midnightCard)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.midnightBorder, lineWidth: 1))
                            .shadow(color: Color.black.opacity(0.02), radius: 4, x: 0, y: 1)
                        }
                    }

                    // Transactions Ledger
                    VStack(alignment: .leading, spacing: 10) {
                        Text("RECENT TRANSACTIONS")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.mint600)
                            .tracking(1)

                        ForEach([
                            ("Chauffeur Ride (Station Rd → Civil Lines)", "-₹390.00", "Today, 14:30", false),
                            ("UPI Wallet Add Money", "+₹1,000.00", "Yesterday, 19:15", true),
                            ("Chauffeur Night Safe Drop", "-₹540.00", "25 Oct, 23:45", false)
                        ], id: \.0) { txn in
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(txn.0)
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.customerTextPrimary)
                                    Text(txn.2)
                                        .font(.system(size: 10))
                                        .foregroundColor(.customerTextSecondary)
                                }
                                Spacer()
                                Text(txn.1)
                                    .font(.system(size: 13, weight: .black))
                                    .foregroundColor(txn.3 ? .mint600 : .customerTextPrimary)
                            }
                            .padding(12)
                            .background(Color.midnightCard)
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.midnightBorder, lineWidth: 1))
                        }
                    }
                }
                .padding(16)
                .padding(.bottom, 80)
            }
        }
        .sheet(isPresented: $showTopUpModal) {
            ZStack {
                Color.midnightDark.edgesIgnoringSafeArea(.all)

                VStack(spacing: 16) {
                    Text("Top Up Wallet")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(.customerTextPrimary)

                    HStack(spacing: 10) {
                        ForEach(["200", "500", "1000", "2000"], id: \.self) { amt in
                            Button("₹\(amt)") {
                                topUpAmount = amt
                            }
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(topUpAmount == amt ? .white : .customerTextPrimary)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(topUpAmount == amt ? Color.mint500 : Color.midnightCard)
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.midnightBorder, lineWidth: 1))
                        }
                    }

                    if isProcessing {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .mint500))
                    } else {
                        Button(action: {
                            isProcessing = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                                isProcessing = false
                                if let val = Double(topUpAmount) {
                                    balance += val
                                    successMessage = "₹\(Int(val)) successfully added via UPI."
                                }
                                showTopUpModal = false
                            }
                        }) {
                            Text("Confirm & Pay ₹\(topUpAmount)")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color.mint500)
                                .cornerRadius(10)
                        }
                    }
                }
                .padding(24)
            }
        }
    }
}
