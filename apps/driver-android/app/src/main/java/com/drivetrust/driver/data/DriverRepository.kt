package com.drivetrust.driver.data

import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.model.RideOffer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class DriverRepository(
    private val preferences: DriverPreferences,
    val apiClient: DriverApiClient = DriverApiClient()
) {

    private val _isDutyOnline = MutableStateFlow(preferences.isDutyOnline)
    val isDutyOnline: StateFlow<Boolean> = _isDutyOnline.asStateFlow()

    private val _currentOffer = MutableStateFlow<RideOffer?>(null)
    val currentOffer: StateFlow<RideOffer?> = _currentOffer.asStateFlow()

    private val _walletBalance = MutableStateFlow(3420)
    val walletBalance: StateFlow<Int> = _walletBalance.asStateFlow()

    fun toggleDuty(online: Boolean): Result<Boolean> {
        if (online && !preferences.isAdminApproved) {
            return Result.failure(IllegalStateException("KYC verification pending with Admin. Cannot go online."))
        }
        preferences.isDutyOnline = online
        _isDutyOnline.value = online
        return Result.success(online)
    }

    suspend fun pollRemoteOffer(): RideOffer? {
        val remoteOffer = apiClient.fetchActiveOffer().getOrNull()
        if (remoteOffer != null) {
            _currentOffer.value = remoteOffer
            return remoteOffer
        }
        return null
    }

    suspend fun acceptOfferRemote(bookingId: String): Boolean {
        val success = apiClient.acceptOffer(bookingId).getOrDefault(false)
        return success
    }

    suspend fun driverArrivedRemote(bookingId: String): Boolean {
        return apiClient.notifyDriverArrived(bookingId).getOrDefault(false)
    }

    suspend fun startTripRemote(bookingId: String, otp: String): Boolean {
        return apiClient.startTripWithOtp(bookingId = bookingId, otp = otp).getOrDefault(false)
    }

    suspend fun completeTripRemote(bookingId: String): Boolean {
        val success = apiClient.completeTrip(bookingId).getOrDefault(false)
        if (success) {
            _walletBalance.value += 432 // 80% driver commission
        }
        return success
    }

    suspend fun updateLocation(lat: Double, lng: Double): Boolean {
        return apiClient.sendLocation(lat = lat, lng = lng).getOrDefault(false)
    }

    fun submitOnboarding(name: String, phone: String, dl: String, badge: String) {
        preferences.driverName = name
        preferences.driverPhone = phone
        preferences.driverDL = dl
        preferences.badgeNumber = badge
        preferences.isAdminApproved = false // Awaiting Admin verification in KYC Vault
        preferences.isDutyOnline = false
        _isDutyOnline.value = false
    }

    fun withdrawBalanceToUpi(): Result<Int> {
        val amount = _walletBalance.value
        if (amount <= 0) {
            return Result.failure(IllegalStateException("Zero withdrawable balance."))
        }
        _walletBalance.value = 0
        return Result.success(amount)
    }

    fun postSimulatedOffer(): RideOffer {
        val offer = RideOffer(
            offerId = "OFFER-" + (1000..9999).random(),
            bookingCode = "DT-" + (100000..999999).random(),
            customerName = "Vikram Aditya",
            customerRating = "4.95 ★",
            pickupAddress = "Indiranagar 100ft Rd, Bangalore",
            destinationAddress = "Koramangala 4th Block, Bangalore",
            distanceKm = "6.4 km",
            estMinutes = "22 mins",
            fare = "₹540",
            carModel = "Toyota Fortuner (Automatic)",
            otp = "8492"
        )
        _currentOffer.value = offer
        return offer
    }

    fun clearOffer() {
        _currentOffer.value = null
    }
}
