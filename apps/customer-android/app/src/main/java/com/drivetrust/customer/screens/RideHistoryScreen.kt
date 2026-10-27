package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
import com.drivetrust.customer.data.PastRideRecord
import com.drivetrust.customer.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerRideHistoryScreen(
    pastRides: List<PastRideRecord>,
    onBack: () -> Unit,
    onDownloadInvoice: (PastRideRecord) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            "Completed Chauffeur Journeys",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            "${pastRides.size} verified trip invoices available",
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .padding(start = 8.dp)
                            .size(36.dp)
                            .background(MidnightCard, CircleShape)
                            .border(1.dp, MidnightBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MidnightDark)
            )
        },
        containerColor = Slate900
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(pastRides) { ride ->
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Surface(
                                    color = Gold500.copy(alpha = 0.15f),
                                    border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.4f)),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        ride.serviceType,
                                        color = Gold400,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                        letterSpacing = 0.5.sp
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(ride.date, fontSize = 11.sp, color = Slate400)
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("₹${ride.fare.toInt()}", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color.White)
                                if (ride.tip > 0) {
                                    Text("+₹${ride.tip.toInt()} Tip", fontSize = 11.sp, color = Gold400, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = MidnightBorder)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Chauffeur: ", fontSize = 12.sp, color = Slate400)
                            Text(ride.driverName, fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Spacer(modifier = Modifier.width(8.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Gold500.copy(alpha = 0.15f)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Star,
                                        contentDescription = "Rating",
                                        tint = Gold400,
                                        modifier = Modifier.size(10.dp)
                                    )
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text("${ride.driverRating}", fontSize = 10.sp, color = Gold400, fontWeight = FontWeight.Black)
                                }
                            }
                        }

                        Text("Car: ${ride.vehicleModel}", fontSize = 12.sp, color = Slate300, modifier = Modifier.padding(top = 2.dp))

                        Spacer(modifier = Modifier.height(8.dp))
                        Text("• Pickup: ${ride.pickup}", fontSize = 11.sp, color = Slate400)
                        Text("• Dropoff: ${ride.dropoff}", fontSize = 11.sp, color = Slate400)

                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "CODE: #${ride.bookingCode}",
                                fontSize = 10.sp,
                                color = Slate500,
                                fontWeight = FontWeight.Bold
                            )

                            OutlinedButton(
                                onClick = { onDownloadInvoice(ride) },
                                shape = RoundedCornerShape(8.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.5f)),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Gold400),
                                modifier = Modifier.height(34.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Download,
                                        contentDescription = "Invoice",
                                        tint = Gold400,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Text("Download GST Bill", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
