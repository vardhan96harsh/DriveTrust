package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

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
                        Text("DriveTrust Safety Shield", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text("24x7 Chauffeur Protection & Police 112", fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Text("←", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF0F172A))
            )
        },
        containerColor = Color(0xFF0B1120)
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
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF991B1B).copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("POLICE EMERGENCY (112)", fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFF87171))
                            Surface(color = Color(0xFFEF4444), shape = RoundedCornerShape(12.dp)) {
                                Text("LIVE DISPATCH", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Pressing SOS transmits your live GPS coordinates, car license plate, and driver identity directly to the National Emergency Response Support System (ERSS 112).",
                            color = Color(0xFFFECACA),
                            fontSize = 12.sp,
                            lineHeight = 17.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))
                        Button(
                            onClick = onCall112,
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626))
                        ) {
                            Text("🚨 Call Police Emergency (112)", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }

            // MoRTH Sarathi Verification Guarantee
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Admin KYC & MoRTH Sarathi Guarantee", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            "100% of DriveTrust chauffeurs undergo strict human Admin verification before stepping behind your steering wheel. We cross-verify Commercial Badges against the Ministry of Road Transport & Highways database.",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8),
                            lineHeight = 17.sp
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Surface(color = Color(0xFF10B981).copy(alpha = 0.15f), shape = RoundedCornerShape(6.dp)) {
                                Text("✓ Police Verified", color = Color(0xFF34D399), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                            Surface(color = Color(0xFF0284C7).copy(alpha = 0.15f), shape = RoundedCornerShape(6.dp)) {
                                Text("✓ Sarathi Validated", color = Color(0xFF38BDF8), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                        }
                    }
                }
            }

            // Trusted Contacts
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Trusted Emergency Contacts", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Auto-alerted via SMS and WhatsApp whenever you trigger SOS", fontSize = 11.sp, color = Color(0xFF94A3B8))

                        Spacer(modifier = Modifier.height(12.dp))
                        Surface(
                            color = Color(0xFF0F172A),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(trustedContactName, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                    Text(trustedContactPhone, color = Color(0xFF94A3B8), fontSize = 12.sp)
                                }
                                Text("PRIMARY", fontSize = 10.sp, color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // Safety Preferences Toggles
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Proactive Safety Automation", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)

                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Auto-Share Night Rides (After 10 PM)", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                Text("Automatically sends WhatsApp tracking link to your trusted contacts", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            }
                            Switch(
                                checked = autoShareNight,
                                onCheckedChange = { autoShareNight = it },
                                colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF10B981))
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = Color(0xFF334155))
                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("In-Cabin Audio Safety Recording", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                Text("Encrypted audio recorded only on your device for emergency disputes", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            }
                            Switch(
                                checked = audioRecordingEnabled,
                                onCheckedChange = { audioRecordingEnabled = it },
                                colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF10B981))
                            )
                        }
                    }
                }
            }
        }
    }
}
