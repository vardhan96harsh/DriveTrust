package com.drivetrust.customer.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.drivetrust.customer.data.CustomerPreferences
import com.drivetrust.customer.data.CustomerRepository
import com.drivetrust.customer.model.*
import com.drivetrust.customer.screens.*
import com.drivetrust.customer.theme.DriveTrustCustomerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val preferences = CustomerPreferences(this)
        val repository = CustomerRepository(preferences)

        setContent {
            DriveTrustCustomerTheme {
                CustomerAppNavigation(
                    repository = repository,
                    onEmergencyDial = {
                        val intent = Intent(Intent.ACTION_DIAL).apply {
                            data = Uri.parse("tel:112")
                        }
                        startActivity(intent)
                    }
                )
            }
        }
    }
}

enum class CustomerNavState {
    LOGIN,
    REGISTER,
    BOOKING,
    HANDOVER_AUDIT,
    TRACKING,
    COMPLETED,
    SAFETY_CENTER,
    RIDE_HISTORY
}

@Composable
fun CustomerAppNavigation(
    repository: CustomerRepository,
    onEmergencyDial: () -> Unit
) {
    var navState by remember { mutableStateOf(CustomerNavState.LOGIN) }
    var customerName by remember { mutableStateOf("Harshvardhan") }
    var customerPhone by remember { mutableStateOf("+91 98450 12345") }
    var carModel by remember { mutableStateOf("Toyota Fortuner 4x4") }
    var carPlate by remember { mutableStateOf("MP-40-CA-4921") }

    val pastRides by repository.pastRides.collectAsState()

    var currentBooking by remember {
        mutableStateOf(
            TripBooking(
                bookingCode = "DT-849102",
                serviceType = ServiceType.NIGHT_SAFE_DROP,
                pickupAddress = "Vidisha Railway Station Road, Vidisha (M.P.)",
                destinationAddress = "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)",
                vehicleModel = "Toyota Fortuner 4x4",
                vehiclePlate = "MP-40-CA-4921",
                startOtp = "8492",
                estimatedFare = 540.0,
                assignedDriverName = "Rajesh Sharma",
                assignedDriverDL = "MP4020190012345",
                isDriverVerifiedByAdmin = true
            )
        )
    }

    when (navState) {
        CustomerNavState.LOGIN -> {
            CustomerLoginScreen(
                onLoginSuccess = { phone ->
                    customerPhone = phone
                    navState = CustomerNavState.BOOKING
                },
                onGoToRegister = {
                    navState = CustomerNavState.REGISTER
                }
            )
        }
        CustomerNavState.REGISTER -> {
            CustomerRegisterScreen(
                onRegisterSuccess = { name, phone, car, plate ->
                    customerName = name
                    customerPhone = phone
                    carModel = car
                    carPlate = plate
                    navState = CustomerNavState.BOOKING
                },
                onBackToLogin = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
        CustomerNavState.BOOKING -> {
            CustomerBookingScreen(
                customerName = customerName,
                carModel = carModel,
                carPlate = carPlate,
                onBookChauffeur = { service, pickup, dropoff, fare ->
                    currentBooking = repository.createBooking(
                        serviceType = service,
                        pickup = pickup,
                        dropoff = dropoff,
                        vehicleModel = carModel,
                        vehiclePlate = carPlate,
                        fare = fare
                    ).copy(customerName = customerName)
                    navState = CustomerNavState.TRACKING
                },
                onOpenSafetyCenter = {
                    navState = CustomerNavState.SAFETY_CENTER
                },
                onOpenHistory = {
                    navState = CustomerNavState.RIDE_HISTORY
                },
                onLogoutClick = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
        CustomerNavState.SAFETY_CENTER -> {
            CustomerSafetyCenterScreen(
                onBack = {
                    navState = CustomerNavState.BOOKING
                },
                onCall112 = onEmergencyDial
            )
        }
        CustomerNavState.RIDE_HISTORY -> {
            CustomerRideHistoryScreen(
                pastRides = pastRides,
                onBack = {
                    navState = CustomerNavState.BOOKING
                },
                onDownloadInvoice = { ride ->
                    // Opens invoice download link
                }
            )
        }
        CustomerNavState.HANDOVER_AUDIT -> {
            CustomerHandoverAuditScreen(
                carModel = currentBooking.vehicleModel,
                carPlate = currentBooking.vehiclePlate,
                driverName = currentBooking.assignedDriverName,
                customerName = customerName,
                onConfirmHandover = {
                    navState = CustomerNavState.TRACKING
                },
                onBack = {
                    navState = CustomerNavState.TRACKING
                }
            )
        }
        CustomerNavState.TRACKING -> {
            CustomerTrackingScreen(
                booking = currentBooking,
                onOpenInspection = {
                    navState = CustomerNavState.HANDOVER_AUDIT
                },
                onCompleteTrip = {
                    navState = CustomerNavState.COMPLETED
                },
                onLogoutClick = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
        CustomerNavState.COMPLETED -> {
            CustomerCompletedRatingScreen(
                booking = currentBooking,
                onBookAnotherRide = {
                    repository.completeActiveTrip(5.0f, 50.0)
                    navState = CustomerNavState.BOOKING
                },
                onLogoutClick = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
    }
}
