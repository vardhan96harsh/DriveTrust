package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
            .background(Slate50)
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
                    .size(60.dp)
                    .background(Emerald50, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "✓", color = Emerald600, fontSize = 28.sp, fontWeight = FontWeight.Black)
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Trip Completed Safely",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )
                Text(
                    text = "Thank you for riding with DriveTrust Ultra",
                    fontSize = 12.sp,
                    color = Slate500
                )
            }

            // Star Rating Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "RATE CHAUFFEUR ${booking.assignedDriverName.uppercase()}",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        (1..5).forEach { star ->
                            TextButton(
                                onClick = { rating = star },
                                contentPadding = PaddingValues(4.dp)
                            ) {
                                Text(
                                    text = if (star <= rating) "★" else "☆",
                                    fontSize = 28.sp,
                                    color = if (star <= rating) Amber600 else Slate400
                                )
                            }
                        }
                    }

                    Text(
                        text = when (rating) {
                            5 -> "★★★★★ Exceptional Driving & Conduct"
                            4 -> "★★★★☆ Very Good Service"
                            3 -> "★★★☆☆ Average Trip Experience"
                            2 -> "★★☆☆☆ Below Expectations"
                            else -> "★☆☆☆☆ Poor Experience"
                        },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate700
                    )
                }
            }

            // Gratuity Tip Card
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
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "CHAUFFEUR GRATUITY TIP",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate500
                        )
                        if (tipAmount > 0) {
                            Text(
                                text = "+₹$tipAmount credited",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald600
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
                                color = if (isSelected) Slate900 else Slate100,
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
                                        color = if (isSelected) Color.White else Slate700
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
                color = if (isFavorite) Red50 else Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, if (isFavorite) Red600.copy(alpha = 0.3f) else Slate200),
                modifier = Modifier.fillMaxWidth(),
                onClick = { isFavorite = !isFavorite }
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isFavorite) "❤️ Saved to Favorite Chauffeurs" else "🤍 Add to Favorite Chauffeurs",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isFavorite) Red600 else Slate700
                    )
                }
            }

            // Receipt Breakdown
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
                        Text("Vehicle Driven:", fontSize = 12.sp, color = Slate500)
                        Text("${booking.vehicleModel} (${booking.vehiclePlate})", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Total Billed:", fontSize = 12.sp, color = Slate500)
                        Text("₹${(booking.estimatedFare + tipAmount).toInt()}.00", fontSize = 15.sp, fontWeight = FontWeight.Black, color = Slate900)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Payment Status:", fontSize = 12.sp, color = Slate500)
                        Text("Auto-Debited via UPI (Instant)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                    }
                }
            }

            Button(
                onClick = onBookAnotherRide,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("Book Another Chauffeur Ride", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }
    }
}
