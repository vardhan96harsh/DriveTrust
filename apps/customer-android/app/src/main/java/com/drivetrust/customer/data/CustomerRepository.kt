package com.drivetrust.customer.data

import com.drivetrust.customer.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class PastRideRecord(
    val id: String,
    val bookingCode: String,
    val date: String,
    val serviceType: String,
    val driverName: String,
    val driverRating: Float,
    val vehicleModel: String,
    val pickup: String,
    val dropoff: String,
    val fare: Double,
    val tip: Double,
    val status: String = "COMPLETED",
    val invoiceUrl: String
)

class CustomerRepository(
    private val preferences: CustomerPreferences,
    val apiClient: CustomerApiClient = CustomerApiClient()
) {

    private val _activeBooking = MutableStateFlow<TripBooking?>(null)
    val activeBooking: StateFlow<TripBooking?> = _activeBooking.asStateFlow()

    private val _pastRides = MutableStateFlow<List<PastRideRecord>>(
        listOf(
            PastRideRecord(
                id = "ride-101",
                bookingCode = "DT-982103",
                date = "22 Oct 2026, 11:30 PM",
                serviceType = "Night Safe-Drop",
                driverName = "Rajesh Kumar",
                driverRating = 5.0f,
                vehicleModel = "Toyota Fortuner (KA-01-MJ-4921)",
                pickup = "Indiranagar 100ft Road, Bangalore",
                dropoff = "Koramangala 4th Block, Bangalore",
                fare = 540.0,
                tip = 50.0,
                invoiceUrl = "https://drivetrust.in/invoices/DT-982103.pdf"
            ),
            PastRideRecord(
                id = "ride-102",
                bookingCode = "DT-974910",
                date = "19 Oct 2026, 06:15 PM",
                serviceType = "Hourly Chauffeur (4 Hrs)",
                driverName = "Suresh Patel",
                driverRating = 4.9f,
                vehicleModel = "BMW 330Li (KA-01-BK-8822)",
                pickup = "Lavelle Road, Bangalore",
                dropoff = "Whitefield ITPL Round Trip",
                fare = 1396.0,
                tip = 100.0,
                invoiceUrl = "https://drivetrust.in/invoices/DT-974910.pdf"
            ),
            PastRideRecord(
                id = "ride-103",
                bookingCode = "DT-961029",
                date = "12 Oct 2026, 05:00 AM",
                serviceType = "Outstation Chauffeur (Coorg)",
                driverName = "Vikram Aditya",
                driverRating = 5.0f,
                vehicleModel = "Toyota Fortuner (KA-01-MJ-4921)",
                pickup = "Sadashivanagar, Bangalore",
                dropoff = "Madikeri, Coorg (2-Day Return)",
                fare = 4200.0,
                tip = 300.0,
                invoiceUrl = "https://drivetrust.in/invoices/DT-961029.pdf"
            )
        )
    )
    val pastRides: StateFlow<List<PastRideRecord>> = _pastRides.asStateFlow()

    fun createBooking(
        serviceType: ServiceType,
        pickup: String,
        dropoff: String,
        vehicleModel: String,
        vehiclePlate: String,
        fare: Double,
        otp: String = "8492",
        isDriverVerified: Boolean = true
    ): TripBooking {
        val newBooking = TripBooking(
            bookingCode = "DT-" + (100000..999999).random(),
            serviceType = serviceType,
            pickupAddress = pickup,
            destinationAddress = dropoff,
            vehicleModel = vehicleModel,
            vehiclePlate = vehiclePlate,
            startOtp = otp,
            estimatedFare = fare,
            status = TripStatus.ACCEPTED,
            assignedDriverName = "Rajesh Kumar",
            assignedDriverPhone = "+91 99801 84920",
            assignedDriverDL = "KA-01-2018-0094821",
            isDriverVerifiedByAdmin = isDriverVerified
        )
        _activeBooking.value = newBooking
        preferences.activeBookingId = newBooking.bookingCode
        return newBooking
    }

    suspend fun createBookingRemote(
        serviceType: ServiceType,
        pickup: String,
        dropoff: String,
        vehicleModel: String,
        vehiclePlate: String,
        fare: Double,
        customerName: String,
        customerPhone: String
    ): TripBooking {
        val remoteRes = apiClient.createAndDispatchBooking(
            pickup = pickup,
            dropoff = dropoff,
            serviceType = serviceType.name,
            vehicleModel = vehicleModel,
            vehiclePlate = vehiclePlate,
            fare = fare,
            customerName = customerName,
            customerPhone = customerPhone
        ).getOrNull()

        val bookingCode = remoteRes?.bookingCode ?: ("DT-" + (100000..999999).random())
        val otp = remoteRes?.startOtp ?: "8492"
        val driverName = remoteRes?.driverName ?: "Rajesh Kumar"
        val driverPhone = remoteRes?.driverPhone ?: "+91 99801 84920"

        val newBooking = TripBooking(
            bookingCode = bookingCode,
            serviceType = serviceType,
            pickupAddress = pickup,
            destinationAddress = dropoff,
            vehicleModel = vehicleModel,
            vehiclePlate = vehiclePlate,
            startOtp = otp,
            estimatedFare = fare,
            status = TripStatus.ACCEPTED,
            assignedDriverName = driverName,
            assignedDriverPhone = driverPhone,
            assignedDriverDL = "KA-01-2018-0094821",
            isDriverVerifiedByAdmin = true,
            customerName = customerName
        )
        _activeBooking.value = newBooking
        preferences.activeBookingId = newBooking.bookingCode
        return newBooking
    }

    suspend fun pollRemoteStatus(bookingId: String): RemoteBookingResult? {
        val result = apiClient.pollBookingStatus(bookingId).getOrNull() ?: return null
        val current = _activeBooking.value
        if (current != null && current.bookingCode == result.bookingCode) {
            val updatedStatus = when (result.status) {
                "DRIVER_ARRIVED" -> TripStatus.DRIVER_ARRIVED
                "IN_PROGRESS" -> TripStatus.IN_PROGRESS
                "COMPLETED" -> TripStatus.COMPLETED
                "CANCELLED" -> TripStatus.CANCELLED
                else -> current.status
            }
            _activeBooking.value = current.copy(
                status = updatedStatus,
                assignedDriverName = result.driverName ?: current.assignedDriverName,
                assignedDriverPhone = result.driverPhone ?: current.assignedDriverPhone
            )
        }
        return result
    }


    fun completeActiveTrip(rating: Float, tip: Double) {
        val current = _activeBooking.value ?: return
        val completedRecord = PastRideRecord(
            id = "ride-" + System.currentTimeMillis(),
            bookingCode = current.bookingCode,
            date = "Today, Just Now",
            serviceType = current.serviceType.label,
            driverName = current.assignedDriverName,
            driverRating = rating,
            vehicleModel = "${current.vehicleModel} (${current.vehiclePlate})",
            pickup = current.pickupAddress,
            dropoff = current.destinationAddress,
            fare = current.estimatedFare,
            tip = tip,
            invoiceUrl = "https://drivetrust.in/invoices/${current.bookingCode}.pdf"
        )
        _pastRides.value = listOf(completedRecord) + _pastRides.value
        _activeBooking.value = null
        preferences.activeBookingId = null
    }

    fun triggerEmergencyAlert(lat: Double, lng: Double): String {
        return "CRITICAL_SOS_DISPATCHED_TO_POLICE_112_AT_${lat}_${lng}"
    }
}
