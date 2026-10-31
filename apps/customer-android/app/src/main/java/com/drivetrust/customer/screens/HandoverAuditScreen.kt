package com.drivetrust.customer.screens

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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.components.CustomerTopAppBar
import com.drivetrust.customer.theme.*

@Composable
fun CustomerHandoverAuditScreen(
    carModel: String,
    carPlate: String,
    driverName: String,
    customerName: String = "Customer",
    onConfirmHandover: () -> Unit,
    onBack: () -> Unit
) {
    var odometerKm by remember { mutableStateOf("42,150 km") }
    var fuelLevel by remember { mutableStateOf("85% Full") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
    ) {
        CustomerTopAppBar(customerName = customerName)

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header with Back button
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(40.dp)
                        .background(CustomerWhite, RoundedCornerShape(10.dp))
                        .border(1.dp, CustomerCardBorderLight, RoundedCornerShape(10.dp))
                ) {
                    Icon(
                        Icons.Rounded.ArrowBack,
                        contentDescription = "Back",
                        tint = CustomerTextPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Column {
                    Text(
                        text = "4-Point Handover Audit",
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp,
                        color = CustomerTextPrimary
                    )
                    Text(
                        text = "Mutual scratch & telematics sign-off before trip start",
                        fontSize = 11.sp,
                        color = CustomerTextSecondary
                    )
                }
            }

            // Vehicle Badge
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Mint50,
                            modifier = Modifier.size(42.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Rounded.DirectionsCar,
                                    contentDescription = null,
                                    tint = Mint600,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = "VEHICLE ASSIGNED",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = CustomerTextSecondary,
                                letterSpacing = 0.5.sp
                            )
                            Text(
                                text = carModel,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Black,
                                color = CustomerTextPrimary
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = CustomerInnerSurfaceLight,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.4f))
                    ) {
                        Text(
                            text = carPlate,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            color = Mint600,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            Text(
                text = "1. 360° EXTERIOR SCRATCH AUDIT",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Gold600,
                letterSpacing = 1.sp
            )

            // 4 Quadrants
            val quadrants = listOf(
                "Front Bumper & Grille" to "Verified Clear (Zero stone chips or dents)",
                "Rear Bumper & Boot" to "Factory paint verified (No impact marks)",
                "Left Quarter & Mirrors" to "Side mirror, glass & sensor intact",
                "Right Quarter & Panels" to "Clear / High-gloss coat inspected"
            )

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                quadrants.forEach { (part, status) ->
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = CustomerWhite,
                        border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                        shadowElevation = 2.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = part,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = CustomerTextPrimary
                                )
                                Text(
                                    text = status,
                                    fontSize = 11.sp,
                                    color = Mint600
                                )
                            }
                            Icon(
                                Icons.Rounded.CheckCircle,
                                contentDescription = null,
                                tint = Mint600,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            Text(
                text = "2. INSTRUMENT CLUSTER VERIFICATION",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Gold600,
                letterSpacing = 1.sp
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = odometerKm,
                    onValueChange = { odometerKm = it },
                    label = { Text("Starting Odometer") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = CustomerTextPrimary,
                        unfocusedTextColor = CustomerTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = CustomerCardBorderLight,
                        focusedLabelColor = Mint600,
                        unfocusedLabelColor = CustomerTextSecondary,
                        focusedContainerColor = CustomerInnerSurfaceLight,
                        unfocusedContainerColor = CustomerInnerSurfaceLight
                    ),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
                OutlinedTextField(
                    value = fuelLevel,
                    onValueChange = { fuelLevel = it },
                    label = { Text("Fuel / Battery") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = CustomerTextPrimary,
                        unfocusedTextColor = CustomerTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = CustomerCardBorderLight,
                        focusedLabelColor = Mint600,
                        unfocusedLabelColor = CustomerTextSecondary,
                        focusedContainerColor = CustomerInnerSurfaceLight,
                        unfocusedContainerColor = CustomerInnerSurfaceLight
                    ),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            // Transit Guarantee Notice
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.35f)),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = Gold50,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                Icons.Rounded.Security,
                                contentDescription = null,
                                tint = Gold600,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "DRIVETRUST ₹10 LAKHS TRANSIT GUARANTEE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold600,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Both Chauffeur $driverName and Vehicle Owner agree to physical status prior to departure.",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )
                    }
                }
            }

            Button(
                onClick = onConfirmHandover,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Mint500,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    Icons.Rounded.LockOpen,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Sign Off Handover & Unlock Trip",
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp
                )
            }
        }
    }
}
