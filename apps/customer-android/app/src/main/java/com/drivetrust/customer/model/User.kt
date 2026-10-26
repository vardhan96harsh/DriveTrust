package com.drivetrust.customer.model

data class CustomerVehicle(
    val id: String,
    val brand: String,
    val model: String,
    val plate: String,
    val transmission: String, // "AUTOMATIC", "MANUAL", "LUXURY"
    val color: String = "Pearl White",
    val year: Int = 2024
)

data class CustomerProfile(
    val id: String = "cust-01",
    val fullName: String = "Harshvardhan",
    val phone: String = "+91 98450 12345",
    val email: String = "harsh@example.com",
    val city: String = "Vidisha",
    val defaultAddress: String = "Station Road, Civil Lines, Vidisha (M.P.)",
    val emergencyContact: String = "Family Contact (Vidisha)",
    val emergencyPhone: String = "+91 94251 09876",
    val isBlocked: Boolean = false,
    val blockReason: String? = null,
    val verificationStatus: String = "VERIFIED", // "VERIFIED", "PENDING", "UNVERIFIED"
    val aadhaarVerified: Boolean = true,
    val vehicles: List<CustomerVehicle> = listOf(
        CustomerVehicle(
            id = "veh-01",
            brand = "Toyota",
            model = "Fortuner 4x4",
            plate = "MP-40-CA-4921",
            transmission = "AUTOMATIC",
            color = "Pearl White",
            year = 2023
        ),
        CustomerVehicle(
            id = "veh-02",
            brand = "BMW",
            model = "330Li M Sport",
            plate = "MP-04-BK-8822",
            transmission = "LUXURY",
            color = "Mineral Grey",
            year = 2024
        )
    )
)
