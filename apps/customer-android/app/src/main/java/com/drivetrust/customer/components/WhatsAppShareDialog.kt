package com.drivetrust.customer.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.theme.*

@Composable
fun WhatsAppShareDialog(
    bookingCode: String,
    driverName: String,
    carModel: String,
    carPlate: String,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Share Live Ride Link",
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            color = CustomerTextPrimary
                        )
                        Text(
                            text = "Send real-time GPS telemetry link to family & WhatsApp",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )
                    }
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
                            .background(CustomerInnerSurfaceLight, CircleShape)
                    ) {
                        Icon(
                            Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = CustomerTextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = CustomerInnerSurfaceLight,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Booking Reference:", fontSize = 11.sp, color = CustomerTextSecondary)
                            Text(
                                bookingCode,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                color = Mint600
                            )
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Chauffeur:", fontSize = 11.sp, color = CustomerTextSecondary)
                            Text(
                                driverName,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = CustomerTextPrimary
                            )
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Vehicle:", fontSize = 11.sp, color = CustomerTextSecondary)
                            Text(
                                "$carModel ($carPlate)",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = CustomerTextSecondary
                            )
                        }
                    }
                }

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Mint50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "SECURE TELEMETRY URL",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Mint600,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "https://drivetrust.in/track/$bookingCode",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.SemiBold,
                            color = CustomerTextPrimary,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        Icons.Rounded.Share,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Share Live Link on WhatsApp",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}
