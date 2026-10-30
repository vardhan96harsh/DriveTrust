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
            .background(CustomerBackgroundLight)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top status
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = if (isChauffeurFound) Mint50 else Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, if (isChauffeurFound) Mint100 else CustomerCardBorderLight)
            ) {
                Text(
                    text = if (isChauffeurFound) "CHAUFFEUR CONFIRMED ✓" else "CONNECTING TO CHAUFFEUR...",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isChauffeurFound) Mint600 else CustomerTextSecondary,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                )
            }
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = if (isChauffeurFound) "Chauffeur Found!" else "Finding Your Verified Chauffeur",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = CustomerTextPrimary
            )
            Text(
                text = "Booking #${booking.bookingCode} • ${booking.vehicleModel}",
                fontSize = 13.sp,
                color = CustomerTextSecondary
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
                        .border(2.dp, Mint500.copy(alpha = pulseAlpha), CircleShape)
                )
                // Middle Pulse Ring
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .scale(pulseScale * 0.85f)
                        .border(2.dp, Mint500.copy(alpha = pulseAlpha), CircleShape)
                )
            }

            // Center Radar Orb
            Surface(
                shape = CircleShape,
                color = if (isChauffeurFound) Mint500 else Color.White,
                border = androidx.compose.foundation.BorderStroke(2.dp, if (isChauffeurFound) Mint600 else Mint500),
                modifier = Modifier.size(96.dp),
                shadowElevation = 8.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    if (isChauffeurFound) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = "Chauffeur Confirmed",
                            tint = Color.White,
                            modifier = Modifier.size(46.dp)
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Rounded.DirectionsCar,
                            contentDescription = "Scanning Chauffeurs",
                            tint = Mint500,
                            modifier = Modifier.size(46.dp)
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
                // Step progress pills in Pure White Card
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        StepStatusRow(
                            stepNumber = "1",
                            text = "Scanning nearby commercial chauffeurs...",
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
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 4.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
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
                                    modifier = Modifier.size(52.dp).background(Mint50, CircleShape).border(1.dp, Mint100, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("RS", color = Mint600, fontWeight = FontWeight.Black, fontSize = 16.sp)
                                }
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Text(booking.assignedDriverName, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                                        Surface(shape = RoundedCornerShape(6.dp), color = Mint50) {
                                            Text("★ 4.96", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Mint600, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                        }
                                    }
                                    Text("DL: ${booking.assignedDriverDL}", fontSize = 12.sp, color = CustomerTextSecondary)
                                    Text("Arriving in ~${booking.driverEtaMinutes} mins", fontSize = 12.sp, color = Mint600, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Handover Start OTP:", fontSize = 13.sp, color = CustomerTextSecondary)
                                Text(booking.startOtp, fontSize = 16.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                            }
                        }

                        Button(
                            onClick = onChauffeurAccepted,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                            elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                        ) {
                            Text("PROCEED TO LIVE TRACKING →", fontWeight = FontWeight.Bold, color = Color.White)
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
                .size(24.dp)
                .background(
                    if (isDone) Mint500 else if (isActive) Mint50 else CustomerInnerSurfaceLight,
                    CircleShape
                )
                .border(
                    1.dp,
                    if (isDone) Mint500 else if (isActive) Mint500 else CustomerCardBorderLight,
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            if (isDone) {
                Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = "Completed",
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            } else {
                Text(
                    text = stepNumber,
                    color = if (isActive) Mint600 else CustomerTextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        Text(
            text = text,
            fontSize = 12.sp,
            color = if (isDone || isActive) CustomerTextPrimary else CustomerTextSecondary,
            fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal
        )
    }
}
