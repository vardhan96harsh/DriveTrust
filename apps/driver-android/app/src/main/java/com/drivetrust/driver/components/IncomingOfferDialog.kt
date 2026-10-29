package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.DirectionsCar
import androidx.compose.material.icons.rounded.Navigation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.driver.model.RideOffer
import com.drivetrust.driver.theme.*

@Composable
fun IncomingOfferDialog(
    offer: RideOffer,
    onAccept: () -> Unit,
    onDecline: () -> Unit
) {
    var countdown by remember { mutableStateOf(offer.countdownSeconds) }

    LaunchedEffect(Unit) {
        while (countdown > 0) {
            kotlinx.coroutines.delay(1000)
            countdown--
        }
        if (countdown == 0) {
            onDecline()
        }
    }

    Dialog(onDismissRequest = onDecline) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MidnightCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.6f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Gold500.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f))
                    ) {
                        Text(
                            text = "NEW CHAUFFEUR DISPATCH",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold500,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    IconButton(
                        onClick = onDecline,
                        modifier = Modifier
                            .size(32.dp)
                            .background(Midnight950, CircleShape)
                    ) {
                        Icon(
                            Icons.Rounded.Close,
                            contentDescription = "Decline",
                            tint = Slate400,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                // Circular Countdown Ring
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(Mint50, CircleShape)
                        .border(
                            2.dp,
                            if (countdown <= 10) Red500 else Mint500,
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${countdown}s",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = if (countdown <= 10) Red500 else DriverTextPrimary
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "₹${offer.netDriverPayout.toInt()}.00",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = Mint600
                    )
                    Text(
                        text = "Net Partner Payout (80% + Travel Allowance)",
                        fontSize = 11.sp,
                        color = DriverTextSecondary
                    )
                }

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Midnight950,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
                            Text("Customer: ${offer.customerName}", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = DriverTextPrimary)
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = MidnightCard,
                                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                            ) {
                                Text(
                                    text = offer.transmission,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = DriverTextSecondary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Rounded.DirectionsCar,
                                contentDescription = null,
                                tint = Gold500,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "${offer.vehicleModel} (${offer.vehiclePlate})",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = DriverTextPrimary
                            )
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Rounded.Navigation,
                                contentDescription = null,
                                tint = Emerald400,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Pickup: ${offer.pickupAddress}",
                                fontSize = 11.sp,
                                color = Slate400
                            )
                        }

                        // Transit Travel Allowance Badge
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Gold500.copy(alpha = 0.12f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Travel Allowance to Pickup:", fontSize = 10.sp, color = DriverTextSecondary)
                                Text("~20-25 Mins (5.2 km)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Gold500)
                            }
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = onDecline,
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = DriverTextSecondary),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
                    ) {
                        Text("Decline", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }

                    Button(
                        onClick = onAccept,
                        modifier = Modifier
                            .weight(1.5f)
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Mint500,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Rounded.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Accept Offer",
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
    }
}
