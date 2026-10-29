package com.drivetrust.customer.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.data.CustomerPreferences
import com.drivetrust.customer.data.CustomerRepository
import com.drivetrust.customer.model.*
import com.drivetrust.customer.screens.*
import com.drivetrust.customer.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val preferences = CustomerPreferences(this)
        val repository = CustomerRepository(preferences)

        setContent {
            com.drivetrust.customer.theme.DriveTrustCustomerTheme {
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
    HOME,
    SEARCHING_CHAUFFEUR,
    HANDOVER_AUDIT,
    TRACKING,
    COMPLETED,
    SAFETY_CENTER,
    NOTIFICATIONS,
    OFFERS,
    FAVORITE_CHAUFFEURS,
    SUPPORT_HELP,
    REFERRAL,
    CORPORATE_BILLING,
    SETTINGS
}

enum class HomeTab {
    BOOK, GARAGE, WALLET, HISTORY, PROFILE
}

@Composable
fun CustomerAppNavigation(
    repository: CustomerRepository,
    onEmergencyDial: () -> Unit
) {
    var navState by remember { mutableStateOf(CustomerNavState.LOGIN) }
    var customerName by remember { mutableStateOf("Harshvardhan") }
    var customerPhone by remember { mutableStateOf("+91 98450 12345") }
    var preferredDriverName by remember { mutableStateOf<String?>(null) }

    var vehicles by remember {
        mutableStateOf(
            listOf(
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
    }
    var selectedVehicleId by remember { mutableStateOf("veh-01") }

    val selectedVehicle = vehicles.firstOrNull { it.id == selectedVehicleId } ?: vehicles.firstOrNull()
    val carModel = selectedVehicle?.let { "${it.brand} ${it.model}" } ?: "No Vehicle"
    val carPlate = selectedVehicle?.plate ?: "—"

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
                    navState = CustomerNavState.HOME
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
                    val firstVehicle = CustomerVehicle(
                        id = "veh-reg-01",
                        brand = car.split(" ").firstOrNull() ?: car,
                        model = car.split(" ").drop(1).joinToString(" ").ifEmpty { car },
                        plate = plate,
                        transmission = "AUTOMATIC"
                    )
                    vehicles = listOf(firstVehicle)
                    selectedVehicleId = firstVehicle.id
                    navState = CustomerNavState.HOME
                },
                onBackToLogin = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
        CustomerNavState.HOME -> {
            CustomerHomeWithBottomNav(
                customerName = customerName,
                customerPhone = customerPhone,
                vehicles = vehicles,
                selectedVehicleId = selectedVehicleId,
                carModel = carModel,
                carPlate = carPlate,
                preferredDriverName = preferredDriverName,
                pastRides = pastRides,
                onBookChauffeur = { service, pickup, dropoff, fare ->
                    currentBooking = repository.createBooking(
                        serviceType = service,
                        pickup = pickup,
                        dropoff = dropoff,
                        vehicleModel = carModel,
                        vehiclePlate = carPlate,
                        fare = fare
                    ).copy(
                        customerName = customerName,
                        assignedDriverName = preferredDriverName ?: "Rajesh Sharma"
                    )
                    navState = CustomerNavState.SEARCHING_CHAUFFEUR
                },
                onAddVehicle = { newVehicle ->
                    vehicles = vehicles + newVehicle
                    if (vehicles.size == 1) selectedVehicleId = newVehicle.id
                },
                onDeleteVehicle = { vehicleId ->
                    vehicles = vehicles.filter { it.id != vehicleId }
                    if (selectedVehicleId == vehicleId) {
                        selectedVehicleId = vehicles.firstOrNull()?.id ?: ""
                    }
                },
                onSelectVehicle = { vehicle ->
                    selectedVehicleId = vehicle.id
                },
                onOpenSafetyCenter = {
                    navState = CustomerNavState.SAFETY_CENTER
                },
                onOpenNotifications = {
                    navState = CustomerNavState.NOTIFICATIONS
                },
                onOpenOffers = {
                    navState = CustomerNavState.OFFERS
                },
                onOpenFavorites = {
                    navState = CustomerNavState.FAVORITE_CHAUFFEURS
                },
                onOpenSupport = {
                    navState = CustomerNavState.SUPPORT_HELP
                },
                onOpenReferral = {
                    navState = CustomerNavState.REFERRAL
                },
                onOpenCorporate = {
                    navState = CustomerNavState.CORPORATE_BILLING
                },
                onOpenSettings = {
                    navState = CustomerNavState.SETTINGS
                },
                onLogoutClick = {
                    navState = CustomerNavState.LOGIN
                }
            )
        }
        CustomerNavState.SEARCHING_CHAUFFEUR -> {
            CustomerSearchingChauffeurScreen(
                booking = currentBooking,
                onChauffeurAccepted = {
                    navState = CustomerNavState.TRACKING
                },
                onCancelBooking = {
                    navState = CustomerNavState.HOME
                }
            )
        }
        CustomerNavState.SAFETY_CENTER -> {
            CustomerSafetyCenterScreen(
                onBack = { navState = CustomerNavState.HOME },
                onCall112 = onEmergencyDial
            )
        }
        CustomerNavState.NOTIFICATIONS -> {
            CustomerNotificationsScreen(
                onBack = { navState = CustomerNavState.HOME },
                onOpenOffers = { navState = CustomerNavState.OFFERS }
            )
        }
        CustomerNavState.OFFERS -> {
            CustomerOffersScreen(
                onBack = { navState = CustomerNavState.HOME },
                onApplyPromo = { _ ->
                    navState = CustomerNavState.HOME
                }
            )
        }
        CustomerNavState.FAVORITE_CHAUFFEURS -> {
            CustomerFavoriteChauffeursScreen(
                onBack = { navState = CustomerNavState.HOME },
                onSelectDriverForRide = { driver ->
                    preferredDriverName = driver.name
                    navState = CustomerNavState.HOME
                }
            )
        }
        CustomerNavState.SUPPORT_HELP -> {
            CustomerSupportHelpScreen(
                onBack = { navState = CustomerNavState.HOME },
                onCallHelpline = onEmergencyDial
            )
        }
        CustomerNavState.REFERRAL -> {
            CustomerReferralScreen(
                onBack = { navState = CustomerNavState.HOME }
            )
        }
        CustomerNavState.CORPORATE_BILLING -> {
            CustomerCorporateBillingScreen(
                onBack = { navState = CustomerNavState.HOME }
            )
        }
        CustomerNavState.SETTINGS -> {
            CustomerAppSettingsScreen(
                onBack = { navState = CustomerNavState.HOME }
            )
        }
        CustomerNavState.HANDOVER_AUDIT -> {
            CustomerHandoverAuditScreen(
                carModel = currentBooking.vehicleModel,
                carPlate = currentBooking.vehiclePlate,
                driverName = currentBooking.assignedDriverName,
                customerName = customerName,
                onConfirmHandover = { navState = CustomerNavState.TRACKING },
                onBack = { navState = CustomerNavState.TRACKING }
            )
        }
        CustomerNavState.TRACKING -> {
            CustomerTrackingScreen(
                booking = currentBooking,
                onOpenInspection = { navState = CustomerNavState.HANDOVER_AUDIT },
                onCompleteTrip = { navState = CustomerNavState.COMPLETED },
                onLogoutClick = { navState = CustomerNavState.LOGIN }
            )
        }
        CustomerNavState.COMPLETED -> {
            CustomerCompletedRatingScreen(
                booking = currentBooking,
                onBookAnotherRide = {
                    repository.completeActiveTrip(5.0f, 50.0)
                    navState = CustomerNavState.HOME
                },
                onLogoutClick = { navState = CustomerNavState.LOGIN }
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Home shell with bottom navigation
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun CustomerHomeWithBottomNav(
    customerName: String,
    customerPhone: String,
    vehicles: List<CustomerVehicle>,
    selectedVehicleId: String,
    carModel: String,
    carPlate: String,
    preferredDriverName: String? = null,
    pastRides: List<com.drivetrust.customer.data.PastRideRecord>,
    onBookChauffeur: (ServiceType, String, String, Double) -> Unit,
    onAddVehicle: (CustomerVehicle) -> Unit,
    onDeleteVehicle: (String) -> Unit,
    onSelectVehicle: (CustomerVehicle) -> Unit,
    onOpenSafetyCenter: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenOffers: () -> Unit,
    onOpenFavorites: () -> Unit,
    onOpenSupport: () -> Unit,
    onOpenReferral: () -> Unit,
    onOpenCorporate: () -> Unit,
    onOpenSettings: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var activeTab by remember { mutableStateOf(HomeTab.BOOK) }

    Box(modifier = Modifier.fillMaxSize()) {
        // Tab content
        AnimatedContent(
            targetState = activeTab,
            transitionSpec = { fadeIn() togetherWith fadeOut() },
            modifier = Modifier.fillMaxSize(),
            label = "tab_content"
        ) { tab ->
            when (tab) {
                HomeTab.BOOK -> {
                    CustomerBookingScreen(
                        customerName = customerName,
                        carModel = carModel,
                        carPlate = carPlate,
                        preferredDriverName = preferredDriverName,
                        onBookChauffeur = onBookChauffeur,
                        onOpenSafetyCenter = onOpenSafetyCenter,
                        onOpenHistory = { activeTab = HomeTab.HISTORY },
                        onOpenOffers = onOpenOffers,
                        onOpenFavorites = onOpenFavorites,
                        onOpenNotifications = onOpenNotifications,
                        onOpenSupport = onOpenSupport,
                        onLogoutClick = onLogoutClick
                    )
                }
                HomeTab.GARAGE -> {
                    MyGarageScreen(
                        vehicles = vehicles,
                        selectedVehicleId = selectedVehicleId,
                        onSelectVehicle = onSelectVehicle,
                        onAddVehicle = onAddVehicle,
                        onDeleteVehicle = onDeleteVehicle
                    )
                }
                HomeTab.HISTORY -> {
                    CustomerRideHistoryScreen(
                        pastRides = pastRides,
                        onBack = { activeTab = HomeTab.BOOK },
                        onDownloadInvoice = { /* Opens invoice */ }
                    )
                }
                HomeTab.WALLET -> {
                    CustomerWalletScreen(customerName = customerName)
                }
                HomeTab.PROFILE -> {
                    CustomerProfileScreen(
                        customerName = customerName,
                        customerPhone = customerPhone,
                        onLogoutClick = onLogoutClick,
                        onOpenSafetyCenter = onOpenSafetyCenter,
                        onOpenFavorites = onOpenFavorites,
                        onOpenCorporate = onOpenCorporate,
                        onOpenReferral = onOpenReferral,
                        onOpenOffers = onOpenOffers,
                        onOpenSupport = onOpenSupport,
                        onOpenSettings = onOpenSettings,
                        onOpenNotifications = onOpenNotifications
                    )
                }
            }
        }

        // Bottom Navigation Bar
        CustomerBottomNavBar(
            activeTab = activeTab,
            onTabSelected = { activeTab = it },
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

data class CustomerNavTabItem(
    val tab: HomeTab,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val label: String
)

@Composable
fun CustomerBottomNavBar(
    activeTab: HomeTab,
    onTabSelected: (HomeTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val tabs = listOf(
        CustomerNavTabItem(HomeTab.BOOK, Icons.Rounded.DirectionsCar, "Chauffeur"),
        CustomerNavTabItem(HomeTab.GARAGE, Icons.Rounded.DirectionsCar, "Garage"),
        CustomerNavTabItem(HomeTab.WALLET, Icons.Rounded.AccountBalanceWallet, "Wallet"),
        CustomerNavTabItem(HomeTab.HISTORY, Icons.Rounded.ReceiptLong, "History"),
        CustomerNavTabItem(HomeTab.PROFILE, Icons.Rounded.Person, "Profile")
    )

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        shape = RoundedCornerShape(24.dp),
        color = CustomerWhite,
        shadowElevation = 10.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp, horizontal = 6.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            tabs.forEach { item ->
                val isActive = item.tab == activeTab
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (isActive) Mint50 else Color.Transparent,
                    border = if (isActive) androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f)) else null,
                    modifier = Modifier
                        .clickable { onTabSelected(item.tab) }
                        .padding(horizontal = 2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            tint = if (isActive) Mint500 else Slate400,
                            modifier = Modifier.size(20.dp)
                        )
                        if (isActive) {
                            Text(
                                text = item.label,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = CustomerTextPrimary
                            )
                        }
                    }
                }
            }
        }
    }
}
