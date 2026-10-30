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
fun CustomerAppSettingsScreen(
    onBack: () -> Unit
) {
    var selectedLanguage by remember { mutableStateOf("ENGLISH") }
    var tripUpdatesEnabled by remember { mutableStateOf(true) }
    var chauffeurArrivalEnabled by remember { mutableStateOf(true) }
    var promoOffersEnabled by remember { mutableStateOf(true) }
    var safetyAlertsEnabled by remember { mutableStateOf(true) }
    var autoShareWithFamily by remember { mutableStateOf(true) }
    var cacheClearedFeedback by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
    ) {
        // Luxury Top App Bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = CustomerBackgroundLight,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 2.dp
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
                    Column {
                        Text(
                            text = "Preferences & System",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "App preferences, alerts & security standards",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
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
            if (cacheClearedFeedback) {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Mint50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.CheckCircle,
                            contentDescription = "Cleared",
                            tint = Mint600,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            "Cached routes, invoice previews and temporary files cleared!",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Mint600
                        )
                    }
                }
            }

            // Language Selector
            SettingsSection(
                title = "SYSTEM LANGUAGE / भाषा",
                icon = Icons.Rounded.Language
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    val langs = listOf("ENGLISH" to "English (EN)", "HINDI" to "हिन्दी (HI)")
                    langs.forEach { (code, label) ->
                        val isSelected = selectedLanguage == code
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) Mint500 else CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) Mint500 else CustomerCardBorderLight
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { selectedLanguage = code }
                        ) {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
                                color = if (isSelected) Color.White else CustomerTextPrimary,
                                modifier = Modifier.padding(vertical = 12.dp, horizontal = 14.dp),
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }
            }

            // Notifications
            SettingsSection(
                title = "NOTIFICATION DISPATCH",
                icon = Icons.Rounded.Notifications
            ) {
                SettingsSwitchRow(
                    label = "Live Trip & Chauffeur Updates",
                    description = "Instant SMS and notifications when driver is en route or arrives",
                    checked = tripUpdatesEnabled,
                    onCheckedChange = { tripUpdatesEnabled = it }
                )
                HorizontalDivider(color = CustomerCardBorderLight)
                SettingsSwitchRow(
                    label = "Safety & Emergency Alerts",
                    description = "SOS triggers, handover audit sign-offs, and route deviations",
                    checked = safetyAlertsEnabled,
                    onCheckedChange = { safetyAlertsEnabled = it }
                )
                HorizontalDivider(color = CustomerCardBorderLight)
                SettingsSwitchRow(
                    label = "Discounts & Cashback Offers",
                    description = "Weekly coupon codes and DT Wallet reward bonuses",
                    checked = promoOffersEnabled,
                    onCheckedChange = { promoOffersEnabled = it }
                )
            }

            // Safety Defaults
            SettingsSection(
                title = "PROACTIVE SAFETY AUTOMATION",
                icon = Icons.Rounded.Security
            ) {
                SettingsSwitchRow(
                    label = "Auto-Share Trips with Emergency Contact",
                    description = "Automatically sends live GPS tracking link to your trusted family contact upon trip start",
                    checked = autoShareWithFamily,
                    onCheckedChange = { autoShareWithFamily = it }
                )
            }

            // Data & Cache
            SettingsSection(
                title = "DATA STORAGE & CACHE",
                icon = Icons.Rounded.Storage
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Clear Cached App Data", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                        Text("Removes temporary map routes and PDF cache (18.4 MB)", fontSize = 11.sp, color = CustomerTextSecondary)
                    }
                    OutlinedButton(
                        onClick = { cacheClearedFeedback = true },
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Mint500),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Mint600)
                    ) {
                        Text("Clear", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Build Info
            SettingsSection(
                title = "APPLICATION CERTIFICATION",
                icon = Icons.Rounded.Info
            ) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("App Version", fontSize = 12.sp, color = CustomerTextSecondary)
                    Text("DriveTrust Customer v2.5.0-PROD", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                }
                HorizontalDivider(color = CustomerCardBorderLight)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Regulatory Compliance", fontSize = 12.sp, color = CustomerTextSecondary)
                    Text("MoRTH Sarathi & MP Police Cleared", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Mint600)
                }
                HorizontalDivider(color = CustomerCardBorderLight)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Operation Hub", fontSize = 12.sp, color = CustomerTextSecondary)
                    Text("Vidisha & Bhopal Central Fleet", fontSize = 12.sp, color = Gold600, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Composable
private fun SettingsSection(
    title: String,
    icon: ImageVector,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Gold600,
                modifier = Modifier.size(14.dp)
            )
            Text(title, fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold600, letterSpacing = 0.8.sp)
        }
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun SettingsSwitchRow(
    label: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
            Text(label, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
            Text(description, fontSize = 11.sp, color = CustomerTextSecondary, lineHeight = 15.sp)
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Mint500,
                uncheckedThumbColor = Slate400,
                uncheckedTrackColor = Slate200
            )
        )
    }
}
