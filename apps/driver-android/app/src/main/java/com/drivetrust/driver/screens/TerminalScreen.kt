package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.drivetrust.driver.components.DriverTopBar
import com.drivetrust.driver.components.IncomingOfferDialog
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.model.KycStatus
import com.drivetrust.driver.model.RideOffer
import com.drivetrust.driver.theme.*

@Composable
fun DriverTerminalScreen(
    driver: DriverProfile,
    onToggleOnline: () -> Unit,
    onAcceptOffer: (RideOffer) -> Unit,
    onOpenWallet: () -> Unit,
    onOpenPerformance: () -> Unit = {},
    onOpenDocuments: () -> Unit = {},
    onLogoutClick: () -> Unit
) {
    var showOfferDialog by remember { mutableStateOf(false) }
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
            .background(Slate50)
    ) {
        DriverTopBar(
            driver = driver,
            onToggleDuty = onToggleOnline,
            onLogoutClick = onLogoutClick
        )

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

            // Terminal Status Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .background(if (driver.isOnline) Emerald50 else Slate100, RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (driver.isOnline) "🟢" else "🔴",
                            fontSize = 24.sp
                        )
                    }

                    Text(
                        text = if (driver.isOnline) "Chauffeur Terminal Online" else "Terminal Offline",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )

                    Text(
                        text = if (driver.isOnline)
                            "Ready to receive executive dispatches within 2.5km spatial radius."
                        else
                            "Toggle status to ONLINE above to start receiving ride dispatch cards.",
                        fontSize = 12.sp,
                        color = Slate500,
                        lineHeight = 18.sp
                    )

                    if (driver.isOnline && driver.kycStatus == KycStatus.APPROVED) {
                        Button(
                            onClick = { showOfferDialog = true },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Simulate Incoming 30s Ride Offer →", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }

            // Quick Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("TODAY'S EARNINGS", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                        Text("₹${driver.walletBalance.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Slate900, fontFamily = FontFamily.Monospace)
                        Text("+₹582 pending", fontSize = 10.sp, color = Emerald600, fontWeight = FontWeight.Bold)
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("SAFETY RATING", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                        Text("★ ${driver.rating}", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Amber600)
                        Text("${driver.totalTrips} completed trips", fontSize = 10.sp, color = Slate500)
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
                    modifier = Modifier.weight(1f).height(44.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF10B981))
                ) {
                    Text("📊 Safety Score (98)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onOpenDocuments,
                    modifier = Modifier.weight(1f).height(44.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF0284C7))
                ) {
                    Text("📄 KYC Docs & DL", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Wallet View Trigger
            Button(
                onClick = onOpenWallet,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Slate100, contentColor = Slate900),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("View Wallet & Instant UPI Settlements →", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }
    }
}
