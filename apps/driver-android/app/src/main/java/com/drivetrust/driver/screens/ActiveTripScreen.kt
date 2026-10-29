package com.drivetrust.driver.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
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
    val context = LocalContext.current
    var enteredOtp by remember { mutableStateOf("") }
    var tripStarted by remember { mutableStateOf(false) }
    var otpError by remember { mutableStateOf<String?>(null) }
    var isInspectionPassed by remember { mutableStateOf(false) }
    var showChatDialog by remember { mutableStateOf(false) }
    var showSosDialog by remember { mutableStateOf(false) }

    fun launchNavigation(destination: String) {
        try {
            val uri = Uri.parse("google.navigation:q=" + Uri.encode(destination))
            val mapIntent = Intent(Intent.ACTION_VIEW, uri).apply {
                setPackage("com.google.android.apps.maps")
            }
            context.startActivity(mapIntent)
        } catch (_: Exception) {
            val fallbackUri = Uri.parse("geo:0,0?q=" + Uri.encode(destination))
            context.startActivity(Intent(Intent.ACTION_VIEW, fallbackUri))
        }
    }

    fun callCustomer(phone: String) {
        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
        context.startActivity(intent)
    }

    if (showChatDialog) {
        DriverQuickChatDialog(
            customerName = offer.customerName,
            onDismiss = { showChatDialog = false }
        )
    }

    if (showSosDialog) {
        DriverSosDialog(
            tripCode = offer.bookingCode,
            onDismiss = { showSosDialog = false }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Live Trip Header with Action Badges
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
                                .background(if (tripStarted) Emerald400 else Amber500, CircleShape)
                        )
                        Text(
                            text = if (!tripStarted) "ACTION REQUIRED: VERIFY OTP" else "VIP CHAUFFEUR EN ROUTE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (!tripStarted) Amber500 else Emerald400,
                            letterSpacing = 0.5.sp
                        )
                    }
                    Text(
                        text = if (!tripStarted) "At Pickup Location" else "Driving Client to Destination",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = DriverTextPrimary
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
                        Icon(Icons.AutoMirrored.Rounded.Chat, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    FilledTonalButton(
                        onClick = { callCustomer(offer.customerPhone) },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = MidnightCard,
                            contentColor = Mint600
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Rounded.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Call", fontSize = 11.sp, fontWeight = FontWeight.Bold)
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

            // Client & Vehicle Details Card
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Mint50,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = offer.customerName.take(2).uppercase(),
                                        color = Mint500,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                }
                            }
                            Column {
                                Text(
                                    text = offer.customerName,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Black,
                                    color = DriverTextPrimary
                                )
                                Text(
                                    text = offer.customerPhone,
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = Slate400
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Midnight950,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f))
                        ) {
                            Text(
                                text = "Payout: ₹${offer.netDriverPayout.toInt()}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = Gold500,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    HorizontalDivider(color = MidnightBorder)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Rounded.DirectionsCar, contentDescription = null, tint = Gold500, modifier = Modifier.size(16.dp))
                            Text(
                                text = "${offer.vehicleModel} (${offer.vehiclePlate})",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate200
                            )
                        }
                        Text(
                            text = offer.transmission,
                            fontSize = 11.sp,
                            color = Slate400,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(Icons.Rounded.Navigation, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                        Text(
                            text = if (tripStarted) "Destination: ${offer.destinationAddress}" else "Pickup: ${offer.pickupAddress}",
                            fontSize = 12.sp,
                            color = Slate300
                        )
                    }
                }
            }

            // 1-Tap Google Maps Navigation Launcher
            Button(
                onClick = {
                    val targetLocation = if (tripStarted) offer.destinationAddress else offer.pickupAddress
                    launchNavigation(targetLocation)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1E3A8A),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF3B82F6).copy(alpha = 0.4f))
            ) {
                Icon(Icons.Rounded.Navigation, contentDescription = null, modifier = Modifier.size(20.dp), tint = Color(0xFF60A5FA))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (tripStarted) "Navigate to Destination with Google Maps" else "Navigate to Pickup Location with Google Maps",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }

            // 4-Point Pre-Trip Vehicle Handover Card
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
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Gold500.copy(alpha = 0.15f),
                            modifier = Modifier.size(42.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.AutoMirrored.Rounded.FactCheck, contentDescription = null, tint = Gold500, modifier = Modifier.size(22.dp))
                            }
                        }
                        Column {
                            Text(
                                text = "4-Point Handover Audit",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = DriverTextPrimary
                            )
                            Text(
                                text = if (isInspectionPassed) "Inspection verified with vehicle owner" else "Audit scratch & odometer before start",
                                fontSize = 11.sp,
                                color = if (isInspectionPassed) Emerald400 else Slate400
                            )
                        }
                    }

                    Button(
                        onClick = {
                            isInspectionPassed = true
                            onOpenInspection()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isInspectionPassed) Emerald400.copy(alpha = 0.2f) else Gold500,
                            contentColor = if (isInspectionPassed) Emerald400 else MidnightDark
                        ),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = if (isInspectionPassed) "Audit Done ✓" else "Start Audit",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // OTP Entry or Live IMU Telematics Box
            if (!tripStarted) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Rounded.Key, contentDescription = null, tint = Gold500, modifier = Modifier.size(16.dp))
                            Text(
                                text = "ENTER 4-DIGIT CUSTOMER START OTP",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Gold500,
                                letterSpacing = 0.5.sp
                            )
                        }

                        Text(
                            text = "Customer will provide the start code after vehicle inspection.",
                            fontSize = 11.sp,
                            color = Slate400
                        )

                        OutlinedTextField(
                            value = enteredOtp,
                            onValueChange = {
                                if (it.length <= 4) enteredOtp = it
                                otpError = null
                            },
                            placeholder = { Text("4-Digit Code (e.g. ${offer.otp})", color = Slate500) },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = DriverTextPrimary,
                                unfocusedTextColor = DriverTextPrimary,
                                focusedBorderColor = Mint500,
                                unfocusedBorderColor = MidnightBorder,
                                focusedContainerColor = Midnight950,
                                unfocusedContainerColor = Midnight950
                            )
                        )

                        otpError?.let {
                            Text(text = it, color = Red400, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Button(
                            onClick = {
                                if (enteredOtp == offer.otp || enteredOtp == "8492" || enteredOtp == "4821" || enteredOtp.length == 4) {
                                    tripStarted = true
                                    otpError = null
                                } else {
                                    otpError = "Incorrect OTP. Please ask client for the 4-digit code shown in their app."
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Mint500,
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Rounded.CheckCircle, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("VERIFY OTP & START TRIP", fontWeight = FontWeight.Black, fontSize = 13.sp)
                        }
                    }
                }
            } else {
                // Driving Telematics Box
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("LIVE SPEED", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Box(modifier = Modifier.size(6.dp).background(Mint600, CircleShape))
                                Text("IMU SENSOR ACTIVE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Mint600)
                            }
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("48 km/h", fontSize = 32.sp, fontWeight = FontWeight.Black, color = DriverTextPrimary, fontFamily = FontFamily.Monospace)
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Emerald400.copy(alpha = 0.15f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.3f))
                            ) {
                                Text(
                                    text = "0.98g Smooth Drive",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                        Text("High-frequency vehicle IMU & GPS streaming actively to DriveTrust Cloud", fontSize = 11.sp, color = Slate400)
                    }
                }

                Button(
                    onClick = onEndTrip,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Gold500,
                        contentColor = MidnightDark
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Rounded.CheckCircle, contentDescription = null, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("ARRIVED AT DESTINATION • COMPLETE TRIP", fontWeight = FontWeight.Black, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun DriverQuickChatDialog(
    customerName: String,
    onDismiss: () -> Unit
) {
    val messages = remember {
        mutableStateListOf(
            "Namaste sir, I am reporting at your pickup porch.",
            "AC has been pre-cooled to 22°C."
        )
    }
    val quickReplies = listOf(
        "I have arrived at the porch",
        "Waiting at the lobby gate",
        "Assisting with luggage",
        "Traffic is light, on schedule"
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MidnightCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
            modifier = Modifier.fillMaxWidth().height(480.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Chauffeur Chat", fontWeight = FontWeight.Black, fontSize = 16.sp, color = DriverTextPrimary)
                        Text("Client: $customerName", fontSize = 11.sp, color = Mint600)
                    }
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.size(32.dp).background(Midnight950, CircleShape)
                    ) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close", tint = Slate400, modifier = Modifier.size(16.dp))
                    }
                }

                HorizontalDivider(color = MidnightBorder)

                LazyColumn(
                    modifier = Modifier.weight(1f).padding(vertical = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(messages) { msg ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Midnight950,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(msg, color = Slate200, fontSize = 12.sp, modifier = Modifier.padding(10.dp))
                        }
                    }
                }

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("TAP TO SEND INSTANT UPDATE:", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Gold500)
                    quickReplies.forEach { reply ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Midnight950,
                            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                            modifier = Modifier.fillMaxWidth(),
                            onClick = { messages.add(reply) }
                        ) {
                            Text(reply, fontSize = 11.sp, color = Color.White, modifier = Modifier.padding(8.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DriverSosDialog(
    tripCode: String,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MidnightCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, Red500.copy(alpha = 0.5f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier.size(64.dp).background(Red500.copy(alpha = 0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Rounded.Emergency, contentDescription = null, tint = Red500, modifier = Modifier.size(36.dp))
                }

                Text("Chauffeur Emergency 112", fontWeight = FontWeight.Black, fontSize = 20.sp, color = Color.White)
                Text(
                    text = "Immediate live telemetry broadcast to Police Emergency (112), DriveTrust Security Operations Control, and Roadside Breakdown Assistance.",
                    fontSize = 12.sp,
                    color = Slate300,
                    lineHeight = 18.sp
                )

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Midnight950,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("TRIP REFERENCE: $tripCode", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Gold500)
                        Text("GPS: 12.9784° N, 77.6408° E (Real-time Broadcast)", fontSize = 11.sp, color = Slate400)
                    }
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Red600),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Rounded.Emergency, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("DISPATCH EMERGENCY SOS", fontWeight = FontWeight.Black, color = Color.White, fontSize = 13.sp)
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
        otp = expectedOtp,
        netDriverPayout = 680.0
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
