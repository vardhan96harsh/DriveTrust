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
                            .background(MidnightCard, CircleShape)
                            .border(1.dp, MidnightBorder, CircleShape)
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
                            text = "Preferences & System",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "App preferences, alerts & security standards",
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
            if (cacheClearedFeedback) {
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
                            contentDescription = "Cleared",
                            tint = Emerald400,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            "Cached routes, invoice previews and temporary files cleared!",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald400
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
                            color = if (isSelected) Gold500 else MidnightDark,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) Gold400 else MidnightBorder
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { selectedLanguage = code }
                        ) {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                                color = if (isSelected) Slate900 else Slate300,
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
                HorizontalDivider(color = MidnightBorder)
                SettingsSwitchRow(
                    label = "Safety & Emergency Alerts",
                    description = "SOS triggers, handover audit sign-offs, and route deviations",
                    checked = safetyAlertsEnabled,
                    onCheckedChange = { safetyAlertsEnabled = it }
                )
                HorizontalDivider(color = MidnightBorder)
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
                        Text("Clear Cached App Data", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Removes temporary map routes and PDF cache (18.4 MB)", fontSize = 11.sp, color = Slate400)
                    }
                    OutlinedButton(
                        onClick = { cacheClearedFeedback = true },
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.5f)),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Gold400)
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
                    Text("App Version", fontSize = 12.sp, color = Slate400)
                    Text("DriveTrust Customer v2.5.0-PROD", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
                HorizontalDivider(color = MidnightBorder)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Regulatory Compliance", fontSize = 12.sp, color = Slate400)
                    Text("MoRTH Sarathi & MP Police Cleared", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                }
                HorizontalDivider(color = MidnightBorder)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Operation Hub", fontSize = 12.sp, color = Slate400)
                    Text("Vidisha & Bhopal Central Fleet", fontSize = 12.sp, color = Gold400, fontWeight = FontWeight.SemiBold)
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
                tint = Gold400,
                modifier = Modifier.size(14.dp)
            )
            Text(title, fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
        }
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MidnightCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
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
            Text(label, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text(description, fontSize = 11.sp, color = Slate400, lineHeight = 15.sp)
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = Gold500, checkedTrackColor = MidnightDark)
        )
    }
}
