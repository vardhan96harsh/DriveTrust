package com.drivetrust.customer.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.*
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
import kotlinx.coroutines.delay

@Composable
fun CustomerBookingScreen(
    customerName: String,
    carModel: String,
    carPlate: String,
    preferredDriverName: String? = null,
    onBookChauffeur: (service: ServiceType, pickup: String, dropoff: String, fare: Double) -> Unit,
    onOpenSafetyCenter: () -> Unit = {},
    onOpenHistory: () -> Unit = {},
    onOpenOffers: () -> Unit = {},
    onOpenFavorites: () -> Unit = {},
    onOpenNotifications: () -> Unit = {},
    onOpenSupport: () -> Unit = {},
    onLogoutClick: () -> Unit
) {
    var selectedService by remember { mutableStateOf(ServiceType.NIGHT_SAFE_DROP) }
    var pickupAddress by remember { mutableStateOf("Vidisha Railway Station Road, Vidisha (M.P.)") }
    var dropoffAddress by remember { mutableStateOf("Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)") }

    // Timing mode
    var isScheduleMode by remember { mutableStateOf(false) }
    var scheduledDate by remember { mutableStateOf("Tomorrow (28 Oct)") }
    var scheduledTime by remember { mutableStateOf("06:30 AM") }
    var showScheduleModal by remember { mutableStateOf(false) }

    // Modals
    var showLocationPickerModal by remember { mutableStateOf(false) }
    var locationPickerTarget by remember { mutableStateOf("PICKUP") }
    var showPricingDetailModal by remember { mutableStateOf(false) }

    // Promo
    var appliedPromoCode by remember { mutableStateOf("WELCOME50") }
    var promoDiscountAmount by remember { mutableStateOf(150.0) }
    var showPromoPickerModal by remember { mutableStateOf(false) }

    // Payment
    var selectedPaymentMethod by remember { mutableStateOf("DT Wallet (Balance: ₹1,240.50)") }
    var selectedPaymentType by remember { mutableStateOf("WALLET") }
    var showPaymentPickerModal by remember { mutableStateOf(false) }
    var showSimulatedPaymentModal by remember { mutableStateOf(false) }
    var isPaymentProcessing by remember { mutableStateOf(false) }
    var simulatedPaymentSuccess by remember { mutableStateOf(false) }

    val popularLandmarks = listOf(
        "Vidisha Railway Station Road, Vidisha (M.P.)",
        "Collectorate Civil Lines, Vidisha (M.P.)",
        "Tilak Chowk / Hospital Rd, Vidisha",
        "Neem Tal Market, Station Rd, Vidisha",
        "Betwa River Ghat / Charans Tirth, Vidisha",
        "Sanchi Stupa Heritage Junction (SH-19)",
        "DB City Mall, MP Nagar Zone-1, Bhopal (M.P.)",
        "Raja Bhoj Airport, VIP Road, Bhopal"
    )

    val distanceKm = remember(pickupAddress, dropoffAddress) {
        val hash = (pickupAddress.hashCode() + dropoffAddress.hashCode()).let { if (it < 0) -it else it }
        val km = 2.5 + (hash % 80) / 10.0
        String.format("%.1f", km)
    }
    val etaMinutes = remember(distanceKm) {
        val mins = (distanceKm.toDoubleOrNull() ?: 3.4) * 2.2 + 2
        mins.toInt()
    }

    val grossFare: Double = remember(selectedService, distanceKm) {
        val dist = distanceKm.toDoubleOrNull() ?: 3.4
        when (selectedService) {
            ServiceType.NIGHT_SAFE_DROP -> {
                val subtotal = 249.0 + (dist * 12.0 * 1.20) + 120.0 + 25.0
                (Math.round(subtotal * 1.05 * 10.0) / 10.0)
            }
            ServiceType.HOURLY_CHAUFFEUR -> {
                val extraKm = if (dist > 20.0) (dist - 20.0) * 11.0 else 0.0
                val subtotal = 399.0 + extraKm + 45.0
                (Math.round(subtotal * 1.05 * 10.0) / 10.0)
            }
            ServiceType.OUTSTATION -> {
                val outstationKm = if (dist < 40.0) 65.0 else dist * 2
                val subtotal = 999.0 + (outstationKm * 10.5) + 300.0 + 80.0
                (Math.round(subtotal * 1.05 * 10.0) / 10.0)
            }
        }
    }

    val finalFare: Double = remember(grossFare, promoDiscountAmount) {
        maxOf(grossFare - promoDiscountAmount, 149.0)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
    ) {
        // Main Scrollable Booking Form
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(bottom = 170.dp) // Space for sticky booking bar + bottom nav
        ) {
            // Top Bar
            CustomerTopAppBar(
                customerName = customerName,
                unreadNotificationCount = 2,
                onOpenNotifications = onOpenNotifications,
                onOpenSupport = onOpenSupport,
                onLogoutClick = onLogoutClick
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Active Vehicle & Chauffeur Guarantee Banner
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
                            Surface(
                                shape = CircleShape,
                                color = Gold500.copy(alpha = 0.15f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                                modifier = Modifier.size(42.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Rounded.DirectionsCar,
                                        contentDescription = "Car",
                                        tint = Gold500,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }
                            Column {
                                Text(
                                    text = carModel,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = CustomerTextPrimary
                                )
                                Text(
                                    text = "$carPlate • Automatic Fleet",
                                    fontSize = 11.sp,
                                    color = CustomerTextSecondary
                                )
                            }
                        }
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MidnightDark,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.VerifiedUser, contentDescription = null, tint = Emerald400, modifier = Modifier.size(12.dp))
                                Text("₹10L Insured", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                // ─────────────────────────────────────────────────────────────
                // STEP 1: ROUTE PICKER (Where to?)
                // ─────────────────────────────────────────────────────────────
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "TRIP ROUTE",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = Gold500,
                                letterSpacing = 1.sp
                            )
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.Timer, contentDescription = null, tint = Emerald400, modifier = Modifier.size(13.dp))
                                Text(
                                    text = "~$distanceKm km • ~$etaMinutes mins ETA",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400
                                )
                            }
                        }

                        // Pickup Row
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .background(Emerald400, CircleShape)
                            )
                            OutlinedTextField(
                                value = pickupAddress,
                                onValueChange = { pickupAddress = it },
                                label = { Text("Pickup Location", color = CustomerTextSecondary, fontSize = 11.sp) },
                                modifier = Modifier.weight(1f),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CustomerTextPrimary),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Mint500,
                                    unfocusedBorderColor = CustomerCardBorderLight,
                                    focusedContainerColor = CustomerWhite,
                                    unfocusedContainerColor = CustomerInnerSurfaceLight
                                ),
                                shape = RoundedCornerShape(10.dp),
                                trailingIcon = {
                                    IconButton(onClick = {
                                        locationPickerTarget = "PICKUP"
                                        showLocationPickerModal = true
                                    }) {
                                        Icon(Icons.Rounded.Search, contentDescription = "Search", tint = Mint500, modifier = Modifier.size(18.dp))
                                    }
                                }
                            )
                        }

                        // Dropoff Row
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .background(Color(0xFFEF4444), RoundedCornerShape(2.dp))
                            )
                            OutlinedTextField(
                                value = dropoffAddress,
                                onValueChange = { dropoffAddress = it },
                                label = { Text("Destination", color = CustomerTextSecondary, fontSize = 11.sp) },
                                modifier = Modifier.weight(1f),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CustomerTextPrimary),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Mint500,
                                    unfocusedBorderColor = CustomerCardBorderLight,
                                    focusedContainerColor = CustomerWhite,
                                    unfocusedContainerColor = CustomerInnerSurfaceLight
                                ),
                                shape = RoundedCornerShape(10.dp),
                                trailingIcon = {
                                    IconButton(onClick = {
                                        locationPickerTarget = "DROPOFF"
                                        showLocationPickerModal = true
                                    }) {
                                        Icon(Icons.Rounded.Search, contentDescription = "Search", tint = Gold500, modifier = Modifier.size(18.dp))
                                    }
                                }
                            )
                        }

                        // Quick Destination Chips
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            val shortNames = listOf(
                                "Station Rd" to "Vidisha Railway Station Road, Vidisha (M.P.)",
                                "Civil Lines" to "Collectorate Civil Lines, Vidisha (M.P.)",
                                "Betwa Ghat" to "Betwa River Ghat / Charans Tirth, Vidisha",
                                "Sanchi Stupa" to "Sanchi Stupa Heritage Junction (SH-19)",
                                "Bhopal Airport" to "Raja Bhoj Airport, VIP Road, Bhopal"
                            )
                            items(shortNames) { (chipLabel, fullAddress) ->
                                Surface(
                                    shape = RoundedCornerShape(20.dp),
                                    color = MidnightDark,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                                    modifier = Modifier.clickable { dropoffAddress = fullAddress }
                                ) {
                                    Text(
                                        text = "+ $chipLabel",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Slate300,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // ─────────────────────────────────────────────────────────────
                // STEP 2: CHOOSE CHAUFFEUR SERVICE PACKAGE
                // ─────────────────────────────────────────────────────────────
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "SELECT CHAUFFEUR PACKAGE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = Gold500,
                        letterSpacing = 1.sp
                    )

                    val services = listOf(
                        Triple(ServiceType.NIGHT_SAFE_DROP, "Night Safe / One-Way", "Late-night safe drop to your doorstep • From ₹249"),
                        Triple(ServiceType.HOURLY_CHAUFFEUR, "Hourly Chauffeur", "Flexible hours, multi-stop business meetings • From ₹399"),
                        Triple(ServiceType.OUTSTATION, "Outstation Highway", "Intercity roundtrip with verified highway expert • From ₹999")
                    )

                    services.forEach { (service, title, desc) ->
                        val isSelected = selectedService == service
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = if (isSelected) MidnightDark else MidnightCard,
                            border = androidx.compose.foundation.BorderStroke(
                                1.5.dp,
                                if (isSelected) Gold500 else MidnightBorder
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedService = service }
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    modifier = Modifier.weight(1f),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = CircleShape,
                                        color = if (isSelected) Gold500.copy(alpha = 0.2f) else MidnightBorder.copy(alpha = 0.3f),
                                        modifier = Modifier.size(36.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Icon(
                                                imageVector = when (service) {
                                                    ServiceType.NIGHT_SAFE_DROP -> Icons.Rounded.Bedtime
                                                    ServiceType.HOURLY_CHAUFFEUR -> Icons.Rounded.AccessTime
                                                    ServiceType.OUTSTATION -> Icons.Rounded.Navigation
                                                },
                                                contentDescription = null,
                                                tint = if (isSelected) Gold500 else Slate400,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }
                                    Column {
                                        Text(
                                            text = title,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = if (isSelected) Color.White else Slate200
                                        )
                                        Text(
                                            text = desc,
                                            fontSize = 11.sp,
                                            color = Slate400,
                                            lineHeight = 15.sp
                                        )
                                    }
                                }

                                Icon(
                                    imageVector = if (isSelected) Icons.Rounded.CheckCircle else Icons.Rounded.RadioButtonUnchecked,
                                    contentDescription = null,
                                    tint = if (isSelected) Gold500 else Slate500,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        }
                    }
                }

                // ─────────────────────────────────────────────────────────────
                // STEP 3: QUICK PREFERENCE CHIPS (Payment, Promo, Timing)
                // ─────────────────────────────────────────────────────────────
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Payment Chip
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { showPaymentPickerModal = true }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Rounded.Payment, contentDescription = null, tint = Gold500, modifier = Modifier.size(16.dp))
                            Column {
                                Text("PAY WITH", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = CustomerTextSecondary)
                                Text(selectedPaymentType, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                            }
                        }
                    }

                    // Promo Chip
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { showPromoPickerModal = true }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Rounded.LocalOffer, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                            Column {
                                Text("PROMO", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Slate400)
                                Text(
                                    if (appliedPromoCode.isNotBlank()) appliedPromoCode else "Add Code",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400
                                )
                            }
                        }
                    }

                    // Schedule Chip
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, if (isScheduleMode) Gold500 else MidnightBorder),
                        modifier = Modifier
                            .weight(1f)
                            .clickable {
                                isScheduleMode = !isScheduleMode
                                if (isScheduleMode) showScheduleModal = true
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(Icons.Rounded.Schedule, contentDescription = null, tint = if (isScheduleMode) Gold500 else Slate400, modifier = Modifier.size(16.dp))
                            Column {
                                Text("TIME", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Slate400)
                                Text(
                                    if (isScheduleMode) scheduledTime else "Now (~8m)",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isScheduleMode) Gold500 else Color.White
                                )
                            }
                        }
                    }
                }

                // Preferred Driver Notice (if assigned)
                if (preferredDriverName != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Rounded.Star, contentDescription = null, tint = Gold500, modifier = Modifier.size(16.dp))
                            Text(
                                text = "Preferred Chauffeur Requested: $preferredDriverName",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Gold500
                            )
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // PERSISTENT FLOATING STICKY BOOKING ACTION BAR
        // Always pinned at bottom right above the bottom navigation bar!
        // ─────────────────────────────────────────────────────────────────────
        Surface(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(bottom = 76.dp) // Sits directly on top of the 5-tab bottom navigation bar
                .padding(horizontal = 14.dp),
            shape = RoundedCornerShape(20.dp),
            color = MidnightCard,
            shadowElevation = 24.dp,
            border = androidx.compose.foundation.BorderStroke(1.5.dp, Gold500.copy(alpha = 0.5f))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Fare Column
                Column(
                    modifier = Modifier
                        .clickable { showPricingDetailModal = true }
                        .padding(end = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = "₹${finalFare.toInt()}",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold500
                        )
                        if (promoDiscountAmount > 0) {
                            Text(
                                text = "₹${grossFare.toInt()}",
                                fontSize = 13.sp,
                                color = Slate400,
                                style = androidx.compose.ui.text.TextStyle(textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough)
                            )
                        }
                    }
                    Text(
                        text = "Price Details ℹ • GST Included",
                        fontSize = 10.sp,
                        color = Slate400
                    )
                }

                // Big Golden "BOOK NOW" Button
                Button(
                    onClick = {
                        if (selectedPaymentType == "CASH") {
                            onBookChauffeur(selectedService, pickupAddress, dropoffAddress, finalFare)
                        } else {
                            showSimulatedPaymentModal = true
                        }
                    },
                    modifier = Modifier
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                    shape = RoundedCornerShape(14.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.DirectionsCar,
                            contentDescription = null,
                            tint = MidnightDark,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = if (isScheduleMode) "CONFIRM SCHEDULE" else "BOOK CHAUFFEUR NOW",
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp,
                            color = MidnightDark,
                            letterSpacing = 0.5.sp
                        )
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowForward,
                            contentDescription = null,
                            tint = MidnightDark,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // MODALS & POPUPS
        // ─────────────────────────────────────────────────────────────────────

        // Modal 1: Landmark & Map Picker
        if (showLocationPickerModal) {
            Dialog(onDismissRequest = { showLocationPickerModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = if (locationPickerTarget == "PICKUP") "Select Pickup Landmark" else "Select Destination Landmark",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary
                        )
                        Text(
                            text = "Vidisha (MP-40) Commercial Chauffeur Network",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )

                        HorizontalDivider(color = CustomerCardBorderLight)

                        popularLandmarks.forEach { landmark ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = CustomerInnerSurfaceLight,
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
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = Mint500, modifier = Modifier.size(16.dp))
                                    Text(landmark, fontSize = 12.sp, color = CustomerTextPrimary, fontWeight = FontWeight.Medium)
                                }
                            }
                        }

                        Button(
                            onClick = { showLocationPickerModal = false },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Done", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Modal 2: Schedule Picker
        if (showScheduleModal) {
            Dialog(onDismissRequest = { showScheduleModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Text("Reserve Advance Chauffeur", fontSize = 16.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                        Text("Chauffeur arrives 10 minutes prior to scheduled time with sanitized uniform", fontSize = 11.sp, color = CustomerTextSecondary)

                        HorizontalDivider(color = CustomerCardBorderLight)

                        val dates = listOf("Today (Immediate)", "Tomorrow (28 Oct)", "Wednesday (29 Oct)", "Weekend Trip")
                        Text("SELECT DATE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Mint500)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(dates) { d ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = if (scheduledDate == d) Mint500 else CustomerInnerSurfaceLight,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                                    modifier = Modifier.clickable { scheduledDate = d }
                                ) {
                                    Text(
                                        text = d,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (scheduledDate == d) Color.White else CustomerTextPrimary,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                    )
                                }
                            }
                        }

                        val times = listOf("06:30 AM", "09:00 AM", "01:30 PM", "06:00 PM", "10:30 PM")
                        Text("SELECT TIME SLOT", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Mint500)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(times) { t ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = if (scheduledTime == t) Mint500 else CustomerInnerSurfaceLight,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                                    modifier = Modifier.clickable { scheduledTime = t }
                                ) {
                                    Text(
                                        text = t,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (scheduledTime == t) Color.White else CustomerTextPrimary,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                    )
                                }
                            }
                        }

                        Button(
                            onClick = {
                                isScheduleMode = true
                                showScheduleModal = false
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Confirm Reservation Slot", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }

        // Modal 3: Promo Picker
        if (showPromoPickerModal) {
            Dialog(onDismissRequest = { showPromoPickerModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = CustomerCardLight,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("Apply Promo Voucher", fontSize = 16.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)

                        val coupons = listOf(
                            Pair("WELCOME50", "₹150 Flat Off on first chauffeur booking"),
                            Pair("DTNIGHT", "₹100 Off on Night Safe Drops"),
                            Pair("HOURLY10", "10% Off on Hourly Chauffeurs"),
                            Pair("CASHBACK20", "20% Wallet Cashback on Outstation")
                        )

                        coupons.forEach { (code, desc) ->
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = CustomerInnerSurfaceLight,
                                border = androidx.compose.foundation.BorderStroke(1.dp, if (appliedPromoCode == code) Mint500 else CustomerCardBorderLight),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        appliedPromoCode = code
                                        promoDiscountAmount = when (code) {
                                            "WELCOME50" -> 150.0
                                            "DTNIGHT" -> 100.0
                                            "HOURLY10" -> 120.0
                                            else -> 200.0
                                        }
                                        showPromoPickerModal = false
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(code, fontWeight = FontWeight.Black, fontSize = 13.sp, color = Mint500)
                                        Text(desc, fontSize = 11.sp, color = CustomerTextSecondary)
                                    }
                                    Text(if (appliedPromoCode == code) "Active ✓" else "Apply", color = Mint500, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                            }
                        }

                        Button(
                            onClick = { showPromoPickerModal = false },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                        ) {
                            Text("Close", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Modal 4: Payment Selector
        if (showPaymentPickerModal) {
            Dialog(onDismissRequest = { showPaymentPickerModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("Select Payment Method", fontSize = 16.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)

                        val paymentOptions = listOf(
                            Triple("WALLET", "DT Wallet (Balance: ₹1,240.50)", "Instant one-tap deduction"),
                            Triple("UPI", "Instant UPI / QR Code", "GPay, PhonePe, Paytm, BHIM"),
                            Triple("CASH", "Cash to Chauffeur", "Pay chauffeur directly after trip end"),
                            Triple("CORP", "Corporate Direct Billing", "Charge to verified company account")
                        )

                        paymentOptions.forEach { (type, label, sub) ->
                            val isSelected = selectedPaymentType == type
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = CustomerInnerSurfaceLight,
                                border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) Mint500 else CustomerCardBorderLight),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedPaymentType = type
                                        selectedPaymentMethod = label
                                        showPaymentPickerModal = false
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(label, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = CustomerTextPrimary)
                                        Text(sub, fontSize = 10.sp, color = CustomerTextSecondary)
                                    }
                                    if (isSelected) {
                                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Mint500, modifier = Modifier.size(18.dp))
                                    }
                                }
                            }
                        }

                        Button(
                            onClick = { showPaymentPickerModal = false },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                        ) {
                            Text("Cancel", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Modal 5: Simulated Payment Sandbox
        if (showSimulatedPaymentModal) {
            Dialog(onDismissRequest = { if (!isPaymentProcessing) showSimulatedPaymentModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Gold500.copy(alpha = 0.15f),
                            modifier = Modifier.size(56.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Rounded.Shield, contentDescription = null, tint = Gold500, modifier = Modifier.size(28.dp))
                            }
                        }

                        Text("Payment Authorization", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                        Text("Simulated Bank Gateway • Amount: ₹${finalFare.toInt()}.00", fontSize = 12.sp, color = CustomerTextSecondary)

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("METHOD: $selectedPaymentMethod", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Mint500)
                                Text("REF: TXN-${(100000..999999).random()}", fontSize = 10.sp, color = CustomerTextSecondary)
                            }
                        }

                        if (isPaymentProcessing) {
                            CircularProgressIndicator(color = Mint500, modifier = Modifier.size(36.dp))
                            Text("Authorizing sandbox transaction...", fontSize = 12.sp, color = Mint500, fontWeight = FontWeight.Bold)
                        } else if (simulatedPaymentSuccess) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Mint500, modifier = Modifier.size(20.dp))
                                Text("Payment Authorized!", color = Mint500, fontWeight = FontWeight.Black, fontSize = 14.sp)
                            }
                        } else {
                            Button(
                                onClick = { isPaymentProcessing = true },
                                modifier = Modifier.fillMaxWidth().height(48.dp),
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                            ) {
                                Text("AUTHORIZE PAYMENT (₹${finalFare.toInt()})", fontWeight = FontWeight.Black, color = Color.White)
                            }
                        }

                        LaunchedEffect(isPaymentProcessing) {
                            if (isPaymentProcessing) {
                                delay(1200)
                                isPaymentProcessing = false
                                simulatedPaymentSuccess = true
                                delay(800)
                                showSimulatedPaymentModal = false
                                onBookChauffeur(selectedService, pickupAddress, dropoffAddress, finalFare)
                            }
                        }
                    }
                }
            }
        }

        // Modal 6: Detailed Pricing Breakdown
        if (showPricingDetailModal) {
            Dialog(onDismissRequest = { showPricingDetailModal = false }) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = CustomerCardLight,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
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
                                Text("Pricing Breakdown", fontSize = 16.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                                Text("Vidisha (MP-40) Chauffeur Matrix", fontSize = 11.sp, color = CustomerTextSecondary)
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Mint50,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f))
                            ) {
                                Text("Zero Hidden Fees", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Mint500, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                            }
                        }

                        HorizontalDivider(color = CustomerCardBorderLight)

                        val driverPayout = Math.round(finalFare * 0.80)
                        val platformTake = Math.round(finalFare * 0.20)

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Base Chauffeur Package", fontSize = 12.sp, color = CustomerTextSecondary)
                                Text("₹${grossFare.toInt()}.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                            }
                            if (promoDiscountAmount > 0) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Promo Discount ($appliedPromoCode)", fontSize = 12.sp, color = Mint500, fontWeight = FontWeight.Bold)
                                    Text("-₹${promoDiscountAmount.toInt()}.00", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Mint500)
                                }
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Transit Guarantee (₹10L Policy)", fontSize = 12.sp, color = Mint500)
                                Text("₹0.00 (Included)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Mint500)
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("GST (5%)", fontSize = 12.sp, color = CustomerTextSecondary)
                                Text("Included", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                            }
                        }

                        HorizontalDivider(color = CustomerCardBorderLight)

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("TOTAL NET BILL", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Mint500)
                                    Text("₹${finalFare.toInt()}.00", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Mint500)
                                }
                                Text("All-inclusive", fontSize = 10.sp, color = CustomerTextSecondary)
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text("Chauffeur Net Payout: ₹$driverPayout.00 (80%)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Mint500)
                                Text("Platform Take-Rate: ₹$platformTake.00 (20%)", fontSize = 10.sp, color = CustomerTextSecondary)
                            }
                        }

                        Button(
                            onClick = { showPricingDetailModal = false },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Close Breakdown", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }
    }
}
