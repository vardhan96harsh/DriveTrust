package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.Logout
import androidx.compose.material.icons.rounded.Language
import androidx.compose.material.icons.rounded.PowerSettingsNew
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.theme.*

@Composable
fun DriverTopBar(
    driver: DriverProfile,
    onToggleDuty: () -> Unit,
    onLogoutClick: () -> Unit,
    onLanguageClick: (() -> Unit)? = null
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MidnightCard,
        shadowElevation = 4.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(Midnight950, RoundedCornerShape(12.dp))
                        .border(1.dp, Gold500.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = driver.fullName.take(2).uppercase(),
                        color = Gold500,
                        fontWeight = FontWeight.Black,
                        fontSize = 14.sp
                    )
                }
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = driver.fullName.split(" ")[0],
                            fontWeight = FontWeight.Black,
                            fontSize = 15.sp,
                            color = Color.White
                        )
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(
                                    if (driver.isOnline) Emerald400 else Red500,
                                    CircleShape
                                )
                        )
                    }
                    Text(
                        text = "Balance: ₹${driver.walletBalance.toInt()}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = Gold400
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (onLanguageClick != null) {
                    IconButton(
                        onClick = onLanguageClick,
                        modifier = Modifier
                            .size(36.dp)
                            .background(Midnight950, CircleShape)
                            .border(1.dp, MidnightBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Language,
                            contentDescription = "Language",
                            tint = Gold400,
                            modifier = Modifier.size(17.dp)
                        )
                    }
                }

                Button(
                    onClick = onToggleDuty,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (driver.isOnline) Emerald500 else Midnight950,
                        contentColor = if (driver.isOnline) Color.White else Slate300
                    ),
                    border = if (driver.isOnline) null else androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.PowerSettingsNew,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = if (driver.isOnline) Color.White else Slate400
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (driver.isOnline) "ONLINE" else "OFFLINE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black
                    )
                }

                IconButton(
                    onClick = onLogoutClick,
                    modifier = Modifier
                        .size(36.dp)
                        .background(Midnight950, CircleShape)
                        .border(1.dp, MidnightBorder, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Rounded.Logout,
                        contentDescription = "Exit",
                        tint = Slate400,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}
