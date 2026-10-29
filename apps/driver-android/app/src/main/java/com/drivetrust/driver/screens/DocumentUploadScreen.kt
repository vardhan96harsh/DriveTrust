package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
fun DocumentUploadScreen(
    driverName: String,
    onBack: () -> Unit,
    onSubmitForReview: () -> Unit
) {
    var dlFrontUploaded by remember { mutableStateOf(true) }
    var dlBackUploaded by remember { mutableStateOf(true) }
    var policeCertUploaded by remember { mutableStateOf(true) }
    var badgeUploaded by remember { mutableStateOf(false) }
    var aadhaarUploaded by remember { mutableStateOf(true) }
    var showSuccessBanner by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("KYC Verification Vault", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = DriverTextPrimary)
                        Text("Partner: $driverName (MoRTH Sarathi Audit)", fontSize = 12.sp, color = DriverTextSecondary)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back", tint = DriverTextPrimary)
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
            // Notice Card
            item {
                Surface(
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(Icons.Rounded.Shield, contentDescription = null, tint = Gold500, modifier = Modifier.size(24.dp))
                        Column {
                            Text("MoRTH Compliance & Chauffeur Standard", fontWeight = FontWeight.Bold, color = Gold500, fontSize = 13.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "All commercial driving licenses and background clearance certificates are securely encrypted and verified by the DriveTrust Operations Admin before you can go on duty.",
                                color = DriverTextSecondary,
                                fontSize = 11.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }

            if (showSuccessBanner) {
                item {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Mint50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint100),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Mint500, modifier = Modifier.size(22.dp))
                            Text(
                                "Documents successfully synchronized with Admin KYC Vault. Audit complete.",
                                color = Mint600,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Doc 1: Commercial DL Front
            item {
                DocumentItemCard(
                    title = "Commercial Driving License (Front)",
                    subtitle = "Shows DL Number, Driver Name & Valid Commercial Transport endorsement",
                    isUploaded = dlFrontUploaded,
                    onToggleUpload = { dlFrontUploaded = !dlFrontUploaded }
                )
            }

            // Doc 2: Commercial DL Back
            item {
                DocumentItemCard(
                    title = "Commercial Driving License (Back)",
                    subtitle = "Shows RTO Authority, validity date and vehicle class (LMV-TR / Transport)",
                    isUploaded = dlBackUploaded,
                    onToggleUpload = { dlBackUploaded = !dlBackUploaded }
                )
            }

            // Doc 3: Police Clearance Certificate (PCC)
            item {
                DocumentItemCard(
                    title = "Police Verification Clearance (PCC)",
                    subtitle = "Character & Criminal Background Clearance certificate from State Police",
                    isUploaded = policeCertUploaded,
                    onToggleUpload = { policeCertUploaded = !policeCertUploaded }
                )
            }

            // Doc 4: MoRTH Commercial Badge
            item {
                DocumentItemCard(
                    title = "MoRTH Commercial Chauffeur Badge",
                    subtitle = "Official metallic or plastic badge issued by Regional Transport Office",
                    isUploaded = badgeUploaded,
                    onToggleUpload = { badgeUploaded = !badgeUploaded }
                )
            }

            // Doc 5: Aadhaar Biometric Card
            item {
                DocumentItemCard(
                    title = "Aadhaar Card (Biometric ID)",
                    subtitle = "UIDAI verified identity proof with masked Aadhaar number",
                    isUploaded = aadhaarUploaded,
                    onToggleUpload = { aadhaarUploaded = !aadhaarUploaded }
                )
            }

            // Submit Button
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = {
                        showSuccessBanner = true
                        onSubmitForReview()
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                ) {
                    Icon(Icons.Rounded.CloudUpload, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Sync to Operations Admin Vault", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }
    }
}

@Composable
fun DocumentItemCard(
    title: String,
    subtitle: String,
    isUploaded: Boolean,
    onToggleUpload: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MidnightCard),
        border = androidx.compose.foundation.BorderStroke(1.dp, if (isUploaded) Mint500.copy(alpha = 0.4f) else MidnightBorder),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                Text(title, fontWeight = FontWeight.Bold, color = DriverTextPrimary, fontSize = 13.sp)
                Spacer(modifier = Modifier.height(3.dp))
                Text(subtitle, fontSize = 11.sp, color = DriverTextSecondary, lineHeight = 15.sp)
            }

            Button(
                onClick = onToggleUpload,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isUploaded) Mint50 else Gold50
                ),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isUploaded) Mint500.copy(alpha = 0.5f) else Gold500.copy(alpha = 0.5f)
                ),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (isUploaded) Icons.Rounded.CheckCircle else Icons.Rounded.CameraAlt,
                        contentDescription = null,
                        tint = if (isUploaded) Mint600 else Gold500,
                        modifier = Modifier.size(15.dp)
                    )
                    Text(
                        text = if (isUploaded) "Verified" else "Upload",
                        color = if (isUploaded) Mint600 else Gold500,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}
