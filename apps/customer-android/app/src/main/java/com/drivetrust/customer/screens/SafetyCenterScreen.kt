package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerSafetyCenterScreen(
    onBack: () -> Unit,
    onCall112: () -> Unit
) {
    var autoShareNight by remember { mutableStateOf(true) }
    var audioRecordingEnabled by remember { mutableStateOf(false) }
    var trustedContactName by remember { mutableStateOf("Rohan Sharma (Brother)") }
    var trustedContactPhone by remember { mutableStateOf("+91 98111 22334") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            "Executive Safety Shield",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = CustomerTextPrimary,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            "24x7 Chauffeur Protection & Police 112 Dispatch",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .padding(start = 8.dp)
                            .size(36.dp)
                            .background(CustomerWhite, CircleShape)
                            .border(1.dp, CustomerCardBorderLight, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = CustomerTextPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CustomerBackgroundLight)
            )
        },
        containerColor = CustomerBackgroundLight
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // SOS Emergency Card
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Red500.copy(alpha = 0.35f)),
                    shape = RoundedCornerShape(16.dp),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(
                                    imageVector = Icons.Rounded.Emergency,
                                    contentDescription = "SOS",
                                    tint = Red500,
                                    modifier = Modifier.size(20.dp)
                                )
                                Text("POLICE EMERGENCY (ERSS 112)", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Red600)
                            }
                            Surface(color = Red500.copy(alpha = 0.12f), shape = RoundedCornerShape(6.dp)) {
                                Text("LIVE DISPATCH", color = Red600, fontSize = 9.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            "Pressing SOS transmits your real-time GPS telemetry, vehicle registration, and verified chauffeur identity directly to the Police Emergency Dispatch Network (112).",
                            color = CustomerTextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 17.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))
                        Button(
                            onClick = onCall112,
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Red600)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Call,
                                    contentDescription = "Call",
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text("Trigger Police Emergency 112", fontWeight = FontWeight.Black, color = Color.White, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }

            // MoRTH Sarathi Verification Guarantee
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.35f)),
                    shape = RoundedCornerShape(16.dp),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.VerifiedUser,
                                contentDescription = "Verified",
                                tint = Gold600,
                                modifier = Modifier.size(18.dp)
                            )
                            Text("MoRTH Sarathi & Police KYC Guarantee", fontSize = 14.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Every DriveTrust chauffeur undergoes strict human admin verification before stepping behind your steering wheel. Commercial badges and DL are authenticated against the Ministry of Road Transport & Highways database.",
                            fontSize = 12.sp,
                            color = CustomerTextSecondary,
                            lineHeight = 17.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Surface(
                                color = Gold50.copy(alpha = 0.8f),
                                border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.4f)),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text("Police Background Cleared", color = Gold600, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                            Surface(
                                color = Mint50,
                                border = androidx.compose.foundation.BorderStroke(0.8.dp, Mint500.copy(alpha = 0.4f)),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text("Sarathi DL Validated", color = Mint600, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                        }
                    }
                }
            }

            // Trusted Contacts
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shape = RoundedCornerShape(16.dp),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.ContactPhone,
                                contentDescription = "Contacts",
                                tint = Gold600,
                                modifier = Modifier.size(18.dp)
                            )
                            Text("Trusted Emergency Contacts", fontSize = 14.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                        }
                        Text("Auto-alerted via SMS and WhatsApp whenever you trigger SOS", fontSize = 11.sp, color = CustomerTextSecondary)

                        Spacer(modifier = Modifier.height(12.dp))
                        Surface(
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(trustedContactName, fontWeight = FontWeight.Black, color = CustomerTextPrimary, fontSize = 13.sp)
                                    Text(trustedContactPhone, color = CustomerTextSecondary, fontSize = 11.sp)
                                }
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Mint100
                                ) {
                                    Text("PRIMARY", fontSize = 10.sp, color = Mint600, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                }
                            }
                        }
                    }
                }
            }

            // Safety Preferences Toggles
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shape = RoundedCornerShape(16.dp),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("PROACTIVE SAFETY AUTOMATION", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold600, letterSpacing = 0.8.sp)

                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Auto-Share Night Rides (After 10 PM)", fontWeight = FontWeight.Bold, color = CustomerTextPrimary, fontSize = 13.sp)
                                Text("Automatically sends WhatsApp tracking link to your trusted contacts", fontSize = 11.sp, color = CustomerTextSecondary)
                            }
                            Switch(
                                checked = autoShareNight,
                                onCheckedChange = { autoShareNight = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = Mint500,
                                    uncheckedThumbColor = Slate400,
                                    uncheckedTrackColor = Slate200
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = CustomerCardBorderLight)
                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("In-Cabin Audio Safety Recording", fontWeight = FontWeight.Bold, color = CustomerTextPrimary, fontSize = 13.sp)
                                Text("Encrypted audio recorded only on your device for emergency disputes", fontSize = 11.sp, color = CustomerTextSecondary)
                            }
                            Switch(
                                checked = audioRecordingEnabled,
                                onCheckedChange = { audioRecordingEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = Mint500,
                                    uncheckedThumbColor = Slate400,
                                    uncheckedTrackColor = Slate200
                                )
                            )
                        }
                    }
                }
            }
        }
    }
}
