package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.theme.*

@Composable
fun DriverLoginScreen(
    onLoginSuccess: (phone: String) -> Unit,
    onGoToOnboard: () -> Unit
) {
    var phoneInput by remember { mutableStateOf("+91 99801 84920") }
    var otpSent by remember { mutableStateOf(false) }
    var enteredOtp by remember { mutableStateOf("") }
    var generatedOtp by remember { mutableStateOf("849201") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MidnightCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.padding(26.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Column {
                    Surface(
                        shape = CircleShape,
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(1.5.dp, Gold500),
                        modifier = Modifier.size(50.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "DT",
                                color = Gold500,
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Chauffeur Terminal",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "Sign in to access partner duty terminal and dispatch offers",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                }

                if (!otpSent) {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "REGISTERED CHAUFFEUR PHONE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Gold500,
                            letterSpacing = 1.sp
                        )
                        OutlinedTextField(
                            value = phoneInput,
                            onValueChange = { phoneInput = it },
                            leadingIcon = { Icon(Icons.Rounded.Phone, contentDescription = null, tint = Gold500) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedBorderColor = Gold500,
                                unfocusedBorderColor = MidnightBorder
                            ),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }

                    Button(
                        onClick = {
                            if (phoneInput.length >= 10) {
                                generatedOtp = "${(100000..999999).random()}"
                                otpSent = true
                                errorMessage = null
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Rounded.Key, contentDescription = null, tint = MidnightDark, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Send 6-Digit Security OTP", fontWeight = FontWeight.Bold, color = MidnightDark)
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Emerald400.copy(alpha = 0.12f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.35f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "SECURITY CODE DISPATCHED",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400,
                                    letterSpacing = 1.sp
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "OTP: $generatedOtp",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Black,
                                    fontFamily = FontFamily.Monospace,
                                    color = Color.White
                                )
                            }
                            Button(
                                onClick = { enteredOtp = generatedOtp },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald400.copy(alpha = 0.2f)),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Auto-Fill", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = enteredOtp,
                        onValueChange = { enteredOtp = it },
                        placeholder = { Text("Enter 6-Digit OTP", color = Slate500) },
                        leadingIcon = { Icon(Icons.Rounded.Lock, contentDescription = null, tint = Gold500) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Gold500,
                            unfocusedBorderColor = MidnightBorder
                        ),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    errorMessage?.let {
                        Text(text = it, color = Color(0xFFEF4444), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Button(
                        onClick = {
                            if (enteredOtp.isNotEmpty() && enteredOtp == generatedOtp) {
                                onLoginSuccess(phoneInput)
                            } else {
                                errorMessage = "Invalid verification code. Please check SMS."
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Verify & Open Terminal", fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }

                HorizontalDivider(color = MidnightBorder)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "New chauffeur partner? ",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                    TextButton(onClick = onGoToOnboard) {
                        Text(
                            text = "Apply & Register DL",
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            color = Gold500
                        )
                    }
                }
            }
        }
    }
}
