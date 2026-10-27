import Foundation

public struct CustomerVehicle: Identifiable, Codable, Hashable {
    public var id: String
    public var brand: String
    public var model: String
    public var plate: String
    public var transmission: String // "AUTOMATIC", "MANUAL", "LUXURY"
    public var color: String
    public var year: Int

    public init(id: String = UUID().uuidString, brand: String, model: String, plate: String, transmission: String, color: String, year: Int) {
        self.id = id
        self.brand = brand
        self.model = model
        self.plate = plate
        self.transmission = transmission
        self.color = color
        self.year = year
    }
}

public struct CustomerProfile: Codable, Hashable {
    public var fullName: String
    public var phone: String
    public var email: String
    public var isKycVerified: Bool
    public var walletBalance: Double
    public var emergencyContactName: String
    public var emergencyContactPhone: String

    public init(
        fullName: String = "Harshvardhan",
        phone: String = "+91 98450 12345",
        email: String = "client@drivetrust.in",
        isKycVerified: Bool = true,
        walletBalance: Double = 1240.50,
        emergencyContactName: String = "Family Guardian",
        emergencyContactPhone: String = "+91 99801 11223"
    ) {
        self.fullName = fullName
        self.phone = phone
        self.email = email
        self.isKycVerified = isKycVerified
        self.walletBalance = walletBalance
        self.emergencyContactName = emergencyContactName
        self.emergencyContactPhone = emergencyContactPhone
    }
}
