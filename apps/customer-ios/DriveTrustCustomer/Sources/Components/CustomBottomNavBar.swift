import SwiftUI

enum HomeTab: String, CaseIterable, Identifiable {
    case book = "Chauffeur"
    case garage = "Garage"
    case wallet = "Wallet"
    case history = "History"
    case profile = "Profile"

    var id: String { rawValue }

    var iconName: String {
        switch self {
        case .book: return "car.fill"
        case .garage: return "car.2.fill"
        case .wallet: return "creditcard.fill"
        case .history: return "doc.text.fill"
        case .profile: return "person.fill"
        }
    }
}

struct CustomBottomNavBar: View {
    @Binding var activeTab: HomeTab

    var body: some View {
        HStack {
            ForEach(HomeTab.allCases) { tab in
                let isSelected = activeTab == tab
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        activeTab = tab
                    }
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: tab.iconName)
                            .font(.system(size: 15, weight: isSelected ? .bold : .medium))
                            .foregroundColor(isSelected ? .gold500 : .slate400)

                        if isSelected {
                            Text(tab.rawValue)
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    .padding(.horizontal, isSelected ? 12 : 8)
                    .padding(.vertical, 8)
                    .background(isSelected ? Color.midnight950 : Color.clear)
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(isSelected ? Color.gold500.opacity(0.4) : Color.clear, lineWidth: 1)
                    )
                }
                if tab != HomeTab.allCases.last {
                    Spacer()
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color.midnightCard)
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.midnightBorder, lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.4), radius: 14, x: 0, y: 6)
        .padding(.horizontal, 16)
        .padding(.bottom, 6)
    }
}
