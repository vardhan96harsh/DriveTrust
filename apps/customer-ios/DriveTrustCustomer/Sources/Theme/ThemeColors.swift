import SwiftUI

extension Color {
    // Luxury Obsidian & Champagne Gold Palette
    static let midnightDark = Color(red: 0.043, green: 0.059, blue: 0.098)     // #0B0F19
    static let midnightCard = Color(red: 0.067, green: 0.094, blue: 0.153)     // #111827
    static let midnightBorder = Color(red: 0.122, green: 0.161, blue: 0.216)   // #1F2937
    static let midnight950 = Color(red: 0.016, green: 0.024, blue: 0.047)      // #04060C

    static let gold500 = Color(red: 0.918, green: 0.702, blue: 0.031)          // #EAB308
    static let gold400 = Color(red: 0.984, green: 0.800, blue: 0.180)          // #FACC15
    static let gold600 = Color(red: 0.792, green: 0.584, blue: 0.016)          // #CA8A04

    static let emerald400 = Color(red: 0.204, green: 0.827, blue: 0.600)       // #34D399
    static let emerald500 = Color(red: 0.063, green: 0.725, blue: 0.506)       // #10B981
    static let emerald600 = Color(red: 0.020, green: 0.596, blue: 0.416)       // #059669

    static let slate300 = Color(red: 0.796, green: 0.835, blue: 0.882)         // #CBD5E1
    static let slate400 = Color(red: 0.580, green: 0.639, blue: 0.722)         // #94A3B8
    static let slate500 = Color(red: 0.392, green: 0.455, blue: 0.545)         // #64748B
    static let slate600 = Color(red: 0.278, green: 0.333, blue: 0.412)         // #475569
    static let slate800 = Color(red: 0.118, green: 0.161, blue: 0.231)         // #1E293B
    static let slate900 = Color(red: 0.059, green: 0.090, blue: 0.165)         // #0F172A
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
    }
}

extension View {
    func obsidianCard(borderColor: Color = .midnightBorder, borderWidth: CGFloat = 1.0, cornerRadius: CGFloat = 16.0) -> some View {
        self.modifier(ObsidianCardModifier(borderColor: borderColor, borderWidth: borderWidth, cornerRadius: cornerRadius))
    }
}
