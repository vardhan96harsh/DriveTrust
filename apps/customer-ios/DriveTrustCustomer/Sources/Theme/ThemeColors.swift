import SwiftUI

extension Color {
    // Crisp Executive Light Palette for iOS Customer App
    static let midnightDark = Color(red: 0.973, green: 0.980, blue: 0.988)     // #F8FAFC (Clean light background)
    static let midnightCard = Color(red: 1.0, green: 1.0, blue: 1.0)           // #FFFFFF (Pure white card)
    static let midnightBorder = Color(red: 0.886, green: 0.910, blue: 0.941)   // #E2E8F0 (Subtle border)
    static let midnight950 = Color(red: 0.945, green: 0.961, blue: 0.976)      // #F1F5F9 (Soft light inner recess)

    // Mint & Emerald Accents (matching Driver App & Logo)
    static let mint500 = Color(red: 0.000, green: 0.718, blue: 0.475)          // #00B779
    static let mint600 = Color(red: 0.000, green: 0.588, blue: 0.388)          // #009663
    static let mint50 = Color(red: 0.925, green: 0.992, blue: 0.961)           // #ECFDF5

    static let gold500 = Color(red: 0.851, green: 0.467, blue: 0.024)          // #D97706
    static let gold400 = Color(red: 0.961, green: 0.620, blue: 0.043)          // #F59E0B
    static let gold600 = Color(red: 0.706, green: 0.325, blue: 0.035)          // #B45309

    static let emerald400 = Color(red: 0.000, green: 0.718, blue: 0.475)       // #00B779
    static let emerald500 = Color(red: 0.063, green: 0.725, blue: 0.506)       // #10B981
    static let emerald600 = Color(red: 0.020, green: 0.596, blue: 0.416)       // #059669

    static let slate100 = Color(red: 0.949, green: 0.961, blue: 0.976)         // #F1F5F9
    static let slate200 = Color(red: 0.886, green: 0.910, blue: 0.941)         // #E2E8F0
    static let slate300 = Color(red: 0.796, green: 0.835, blue: 0.882)         // #CBD5E1
    static let slate400 = Color(red: 0.392, green: 0.455, blue: 0.545)         // #64748B (High contrast secondary)
    static let slate500 = Color(red: 0.392, green: 0.455, blue: 0.545)         // #64748B
    static let slate600 = Color(red: 0.278, green: 0.333, blue: 0.412)         // #475569
    static let slate800 = Color(red: 0.118, green: 0.161, blue: 0.231)         // #1E293B
    static let slate900 = Color(red: 0.059, green: 0.090, blue: 0.165)         // #0F172A

    static let customerTextPrimary = Color(red: 0.059, green: 0.090, blue: 0.165) // #0F172A
    static let customerTextSecondary = Color(red: 0.392, green: 0.455, blue: 0.545) // #64748B
}

struct ObsidianCardModifier: ViewModifier {
    var borderColor: Color = .midnightBorder
    var borderWidth: CGFloat = 1.0
    var cornerRadius: CGFloat = 16.0

    func body(content: Content) -> some View {
        content
            .background(Color.midnightCard)
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
            .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

extension View {
    func obsidianCard(borderColor: Color = .midnightBorder, borderWidth: CGFloat = 1.0, cornerRadius: CGFloat = 16.0) -> some View {
        self.modifier(ObsidianCardModifier(borderColor: borderColor, borderWidth: borderWidth, cornerRadius: cornerRadius))
    }
}
