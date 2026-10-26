package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
            color = Color.White,
            border = androidx.compose.foundation.BorderStroke(2.dp, Slate900),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Slate100
                    ) {
                        Text(
                            text = "NEW RIDE OFFER",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate900,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Slate100
                    ) {
                        Text(
                            text = offer.transmission,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate700,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                // Circular Countdown Ring
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .background(Slate50, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${countdown}s",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = if (countdown <= 10) Red600 else Slate900
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "₹${offer.netDriverPayout.toInt()}.00",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        text = "Net Driver Payout (80% + Return Allowance)",
                        fontSize = 10.sp,
                        color = Slate500
                    )
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Slate50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Customer: ${offer.customerName}", fontSize = 11.sp, color = Slate500)
                            Text(offer.customerPhone, fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Slate500)
                        }
                        Text(
                            text = "Vehicle: ${offer.vehicleModel} (${offer.vehiclePlate})",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate900
                        )
                        Text(
                            text = "Pickup: ${offer.pickupAddress}",
                            fontSize = 11.sp,
                            color = Slate700
                        )
                    }
                }

                Button(
                    onClick = onAccept,
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(
                        text = "ACCEPT RIDE OFFER (₹${offer.netDriverPayout.toInt()}) →",
                        fontWeight = FontWeight.Black,
                        fontSize = 13.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}
