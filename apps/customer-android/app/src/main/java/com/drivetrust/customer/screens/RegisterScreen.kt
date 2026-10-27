package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
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
import com.drivetrust.customer.theme.*

@Composable
fun CustomerRegisterScreen(
    onRegisterSuccess: (name: String, phone: String, car: String, plate: String) -> Unit,
    onBackToLogin: () -> Unit
) {
    var fullName by remember { mutableStateOf("Harshvardhan") }
    var phone by remember { mutableStateOf("+91 98450 12345") }
    var carBrand by remember { mutableStateOf("Toyota Fortuner 4x4") }
    var plate by remember { mutableStateOf("KA-01-MJ-4921") }

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
            shape = RoundedCornerShape(24.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header
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
                        text = "Executive Member Registration",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "Register your profile and primary vehicle for chauffeur services",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                }

                OutlinedTextField(
                    value = fullName,
                    onValueChange = { fullName = it },
                    label = { Text("Full Legal Name") },
                    leadingIcon = {
                        Icon(
                            Icons.Rounded.Person,
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
                        focusedLabelColor = Gold500,
                        unfocusedLabelColor = Slate400,
                        focusedContainerColor = Midnight950,
                        unfocusedContainerColor = Midnight950
                    ),
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
                            tint = Gold500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Slate200,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedLabelColor = Gold500,
                        unfocusedLabelColor = Slate400,
                        focusedContainerColor = Midnight950,
                        unfocusedContainerColor = Midnight950
                    ),
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
                            tint = Gold500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Slate200,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedLabelColor = Gold500,
                        unfocusedLabelColor = Slate400,
                        focusedContainerColor = Midnight950,
                        unfocusedContainerColor = Midnight950
                    ),
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
                            tint = Gold500,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Slate200,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedLabelColor = Gold500,
                        unfocusedLabelColor = Slate400,
                        focusedContainerColor = Midnight950,
                        unfocusedContainerColor = Midnight950
                    ),
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
                        containerColor = Gold500,
                        contentColor = MidnightDark
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Register & Enter Garage", fontWeight = FontWeight.Black, fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(Icons.Rounded.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                }

                HorizontalDivider(color = MidnightBorder)

                TextButton(
                    onClick = onBackToLogin,
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text(
                        text = "Already registered? Sign In",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Gold500
                    )
                }
            }
        }
    }
}
