package com.drivetrust.customer.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.model.TripBooking
import com.drivetrust.customer.theme.*
import kotlinx.coroutines.delay

@Composable
fun CustomerSearchingChauffeurScreen(
    booking: TripBooking,
    onChauffeurAccepted: () -> Unit,
    onCancelBooking: () -> Unit
) {
    var searchStep by remember { mutableStateOf(1) }
    var isChauffeurFound by remember { mutableStateOf(false) }

    // Pulsing radar animation
    val infiniteTransition = rememberInfiniteTransition(label = "radar_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.4f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = LinearOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radar_scale"
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = LinearOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radar_alpha"
    )

    // Progression timer
    LaunchedEffect(Unit) {
        delay(1200)
        searchStep = 2
        delay(1400)
        searchStep = 3
        delay(1200)
        searchStep = 4
        isChauffeurFound = true
        delay(2500)
        onChauffeurAccepted()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate900)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top status
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 24.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Slate800
            ) {
                Text(
                    text = if (isChauffeurFound) "CHAUFFEUR CONFIRMED ✓" else "CONNECTING TO CHAUFFEUR...",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = if (isChauffeurFound) Emerald400 else Slate300,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = if (isChauffeurFound) "Chauffeur Found!" else "Finding Your Verified Chauffeur",
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "Booking #${booking.bookingCode} • ${booking.vehicleModel}",
                fontSize = 12.sp,
                color = Slate400
            )
        }

        // Radar Graphic Center
        Box(
            modifier = Modifier.size(240.dp),
            contentAlignment = Alignment.Center
        ) {
            if (!isChauffeurFound) {
                // Outer Pulse Ring
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .scale(pulseScale)
                        .border(2.dp, Emerald500.copy(alpha = pulseAlpha), CircleShape)
                )
                // Middle Pulse Ring
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .scale(pulseScale * 0.85f)
                        .border(2.dp, Emerald500.copy(alpha = pulseAlpha), CircleShape)
                )
            }

            // Center Radar Orb
            Surface(
                shape = CircleShape,
                color = if (isChauffeurFound) Emerald500 else MidnightCard,
                border = androidx.compose.foundation.BorderStroke(2.dp, if (isChauffeurFound) Emerald400 else Gold500.copy(alpha = 0.5f)),
                modifier = Modifier.size(90.dp),
                shadowElevation = 16.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    if (isChauffeurFound) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = "Chauffeur Confirmed",
                            tint = Slate900,
                            modifier = Modifier.size(42.dp)
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Rounded.DirectionsCar,
                            contentDescription = "Scanning Chauffeurs",
                            tint = Gold400,
                            modifier = Modifier.size(42.dp)
                        )
                    }
                }
            }
        }

        // Bottom Steps & Matched Card
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (!isChauffeurFound) {
                // Step progress pills
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Slate800,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        StepStatusRow(
                            stepNumber = "1",
                            text = "Scanning nearby commercial chauffeurs in Vidisha...",
                            isDone = searchStep > 1,
                            isActive = searchStep == 1
                        )
                        StepStatusRow(
                            stepNumber = "2",
                            text = "Verifying ${booking.transmission} transmission proficiency...",
                            isDone = searchStep > 2,
                            isActive = searchStep == 2
                        )
                        StepStatusRow(
                            stepNumber = "3",
                            text = "Checking MoRTH Sarathi background & KYC...",
                            isDone = searchStep > 3,
                            isActive = searchStep == 3
                        )
                    }
                }

                TextButton(
                    onClick = onCancelBooking,
                    colors = ButtonDefaults.textButtonColors(contentColor = Red500)
                ) {
                    Text("Cancel Request", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            } else {
                // Chauffeur Accepted Card
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier.size(50.dp).background(Slate900, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("RS", color = Color.White, fontWeight = FontWeight.Black, fontSize = 16.sp)
                                }
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Text(booking.assignedDriverName, fontSize = 15.sp, fontWeight = FontWeight.Black, color = Slate900)
                                        Surface(shape = RoundedCornerShape(4.dp), color = Emerald50) {
                                            Text("★ 4.96", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                        }
                                    }
                                    Text("DL: ${booking.assignedDriverDL}", fontSize = 11.sp, color = Slate500)
                                    Text("Arriving in ~${booking.driverEtaMinutes} mins (Chauffeur En Route to Location)", fontSize = 11.sp, color = Emerald600, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Slate100,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Handover Start OTP:", fontSize = 12.sp, color = Slate600)
                                Text(booking.startOtp, fontSize = 14.sp, fontWeight = FontWeight.Black, color = Slate900)
                            }
                        }

                        Button(
                            onClick = onChauffeurAccepted,
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                        ) {
                            Text("PROCEED TO LIVE TRACKING →", fontWeight = FontWeight.Black, color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StepStatusRow(
    stepNumber: String,
    text: String,
    isDone: Boolean,
    isActive: Boolean
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Box(
            modifier = Modifier
                .size(22.dp)
                .background(
                    if (isDone) Emerald500 else if (isActive) Slate700 else Slate800,
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            if (isDone) {
                Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = "Completed",
                    tint = Slate900,
                    modifier = Modifier.size(12.dp)
                )
            } else {
                Text(
                    text = stepNumber,
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black
                )
            }
        }
        Text(
            text = text,
            fontSize = 11.sp,
            color = if (isDone || isActive) Color.White else Slate500,
            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal
        )
    }
}
