package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.theme.*

@Composable
fun CustomerProfileScreen(
    customerName: String,
    customerPhone: String,
    onLogoutClick: () -> Unit,
    onOpenSafetyCenter: () -> Unit,
    onOpenFavorites: () -> Unit = {},
    onOpenCorporate: () -> Unit = {},
    onOpenReferral: () -> Unit = {},
    onOpenOffers: () -> Unit = {},
    onOpenSupport: () -> Unit = {},
    onOpenSettings: () -> Unit = {},
    onOpenNotifications: () -> Unit = {}
) {
    var name by remember { mutableStateOf(customerName) }
    var phone by remember { mutableStateOf(customerPhone) }
    var email by remember { mutableStateOf("harsh@example.com") }
    var city by remember { mutableStateOf("Vidisha") }
    var emergencyContact by remember { mutableStateOf("Family Contact (Vidisha)") }
    var emergencyPhone by remember { mutableStateOf("+91 94251 09876") }
    var isEditing by remember { mutableStateOf(false) }
    var savedSuccess by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Luxury Header
        Surface(modifier = Modifier.fillMaxWidth(), color = Color.White, shadowElevation = 2.dp) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Executive Profile", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Slate900, letterSpacing = (-0.5).sp)
                    Text("Client Member Account", fontSize = 11.sp, color = Slate500)
                }
                TextButton(
                    onClick = { if (isEditing) { savedSuccess = true; isEditing = false } else isEditing = true },
                    colors = ButtonDefaults.textButtonColors(contentColor = if (isEditing) Emerald600 else Slate900)
                ) {
                    Text(if (isEditing) "Save ✓" else "Edit Profile", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Column(
            modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Executive Avatar Card
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Slate900,
                shadowElevation = 6.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DarkMeshGradient)
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .background(Slate800, CircleShape)
                                .border(1.5.dp, Gold400, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = name.take(2).uppercase(),
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Black,
                                color = Gold400
                            )
                        }
                        Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            Text(name, fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Text(phone, fontSize = 12.sp, color = Slate300)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Surface(shape = RoundedCornerShape(4.dp), color = Slate800) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(3.dp)
                                    ) {
                                        Icon(Icons.Rounded.Verified, contentDescription = "KYC", tint = Emerald400, modifier = Modifier.size(10.dp))
                                        Text("KYC CLEARED", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Emerald400)
                                    }
                                }
                                Surface(shape = RoundedCornerShape(4.dp), color = Slate800) {
                                    Text("VIP PASSENGER", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Gold400, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                }
                            }
                        }
                    }
                }
            }

            if (savedSuccess) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Emerald50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("✓ Profile saved successfully!", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald600, modifier = Modifier.padding(12.dp))
                }
                LaunchedEffect(savedSuccess) {
                    kotlinx.coroutines.delay(2500)
                    savedSuccess = false
                }
            }

            // Services & Shortcuts (Clean vector iconography)
            ProfileSection(title = "SERVICES & PERKS") {
                ProfileShortcutRow(
                    icon = Icons.Rounded.Star,
                    iconTint = Gold500,
                    title = "Favorite Chauffeurs",
                    subtitle = "Request your trusted, top-rated drivers",
                    onClick = onOpenFavorites
                )
                HorizontalDivider(color = Slate100)
                ProfileShortcutRow(
                    icon = Icons.Rounded.Business,
                    iconTint = Slate800,
                    title = "Corporate Profile & GST",
                    subtitle = "Business billing & 18% ITC tax invoices",
                    onClick = onOpenCorporate
                )
                HorizontalDivider(color = Slate100)
                ProfileShortcutRow(
                    icon = Icons.Rounded.CardGiftcard,
                    iconTint = Emerald600,
                    title = "Refer & Earn ₹100",
                    subtitle = "Invite friends and get ₹100 in DT Wallet",
                    onClick = onOpenReferral
                )
                HorizontalDivider(color = Slate100)
                ProfileShortcutRow(
                    icon = Icons.Rounded.LocalOffer,
                    iconTint = Gold600,
                    title = "Offers & Coupons",
                    subtitle = "Discounts on safe drops & hourly bookings",
                    onClick = onOpenOffers
                )
                HorizontalDivider(color = Slate100)
                ProfileShortcutRow(
                    icon = Icons.Rounded.SupportAgent,
                    iconTint = Blue600,
                    title = "Help & 24x7 Care",
                    subtitle = "FAQs, live chat bot & ticket resolution",
                    onClick = onOpenSupport
                )
                HorizontalDivider(color = Slate100)
                ProfileShortcutRow(
                    icon = Icons.Rounded.Settings,
                    iconTint = Slate700,
                    title = "App Settings",
                    subtitle = "Language (English/हिन्दी), alerts & cache",
                    onClick = onOpenSettings
                )
            }

            // Personal Information
            ProfileSection(title = "PERSONAL CREDENTIALS") {
                if (isEditing) {
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Full Name") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                    OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Mobile Phone") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email Address") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                    OutlinedTextField(value = city, onValueChange = { city = it }, label = { Text("City") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                } else {
                    ProfileInfoRow(label = "Full Name", value = name)
                    ProfileInfoRow(label = "Mobile", value = phone)
                    ProfileInfoRow(label = "Email", value = email)
                    ProfileInfoRow(label = "Home City", value = city)
                }
            }

            // Emergency contact
            ProfileSection(title = "EMERGENCY CONTACT & SAFETY") {
                if (isEditing) {
                    OutlinedTextField(value = emergencyContact, onValueChange = { emergencyContact = it }, label = { Text("Contact Name") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                    OutlinedTextField(value = emergencyPhone, onValueChange = { emergencyPhone = it }, label = { Text("Contact Phone") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp))
                } else {
                    ProfileInfoRow(label = "Primary Contact", value = emergencyContact)
                    ProfileInfoRow(label = "Phone", value = emergencyPhone)
                    Text("Auto-alerted via SMS with live tracking when SOS is triggered.", fontSize = 11.sp, color = Slate500)
                }
            }

            // KYC & Verification
            ProfileSection(title = "KYC & VERIFICATION") {
                VerificationRow(label = "Aadhaar Identity", isVerified = true)
                VerificationRow(label = "Phone Number OTP", isVerified = true)
                VerificationRow(label = "Email Address", isVerified = false)
            }

            // Safety Center Quick Link Card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFFEF2F2),
                border = androidx.compose.foundation.BorderStroke(1.dp, Red600.copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(Icons.Rounded.Shield, contentDescription = "Safety", tint = Red600, modifier = Modifier.size(24.dp))
                        Column {
                            Text("Safety Shield Center", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Red600)
                            Text("Direct 112 dialer, live trip sharing", fontSize = 11.sp, color = Slate600)
                        }
                    }
                    OutlinedButton(
                        onClick = onOpenSafetyCenter,
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Red600),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text("Open", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // App info
            ProfileSection(title = "APP INFORMATION") {
                ProfileInfoRow(label = "Version", value = "DriveTrust v2.5.0-PROD")
                ProfileInfoRow(label = "Platform", value = "Android Client")
                ProfileInfoRow(label = "Corporate Support", value = "support@drivetrust.in")
            }

            // Logout
            Button(
                onClick = onLogoutClick,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("Sign Out", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
            }

            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}

@Composable
private fun ProfileSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(title, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500, letterSpacing = 0.5.sp)
        Surface(shape = RoundedCornerShape(16.dp), color = Color.White, border = androidx.compose.foundation.BorderStroke(1.dp, Slate200), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun ProfileInfoRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, fontSize = 13.sp, color = Slate500)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Slate900)
    }
}

@Composable
private fun VerificationRow(label: String, isVerified: Boolean) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text(label, fontSize = 13.sp, color = Slate700)
        Surface(shape = RoundedCornerShape(6.dp), color = if (isVerified) Emerald50 else Amber50) {
            Text(
                text = if (isVerified) "✓ Verified" else "Pending",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (isVerified) Emerald600 else Amber600,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
            )
        }
    }
}

@Composable
private fun ProfileShortcutRow(
    icon: ImageVector,
    iconTint: Color,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(iconTint.copy(alpha = 0.1f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = iconTint,
                    modifier = Modifier.size(18.dp)
                )
            }
            Column {
                Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Slate900)
                Text(subtitle, fontSize = 11.sp, color = Slate500)
            }
        }
        Text("›", fontSize = 18.sp, color = Slate400, fontWeight = FontWeight.Bold)
    }
}
