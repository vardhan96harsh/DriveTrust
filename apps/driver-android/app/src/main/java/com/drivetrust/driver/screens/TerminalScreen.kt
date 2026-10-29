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
                    if (driver.isOnline) Emerald400.copy(alpha = 0.4f) else MidnightBorder
                ),
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
                                if (driver.isOnline) Emerald400.copy(alpha = 0.15f) else Midnight950,
                                CircleShape
                            )
                            .border(
                                2.dp,
                                if (driver.isOnline) Emerald400 else Slate700,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (driver.isOnline) Icons.Rounded.GpsFixed else Icons.Rounded.GpsOff,
                            contentDescription = null,
                            tint = if (driver.isOnline) Emerald400 else Slate500,
                            modifier = Modifier.size(30.dp)
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (driver.isOnline) "Cockpit Active • Radar Scanning" else "Terminal Offline",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = if (driver.isOnline)
                                "GPS telemetry active. You are eligible for VIP bookings in 2.5km radius."
                            else
                                "Switch duty to ONLINE in the top bar to receive private client bookings.",
                            fontSize = 12.sp,
                            color = Slate400,
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
                                containerColor = Gold500,
                                contentColor = MidnightDark
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Rounded.NotificationsActive, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Simulate Incoming 30s VIP Offer", fontWeight = FontWeight.Black, fontSize = 13.sp)
                        }
                    }
                }
            }

            // Commercial Fatigue & Shift Hours Safety Tracker
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
                            color = Midnight950,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.AccessTime,
                                    contentDescription = null,
                                    tint = Gold500,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = "SHIFT & FATIGUE TIMER",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Gold500,
                                letterSpacing = 0.5.sp
                            )
                            Text(
                                text = if (driver.isOnline) "3h 45m On-Duty Today" else "Shift Paused",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Midnight950,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                    ) {
                        Text(
                            text = "Max 10h / Shift",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald400,
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
                            Text("TODAY'S EARNINGS", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                        }
                        Text(
                            text = "₹${driver.walletBalance.toInt()}",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold500,
                            fontFamily = FontFamily.Monospace
                        )
                        Text("+₹582 pending", fontSize = 10.sp, color = Emerald400, fontWeight = FontWeight.Bold)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
                            Text("SAFETY INDEX", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                        }
                        Text(
                            text = "${driver.rating} ★",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text("${driver.totalTrips} VIP rides", fontSize = 10.sp, color = Slate400)
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
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Emerald400),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                ) {
                    Icon(Icons.Rounded.Analytics, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Safety Score (98)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onOpenDocuments,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Gold500),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                ) {
                    Icon(Icons.Rounded.Badge, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("KYC Vault & DL", fontSize = 11.sp, fontWeight = FontWeight.Bold)
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
                    contentColor = Gold500
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Rounded.AccountBalanceWallet, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Instant UPI Payouts & Settlement Ledger", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }
    }
}
