package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Key
import androidx.compose.material.icons.rounded.Phone
import androidx.compose.material.icons.rounded.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.theme.*

@Composable
fun CustomerLoginScreen(
    onLoginSuccess: (phone: String) -> Unit,
    onGoToRegister: () -> Unit
) {
    var phoneInput by remember { mutableStateOf("+91 98450 12345") }
    var otpSent by remember { mutableStateOf(false) }
    var enteredOtp by remember { mutableStateOf("") }
    var generatedOtp by remember { mutableStateOf("918234") }
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
            shape = RoundedCornerShape(24.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Luxury Monogram & Brand Header
                Column {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Midnight950,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.6f)),
                        modifier = Modifier.size(48.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "DT",
                                color = Gold500,
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Executive Chauffeur Sign In",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "Hire background-verified professional chauffeurs for your car",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                }

                if (!otpSent) {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "REGISTERED MOBILE NUMBER",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Gold500,
                            letterSpacing = 0.5.sp
                        )
                        OutlinedTextField(
                            value = phoneInput,
                            onValueChange = { phoneInput = it },
                            leadingIcon = {
                                Icon(
                                    Icons.Rounded.Phone,
                                    contentDescription = null,
                                    tint = Gold500,
                                    modifier = Modifier.size(18.dp)
                                )
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Slate200,
                                focusedBorderColor = Gold500,
                                unfocusedBorderColor = MidnightBorder,
                                focusedContainerColor = Midnight950,
                                unfocusedContainerColor = Midnight950
                            ),
                            modifier = Modifier.fillMaxWidth(),
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
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Gold500,
                            contentColor = MidnightDark
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Send 6-Digit Security OTP", fontWeight = FontWeight.Black, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Rounded.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Midnight950,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "SANDBOX SIMULATION OTP",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400,
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = generatedOtp,
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Black,
                                    fontFamily = FontFamily.Monospace,
                                    color = Color.White,
                                    letterSpacing = 2.sp
                                )
                            }
                            Button(
                                onClick = { enteredOtp = generatedOtp },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Emerald400.copy(alpha = 0.2f),
                                    contentColor = Emerald400
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text("Auto-Fill", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = enteredOtp,
                        onValueChange = { enteredOtp = it },
                        placeholder = { Text("Enter 6-Digit OTP", color = Slate500) },
                        leadingIcon = {
                            Icon(
                                Icons.Rounded.Key,
                                contentDescription = null,
                                tint = Gold500,
                                modifier = Modifier.size(18.dp)
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Slate200,
                            focusedBorderColor = Gold500,
                            unfocusedBorderColor = MidnightBorder,
                            focusedContainerColor = Midnight950,
                            unfocusedContainerColor = Midnight950
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    errorMessage?.let {
                        Text(text = it, color = Red400, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Button(
                        onClick = {
                            if (enteredOtp.isNotEmpty() && enteredOtp == generatedOtp) {
                                onLoginSuccess(phoneInput)
                            } else {
                                errorMessage = "Invalid verification code. Please check SMS."
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Gold500,
                            contentColor = MidnightDark
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Verify & Continue", fontWeight = FontWeight.Black, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Rounded.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                }

                HorizontalDivider(color = MidnightBorder)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "New vehicle owner? ",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                    TextButton(onClick = onGoToRegister) {
                        Text(
                            text = "Register Your Vehicle",
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
