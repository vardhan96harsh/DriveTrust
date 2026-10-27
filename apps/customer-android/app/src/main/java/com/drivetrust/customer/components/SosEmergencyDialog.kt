package com.drivetrust.customer.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Emergency
import androidx.compose.material.icons.rounded.GpsFixed
import androidx.compose.material.icons.rounded.Security
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.theme.*

@Composable
fun SosEmergencyDialog(
    bookingCode: String,
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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
                            .background(Midnight950, CircleShape)
                    ) {
                        Icon(
                            Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = Slate400,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .background(Red500.copy(alpha = 0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Rounded.Emergency,
                        contentDescription = null,
                        tint = Red500,
                        modifier = Modifier.size(36.dp)
                    )
                }

                Text(
                    text = "Emergency SOS 112 Protocol",
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp,
                    color = Color.White
                )

                Text(
                    text = "Immediate escalation to Police Control Room (112), DriveTrust 24/7 Security Operations Command, and your registered emergency guardians.",
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
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Rounded.Security,
                                contentDescription = null,
                                tint = Red400,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "ACTIVE TRIP TELEMETRY BROADCAST",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Red400,
                                letterSpacing = 0.5.sp
                            )
                        }

                        Text(
                            text = "Trip Ref: $bookingCode",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                Icons.Rounded.GpsFixed,
                                contentDescription = null,
                                tint = Emerald400,
                                modifier = Modifier.size(12.dp)
                            )
                            Text(
                                text = "GPS: 12.9784° N, 77.6408° E (Real-time Link)",
                                fontSize = 11.sp,
                                color = Slate400
                            )
                        }
                    }
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Red600),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        Icons.Rounded.Emergency,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "DISPATCH EMERGENCY SOS 112",
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}
