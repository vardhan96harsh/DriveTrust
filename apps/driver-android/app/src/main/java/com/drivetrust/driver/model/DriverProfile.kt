package com.drivetrust.driver.model

enum class KycStatus(val label: String) {
    APPROVED("Approved by MoRTH"),
    UNDER_REVIEW("Under Review by Admin"),
    REJECTED("Rejected")
}

data class DriverProfile(
    val id: String = "drv-01",
    val fullName: String = "Rajesh Sharma",
    val phone: String = "+91 99801 84920",
    val city: String = "Vidisha",
    val licenseNumber: String = "MP4020190012345",
    val licenseExpiry: String = "2038-04-12",
    val rto: String = "MP-40 (Vidisha, Madhya Pradesh)",
    val experienceYears: Int = 8,
    val transmissions: List<String> = listOf("AUTOMATIC", "MANUAL", "LUXURY"),
    val aadhaarNumber: String = "7821-9920-1123",
    val upiId: String = "rajesh.sharma@okhdfcbank",
    val kycStatus: KycStatus = KycStatus.APPROVED,
    val rating: Float = 4.96f,
    val totalTrips: Int = 1420,
    val walletBalance: Double = 1850.0,
    val isOnline: Boolean = true
)
