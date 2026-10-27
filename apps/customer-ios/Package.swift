// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "DriveTrustCustomer",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "DriveTrustCustomer",
            targets: ["DriveTrustCustomer"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "DriveTrustCustomer",
            dependencies: [],
            path: "DriveTrustCustomer/Sources"
        )
    ]
)
