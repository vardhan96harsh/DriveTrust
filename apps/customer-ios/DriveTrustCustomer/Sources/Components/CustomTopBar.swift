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
                    .fill(Color.mint50)
                    .frame(width: 42, height: 42)
                    .overlay(
                        Circle().stroke(Color.mint500, lineWidth: 1.5)
                    )
                Text("DT")
                    .font(.system(size: 16, weight: .black))
                    .foregroundColor(.mint500)
            }

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text("DriveTrust")
                        .font(.system(size: 17, weight: .black))
                        .foregroundColor(.customerTextPrimary)
                    
                    Text("LUXURY")
                        .font(.system(size: 8, weight: .black))
                        .foregroundColor(.mint500)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.mint50)
                        .cornerRadius(4)
                        .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.mint500.opacity(0.35), lineWidth: 1))
                }

                Text("Private Chauffeur • \(customerName)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.customerTextSecondary)
            }

            Spacer()

            // Safety Vault Button
            Button(action: onOpenSafety) {
                Image(systemName: "shield.checkered")
                    .font(.system(size: 16))
                    .foregroundColor(.customerTextSecondary)
                    .frame(width: 38, height: 38)
                    .background(Color.midnight950)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))
            }

            // Notifications with Mint Badge
            Button(action: onOpenNotifications) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 16))
                        .foregroundColor(.customerTextSecondary)
                        .frame(width: 38, height: 38)
                        .background(Color.midnight950)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))

                    if unreadCount > 0 {
                        Circle()
                            .fill(Color.mint500)
                            .frame(width: 10, height: 10)
                            .overlay(Circle().stroke(Color.white, lineWidth: 1.5))
                            .offset(x: 2, y: -2)
                    }
                }
            }

            // Logout
            Button(action: onLogout) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 15))
                    .foregroundColor(.customerTextSecondary)
                    .frame(width: 38, height: 38)
                    .background(Color.midnight950)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.midnightBorder, lineWidth: 1))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(.midnightBorder),
            alignment: .bottom
        )
    }
}
