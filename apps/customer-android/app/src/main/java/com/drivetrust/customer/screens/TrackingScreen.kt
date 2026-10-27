package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
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
            .background(MidnightDark)
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Live Status Header with Executive Action Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(Emerald400, CircleShape)
                        )
                        Text(
                            text = "LIVE TRIP EN ROUTE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald400,
                            letterSpacing = 1.sp
                        )
                    }
                    Text(
                        text = "Chauffeur Approaching",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilledTonalButton(
                        onClick = { showChatDialog = true },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = MidnightCard,
                            contentColor = Gold500
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Rounded.Chat, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    FilledTonalButton(
                        onClick = { showShareDialog = true },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = MidnightCard,
                            contentColor = Emerald400
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Rounded.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Share", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { showSosDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Red600),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Rounded.Emergency, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("SOS", fontSize = 11.sp, fontWeight = FontWeight.Black)
                    }
                }
            }

            // Radar/Telemetry Map Box with Executive Obsidian Glass
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(175.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Color(0xFF0D1527), Color(0xFF131D38), Color(0xFF0F172A))
                            )
                        )
                        .padding(18.dp)
                ) {
                    // Subtle background grid radar ring
                    Box(
                        modifier = Modifier
                            .size(140.dp)
                            .align(Alignment.CenterEnd)
                            .border(1.dp, Gold500.copy(alpha = 0.15f), CircleShape)
                    )
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .align(Alignment.CenterEnd)
                            .border(1.dp, Gold500.copy(alpha = 0.25f), CircleShape)
                    )

                    Column(
                        modifier = Modifier.align(Alignment.BottomStart),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Emerald400.copy(alpha = 0.2f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        Icons.Rounded.GpsFixed,
                                        contentDescription = null,
                                        tint = Emerald400,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Text(
                                        text = "TELEMETRY ACTIVE",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Emerald400,
                                        letterSpacing = 0.5.sp
                                    )
                                }
                            }
                            Text(
                                text = "ETA: ~12 Mins to Pickup",
                                color = Color.White,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Rounded.Navigation,
                                contentDescription = null,
                                tint = Gold500,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "Pickup: ${booking.pickupAddress}",
                                color = Slate400,
                                fontSize = 12.sp,
                                maxLines = 1
                            )
                        }
                    }
                }
            }

            // 4-Point Vehicle Pre-Trip Handover Status Card
            Surface(
                shape = RoundedCornerShape(18.dp),
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
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Gold500.copy(alpha = 0.12f),
                            modifier = Modifier.size(44.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.FactCheck,
                                    contentDescription = null,
                                    tint = Gold500,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = "4-Point Handover Audit",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = Color.White
                            )
                            Text(
                                text = if (isHandoverVerified) "Handover verified (zero pre-existing marks)" else "Pre-trip scratch audit pending",
                                fontSize = 11.sp,
                                color = if (isHandoverVerified) Emerald400 else Slate400
                            )
                        }
                    }

                    Button(
                        onClick = { onOpenInspection() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isHandoverVerified) Emerald400.copy(alpha = 0.2f) else Gold500,
                            contentColor = if (isHandoverVerified) Emerald400 else MidnightDark
                        ),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
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
                shape = RoundedCornerShape(18.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Midnight950,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.5f)),
                                modifier = Modifier.size(46.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = booking.assignedDriverName.take(2).uppercase(),
                                        color = Gold500,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 16.sp
                                    )
                                }
                            }
                            Column {
                                Text(
                                    text = booking.assignedDriverName,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 15.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = "DL: ${booking.assignedDriverDL}",
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = Slate400
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Emerald400.copy(alpha = 0.15f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.3f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    Icons.Rounded.Verified,
                                    contentDescription = null,
                                    tint = Emerald400,
                                    modifier = Modifier.size(13.dp)
                                )
                                Text(
                                    text = "MoRTH Verified",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400
                                )
                            }
                        }
                    }

                    HorizontalDivider(color = MidnightBorder)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Rounded.DirectionsCar,
                                contentDescription = null,
                                tint = Gold500,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "${booking.vehicleModel} (${booking.vehiclePlate})",
                                fontSize = 12.sp,
                                color = Slate200,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = Midnight950,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                        ) {
                            Text(
                                text = booking.transmission,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate400,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                }
            }

            // 4-Digit Security OTP Handshake Card
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            Icons.Rounded.Key,
                            contentDescription = null,
                            tint = Gold500,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "START RIDE VERIFICATION CODE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Gold500,
                            letterSpacing = 1.sp
                        )
                    }

                    Text(
                        text = booking.startOtp,
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White,
                        letterSpacing = 8.sp
                    )

                    Text(
                        text = "Share this secure handshake code only after vehicle inspection",
                        fontSize = 11.sp,
                        color = Slate400
                    )
                }
            }

            // Fast forward simulation button
            Button(
                onClick = onCompleteTrip,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Gold500,
                    contentColor = MidnightDark
                ),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    Icons.Rounded.CheckCircle,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Simulate Safe Trip Completion",
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp
                )
            }
        }
    }
}
