package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
fun CustomerCorporateBillingScreen(
    onBack: () -> Unit
) {
    var isBusinessModeActive by remember { mutableStateOf(true) }
    var companyName by remember { mutableStateOf("Apex Tech Solutions Pvt Ltd") }
    var workEmail by remember { mutableStateOf("harsh.v@apextech.in") }
    var gstin by remember { mutableStateOf("23AABCA1234F1Z5") }
    var costCenter by remember { mutableStateOf("CORP-EXEC-01") }
    var savedSuccess by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate900)
    ) {
        // Luxury Top App Bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MidnightDark,
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
            shadowElevation = 8.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .size(38.dp)
                            .background(MidnightCard, androidx.compose.foundation.shape.CircleShape)
                            .border(1.dp, MidnightBorder, androidx.compose.foundation.shape.CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "Corporate Account & GST",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Enterprise billing, cost centers & ITC invoices",
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                }
            }
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Profile Switcher Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .background(MidnightDark, androidx.compose.foundation.shape.CircleShape)
                                .border(1.dp, if (isBusinessModeActive) Gold500.copy(alpha = 0.6f) else MidnightBorder, androidx.compose.foundation.shape.CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isBusinessModeActive) Icons.Rounded.Business else Icons.Rounded.Person,
                                contentDescription = "Profile Mode",
                                tint = if (isBusinessModeActive) Gold400 else Slate400,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Column {
                            Text("ACTIVE PROFILE MODE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Slate400, letterSpacing = 0.8.sp)
                            Text(
                                text = if (isBusinessModeActive) "Corporate Enterprise Mode" else "Personal Ride Mode",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                            Text(
                                text = if (isBusinessModeActive) "Auto-generates GST tax invoices with ITC" else "Standard personal travel receipts",
                                fontSize = 11.sp,
                                color = Slate400
                            )
                        }
                    }
                    Switch(
                        checked = isBusinessModeActive,
                        onCheckedChange = { isBusinessModeActive = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = Gold500, checkedTrackColor = MidnightDark)
                    )
                }
            }

            if (savedSuccess) {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.6f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.CheckCircle,
                            contentDescription = "Success",
                            tint = Emerald400,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            "Corporate profile updated! GST invoices will be issued to $companyName.",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald400
                        )
                    }
                }
            }

            // Company Details Form
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text("ENTERPRISE BILLING INFORMATION", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)

                    val textFieldColors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = MidnightDark,
                        unfocusedContainerColor = MidnightDark
                    )

                    Column {
                        Text("Company Legal Name", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Slate300)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = companyName,
                            onValueChange = { companyName = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true,
                            colors = textFieldColors
                        )
                    }

                    Column {
                        Text("Official Work Email (For Invoices)", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Slate300)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = workEmail,
                            onValueChange = { workEmail = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true,
                            colors = textFieldColors
                        )
                    }

                    Column {
                        Text("Company GSTIN (15 Digits)", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Slate300)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = gstin,
                            onValueChange = { gstin = it.uppercase() },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true,
                            colors = textFieldColors
                        )
                    }

                    Column {
                        Text("Cost Center / Department Code (Optional)", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Slate300)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = costCenter,
                            onValueChange = { costCenter = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            singleLine = true,
                            colors = textFieldColors
                        )
                    }

                    Button(
                        onClick = { savedSuccess = true },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Gold500)
                    ) {
                        Text("SAVE CORPORATE DETAILS", fontWeight = FontWeight.Black, color = Slate900)
                    }
                }
            }

            // Tax & ITC Benefits Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.35f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.VerifiedUser,
                            contentDescription = "B2B",
                            tint = Gold400,
                            modifier = Modifier.size(16.dp)
                        )
                        Text("EXECUTIVE B2B TAX ADVANTAGE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
                    }
                    Text("Full 18% Input Tax Credit Compliance", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color.White)
                    Text(
                        "All business chauffeur trips generate certified GST tax invoices containing your legal GSTIN for instant expense write-offs and tax deductions.",
                        fontSize = 11.sp,
                        color = Slate400,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}
