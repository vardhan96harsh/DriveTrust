package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ReceiptLong
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.components.AdminVerificationBanner
import com.drivetrust.driver.components.ChooseLanguageBottomSheet
import com.drivetrust.driver.components.DriverTopBar
import com.drivetrust.driver.components.IncomingOfferDialog
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.model.KycStatus
import com.drivetrust.driver.model.RideOffer
import com.drivetrust.driver.theme.*

@Composable
fun DriverTerminalScreen(
    driver: DriverProfile,
    currentLanguage: String = "English",
    onLanguageChanged: (String) -> Unit = {},
    onToggleOnline: () -> Unit,
    onAcceptOffer: (RideOffer) -> Unit,
    onOpenWallet: () -> Unit,
    onOpenPerformance: () -> Unit = {},
    onOpenDocuments: () -> Unit = {},
    onLogoutClick: () -> Unit
) {
    var showOfferDialog by remember { mutableStateOf(false) }
    var showLanguageSheet by remember { mutableStateOf(false) }
    var currentOffer by remember {
        mutableStateOf(
            RideOffer(
                bookingCode = "DT-849102",
                customerName = "Harshvardhan",
                customerPhone = "+91 98450 12345",
                vehicleModel = "Toyota Fortuner 4x4",
                vehiclePlate = "KA-01-MJ-4921",
                transmission = "AUTOMATIC",
                pickupAddress = "Indiranagar 100ft Rd, Bangalore",
                destinationAddress = "Koramangala 5th Block, Bangalore",
                netDriverPayout = 582.0
            )
        )
    }

    if (showOfferDialog) {
        IncomingOfferDialog(
            offer = currentOffer,
            onAccept = {
                showOfferDialog = false
                onAcceptOffer(currentOffer)
            },
            onDecline = {
                showOfferDialog = false
            }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
    ) {
        DriverTopBar(
            driver = driver,
            onToggleDuty = onToggleOnline,
            onLogoutClick = onLogoutClick,
            onLanguageClick = { showLanguageSheet = true }
        )

        if (showLanguageSheet) {
            ChooseLanguageBottomSheet(
                currentLanguage = currentLanguage,
                onLanguageConfirmed = { chosen ->
                    onLanguageChanged(chosen)
                    showLanguageSheet = false
                },
                onDismissRequest = {
                    showLanguageSheet = false
                }
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Admin Verification Status Banner
            AdminVerificationBanner(
                kycStatus = driver.kycStatus,
                licenseNumber = driver.licenseNumber
            )

            // Executive Chauffeur Radar & Cockpit Card
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (driver.isOnline) Mint500.copy(alpha = 0.5f) else MidnightBorder
                ),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(
                                if (driver.isOnline) Mint50 else Midnight950,
                                CircleShape
                            )
                            .border(
                                2.dp,
                                if (driver.isOnline) Mint500 else Slate300,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (driver.isOnline) Icons.Rounded.GpsFixed else Icons.Rounded.GpsOff,
                            contentDescription = null,
                            tint = if (driver.isOnline) Mint500 else Slate400,
                            modifier = Modifier.size(30.dp)
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (driver.isOnline) {
                                if (currentLanguage == "हिन्दी") "कॉकपिट सक्रिय • रडार स्कैनिंग" else "Cockpit Active • Radar Scanning"
                            } else {
                                if (currentLanguage == "हिन्दी") "टर्मिनल ऑफ़लाइन" else "Terminal Offline"
                            },
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = DriverTextPrimary
                        )
                        Text(
                            text = if (driver.isOnline) {
                                if (currentLanguage == "हिन्दी")
                                    "GPS सक्रिय। आप 2.5 किमी के दायरे में VIP बुकिंग के लिए उपलब्ध हैं।"
                                else
                                    "GPS telemetry active. You are eligible for VIP bookings in 2.5km radius."
                            } else {
                                if (currentLanguage == "हिन्दी")
                                    "प्राइवेट बुकिंग प्राप्त करने के लिए शीर्ष बार में ड्यूटी चालू (ONLINE) करें।"
                                else
                                    "Switch duty to ONLINE in the top bar to receive private client bookings."
                            },
                            fontSize = 12.sp,
                            color = DriverTextSecondary,
                            lineHeight = 18.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    if (driver.isOnline && driver.kycStatus == KycStatus.APPROVED) {
                        Button(
                            onClick = { showOfferDialog = true },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Mint500,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Rounded.NotificationsActive, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (currentLanguage == "हिन्दी") "VIP राइड टेस्ट ऑफर देखें" else "Simulate Incoming 30s VIP Offer",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }

            // Commercial Fatigue & Shift Hours Safety Tracker
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                shadowElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Mint50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.AccessTime,
                                    contentDescription = null,
                                    tint = Mint500,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = if (currentLanguage == "हिन्दी") "शिफ्ट व आराम ट्रैकर" else "SHIFT & FATIGUE TIMER",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Gold500,
                                letterSpacing = 0.5.sp
                            )
                            Text(
                                text = if (driver.isOnline) {
                                    if (currentLanguage == "हिन्दी") "आज 3 घंटे 45 मिनट सक्रिय" else "3h 45m On-Duty Today"
                                } else {
                                    if (currentLanguage == "हिन्दी") "शिफ्ट रुकी हुई" else "Shift Paused"
                                },
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = DriverTextPrimary
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Mint50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint100)
                    ) {
                        Text(
                            text = if (currentLanguage == "हिन्दी") "अधिकतम 10 घंटे" else "Max 10h / Shift",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Mint600,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            // Quick Stats Row: Earnings & Safety Rating
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shadowElevation = 1.dp,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOpenWallet() }
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(Icons.AutoMirrored.Rounded.ReceiptLong, contentDescription = null, tint = Gold500, modifier = Modifier.size(14.dp))
                            Text(
                                text = if (currentLanguage == "हिन्दी") "आज की कमाई" else "TODAY'S EARNINGS",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = DriverTextSecondary
                            )
                        }
                        Text(
                            text = "₹${driver.walletBalance.toInt()}",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = DriverTextPrimary,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = if (currentLanguage == "हिन्दी") "+₹582 प्रक्रिया में" else "+₹582 pending",
                            fontSize = 10.sp,
                            color = Mint600,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shadowElevation = 1.dp,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOpenPerformance() }
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(Icons.Rounded.Star, contentDescription = null, tint = Amber500, modifier = Modifier.size(14.dp))
                            Text(
                                text = if (currentLanguage == "हिन्दी") "सुरक्षा रेटिंग" else "SAFETY INDEX",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = DriverTextSecondary
                            )
                        }
                        Text(
                            text = "${driver.rating} ★",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = DriverTextPrimary
                        )
                        Text(
                            text = if (currentLanguage == "हिन्दी") "${driver.totalTrips} राइड्स पूर्ण" else "${driver.totalTrips} VIP rides",
                            fontSize = 10.sp,
                            color = DriverTextSecondary
                        )
                    }
                }
            }

            // Chauffeur Hub: Scorecard & KYC Docs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenPerformance,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = MidnightCard,
                        contentColor = Mint600
                    ),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                ) {
                    Icon(Icons.Rounded.Analytics, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (currentLanguage == "हिन्दी") "सुरक्षा स्कोर (98)" else "Safety Score (98)",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                OutlinedButton(
                    onClick = onOpenDocuments,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = MidnightCard,
                        contentColor = Gold500
                    ),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                ) {
                    Icon(Icons.Rounded.Badge, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (currentLanguage == "हिन्दी") "केवाईसी और लाइसेंस" else "KYC Vault & DL",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Wallet View Trigger
            Button(
                onClick = onOpenWallet,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MidnightCard,
                    contentColor = DriverTextPrimary
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                shape = RoundedCornerShape(14.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 1.dp)
            ) {
                Icon(Icons.Rounded.AccountBalanceWallet, contentDescription = null, tint = Mint500, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (currentLanguage == "हिन्दी") "तत्काल UPI निकासी और खाता बही" else "Instant UPI Payouts & Settlement Ledger",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }

            // Driver App Language Settings Row (User able to change language in settings anytime)
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                shadowElevation = 1.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showLanguageSheet = true }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Mint50,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.Language,
                                    contentDescription = null,
                                    tint = Mint500,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = if (currentLanguage == "हिन्दी") "ऐप की भाषा बदलें" else "App Language / भाषा बदलें",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = DriverTextPrimary
                            )
                            Text(
                                text = "Current: $currentLanguage",
                                fontSize = 11.sp,
                                color = DriverTextSecondary
                            )
                        }
                    }
                    Text(
                        text = if (currentLanguage == "हिन्दी") "बदलें" else "Change",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Mint500
                    )
                }
            }
        }
    }
}
