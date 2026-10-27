package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import com.drivetrust.driver.theme.*

@Composable
fun DriverOnboardingScreen(
    onOnboardSuccess: (name: String, phone: String, dl: String) -> Unit,
    onBackToLogin: () -> Unit
) {
    var fullName by remember { mutableStateOf("Rajesh Kumar") }
    var phone by remember { mutableStateOf("+91 99801 84920") }
    var dlNumber by remember { mutableStateOf("KA0120180094821") }
    var rto by remember { mutableStateOf("KA-01 (Koramangala, Bangalore)") }
    var experience by remember { mutableStateOf("8 Years") }
    var upiId by remember { mutableStateOf("rajesh.kumar@okhdfcbank") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MidnightCard),
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = Gold500.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                        modifier = Modifier.size(46.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Rounded.Badge, contentDescription = null, tint = Gold500, modifier = Modifier.size(24.dp))
                        }
                    }
                    Column {
                        Text(
                            text = "Chauffeur Registration",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = "Submit Commercial DL for MoRTH verification",
                            fontSize = 12.sp,
                            color = Slate400
                        )
                    }
                }

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Name (as per DL)", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.Person, contentDescription = null, tint = Gold500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Mobile Phone", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.Phone, contentDescription = null, tint = Gold500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = dlNumber,
                    onValueChange = { dlNumber = it },
                    label = { Text("Commercial Driving License (DL)", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.DirectionsCar, contentDescription = null, tint = Gold500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = rto,
                    onValueChange = { rto = it },
                    label = { Text("RTO Authority", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.LocationCity, contentDescription = null, tint = Gold500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = upiId,
                    onValueChange = { upiId = it },
                    label = { Text("Instant Payout UPI ID (e.g. name@okhdfcbank)", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Emerald400) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MidnightDark,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Rounded.Shield, contentDescription = null, tint = Gold500, modifier = Modifier.size(20.dp))
                        Text(
                            text = "New profiles require mandatory verification by Operations Admin in the KYC Vault before going on duty.",
                            fontSize = 11.sp,
                            color = Slate300,
                            lineHeight = 15.sp
                        )
                    }
                }

                Button(
                    onClick = {
                        if (fullName.isNotBlank() && dlNumber.isNotBlank()) {
                            onOnboardSuccess(fullName, phone, dlNumber)
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Submit for Admin Verification", fontWeight = FontWeight.Bold, color = MidnightDark)
                }

                TextButton(
                    onClick = onBackToLogin,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text("Back to Sign In", fontSize = 12.sp, color = Slate400)
                }
            }
        }
    }
}

@Composable
fun OnboardingScreen(
    onOnboardingComplete: (name: String, phone: String, dl: String) -> Unit,
    onBackToLogin: () -> Unit
) {
    DriverOnboardingScreen(
        onOnboardSuccess = onOnboardingComplete,
        onBackToLogin = onBackToLogin
    )
}
