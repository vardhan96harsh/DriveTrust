package com.drivetrust.customer.screens

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
import com.drivetrust.customer.components.CustomerTopAppBar
import com.drivetrust.customer.components.QuickChatDialog
import com.drivetrust.customer.components.SosEmergencyDialog
import com.drivetrust.customer.components.WhatsAppShareDialog
import com.drivetrust.customer.model.TripBooking
import com.drivetrust.customer.model.TripStatus
import com.drivetrust.customer.theme.*

@Composable
fun CustomerTrackingScreen(
    booking: TripBooking,
    onOpenInspection: () -> Unit,
    onCompleteTrip: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var showChatDialog by remember { mutableStateOf(false) }
    var showShareDialog by remember { mutableStateOf(false) }
    var showSosDialog by remember { mutableStateOf(false) }
    var isHandoverVerified by remember { mutableStateOf(false) }

    if (showChatDialog) {
        QuickChatDialog(
            driverName = booking.assignedDriverName,
            onDismiss = { showChatDialog = false }
        )
    }

    if (showShareDialog) {
        WhatsAppShareDialog(
            bookingCode = booking.bookingCode,
            driverName = booking.assignedDriverName,
            carModel = booking.vehicleModel,
            carPlate = booking.vehiclePlate,
            onDismiss = { showShareDialog = false }
        )
    }

    if (showSosDialog) {
        SosEmergencyDialog(
            bookingCode = booking.bookingCode,
            onDismiss = { showSosDialog = false }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        CustomerTopAppBar(
            customerName = booking.customerName,
            onLogoutClick = onLogoutClick
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Status Header with Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "LIVE TRIP EN ROUTE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Emerald600
                    )
                    Text(
                        text = "Chauffeur Approaching",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    FilledTonalButton(
                        onClick = { showChatDialog = true },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text("💬 Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { showShareDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text("📲 Share", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { showSosDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Red600),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text("SOS", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Simulated Map Box
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Slate900,
                modifier = Modifier.fillMaxWidth().height(160.dp)
            ) {
                Box(
                    modifier = Modifier.fillMaxSize().padding(16.dp),
                    contentAlignment = Alignment.BottomStart
                ) {
                    Column {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Emerald600
                            ) {
                                Text(
                                    text = "LIVE GPS",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                            Text(
                                text = "ETA: ~12 Mins to Pickup",
                                color = Color.White,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = "Pickup: ${booking.pickupAddress}",
                            color = Slate400,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // 4-Point Vehicle Pre-Trip Handover Status Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "🔍", fontSize = 20.sp)
                        Column {
                            Text(
                                text = "4-Point Vehicle Handover",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Slate900
                            )
                            Text(
                                text = if (isHandoverVerified) "✓ Handover Verified (No scratches)" else "Pre-trip scratch audit pending",
                                fontSize = 11.sp,
                                color = if (isHandoverVerified) Emerald600 else Slate500
                            )
                        }
                    }

                    Button(
                        onClick = {
                            onOpenInspection()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isHandoverVerified) Emerald50 else Slate900,
                            contentColor = if (isHandoverVerified) Emerald600 else Color.White
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = if (isHandoverVerified) "View Audit" else "Audit Car",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Chauffeur Identity Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Slate900,
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = booking.assignedDriverName.take(2).uppercase(),
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                            Column {
                                Text(
                                    text = booking.assignedDriverName,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp,
                                    color = Slate900
                                )
                                Text(
                                    text = "DL: ${booking.assignedDriverDL}",
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = Slate500
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = Emerald50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.3f))
                        ) {
                            Text(
                                text = "✓ MoRTH Sarathi Cleared",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald600,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                            )
                        }
                    }

                    HorizontalDivider(color = Slate100)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Vehicle: ${booking.vehicleModel} (${booking.vehiclePlate})",
                            fontSize = 11.sp,
                            color = Slate700,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = booking.transmission,
                            fontSize = 11.sp,
                            color = Slate500
                        )
                    }
                }
            }

            // 4-Digit Security OTP Handshake
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Slate900,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "GIVE THIS 4-DIGIT START OTP TO YOUR CHAUFFEUR",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate400
                    )
                    Text(
                        text = booking.startOtp,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = Emerald500,
                        letterSpacing = 4.sp
                    )
                    Text(
                        text = "Driver physically cannot start driving without this security code",
                        fontSize = 10.sp,
                        color = Slate400
                    )
                }
            }

            // Fast forward simulation button
            Button(
                onClick = onCompleteTrip,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Simulate Safe Trip Completion →", fontWeight = FontWeight.Bold)
            }
        }
    }
}
