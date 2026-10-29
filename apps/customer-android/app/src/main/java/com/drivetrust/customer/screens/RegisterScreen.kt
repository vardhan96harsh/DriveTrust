package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Badge
import androidx.compose.material.icons.rounded.DirectionsCar
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.theme.*

@Composable
fun CustomerRegisterScreen(
    onRegisterSuccess: (name: String, phone: String, car: String, plate: String) -> Unit,
    onBackToLogin: () -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var carBrand by remember { mutableStateOf("Toyota Fortuner 4x4") }
    var plate by remember { mutableStateOf("MP-40-CA-4921") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CustomerCardLight),
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Luxury Monogram & Brand Header
                Column {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Mint50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f)),
                        modifier = Modifier.size(48.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "DT",
                                color = Mint500,
                                fontWeight = FontWeight.Black,
                                fontSize = 20.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Executive Member Registration",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = CustomerTextPrimary
                    )
                    Text(
                        text = "Register your profile and primary vehicle for chauffeur services",
                        fontSize = 12.sp,
                        color = CustomerTextSecondary
                    )
                }

                val tfColors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = CustomerTextPrimary,
                    unfocusedTextColor = CustomerTextPrimary,
                    focusedBorderColor = Mint500,
                    unfocusedBorderColor = CustomerCardBorderLight,
                    focusedLabelColor = Mint500,
                    unfocusedLabelColor = CustomerTextSecondary,
                    focusedContainerColor = CustomerWhite,
                    unfocusedContainerColor = CustomerInnerSurfaceLight
                )

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Legal Name") },
                    leadingIcon = {
                        Icon(
                            Icons.Rounded.Person,
                            contentDescription = null,
                            tint = Mint500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = tfColors,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Mobile Phone Number") },
                    leadingIcon = {
                        Icon(
                            Icons.Rounded.Phone,
                            contentDescription = null,
                            tint = Mint500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = tfColors,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = carBrand,
                    onValueChange = { carBrand = it },
                    label = { Text("Primary Vehicle Make & Model") },
                    leadingIcon = {
                        Icon(
                            Icons.Rounded.DirectionsCar,
                            contentDescription = null,
                            tint = Mint500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = tfColors,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                OutlinedTextField(
                    value = plate,
                    onValueChange = { plate = it },
                    label = { Text("Registration Plate Number") },
                    leadingIcon = {
                        Icon(
                            Icons.Rounded.Badge,
                            contentDescription = null,
                            tint = Mint500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = tfColors,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                Button(
                    onClick = {
                        if (fullName.isNotBlank() && phone.isNotBlank()) {
                            onRegisterSuccess(fullName, phone, carBrand, plate)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Mint500,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Register & Enter Garage", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(Icons.Rounded.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.White)
                }

                HorizontalDivider(color = CustomerCardBorderLight)

                TextButton(
                    onClick = onBackToLogin,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text(
                        text = "Already registered? Sign In",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Mint500
                    )
                }
            }
        }
    }
}
