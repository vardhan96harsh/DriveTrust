package com.drivetrust.driver.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.drivetrust.driver.data.DriverPreferences
import com.drivetrust.driver.data.DriverRepository
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.model.KycStatus
import com.drivetrust.driver.screens.*
import com.drivetrust.driver.theme.DriverColors
import com.drivetrust.driver.theme.DriverTheme

enum class DriverAppScreen {
    WALKTHROUGH,
    LOGIN,
    ONBOARDING,
    TERMINAL,
    ACTIVE_TRIP,
    HANDOVER_INSPECTION,
    WALLET,
    PERFORMANCE,
    DOCUMENTS
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val preferences = DriverPreferences(this)
        val repository = DriverRepository(preferences)

        setContent {
            DriverTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DriverColors.BackgroundLight
                ) {
                    DriverAppCoordinator(preferences, repository)
                }
            }
        }
    }
}

@Composable
fun DriverAppCoordinator(
    preferences: DriverPreferences,
    repository: DriverRepository
) {
    // App opens directly to LOGIN first
    var currentScreen by remember {
        mutableStateOf(DriverAppScreen.LOGIN)
    }

    // Chauffeur Profile State
    var driverName by remember { mutableStateOf(preferences.driverName) }
    var driverPhone by remember { mutableStateOf(preferences.driverPhone) }
    var driverDL by remember { mutableStateOf(preferences.driverDL) }
    var isApproved by remember { mutableStateOf(preferences.isAdminApproved) }
    var isOnline by remember { mutableStateOf(preferences.isDutyOnline) }

    // Active trip context
    var activeTripCustomer by remember { mutableStateOf("Vikram Aditya") }
    var activeTripOtp by remember { mutableStateOf("4821") }

    when (currentScreen) {
        DriverAppScreen.LOGIN -> {
            DriverLoginScreen(
                onLoginSuccess = { phone ->
                    driverPhone = phone
                    preferences.driverPhone = phone
                    // After first login: show Step 1 (Language) & Step 2 (Walkthrough)
                    if (!preferences.hasCompletedWalkthrough) {
                        currentScreen = DriverAppScreen.WALKTHROUGH
                    } else {
                        currentScreen = DriverAppScreen.TERMINAL
                    }
                },
                onGoToOnboard = {
                    currentScreen = DriverAppScreen.ONBOARDING
                },
                onViewWalkthrough = {
                    currentScreen = DriverAppScreen.WALKTHROUGH
                }
            )
        }

        DriverAppScreen.WALKTHROUGH -> {
            DriverWalkthroughScreen(
                initialLanguage = preferences.selectedLanguage,
                onLanguageSelected = { chosen ->
                    preferences.selectedLanguage = chosen
                },
                onFinishWalkthrough = {
                    preferences.hasCompletedWalkthrough = true
                    // After completing walkthrough, enter Terminal directly
                    currentScreen = DriverAppScreen.TERMINAL
                }
            )
        }

        DriverAppScreen.ONBOARDING -> {
            OnboardingScreen(
                onOnboardingComplete = { name, phone, dl ->
                    driverName = name
                    driverPhone = phone
                    driverDL = dl
                    isApproved = false // Pending Admin KYC verification
                    repository.submitOnboarding(name, phone, dl, "KA-COMM-88219")
                    currentScreen = DriverAppScreen.DOCUMENTS
                },
                onBackToLogin = {
                    currentScreen = DriverAppScreen.LOGIN
                }
            )
        }

        DriverAppScreen.DOCUMENTS -> {
            DocumentUploadScreen(
                driverName = driverName,
                onBack = {
                    currentScreen = DriverAppScreen.TERMINAL
                },
                onSubmitForReview = {
                    currentScreen = DriverAppScreen.TERMINAL
                }
            )
        }

        DriverAppScreen.PERFORMANCE -> {
            DriverPerformanceScreen(
                driverName = driverName,
                onBack = {
                    currentScreen = DriverAppScreen.TERMINAL
                }
            )
        }

        DriverAppScreen.TERMINAL -> {
            val profile = DriverProfile(
                fullName = driverName,
                phone = driverPhone,
                licenseNumber = driverDL,
                kycStatus = if (isApproved) KycStatus.APPROVED else KycStatus.UNDER_REVIEW,
                isOnline = isOnline,
                walletBalance = 3420.0,
                rating = 4.96f,
                totalTrips = 1420
            )

            DriverTerminalScreen(
                driver = profile,
                currentLanguage = preferences.selectedLanguage,
                onLanguageChanged = { newLang ->
                    preferences.selectedLanguage = newLang
                },
                onToggleOnline = {
                    val result = repository.toggleDuty(!isOnline)
                    if (result.isSuccess) {
                        isOnline = !isOnline
                    }
                },
                onAcceptOffer = { offer ->
                    activeTripCustomer = offer.customerName
                    activeTripOtp = "8492"
                    currentScreen = DriverAppScreen.HANDOVER_INSPECTION
                },
                onOpenWallet = {
                    currentScreen = DriverAppScreen.WALLET
                },
                onOpenPerformance = {
                    currentScreen = DriverAppScreen.PERFORMANCE
                },
                onOpenDocuments = {
                    currentScreen = DriverAppScreen.DOCUMENTS
                },
                onLogoutClick = {
                    currentScreen = DriverAppScreen.LOGIN
                }
            )
        }

        DriverAppScreen.HANDOVER_INSPECTION -> {
            HandoverInspectionScreen(
                tripId = "TRIP-KA-9921",
                customerName = activeTripCustomer,
                onCompleteInspection = {
                    currentScreen = DriverAppScreen.ACTIVE_TRIP
                },
                onCancel = {
                    currentScreen = DriverAppScreen.TERMINAL
                }
            )
        }

        DriverAppScreen.ACTIVE_TRIP -> {
            ActiveTripScreen(
                customerName = activeTripCustomer,
                customerPhone = "+91 98450 11223",
                pickupAddress = "4th Block, 100ft Road, Koramangala",
                dropoffAddress = "Terminal 2, Kempegowda International Airport",
                expectedOtp = activeTripOtp,
                fare = "₹850",
                onCompleteTrip = {
                    currentScreen = DriverAppScreen.WALLET
                },
                onCancelTrip = {
                    currentScreen = DriverAppScreen.TERMINAL
                }
            )
        }

        DriverAppScreen.WALLET -> {
            WalletScreen(
                driverName = driverName,
                onBack = {
                    currentScreen = DriverAppScreen.TERMINAL
                },
                onPayoutSuccess = { payoutAmount ->
                    repository.withdrawBalanceToUpi()
                }
            )
        }
    }
}
