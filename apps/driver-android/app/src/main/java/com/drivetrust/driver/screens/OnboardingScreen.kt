package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
            .background(Slate50)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "Chauffeur Registration",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )
                Text(
                    text = "Submit official Commercial Driving License for MoRTH Sarathi verification",
                    fontSize = 12.sp,
                    color = Slate500
                )

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Name (as per DL)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Mobile Phone") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = dlNumber,
                    onValueChange = { dlNumber = it },
                    label = { Text("Commercial Driving License (DL)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = rto,
                    onValueChange = { rto = it },
                    label = { Text("RTO Authority") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = upiId,
                    onValueChange = { upiId = it },
                    label = { Text("Payout UPI ID (e.g. name@okhdfcbank)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Amber50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Amber600.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("⚠️", fontSize = 16.sp)
                        Text(
                            text = "New profiles require mandatory verification by Operations Admin in the KYC Vault before going on duty.",
                            fontSize = 11.sp,
                            color = Slate700
                        )
                    }
                }

                Button(
                    onClick = {
                        if (fullName.isNotBlank() && dlNumber.isNotBlank()) {
                            onOnboardSuccess(fullName, phone, dlNumber)
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Submit for Admin Verification →", fontWeight = FontWeight.Bold)
                }

                TextButton(
                    onClick = onBackToLogin,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text("Back to Sign In", fontSize = 12.sp, color = Slate600)
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
