package com.drivetrust.driver.data

import android.content.Context
import android.content.SharedPreferences

class DriverPreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("drivetrust_driver_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_AUTH_TOKEN = "driver_auth_token"
        private const val KEY_DRIVER_ID = "driver_id"
        private const val KEY_DRIVER_NAME = "driver_name"
        private const val KEY_DRIVER_PHONE = "driver_phone"
        private const val KEY_DRIVER_DL = "driver_dl_number"
        private const val KEY_BADGE_NUMBER = "driver_badge_number"
        private const val KEY_IS_APPROVED = "is_admin_approved"
        private const val KEY_IS_ONLINE = "is_duty_online"
        private const val KEY_BANK_ACCOUNT = "bank_account_masked"
        private const val KEY_UPI_ID = "driver_upi_id"
        private const val KEY_WALKTHROUGH = "has_completed_walkthrough"
    }

    var hasCompletedWalkthrough: Boolean
        get() = prefs.getBoolean(KEY_WALKTHROUGH, false)
        set(value) = prefs.edit().putBoolean(KEY_WALKTHROUGH, value).apply()

    var authToken: String?
        get() = prefs.getString(KEY_AUTH_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_AUTH_TOKEN, value).apply()

    var driverId: String
        get() = prefs.getString(KEY_DRIVER_ID, "drv-01") ?: "drv-01"
        set(value) = prefs.edit().putString(KEY_DRIVER_ID, value).apply()

    var driverName: String
        get() = prefs.getString(KEY_DRIVER_NAME, "Rajesh Kumar") ?: "Rajesh Kumar"
        set(value) = prefs.edit().putString(KEY_DRIVER_NAME, value).apply()

    var driverPhone: String
        get() = prefs.getString(KEY_DRIVER_PHONE, "+91 99801 84920") ?: "+91 99801 84920"
        set(value) = prefs.edit().putString(KEY_DRIVER_PHONE, value).apply()

    var driverDL: String
        get() = prefs.getString(KEY_DRIVER_DL, "KA-01-2018-0094821") ?: "KA-01-2018-0094821"
        set(value) = prefs.edit().putString(KEY_DRIVER_DL, value).apply()

    var badgeNumber: String
        get() = prefs.getString(KEY_BADGE_NUMBER, "KA-COMM-88219") ?: "KA-COMM-88219"
        set(value) = prefs.edit().putString(KEY_BADGE_NUMBER, value).apply()

    var isAdminApproved: Boolean
        get() = prefs.getBoolean(KEY_IS_APPROVED, false)
        set(value) = prefs.edit().putBoolean(KEY_IS_APPROVED, value).apply()

    var isDutyOnline: Boolean
        get() = prefs.getBoolean(KEY_IS_ONLINE, false)
        set(value) = prefs.edit().putBoolean(KEY_IS_ONLINE, value).apply()

    var bankAccountMasked: String
        get() = prefs.getString(KEY_BANK_ACCOUNT, "HDFC Bank •••• 9812") ?: "HDFC Bank •••• 9812"
        set(value) = prefs.edit().putString(KEY_BANK_ACCOUNT, value).apply()

    var driverUpiId: String
        get() = prefs.getString(KEY_UPI_ID, "rajeshkumar@okaxis") ?: "rajeshkumar@okaxis"
        set(value) = prefs.edit().putString(KEY_UPI_ID, value).apply()

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
