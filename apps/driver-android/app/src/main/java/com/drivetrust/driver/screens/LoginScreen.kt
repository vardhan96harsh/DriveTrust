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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.theme.*

@Composable
fun DriverLoginScreen(
    onLoginSuccess: (phone: String) -> Unit,
    onGoToOnboard: () -> Unit,
    onViewWalkthrough: (() -> Unit)? = null
) {
    var phoneInput by remember { mutableStateOf("+91 99801 84920") }
    var otpSent by remember { mutableStateOf(false) }
    var enteredOtp by remember { mutableStateOf("") }
    var generatedOtp by remember { mutableStateOf("849201") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DriverWhite)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(elevation = 6.dp, shape = RoundedCornerShape(24.dp), spotColor = Color(0x10000000)),
            colors = CardDefaults.cardColors(containerColor = DriverWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, DriverCardBorderLight),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.padding(26.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Header & Brand Logo
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column {
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = Mint50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                            modifier = Modifier.size(52.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.DirectionsCar,
                                    contentDescription = null,
                                    tint = Mint500,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "Driver Partner Login",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = DriverTextPrimary
                        )
                        Text(
                            text = "Sign in to accept high-fare bookings & track daily payouts",
                            fontSize = 13.sp,
                            color = DriverTextSecondary,
                            lineHeight = 18.sp
                        )
                    }

                    if (onViewWalkthrough != null) {
                        IconButton(onClick = onViewWalkthrough) {
                            Icon(
                                Icons.Rounded.HelpOutline,
                                contentDescription = "View Introduction",
                                tint = DriverTextSecondary
                            )
                        }
                    }
                }

                if (!otpSent) {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = "MOBILE PHONE NUMBER",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = DriverTextSecondary,
                            letterSpacing = 0.5.sp
                        )
                        OutlinedTextField(
                            value = phoneInput,
                            onValueChange = { phoneInput = it },
                            leadingIcon = { Icon(Icons.Rounded.Phone, contentDescription = null, tint = Mint500) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = DriverTextPrimary,
                                unfocusedTextColor = DriverTextPrimary,
                                focusedBorderColor = Mint500,
                                unfocusedBorderColor = DriverCardBorderLight,
                                focusedContainerColor = DriverWhite,
                                unfocusedContainerColor = DriverWhite
                            ),
                            shape = RoundedCornerShape(14.dp),
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
                            .height(52.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                        shape = RoundedCornerShape(14.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                    ) {
                        Icon(Icons.Rounded.Key, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Send Security OTP", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = Color.White)
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Mint50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.3f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "SMS VERIFICATION CODE DISPATCHED",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Mint600,
                                    letterSpacing = 0.5.sp
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "OTP: $generatedOtp",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = DriverTextPrimary
                                )
                            }
                            Button(
                                onClick = { enteredOtp = generatedOtp },
                                colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                shape = RoundedCornerShape(10.dp),
                                elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                            ) {
                                Text("Auto-Fill", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = enteredOtp,
                        onValueChange = { enteredOtp = it },
                        placeholder = { Text("Enter 6-Digit OTP", color = DriverTextMuted) },
                        leadingIcon = { Icon(Icons.Rounded.Lock, contentDescription = null, tint = Mint500) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = DriverTextPrimary,
                            unfocusedTextColor = DriverTextPrimary,
                            focusedBorderColor = Mint500,
                            unfocusedBorderColor = DriverCardBorderLight,
                            focusedContainerColor = DriverWhite,
                            unfocusedContainerColor = DriverWhite
                        ),
                        shape = RoundedCornerShape(14.dp),
                        singleLine = true
                    )

                    errorMessage?.let {
                        Text(text = it, color = Color(0xFFEF4444), fontSize = 12.sp, fontWeight = FontWeight.Medium)
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
                            .height(52.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                        shape = RoundedCornerShape(14.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                    ) {
                        Text("Verify & Start Duty", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = Color.White)
                    }
                }

                HorizontalDivider(color = DriverCardBorderLight)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "New driver partner? ",
                        fontSize = 13.sp,
                        color = DriverTextSecondary
                    )
                    TextButton(onClick = onGoToOnboard) {
                        Text(
                            text = "Register Driver License",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = Mint600
                        )
                    }
                }
            }
        }
    }
}
