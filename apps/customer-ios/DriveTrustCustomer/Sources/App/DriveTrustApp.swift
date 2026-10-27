import SwiftUI

@main
struct DriveTrustCustomerApp: App {
    var body: some Scene {
        WindowGroup {
            AppCoordinator()
                .preferredColorScheme(.dark)
        }
    }
}
