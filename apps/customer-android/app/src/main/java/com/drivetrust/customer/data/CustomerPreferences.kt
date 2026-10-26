package com.drivetrust.customer.data

import android.content.Context
import android.content.SharedPreferences

class CustomerPreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("drivetrust_customer_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_AUTH_TOKEN = "auth_token"
        private const val KEY_CUSTOMER_ID = "customer_id"
        private const val KEY_CUSTOMER_NAME = "customer_name"
        private const val KEY_CUSTOMER_PHONE = "customer_phone"
        private const val KEY_EMERGENCY_CONTACT_NAME = "emergency_contact_name"
        private const val KEY_EMERGENCY_CONTACT_PHONE = "emergency_contact_phone"
        private const val KEY_AUTO_SHARE_NIGHT = "auto_share_night_trips"
        private const val KEY_SELECTED_VEHICLE = "selected_vehicle"
        private const val KEY_ACTIVE_BOOKING_ID = "active_booking_id"
    }

    var authToken: String?
        get() = prefs.getString(KEY_AUTH_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_AUTH_TOKEN, value).apply()

    var customerId: String
        get() = prefs.getString(KEY_CUSTOMER_ID, "cust-8821") ?: "cust-8821"
        set(value) = prefs.edit().putString(KEY_CUSTOMER_ID, value).apply()

    var customerName: String
        get() = prefs.getString(KEY_CUSTOMER_NAME, "Harshvardhan") ?: "Harshvardhan"
        set(value) = prefs.edit().putString(KEY_CUSTOMER_NAME, value).apply()

    var customerPhone: String
        get() = prefs.getString(KEY_CUSTOMER_PHONE, "+91 98450 12345") ?: "+91 98450 12345"
        set(value) = prefs.edit().putString(KEY_CUSTOMER_PHONE, value).apply()

    var emergencyContactName: String
        get() = prefs.getString(KEY_EMERGENCY_CONTACT_NAME, "Rohan Sharma") ?: "Rohan Sharma"
        set(value) = prefs.edit().putString(KEY_EMERGENCY_CONTACT_NAME, value).apply()

    var emergencyContactPhone: String
        get() = prefs.getString(KEY_EMERGENCY_CONTACT_PHONE, "+91 98111 22334") ?: "+91 98111 22334"
        set(value) = prefs.edit().putString(KEY_EMERGENCY_CONTACT_PHONE, value).apply()

    var autoShareNightTrips: Boolean
        get() = prefs.getBoolean(KEY_AUTO_SHARE_NIGHT, true)
        set(value) = prefs.edit().putBoolean(KEY_AUTO_SHARE_NIGHT, value).apply()

    var selectedVehicle: String
        get() = prefs.getString(KEY_SELECTED_VEHICLE, "Toyota Fortuner 4x4 (KA-01-MJ-4921)") ?: "Toyota Fortuner 4x4 (KA-01-MJ-4921)"
        set(value) = prefs.edit().putString(KEY_SELECTED_VEHICLE, value).apply()

    var activeBookingId: String?
        get() = prefs.getString(KEY_ACTIVE_BOOKING_ID, null)
        set(value) = prefs.edit().putString(KEY_ACTIVE_BOOKING_ID, value).apply()

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
