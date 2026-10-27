import Foundation

public enum ServiceType: String, CaseIterable, Identifiable, Codable {
    case nightSafeDrop = "Night Safe-Drop"
    case hourlyChauffeur = "Hourly Chauffeur"
    case outstation = "Outstation Trip"

    public var id: String { rawValue }

    public var baseFare: Double {
        switch self {
        case .nightSafeDrop: return 249.0
        case .hourlyChauffeur: return 399.0
        case .outstation: return 999.0
        }
    }

    public var subtitle: String {
        switch self {
        case .nightSafeDrop: return "Late-night doorstep transit • From ₹249"
        case .hourlyChauffeur: return "Multi-stop flexible hours • From ₹399"
        case .outstation: return "Intercity verified highway expert • From ₹999"
        }
    }

    public var iconName: String {
        switch self {
        case .nightSafeDrop: return "moon.stars.fill"
        case .hourlyChauffeur: return "clock.fill"
        case .outstation: return "map.fill"
        }
    }
}

public struct TripBooking: Identifiable, Codable, Hashable {
    public var id: String
    public var bookingCode: String
    public var serviceType: ServiceType
    public var pickupAddress: String
    public var destinationAddress: String
    public var vehicleModel: String
    public var vehiclePlate: String
    public var startOtp: String
    public var estimatedFare: Double
    public var assignedDriverName: String
    public var assignedDriverDL: String
    public var isDriverVerifiedByAdmin: Bool
    public var status: String

    public init(
        id: String = UUID().uuidString,
        bookingCode: String = "DT-849102",
        serviceType: ServiceType = .nightSafeDrop,
        pickupAddress: String = "Vidisha Railway Station Road, Vidisha (M.P.)",
        destinationAddress: String = "Collectorate Civil Lines, Vidisha (M.P.)",
        vehicleModel: String = "Toyota Fortuner 4x4",
        vehiclePlate: String = "MP-40-CA-4921",
        startOtp: String = "8492",
        estimatedFare: Double = 540.0,
        assignedDriverName: String = "Rajesh Sharma",
        assignedDriverDL: String = "MP4020190012345",
        isDriverVerifiedByAdmin: Bool = true,
        status: String = "ACCEPTED"
    ) {
        self.id = id
        self.bookingCode = bookingCode
        self.serviceType = serviceType
        self.pickupAddress = pickupAddress
        self.destinationAddress = destinationAddress
        self.vehicleModel = vehicleModel
        self.vehiclePlate = vehiclePlate
        self.startOtp = startOtp
        self.estimatedFare = estimatedFare
        self.assignedDriverName = assignedDriverName
        self.assignedDriverDL = assignedDriverDL
        self.isDriverVerifiedByAdmin = isDriverVerifiedByAdmin
        self.status = status
    }
}

public struct PastRideRecord: Identifiable, Codable, Hashable {
    public var id: String
    public var bookingCode: String
    public var dateString: String
    public var serviceLabel: String
    public var pickup: String
    public var dropoff: String
    public var fare: Double
    public var driverName: String
    public var driverRating: Double
    public var vehicleSummary: String

    public init(
        id: String = UUID().uuidString,
        bookingCode: String,
        dateString: String,
        serviceLabel: String,
        pickup: String,
        dropoff: String,
        fare: Double,
        driverName: String,
        driverRating: Double,
        vehicleSummary: String
    ) {
        self.id = id
        self.bookingCode = bookingCode
        self.dateString = dateString
        self.serviceLabel = serviceLabel
        self.pickup = pickup
        self.dropoff = dropoff
        self.fare = fare
        self.driverName = driverName
        self.driverRating = driverRating
        self.vehicleSummary = vehicleSummary
    }
}
