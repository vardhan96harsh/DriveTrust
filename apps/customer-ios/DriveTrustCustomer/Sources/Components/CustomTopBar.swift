import SwiftUI

struct CustomTopBar: View {
    var customerName: String
    var unreadCount: Int = 2
    var onOpenSafety: () -> Void = {}
    var onOpenNotifications: () -> Void = {}
    var onLogout: () -> Void = {}

    var body: some View {
        HStack(spacing: 12) {
            // Monogram Badge
            ZStack {
                Circle()
                    .fill(Color.midnightDark)
                    .frame(width: 42, height: 42)
                    .overlay(
                        Circle().stroke(Color.gold500, lineWidth: 1.5)
                    )
                Text("DT")
                    .font(.system(size: 16, weight: .black))
                    .foregroundColor(.gold500)
            }

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text("DriveTrust")
                        .font(.system(size: 17, weight: .black))
                        .foregroundColor(.white)
                    
                    Text("LUXURY")
                        .font(.system(size: 8, weight: .black))
                        .foregroundColor(.gold500)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.midnightDark)
                        .cornerRadius(4)
                        .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.gold500.opacity(0.4), lineWidth: 1))
                }

                Text("Private Chauffeur • \(customerName)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.slate400)
            }

            Spacer()

            // Safety Vault Button
            Button(action: onOpenSafety) {
                Image(systemName: "shield.checkered")
                    .font(.system(size: 16))
                    .foregroundColor(.slate300)
                    .frame(width: 38, height: 38)
                    .background(Color.midnightDark)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))
            }

            // Notifications with Gold Badge
            Button(action: onOpenNotifications) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 16))
                        .foregroundColor(.slate300)
                        .frame(width: 38, height: 38)
                        .background(Color.midnightDark)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))

                    if unreadCount > 0 {
                        Circle()
                            .fill(Color.gold500)
                            .frame(width: 10, height: 10)
                            .overlay(Circle().stroke(Color.midnightCard, lineWidth: 1.5))
                            .offset(x: 2, y: -2)
                    }
                }
            }

            // Logout
            Button(action: onLogout) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 15))
                    .foregroundColor(.slate400)
                    .frame(width: 38, height: 38)
                    .background(Color.midnightDark)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.midnightCard)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.midnightBorder),
            alignment: .bottom
        )
    }
}
