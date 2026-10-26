package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.components.CustomerTopAppBar
import com.drivetrust.customer.model.ServiceType
import com.drivetrust.customer.theme.*

@Composable
fun CustomerBookingScreen(
    customerName: String,
    carModel: String,
    carPlate: String,
    onBookChauffeur: (service: ServiceType, pickup: String, dropoff: String, fare: Double) -> Unit,
    onOpenSafetyCenter: () -> Unit = {},
    onOpenHistory: () -> Unit = {},
    onLogoutClick: () -> Unit
) {
    var selectedService by remember { mutableStateOf(ServiceType.NIGHT_SAFE_DROP) }
    var pickupAddress by remember { mutableStateOf("Vidisha Railway Station Road, Vidisha (M.P.)") }
    var dropoffAddress by remember { mutableStateOf("Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)") }
    var reportingTime by remember { mutableStateOf("Now (ETA ~8 mins)") }

    var showLocationPickerModal by remember { mutableStateOf(false) }
    var locationPickerTarget by remember { mutableStateOf("PICKUP") }
    var showPricingDetailModal by remember { mutableStateOf(false) }

    val vidishaLandmarks = listOf(
        "Vidisha Railway Station Road, Vidisha (M.P.)",
        "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)",
        "Neem Tal Market, Station Rd, Vidisha",
        "Tilak Chowk / Civil Hospital Rd, Vidisha",
        "Betwa River Ghat / Charans Tirth, Vidisha",
        "Sanchi Stupa Heritage Junction (SH-19)",
        "DB City Mall, MP Nagar Zone-1, Bhopal (M.P.)",
        "Raja Bhoj International Airport, VIP Road, Bhopal"
    )

    val distanceKm = remember(pickupLocation, dropLocation) {
        val hash = (pickupLocation.hashCode() + dropLocation.hashCode()).let { if (it < 0) -it else it }
        val km = 2.5 + (hash % 80) / 10.0
        String.format("%.1f", km)
    }
    val etaMinutes = remember(distanceKm) {
        val mins = (distanceKm.toDoubleOrNull() ?: 3.4) * 2.2 + 2
        mins.toInt()
    }

    val fare = remember(selectedService, distanceKm) {
        val dist = distanceKm.toDoubleOrNull() ?: 3.4
        when (selectedService) {
            ServiceType.NIGHT_SAFE_DROP -> {
                val subtotal = 249.0 + (dist * 12.0 * 1.20) + 120.0 + 25.0
                Math.round(subtotal * 1.05 * 10.0) / 10.0
            }
            ServiceType.HOURLY_CHAUFFEUR -> {
                val extraKm = if (dist > 20.0) (dist - 20.0) * 11.0 else 0.0
                val subtotal = 299.0 + extraKm + 25.0
                Math.round(subtotal * 1.05 * 10.0) / 10.0
            }
            ServiceType.OUTSTATION -> 1799.0
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        CustomerTopAppBar(
            customerName = customerName,
            onLogoutClick = onLogoutClick
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Selected Vehicle Garage Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Slate900,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "ASSIGNED GARAGE VEHICLE",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate400
                        )
                        Text(
                            text = carModel,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = carPlate,
                            fontSize = 11.sp,
                            color = Emerald500,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Slate800
                    ) {
                        Text(
                            text = "AUTOMATIC",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            // Quick Actions: Safety Center & Past Invoices
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenSafetyCenter,
                    modifier = Modifier.weight(1f).height(40.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFDC2626))
                ) {
                    Text("🛡️ Safety Shield", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onOpenHistory,
                    modifier = Modifier.weight(1f).height(40.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF0284C7))
                ) {
                    Text("📜 Past Invoices", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Service Mode Selector
            Text(
                text = "SELECT CHAUFFEUR SERVICE",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Slate500
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ServiceType.values().forEach { svc ->
                    val isSelected = svc == selectedService
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (isSelected) Slate900 else Color.White,
                        border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) Slate900 else Slate200),
                        modifier = Modifier.weight(1f),
                        onClick = { selectedService = svc }
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = svc.label,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Slate900
                            )
                            Text(
                                text = "₹${svc.baseRate.toInt()}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black,
                                color = if (isSelected) Emerald500 else Slate700
                            )
                        }
                    }
                }
            }

            // Addresses Box with Pick on Map Controls
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Pickup Address Row
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "PICKUP LOCATION",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald600
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Emerald50,
                                modifier = Modifier.clickable {
                                    locationPickerTarget = "PICKUP"
                                    showLocationPickerModal = true
                                }
                            ) {
                                Text(
                                    text = "📍 Pick on Map",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald600,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }
                        OutlinedTextField(
                            value = pickupAddress,
                            onValueChange = { pickupAddress = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        )
                    }

                    // Destination Address Row
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "DESTINATION",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Red600
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color(0xFFFEF2F2),
                                modifier = Modifier.clickable {
                                    locationPickerTarget = "DROPOFF"
                                    showLocationPickerModal = true
                                }
                            ) {
                                Text(
                                    text = "🎯 Pick on Map",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Red600,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }
                        OutlinedTextField(
                            value = dropoffAddress,
                            onValueChange = { dropoffAddress = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp)
                        )
                    }

                    // Live Route Distance & Time Indicator
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "🛣️ Distance: ~$distanceKm km",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Slate600
                        )
                        Text(
                            text = "⏱️ Chauffeur ETA: ~$etaMinutes mins",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Slate600
                        )
                    }
                }
            }

            // Detailed Pricing Breakdown Trigger Card
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Slate900,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showPricingDetailModal = true }
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "ESTIMATED TOTAL FARE",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate400
                        )
                        Text(
                            text = "₹${fare.toInt()}.00",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Emerald500
                        )
                        Text(
                            text = "Vidisha (MP-40) Matrix • All-inclusive",
                            fontSize = 10.sp,
                            color = Slate300
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Emerald500
                    ) {
                        Text(
                            text = "Price in Detail ℹ️",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate900,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            // Strict Admin Verification Guarantee Notice
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Emerald50,
                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "🛡️", fontSize = 20.sp)
                    Column {
                        Text(
                            text = "100% ADMIN-VERIFIED CHAUFFEURS ONLY",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Emerald600
                        )
                        Text(
                            text = "Unverified drivers are strictly locked out by the Admin KYC Vault. All drivers cleared via MoRTH Sarathi & Police background audit.",
                            fontSize = 11.sp,
                            color = Slate700
                        )
                    }
                }
            }

            // Booking Button
            Button(
                onClick = {
                    onBookChauffeur(selectedService, pickupAddress, dropoffAddress, fare)
                },
                modifier = Modifier.fillMaxWidth().height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "REQUEST VERIFIED CHAUFFEUR",
                        fontWeight = FontWeight.Black,
                        fontSize = 13.sp,
                        color = Color.White
                    )
                    Text(
                        text = "₹${fare.toInt()}.00",
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp,
                        color = Emerald500
                    )
                }
            }
        }
    }

    // Modal 1: Interactive Location Picker
    if (showLocationPickerModal) {
        Dialog(onDismissRequest = { showLocationPickerModal = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color.White,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = if (locationPickerTarget == "PICKUP") "📍 Pick Pickup Location on Map" else "🎯 Pick Destination on Map",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        text = "Tap a verified landmark in Vidisha / Bhopal or enter custom street:",
                        fontSize = 11.sp,
                        color = Slate600
                    )

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 280.dp)
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        vidishaLandmarks.forEach { landmark ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Slate50,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        if (locationPickerTarget == "PICKUP") {
                                            pickupAddress = landmark
                                        } else {
                                            dropoffAddress = landmark
                                        }
                                        showLocationPickerModal = false
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("📍 ", fontSize = 13.sp)
                                    Text(
                                        text = landmark,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Slate900
                                    )
                                }
                            }
                        }
                    }

                    Button(
                        onClick = { showLocationPickerModal = false },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Confirm Selection", fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
    }

    // Modal 2: Detailed Pricing Breakdown
    if (showPricingDetailModal) {
        Dialog(onDismissRequest = { showPricingDetailModal = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Color.White,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Pricing in Detail",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = Slate900
                            )
                            Text(
                                text = "Vidisha (MP-40) Matrix • Itemized Ledger",
                                fontSize = 11.sp,
                                color = Slate500
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = Emerald50
                        ) {
                            Text(
                                text = "Zero Hidden Fees",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald600,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    HorizontalDivider(color = Slate200)

                    val driverPayout = Math.round(fare * 0.80)
                    val platformTake = Math.round(fare * 0.20)

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        when (selectedService) {
                            ServiceType.HOURLY_CHAUFFEUR -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Base 2-Hour Chauffeur Package", fontSize = 12.sp, color = Slate600)
                                    Text("₹299.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Convenience & Dispatch Fee", fontSize = 12.sp, color = Slate600)
                                    Text("₹25.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Transit Guarantee (₹10L Policy)", fontSize = 12.sp, color = Emerald600)
                                    Text("₹0.00 (Free)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("GST (5%)", fontSize = 12.sp, color = Slate600)
                                    Text("₹25.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                            }
                            ServiceType.NIGHT_SAFE_DROP -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Base Chauffeur Fare", fontSize = 12.sp, color = Slate600)
                                    Text("₹249.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Distance Surcharge (~3.4 km)", fontSize = 12.sp, color = Slate600)
                                    Text("₹41.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Night Surge Multiplier (1.20x)", fontSize = 12.sp, color = Color(0xFFB45309))
                                    Text("₹58.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB45309))
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Chauffeur Return Allowance", fontSize = 12.sp, color = Color(0xFF1D4ED8))
                                    Text("₹120.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1D4ED8))
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Transit Guarantee (₹10L Policy)", fontSize = 12.sp, color = Emerald600)
                                    Text("₹0.00 (Free)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Convenience Fee & GST (5%)", fontSize = 12.sp, color = Slate600)
                                    Text("₹72.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                            }
                            ServiceType.OUTSTATION -> {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("1-Day Outstation Rate (250 km included)", fontSize = 12.sp, color = Slate600)
                                    Text("₹1499.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Chauffeur Food & Stay Allowance", fontSize = 12.sp, color = Color(0xFF1D4ED8))
                                    Text("₹200.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1D4ED8))
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Transit Guarantee (₹10L Policy)", fontSize = 12.sp, color = Emerald600)
                                    Text("₹0.00 (Free)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                                }
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Convenience Fee & GST (5%)", fontSize = 12.sp, color = Slate600)
                                    Text("₹100.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                }
                            }
                        }
                    }

                    HorizontalDivider(color = Slate200)

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Slate900,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("TOTAL CUSTOMER BILL", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                                Text("₹${fare.toInt()}.00", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Emerald500)
                            }
                            Text("All-inclusive", fontSize = 10.sp, color = Slate300)
                        }
                    }

                    // Payout Split Transparency
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Emerald50,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("Chauffeur Net Payout: ₹$driverPayout.00 (85%)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            Text("Platform Take-Rate: ₹$platformTake.00 (15%)", fontSize = 10.sp, color = Slate600)
                        }
                    }

                    Button(
                        onClick = { showPricingDetailModal = false },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Close Breakdown", fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
    }
}
