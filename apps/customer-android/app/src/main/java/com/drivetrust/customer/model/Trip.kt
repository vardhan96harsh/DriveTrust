package com.drivetrust.customer.model

/**
 * Mobility service categories offered by DriveTrust
 */
enum class ServiceType(val label: String, val baseRate: Double) {
    NIGHT_SAFE_DROP("Night Safe-Drop", 540.0),
    HOURLY_CHAUFFEUR("Hourly Chauffeur", 349.0),
    OUTSTATION("Outstation Trip", 1799.0)
}

/**
 * End-to-end operational states of a chauffeur trip lifecycle
 */
enum class TripStatus {
    IDLE,
    SEARCHING,
    ACCEPTED,
    DRIVER_ARRIVED,
    HANDOVER_INSPECTION,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    DISPUTED
}

/**
 * Payment instruments supported across Indian metros
 */
enum class PaymentMethod(val label: String) {
    UPI("Instant UPI (GPay / PhonePe / Paytm)"),
    CREDIT_CARD("Credit / Debit Card"),
    CORPORATE_BILLING("Corporate Expense Account"),
    CASH_TO_CHAUFFEUR("Direct Cash to Driver")
}

/**
 * Settlement state of the trip fare
 */
enum class PaymentStatus {
    PENDING,
    AUTHORIZED,
    PAID,
    FAILED,
    REFUNDED
}

/**
 * Vehicle transmission type - critical for chauffeur allocation
 */
enum class TransmissionType(val label: String) {
    AUTOMATIC("Automatic"),
    MANUAL("Manual (Clutch)"),
    LUXURY_EV("Electric / Luxury Dual-Clutch")
}

/**
 * Standardized cancellation reasons for audit & driver compensation
 */
enum class CancellationReason(val label: String) {
    DRIVER_DELAYED("Driver arrived later than promised ETA"),
    PLAN_CHANGED("Customer itinerary or travel plans changed"),
    INCORRECT_LOCATION("Entered incorrect pickup or vehicle location"),
    EMERGENCY("Personal emergency"),
    VEHICLE_UNAVAILABLE("Client vehicle not accessible or mechanical issue"),
    DRIVER_REQUESTED("Chauffeur requested cancellation")
}

/**
 * GPS Geographic coordinates for navigation, route mapping, and live chauffeur tracking
 */
data class GeoCoordinate(
    val latitude: Double,
    val longitude: Double,
    val heading: Float = 0f,
    val addressLabel: String = ""
)

/**
 * 4-Point pre-trip vehicle condition audit record before chauffeur starts driving client car
 */
data class VehicleHandoverRecord(
    val isAuditCompleted: Boolean = true,
    val startingOdometerKm: Int = 24890,
    val fuelLevelPercent: Int = 85,
    val areScratchesDocumented: Boolean = true,
    val inspectionNotes: String = "No pre-existing exterior damage; tires & headlights verified.",
    val signedAtTimestamp: Long = System.currentTimeMillis(),
    
    // Post-Trip Return Handover Audit
    val isReturnHandoverCompleted: Boolean = false,
    val endingOdometerKm: Int? = null,
    val endingFuelPercent: Int? = null,
    val areKeysReturnedToOwner: Boolean = true,
    val isPostTripDamageObserved: Boolean = false,
    val postTripNotes: String = "Vehicle returned in pristine condition with keys handed over."
)

/**
 * Production enterprise model for a DriveTrust customer ride booking
 */
data class TripBooking(
    // 1. Identifiers & Service Mode
    val bookingCode: String = "DT-849102",
    val customerId: String = "cust-8821",
    val customerName: String = "Harshvardhan",
    val customerPhone: String = "+91 98450 12345",
    val serviceType: ServiceType = ServiceType.NIGHT_SAFE_DROP,
    val status: TripStatus = TripStatus.IDLE,

    // 2. Spatial Locations & GPS Coordinates (Required for Google Maps, Routes & Waypoints)
    val pickupAddress: String = "Vidisha Railway Station Road, Vidisha (M.P.)",
    val destinationAddress: String = "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)",
    val pickupCoordinates: GeoCoordinate = GeoCoordinate(23.5262, 77.8211, addressLabel = "Vidisha Railway Station"),
    val destinationCoordinates: GeoCoordinate = GeoCoordinate(23.5350, 77.8115, addressLabel = "Collectorate & District Court, Vidisha"),
    val waypoints: List<GeoCoordinate> = emptyList(),
    val driverCurrentCoordinates: GeoCoordinate = GeoCoordinate(23.5285, 77.8180, heading = 45f, addressLabel = "Chauffeur on Neem Tal Rd, Vidisha"),
    val routeDistanceKm: Double = 3.4,
    val estimatedDurationMinutes: Int = 8,
    val routePolyline: String = "w~m_Ac~_wM...",

    // 3. Customer Vehicle Details (Client's personal vehicle)
    val vehicleModel: String = "Toyota Fortuner 4x4",
    val vehiclePlate: String = "MP-40-CA-4921",
    val transmission: String = "AUTOMATIC",
    val transmissionType: TransmissionType = TransmissionType.AUTOMATIC,

    // 4. Security PIN Handshake & ETA
    val startOtp: String = "8492",
    val reportingTime: String = "Chauffeur En Route (~20-25 mins)",
    val driverEtaMinutes: Int = 20,

    // 5. Assigned Commercial Chauffeur Details
    val assignedDriverId: String = "drv-01",
    val assignedDriverName: String = "Rajesh Sharma",
    val assignedDriverPhone: String = "+91 99801 84920",
    val assignedDriverDL: String = "MP4020190012345",
    val assignedDriverBadgeNumber: String = "MP-COMM-88219",
    val isDriverVerifiedByAdmin: Boolean = true,
    val isPoliceBackgroundVerified: Boolean = true,
    val driverRating: Float = 4.96f,
    val driverTotalTrips: Int = 1420,
    val driverPhotoUrl: String = "https://drivetrust.in/avatars/rajesh_sharma.jpg",

    // 6. Comprehensive Fare Breakdown & Demurrage / Waiting Time
    val estimatedFare: Double = 540.0,
    val baseFare: Double = 299.0,
    val distanceFare: Double = 89.6,
    val nightSurgeFare: Double = 75.0,
    val driverReturnAllowance: Double = 150.0,
    val freeWaitMinutes: Int = 10,
    val elapsedWaitMinutes: Int = 0,
    val waitCharges: Double = 0.0,
    val tollAndTaxes: Double = 26.4,
    val tipAmount: Double = 50.0,
    val finalTotalFare: Double = 590.0,
    val paymentMethod: PaymentMethod = PaymentMethod.UPI,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,

    // 7. Handover Inspection & Safety Telematics
    val handoverRecord: VehicleHandoverRecord = VehicleHandoverRecord(),
    val transitInsurancePolicyRef: String = "DT-TRANSIT-INS-10L-94820",
    val isTransitInsuranceActive: Boolean = true,
    val isEmergencySosTriggered: Boolean = false,
    val emergencyPoliceAckRef: String? = null,
    val isAudioSafetyActive: Boolean = false,
    val liveShareTrackingUrl: String = "https://drivetrust.in/track/DT-849102",
    val driverSpeedKmh: Float = 28.5f,
    val telemetryTopic: String = "telemetry.trip.DT-849102",

    // 8. Post-Trip Customer Feedback
    val ratingGiven: Float? = null,
    val feedbackComment: String? = null,
    val ratingCompliments: List<String> = emptyList(),

    // 9. Cancellation & Dispute Tracking
    val cancellationReason: CancellationReason? = null,
    val cancelledBy: String? = null,
    val cancellationFee: Double = 0.0,
    val disputeTicketId: String? = null,
    val disputeNotes: String? = null,

    // 10. B2B Corporate Invoicing
    val corporateGstin: String? = null,
    val corporateCompanyName: String? = null,
    val taxInvoicePdfUrl: String? = null,

    // 11. Complete Audit Lifecycle Timestamps
    val createdAtTimestamp: Long = System.currentTimeMillis(),
    val scheduledForTimestamp: Long? = null,
    val driverAcceptedAt: Long? = null,
    val driverArrivedAt: Long? = null,
    val tripStartedAt: Long? = null,
    val tripCompletedAt: Long? = null
) {
    /**
     * Whether the trip is actively in-flight
     */
    val isActive: Boolean
        get() = status in listOf(
            TripStatus.ACCEPTED,
            TripStatus.DRIVER_ARRIVED,
            TripStatus.HANDOVER_INSPECTION,
            TripStatus.IN_PROGRESS
        )

    /**
     * Whether the trip has terminated
     */
    val isEnded: Boolean
        get() = status in listOf(
            TripStatus.COMPLETED,
            TripStatus.CANCELLED,
            TripStatus.DISPUTED
        )

    /**
     * Formatted fare strings for UI display
     */
    val formattedEstimatedFare: String
        get() = "₹%.2f".format(estimatedFare)

    val formattedFinalFare: String
        get() = "₹%.2f".format(finalTotalFare)

    val formattedDistance: String
        get() = "%.1f km".format(routeDistanceKm)
}
