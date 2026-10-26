package com.drivetrust.driver.screens

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
fun DriverPerformanceScreen(
    driverName: String,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Chauffeur Safety & Quality Score", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text("Partner: $driverName (Platinum Tier)", fontSize = 12.sp, color = Color(0xFF94A3B8))
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
            // Main Score Hero Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Color(0xFF10B981).copy(alpha = 0.15f),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Text("PLATINUM CHAUFFEUR TIER", color = Color(0xFF10B981), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp))
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Text("98", fontSize = 54.sp, fontWeight = FontWeight.Black, color = Color.White)
                        Text("Safety & Smoothness Telematics Index", fontSize = 12.sp, color = Color(0xFF94A3B8))

                        Spacer(modifier = Modifier.height(16.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("4.96 ★", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF59E0B))
                                Text("Rating (128 Rides)", fontSize = 11.sp, color = Color(0xFF64748B))
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("99%", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8))
                                Text("Acceptance", fontSize = 11.sp, color = Color(0xFF64748B))
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("0%", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                                Text("Cancellations", fontSize = 11.sp, color = Color(0xFF64748B))
                            }
                        }
                    }
                }
            }

            // Real-Time Sensor Telematics Breakdown
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Live Vehicle Sensor Telematics (Last 30 Days)", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Calculated via phone accelerometer and GPS sensor stream", fontSize = 11.sp, color = Color(0xFF94A3B8))

                        Spacer(modifier = Modifier.height(14.dp))

                        TelemetryMetricRow(
                            title = "Harsh Braking Events",
                            value = "0 incidents",
                            status = "Excellent",
                            statusColor = Color(0xFF10B981)
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = Color(0xFF334155))
                        Spacer(modifier = Modifier.height(10.dp))

                        TelemetryMetricRow(
                            title = "Harsh Cornering G-Force",
                            value = "0.08 G (Low)",
                            status = "Smooth Drive",
                            statusColor = Color(0xFF10B981)
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = Color(0xFF334155))
                        Spacer(modifier = Modifier.height(10.dp))

                        TelemetryMetricRow(
                            title = "City Speed Limit Adherence",
                            value = "100%",
                            status = "Full Compliance",
                            statusColor = Color(0xFF10B981)
                        )
                    }
                }
            }

            // MoRTH Background Verification Status
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("MoRTH Sarathi Verification", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Surface(color = Color(0xFF10B981).copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                                Text("ADMIN VERIFIED", color = Color(0xFF34D399), fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            "Commercial Driving License and Police Clearance Certificate audited by DriveTrust Compliance team. Authorized for luxury automatic & manual client vehicles.",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8),
                            lineHeight = 16.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TelemetryMetricRow(
    title: String,
    value: String,
    status: String,
    statusColor: Color
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(title, fontWeight = FontWeight.Medium, color = Color.White, fontSize = 13.sp)
            Text(value, fontSize = 11.sp, color = Color(0xFF94A3B8))
        }
        Surface(
            color = statusColor.copy(alpha = 0.15f),
            shape = RoundedCornerShape(6.dp)
        ) {
            Text(status, color = statusColor, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
        }
    }
}
