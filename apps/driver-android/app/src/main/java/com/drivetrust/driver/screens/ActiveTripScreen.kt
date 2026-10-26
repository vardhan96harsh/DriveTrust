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
import com.drivetrust.driver.components.DriverTopBar
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.model.RideOffer
import com.drivetrust.driver.theme.*

@Composable
fun DriverActiveTripScreen(
    driver: DriverProfile,
    offer: RideOffer,
    onOpenInspection: () -> Unit,
    onEndTrip: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var enteredOtp by remember { mutableStateOf("") }
    var tripStarted by remember { mutableStateOf(false) }
    var otpError by remember { mutableStateOf<String?>(null) }
    var isInspectionPassed by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        DriverTopBar(
            driver = driver,
            onToggleDuty = {},
            onLogoutClick = onLogoutClick
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Text(
                text = if (!tripStarted) "ACTION REQUIRED: VERIFY 4-DIGIT OTP" else "TRIP IN PROGRESS • EN ROUTE",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = if (!tripStarted) Amber600 else Emerald600
            )

            // Customer & Vehicle Info Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Customer: ${offer.customerName}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Slate900)
                        Text(offer.customerPhone, fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Slate500)
                    }
                    Text(
                        text = "Vehicle: ${offer.vehicleModel} (${offer.vehiclePlate})",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate700
                    )
                    Text(
                        text = "Pickup: ${offer.pickupAddress}",
                        fontSize = 11.sp,
                        color = Slate500
                    )
                }
            }

            // 4-Point Pre-Trip Vehicle Handover Card
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
                    Column {
                        Text(
                            text = "Pre-Trip Handover Audit",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = Slate900
                        )
                        Text(
                            text = if (isInspectionPassed) "✓ Audit Passed (No Scratches)" else "Perform bodywork & odometer audit",
                            fontSize = 11.sp,
                            color = if (isInspectionPassed) Emerald600 else Amber600
                        )
                    }

                    Button(
                        onClick = {
                            onOpenInspection()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isInspectionPassed) Emerald50 else Slate900,
                            contentColor = if (isInspectionPassed) Emerald600 else Color.White
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(if (isInspectionPassed) "Review" else "Inspect Car", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            if (!tripStarted) {
                // 4-Digit OTP Entry Card
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = "ENTER CUSTOMER'S 4-DIGIT START OTP",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate500
                        )
                        Text(
                            text = "Ask the passenger to read the 4-digit code shown on their phone screen.",
                            fontSize = 11.sp,
                            color = Slate500
                        )

                        OutlinedTextField(
                            value = enteredOtp,
                            onValueChange = { if (it.length <= 4) enteredOtp = it.filter { ch -> ch.isDigit() } },
                            placeholder = { Text("4-Digit OTP") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )

                        otpError?.let {
                            Text(text = it, color = Red600, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = {
                                if (enteredOtp.isNotEmpty() && enteredOtp == offer.otp) {
                                    tripStarted = true
                                    otpError = null
                                } else {
                                    otpError = "Invalid 4-digit OTP. Please check customer phone."
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("VERIFY OTP & START TRIP →", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            } else {
                // Driving Telematics Box
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Slate900,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("LIVE SPEED", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                            Text("IMU TELEMETRICS", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Emerald500)
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("48 km/h", fontSize = 28.sp, fontWeight = FontWeight.Black, color = Color.White, fontFamily = FontFamily.Monospace)
                            Text("0.98g (Smooth)", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Emerald500)
                        }
                        Text("12-Partition Kafka Telemetry Stream Active", fontSize = 10.sp, color = Slate400)
                    }
                }

                Button(
                    onClick = onEndTrip,
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("ARRIVED AT DESTINATION • END TRIP →", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun ActiveTripScreen(
    customerName: String,
    customerPhone: String,
    pickupAddress: String,
    dropoffAddress: String,
    expectedOtp: String,
    fare: String,
    onCompleteTrip: () -> Unit,
    onCancelTrip: () -> Unit
) {
    val simulatedOffer = RideOffer(
        customerName = customerName,
        customerPhone = customerPhone,
        pickupAddress = pickupAddress,
        destinationAddress = dropoffAddress,
        fare = fare,
        otp = expectedOtp
    )
    val simulatedDriver = DriverProfile(
        fullName = "Rajesh Kumar",
        phone = "+91 99801 84920"
    )
    DriverActiveTripScreen(
        driver = simulatedDriver,
        offer = simulatedOffer,
        onOpenInspection = {},
        onEndTrip = onCompleteTrip,
        onLogoutClick = onCancelTrip
    )
}

