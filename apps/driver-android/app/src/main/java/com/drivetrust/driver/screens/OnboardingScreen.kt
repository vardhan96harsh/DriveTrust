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
import androidx.compose.ui.draw.shadow
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
            .background(DriverWhite)
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
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
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Mint50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                        modifier = Modifier.size(50.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Rounded.Badge, contentDescription = null, tint = Mint500, modifier = Modifier.size(26.dp))
                        }
                    }
                    Column {
                        Text(
                            text = "Driver Partner Registration",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = DriverTextPrimary
                        )
                        Text(
                            text = "Submit Driving License for verified fast onboarding",
                            fontSize = 12.sp,
                            color = DriverTextSecondary
                        )
                    }
                }

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Name (as per DL)", color = DriverTextSecondary) },
                    leadingIcon = { Icon(Icons.Rounded.Person, contentDescription = null, tint = Mint500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = DriverTextPrimary,
                        unfocusedTextColor = DriverTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = DriverCardBorderLight,
                        focusedContainerColor = DriverWhite,
                        unfocusedContainerColor = DriverWhite
                    ),
                    shape = RoundedCornerShape(14.dp)
                )

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Mobile Phone", color = DriverTextSecondary) },
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
                    shape = RoundedCornerShape(14.dp)
                )

                OutlinedTextField(
                    value = dlNumber,
                    onValueChange = { dlNumber = it },
                    label = { Text("Commercial Driving License (DL)", color = DriverTextSecondary) },
                    leadingIcon = { Icon(Icons.Rounded.DirectionsCar, contentDescription = null, tint = Mint500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = DriverTextPrimary,
                        unfocusedTextColor = DriverTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = DriverCardBorderLight,
                        focusedContainerColor = DriverWhite,
                        unfocusedContainerColor = DriverWhite
                    ),
                    shape = RoundedCornerShape(14.dp)
                )

                OutlinedTextField(
                    value = rto,
                    onValueChange = { rto = it },
                    label = { Text("RTO Authority", color = DriverTextSecondary) },
                    leadingIcon = { Icon(Icons.Rounded.LocationCity, contentDescription = null, tint = Mint500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = DriverTextPrimary,
                        unfocusedTextColor = DriverTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = DriverCardBorderLight,
                        focusedContainerColor = DriverWhite,
                        unfocusedContainerColor = DriverWhite
                    ),
                    shape = RoundedCornerShape(14.dp)
                )

                OutlinedTextField(
                    value = upiId,
                    onValueChange = { upiId = it },
                    label = { Text("Instant Payout UPI ID (e.g. name@okhdfcbank)", color = DriverTextSecondary) },
                    leadingIcon = { Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Mint500) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = DriverTextPrimary,
                        unfocusedTextColor = DriverTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = DriverCardBorderLight,
                        focusedContainerColor = DriverWhite,
                        unfocusedContainerColor = DriverWhite
                    ),
                    shape = RoundedCornerShape(14.dp)
                )

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Mint50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Rounded.VerifiedUser, contentDescription = null, tint = Mint500, modifier = Modifier.size(22.dp))
                        Text(
                            text = "DriveTrust guarantees same-day verification and instant direct bank UPI payouts for all rides completed.",
                            fontSize = 12.sp,
                            color = DriverTextSecondary,
                            lineHeight = 16.sp
                        )
                    }
                }

                Button(
                    onClick = {
                        if (fullName.isNotBlank() && dlNumber.isNotBlank()) {
                            onOnboardSuccess(fullName, phone, dlNumber)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                    shape = RoundedCornerShape(14.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                ) {
                    Text("Submit for Instant Verification", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = Color.White)
                }

                TextButton(
                    onClick = onBackToLogin,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text("Already registered? Sign In", fontSize = 13.sp, color = DriverTextSecondary)
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
