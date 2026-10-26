package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import com.drivetrust.driver.theme.DriverColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DocumentUploadScreen(
    driverName: String,
    onBack: () -> Unit,
    onSubmitForReview: () -> Unit
) {
    var dlFrontUploaded by remember { mutableStateOf(true) }
    var dlBackUploaded by remember { mutableStateOf(true) }
    var policeCertUploaded by remember { mutableStateOf(false) }
    var badgeUploaded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("KYC Verification Documents", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text("Partner: $driverName (MoRTH Sarathi Audit)", fontSize = 12.sp, color = Color(0xFF94A3B8))
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
            // Notice Card
            item {
                Surface(
                    color = Color(0xFF0284C7).copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("Mandatory Admin Verification Notice", fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8), fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            "Under DriveTrust Chauffeur safety standards, all commercial licenses and badge credentials must be verified by an Administrator in the Admin KYC Vault before you can switch duty online.",
                            color = Color(0xFFBAE6FD),
                            fontSize = 11.sp,
                            lineHeight = 16.sp
                        )
                    }
                }
            }

            // Doc 1: Commercial DL Front
            item {
                DocumentItemCard(
                    title = "Commercial Driving License (Front)",
                    subtitle = "Showing DL Number, Name & Valid Commercial Transport endorsement",
                    isUploaded = dlFrontUploaded,
                    onToggleUpload = { dlFrontUploaded = !dlFrontUploaded }
                )
            }

            // Doc 2: Commercial DL Back
            item {
                DocumentItemCard(
                    title = "Commercial Driving License (Back)",
                    subtitle = "Showing RTO Issuing Authority and vehicle class (LMV-TR)",
                    isUploaded = dlBackUploaded,
                    onToggleUpload = { dlBackUploaded = !dlBackUploaded }
                )
            }

            // Doc 3: Police Clearance Certificate (PCC)
            item {
                DocumentItemCard(
                    title = "Police Verification Certificate (PCC)",
                    subtitle = "Character & Background Clearance from Karnataka State Police",
                    isUploaded = policeCertUploaded,
                    onToggleUpload = { policeCertUploaded = !policeCertUploaded }
                )
            }

            // Doc 4: MoRTH Commercial Badge
            item {
                DocumentItemCard(
                    title = "Commercial Driver Badge Photo",
                    subtitle = "Official metallic/plastic badge issued by Transport Department",
                    isUploaded = badgeUploaded,
                    onToggleUpload = { badgeUploaded = !badgeUploaded }
                )
            }

            // Submit Button
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = onSubmitForReview,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7))
                ) {
                    Text("Submit to Admin KYC Vault", fontWeight = FontWeight.Bold, color = Color.White)
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
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
        shape = RoundedCornerShape(14.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                Text(title, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                Spacer(modifier = Modifier.height(3.dp))
                Text(subtitle, fontSize = 11.sp, color = Color(0xFF94A3B8), lineHeight = 15.sp)
            }

            Button(
                onClick = onToggleUpload,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isUploaded) Color(0xFF10B981).copy(alpha = 0.2f) else Color(0xFF334155)
                ),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text(
                    text = if (isUploaded) "✓ Uploaded" else "Take Photo",
                    color = if (isUploaded) Color(0xFF34D399) else Color(0xFFCBD5E1),
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                )
            }
        }
    }
}
