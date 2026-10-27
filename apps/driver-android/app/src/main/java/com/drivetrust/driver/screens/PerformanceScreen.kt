package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
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
                        Text("Partner: $driverName (Platinum Tier)", fontSize = 12.sp, color = Slate400)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MidnightCard)
            )
        },
        containerColor = MidnightDark
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
                    colors = CardDefaults.cardColors(containerColor = MidnightCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Surface(
                            color = Gold500.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(20.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.WorkspacePremium, contentDescription = null, tint = Gold500, modifier = Modifier.size(16.dp))
                                Text("PLATINUM CHAUFFEUR TIER", color = Gold500, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        Text("98", fontSize = 60.sp, fontWeight = FontWeight.Black, color = Color.White)
                        Text("Safety & Smoothness Telematics Index", fontSize = 12.sp, color = Slate400)

                        Spacer(modifier = Modifier.height(20.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("4.96", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Gold500)
                                    Icon(Icons.Rounded.Star, contentDescription = null, tint = Gold500, modifier = Modifier.size(15.dp))
                                }
                                Text("Rating (128 Rides)", fontSize = 11.sp, color = Slate400)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("99%", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8))
                                Text("Acceptance Rate", fontSize = 11.sp, color = Slate400)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("0%", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                                Text("Cancellations", fontSize = 11.sp, color = Slate400)
                            }
                        }
                    }
                }
            }

            // Real-Time Sensor Telematics Breakdown
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MidnightCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Rounded.Sensors, contentDescription = null, tint = Emerald400, modifier = Modifier.size(20.dp))
                            Text("Live Telematics Stream (Last 30 Days)", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Text("Calculated via phone 3-axis accelerometer and GPS trajectory sampling", fontSize = 11.sp, color = Slate400)

                        Spacer(modifier = Modifier.height(16.dp))

                        TelemetryMetricRow(
                            title = "Smooth Braking Compliance",
                            value = "0 harsh brake incidents across 420 km",
                            status = "99% Smooth",
                            statusColor = Emerald400,
                            progress = 0.99f
                        )

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = MidnightBorder)
                        Spacer(modifier = Modifier.height(14.dp))

                        TelemetryMetricRow(
                            title = "Cornering & Centrifugal G-Force",
                            value = "Max 0.08 G (Chauffeur Standard < 0.20 G)",
                            status = "Pristine",
                            statusColor = Emerald400,
                            progress = 0.96f
                        )

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = MidnightBorder)
                        Spacer(modifier = Modifier.height(14.dp))

                        TelemetryMetricRow(
                            title = "City Speed Limit Adherence",
                            value = "100% compliance with road speed regulations",
                            status = "100% Lawful",
                            statusColor = Emerald400,
                            progress = 1.0f
                        )
                    }
                }
            }

            // MoRTH Background Verification Status
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MidnightCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Rounded.Shield, contentDescription = null, tint = Gold500, modifier = Modifier.size(20.dp))
                                Text("MoRTH Sarathi Verification", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Surface(
                                color = Emerald400.copy(alpha = 0.15f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f)),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text("ADMIN VERIFIED", color = Emerald400, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Commercial Driving License and Police Clearance Certificate audited by DriveTrust Operations Admin. Cleared for luxury automatic & manual client vehicles.",
                            fontSize = 11.sp,
                            color = Slate300,
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
    statusColor: Color,
    progress: Float = 1.0f
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.SemiBold, color = Color.White, fontSize = 13.sp)
                Text(value, fontSize = 11.sp, color = Slate400)
            }
            Surface(
                color = statusColor.copy(alpha = 0.15f),
                border = androidx.compose.foundation.BorderStroke(1.dp, statusColor.copy(alpha = 0.3f)),
                shape = RoundedCornerShape(6.dp)
            ) {
                Text(status, color = statusColor, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
            }
        }
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(4.dp),
            color = statusColor,
            trackColor = MidnightBorder
        )
    }
}
