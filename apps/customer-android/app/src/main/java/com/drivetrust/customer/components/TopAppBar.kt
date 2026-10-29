package com.drivetrust.customer.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.theme.*

@Composable
fun CustomerTopAppBar(
    customerName: String,
    unreadNotificationCount: Int = 2,
    onOpenNotifications: () -> Unit = {},
    onOpenSupport: () -> Unit = {},
    onLogoutClick: () -> Unit = {}
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MidnightCard,
        shadowElevation = 8.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: Luxury Monogram & Brand Headline
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .background(Mint50, CircleShape)
                        .border(1.5.dp, Mint500, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "DT",
                        color = Mint500,
                        fontWeight = FontWeight.Black,
                        fontSize = 16.sp,
                        letterSpacing = 1.sp
                    )
                }

                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = "DriveTrust",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = CustomerTextPrimary,
                            letterSpacing = (-0.3).sp
                        )
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Mint50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(3.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Shield,
                                    contentDescription = "Verified",
                                    tint = Mint500,
                                    modifier = Modifier.size(9.dp)
                                )
                                Text(
                                    text = "LUXURY",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Mint500,
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }
                    }
                    Text(
                        text = "Private Chauffeur • $customerName",
                        fontSize = 11.sp,
                        color = CustomerTextSecondary,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Right: Clean Luxury Action Buttons
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Support Icon Button
                Surface(
                    shape = CircleShape,
                    color = MidnightDark,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.size(38.dp),
                    onClick = onOpenSupport
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.HelpOutline,
                            contentDescription = "Help & Support",
                            tint = Slate300,
                            modifier = Modifier.size(19.dp)
                        )
                    }
                }

                // Notification Bell Button with Amber/Red Live Dot
                Box(contentAlignment = Alignment.TopEnd) {
                    Surface(
                        shape = CircleShape,
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        modifier = Modifier.size(38.dp),
                        onClick = onOpenNotifications
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Rounded.Notifications,
                                contentDescription = "Notifications",
                                tint = Slate300,
                                modifier = Modifier.size(19.dp)
                            )
                        }
                    }
                    if (unreadNotificationCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .background(Gold500, CircleShape)
                                .border(1.5.dp, MidnightCard, CircleShape)
                        )
                    }
                }

                // Logout Button
                Surface(
                    shape = CircleShape,
                    color = MidnightDark,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.size(38.dp),
                    onClick = onLogoutClick
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.Logout,
                            contentDescription = "Logout",
                            tint = Slate400,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}
