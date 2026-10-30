package com.drivetrust.customer.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.components.CustomerTopAppBar
import com.drivetrust.customer.model.TripBooking
import com.drivetrust.customer.theme.*

@Composable
fun CustomerCompletedRatingScreen(
    booking: TripBooking,
    onBookAnotherRide: () -> Unit,
    onLogoutClick: () -> Unit
) {
    var rating by remember { mutableStateOf(5) }
    var tipAmount by remember { mutableStateOf(0) }
    var isFavorite by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
    ) {
        CustomerTopAppBar(customerName = booking.customerName, onLogoutClick = onLogoutClick)

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(68.dp)
                    .background(Mint50, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Rounded.CheckCircle,
                    contentDescription = null,
                    tint = Mint600,
                    modifier = Modifier.size(40.dp)
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Trip Completed Safely",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = CustomerTextPrimary
                )
                Text(
                    text = "Thank you for riding with DriveTrust Ultra Chauffeur",
                    fontSize = 12.sp,
                    color = CustomerTextSecondary
                )
            }

            // Star Rating Card
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "RATE CHAUFFEUR ${booking.assignedDriverName.uppercase()}",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Gold600,
                        letterSpacing = 1.sp
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        (1..5).forEach { star ->
                            IconButton(
                                onClick = { rating = star },
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    imageVector = if (star <= rating) Icons.Rounded.Star else Icons.Rounded.StarBorder,
                                    contentDescription = "$star Stars",
                                    tint = if (star <= rating) Gold500 else Slate400,
                                    modifier = Modifier.size(32.dp)
                                )
                            }
                        }
                    }

                    Text(
                        text = when (rating) {
                            5 -> "Exceptional Chauffeur Conduct & Smooth Ride"
                            4 -> "Very Good Professional Service"
                            3 -> "Standard Ride Experience"
                            2 -> "Below Luxury Expectation"
                            else -> "Unsatisfactory Experience"
                        },
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (rating >= 4) Gold600 else CustomerTextSecondary
                    )
                }
            }

            // Gratuity Tip Card
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "CHAUFFEUR GRATUITY TIP",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CustomerTextSecondary,
                            letterSpacing = 0.5.sp
                        )
                        if (tipAmount > 0) {
                            Text(
                                text = "+₹$tipAmount credited",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Mint600
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(0, 50, 100, 200).forEach { amt ->
                            val isSelected = amt == tipAmount
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (isSelected) Mint50 else CustomerInnerSurfaceLight,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) Mint500 else CustomerCardBorderLight
                                ),
                                modifier = Modifier.weight(1f),
                                onClick = { tipAmount = amt }
                            ) {
                                Box(
                                    contentAlignment = Alignment.Center,
                                    modifier = Modifier.padding(vertical = 10.dp)
                                ) {
                                    Text(
                                        text = if (amt == 0) "No Tip" else "₹$amt",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Mint600 else CustomerTextPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Favorite Chauffeur Bookmark Button
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = if (isFavorite) Red500.copy(alpha = 0.1f) else CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isFavorite) Red500.copy(alpha = 0.35f) else CustomerCardBorderLight
                ),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth(),
                onClick = { isFavorite = !isFavorite }
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (isFavorite) Icons.Rounded.Favorite else Icons.Rounded.FavoriteBorder,
                        contentDescription = null,
                        tint = if (isFavorite) Red500 else CustomerTextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isFavorite) "Saved to Favorite Chauffeurs" else "Add to Favorite Chauffeurs",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isFavorite) Red600 else CustomerTextPrimary
                    )
                }
            }

            // Receipt Breakdown
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Vehicle Driven:", fontSize = 12.sp, color = CustomerTextSecondary)
                        Text(
                            "${booking.vehicleModel} (${booking.vehiclePlate})",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = CustomerTextPrimary
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Total Billed:", fontSize = 12.sp, color = CustomerTextSecondary)
                        Text(
                            "₹${(booking.estimatedFare + tipAmount).toInt()}.00",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold600
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Payment Status:", fontSize = 12.sp, color = CustomerTextSecondary)
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                Icons.Rounded.CheckCircle,
                                contentDescription = null,
                                tint = Mint600,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                "Auto-Debited via UPI (Instant)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Mint600
                            )
                        }
                    }
                }
            }

            Button(
                onClick = onBookAnotherRide,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Mint500,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    Icons.Rounded.DirectionsCar,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Book Another Chauffeur Ride", fontWeight = FontWeight.Black, fontSize = 14.sp)
            }
        }
    }
}
