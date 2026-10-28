import ActivityKit
import Foundation

// ActivityKit struct for iOS Dynamic Island & Lock Screen Live Activities
public struct TripActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var driverName: String
        public var vehicleDetails: String
        public var driverPhotoURL: String
        public var statusText: String // "Driver is 4 mins away", "Trip in progress"
        public var estimatedArrival: Date
        public var distanceKm: Double
        public var startOTP: String // "8492" (displayed on Dynamic Island when driver arrives)
        
        public init(
            driverName: String,
            vehicleDetails: String,
            driverPhotoURL: String,
            statusText: String,
            estimatedArrival: Date,
            distanceKm: Double,
            startOTP: String
        ) {
            self.driverName = driverName
            self.vehicleDetails = vehicleDetails
            self.driverPhotoURL = driverPhotoURL
            self.statusText = statusText
            self.estimatedArrival = estimatedArrival
            self.distanceKm = distanceKm
            self.startOTP = startOTP
        }
    }

    public var bookingId: String
    public var serviceType: String // "Hourly", "Night Safe-Drop", "Outstation"
    public var pickupAddress: String

    public init(bookingId: String, serviceType: String, pickupAddress: String) {
        self.bookingId = bookingId
        self.serviceType = serviceType
        self.pickupAddress = pickupAddress
    }
}
