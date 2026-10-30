package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.theme.*

data class PromoOffer(
    val code: String,
    val title: String,
    val discountDescription: String,
    val discountPercent: Int? = null,
    val flatDiscount: Double? = null,
    val maxDiscount: Double = 150.0,
    val validTill: String,
    val minOrder: Double = 299.0,
    val applicableService: String = "All Chauffeur Services",
    val isHot: Boolean = false
)

@Composable
fun CustomerOffersScreen(
    onBack: () -> Unit,
    onApplyPromo: (PromoOffer) -> Unit = {}
) {
    var promoInput by remember { mutableStateOf("") }
    var inputError by remember { mutableStateOf<String?>(null) }
    var appliedCodeFeedback by remember { mutableStateOf<String?>(null) }

    val offers = remember {
        listOf(
            PromoOffer(
                code = "WELCOME50",
                title = "New Passenger Welcome",
                discountDescription = "50% OFF up to ₹150 on your first verified chauffeur booking",
                discountPercent = 50,
                maxDiscount = 150.0,
                validTill = "Valid till 31 Nov 2026",
                minOrder = 249.0,
                isHot = true
            ),
            PromoOffer(
                code = "DTNIGHT",
                title = "Night Safe-Drop Privilege",
                discountDescription = "Flat ₹100 OFF on safe drop between 10 PM and 5 AM",
                flatDiscount = 100.0,
                maxDiscount = 100.0,
                validTill = "Valid till 15 Nov 2026",
                minOrder = 400.0,
                applicableService = "Night Safe-Drop",
                isHot = true
            ),
            PromoOffer(
                code = "HOURLY10",
                title = "Multi-Hour Savings",
                discountDescription = "10% OFF on Hourly Chauffeur packages (Vidisha & Bhopal)",
                discountPercent = 10,
                maxDiscount = 250.0,
                validTill = "Valid till 31 Dec 2026",
                minOrder = 500.0,
                applicableService = "Hourly Chauffeur"
            ),
            PromoOffer(
                code = "CASHBACK20",
                title = "Wallet Cashback Fest",
                discountDescription = "Get 20% instant cashback credited to your DT Wallet",
                discountPercent = 20,
                maxDiscount = 200.0,
                validTill = "Valid this weekend",
                minOrder = 349.0
            ),
            PromoOffer(
                code = "OUTSTATION500",
                title = "Weekend Getaway Outstation",
                discountDescription = "Flat ₹250 OFF on 1-day or multi-day outstation bookings",
                flatDiscount = 250.0,
                maxDiscount = 250.0,
                validTill = "Valid till 10 Dec 2026",
                minOrder = 1499.0,
                applicableService = "Outstation Trip"
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
    ) {
        // Luxury Top App Bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = CustomerBackgroundLight,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .size(38.dp)
                            .background(CustomerWhite, androidx.compose.foundation.shape.CircleShape)
                            .border(1.dp, CustomerCardBorderLight, androidx.compose.foundation.shape.CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = CustomerTextPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "Privileges & Offers",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Exclusive vouchers on verified chauffeur rides",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )
                    }
                }
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            // Manual coupon code input box
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("HAVE AN EXECUTIVE PROMO CODE?", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold600, letterSpacing = 0.8.sp)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = promoInput,
                                onValueChange = {
                                    promoInput = it.uppercase().trim()
                                    inputError = null
                                },
                                placeholder = { Text("e.g. WELCOME50", fontSize = 12.sp, color = CustomerTextSecondary) },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp),
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Mint500,
                                    unfocusedBorderColor = CustomerCardBorderLight,
                                    focusedTextColor = CustomerTextPrimary,
                                    unfocusedTextColor = CustomerTextPrimary,
                                    focusedContainerColor = CustomerInnerSurfaceLight,
                                    unfocusedContainerColor = CustomerInnerSurfaceLight
                                )
                            )
                            Button(
                                onClick = {
                                    val matched = offers.firstOrNull { it.code.equals(promoInput, ignoreCase = true) }
                                    if (matched != null) {
                                        appliedCodeFeedback = "Applied '${matched.code}' successfully!"
                                        onApplyPromo(matched)
                                    } else if (promoInput.isNotBlank()) {
                                        inputError = "Invalid promo code. Please select from offers below."
                                    }
                                },
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                                modifier = Modifier.height(52.dp)
                            ) {
                                Text("APPLY", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color.White)
                            }
                        }

                        if (inputError != null) {
                            Text(inputError!!, fontSize = 11.sp, color = Red600, fontWeight = FontWeight.SemiBold)
                        }
                        if (appliedCodeFeedback != null) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.CheckCircle,
                                    contentDescription = "Success",
                                    tint = Mint600,
                                    modifier = Modifier.size(14.dp)
                                )
                                Text(appliedCodeFeedback!!, fontSize = 12.sp, color = Mint600, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Offers Section Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("ACTIVE PRIVILEGE VOUCHERS (${offers.size})", fontSize = 10.sp, fontWeight = FontWeight.Black, color = CustomerTextSecondary, letterSpacing = 0.8.sp)
                    Text("Tap to Apply", fontSize = 11.sp, color = Mint600, fontWeight = FontWeight.Bold)
                }
            }

            // Offers List
            items(offers, key = { it.code }) { offer ->
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (offer.isHot) Mint500.copy(alpha = 0.5f) else CustomerCardBorderLight
                    ),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = CustomerInnerSurfaceLight,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f))
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Rounded.ConfirmationNumber,
                                            contentDescription = "Coupon",
                                            tint = Gold600,
                                            modifier = Modifier.size(13.dp)
                                        )
                                        Text(
                                            text = offer.code,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Gold600,
                                            letterSpacing = 0.5.sp
                                        )
                                    }
                                }

                                if (offer.isHot) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = Gold50.copy(alpha = 0.9f),
                                        border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.4f))
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                            horizontalArrangement = Arrangement.spacedBy(3.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Rounded.Whatshot,
                                                contentDescription = "Popular",
                                                tint = Gold600,
                                                modifier = Modifier.size(11.dp)
                                            )
                                            Text(
                                                text = "POPULAR",
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Black,
                                                color = Gold600
                                            )
                                        }
                                    }
                                }
                            }

                            Button(
                                onClick = {
                                    appliedCodeFeedback = "Applied '${offer.code}'!"
                                    onApplyPromo(offer)
                                },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = if (offer.isHot) Mint500 else CustomerInnerSurfaceLight),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    "APPLY",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (offer.isHot) Color.White else CustomerTextPrimary
                                )
                            }
                        }

                        Text(
                            text = offer.title,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary
                        )

                        Text(
                            text = offer.discountDescription,
                            fontSize = 12.sp,
                            color = CustomerTextSecondary,
                            lineHeight = 16.sp
                        )

                        HorizontalDivider(color = CustomerCardBorderLight)

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Min Order: ₹${offer.minOrder.toInt()} • ${offer.applicableService}",
                                fontSize = 10.sp,
                                color = CustomerTextSecondary
                            )
                            Text(
                                text = offer.validTill,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Gold600
                            )
                        }
                    }
                }
            }
        }
    }
}
