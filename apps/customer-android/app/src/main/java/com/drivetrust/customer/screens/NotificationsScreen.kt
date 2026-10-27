package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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

data class AppNotification(
    val id: String,
    val title: String,
    val description: String,
    val timestamp: String,
    val type: NotificationType,
    val isRead: Boolean = false,
    val actionLabel: String? = null
)

enum class NotificationType(val icon: ImageVector, val badgeColor: Color) {
    TRIP(Icons.Rounded.DirectionsCar, Blue600),
    PAYMENT(Icons.Rounded.AccountBalanceWallet, Emerald600),
    OFFER(Icons.Rounded.LocalOffer, Gold500),
    SAFETY(Icons.Rounded.Shield, Red600),
    SYSTEM(Icons.Rounded.Info, Slate600)
}

@Composable
fun CustomerNotificationsScreen(
    onBack: () -> Unit,
    onOpenWallet: () -> Unit = {},
    onOpenOffers: () -> Unit = {}
) {
    var notifications by remember {
        mutableStateOf(
            listOf(
                AppNotification(
                    id = "notif-1",
                    title = "Chauffeur Assigned • Rajesh Sharma",
                    description = "Your commercial chauffeur Rajesh Sharma (4.96★) is en route to Vidisha Railway Station. Handover OTP: 8492.",
                    timestamp = "10 mins ago",
                    type = NotificationType.TRIP,
                    isRead = false,
                    actionLabel = "Track Live"
                ),
                AppNotification(
                    id = "notif-2",
                    title = "₹100 Referral Credit Added!",
                    description = "Your friend Priya R. completed her first chauffeur ride. ₹100 has been credited to your DT Wallet.",
                    timestamp = "2 hours ago",
                    type = NotificationType.PAYMENT,
                    isRead = false,
                    actionLabel = "View Wallet"
                ),
                AppNotification(
                    id = "notif-3",
                    title = "Night Safe-Drop 20% Cashback",
                    description = "Book any night chauffeur between 10 PM and 5 AM this week and get 20% instant cashback.",
                    timestamp = "Yesterday",
                    type = NotificationType.OFFER,
                    isRead = true,
                    actionLabel = "View Offer"
                ),
                AppNotification(
                    id = "notif-4",
                    title = "4-Point Handover Audit Logged",
                    description = "Vehicle handover inspection report for Toyota Fortuner (MP-40-CA-4921) logged to cloud audit vault.",
                    timestamp = "22 Oct 2026",
                    type = NotificationType.SAFETY,
                    isRead = true
                ),
                AppNotification(
                    id = "notif-5",
                    title = "Police Verification Certified",
                    description = "100% of DriveTrust chauffeurs in Vidisha & Bhopal have cleared MoRTH Sarathi background check.",
                    timestamp = "18 Oct 2026",
                    type = NotificationType.SYSTEM,
                    isRead = true
                )
            )
        )
    }

    var selectedFilter by remember { mutableStateOf("ALL") }

    val filteredNotifications = remember(notifications, selectedFilter) {
        when (selectedFilter) {
            "UNREAD" -> notifications.filter { !it.isRead }
            "TRIPS" -> notifications.filter { it.type == NotificationType.TRIP }
            "OFFERS" -> notifications.filter { it.type == NotificationType.OFFER || it.type == NotificationType.PAYMENT }
            else -> notifications
        }
    }

    val unreadCount = notifications.count { !it.isRead }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        // Luxury Top Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = Color.White,
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Rounded.ArrowBack, contentDescription = "Back", tint = Slate900)
                    }
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("Notifications", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Slate900, letterSpacing = (-0.5).sp)
                            if (unreadCount > 0) {
                                Surface(
                                    shape = CircleShape,
                                    color = Red600
                                ) {
                                    Text(
                                        text = "$unreadCount",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White,
                                        modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                        Text("Live trip updates & priority alerts", fontSize = 11.sp, color = Slate500)
                    }
                }

                if (unreadCount > 0) {
                    TextButton(
                        onClick = {
                            notifications = notifications.map { it.copy(isRead = true) }
                        }
                    ) {
                        Text("Mark all read", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Blue600)
                    }
                }
            }
        }

        // Filter Pills
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val filters = listOf("ALL" to "All", "UNREAD" to "Unread ($unreadCount)", "TRIPS" to "Trips", "OFFERS" to "Offers")
            filters.forEach { (key, label) ->
                val isSelected = selectedFilter == key
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = if (isSelected) Slate900 else Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) Slate900 else Slate200),
                    modifier = Modifier.clickable { selectedFilter = key }
                ) {
                    Text(
                        text = label,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) Color.White else Slate700,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                    )
                }
            }
        }

        // Notification List
        if (filteredNotifications.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Rounded.NotificationsNone, contentDescription = "None", tint = Slate400, modifier = Modifier.size(48.dp))
                    Text("No Notifications", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Slate800)
                    Text("You're all caught up! Trip updates and alerts will appear here.", fontSize = 12.sp, color = Slate500)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                items(filteredNotifications, key = { it.id }) { notif ->
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = if (notif.isRead) Color.White else Color(0xFFF8FAFC),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (notif.isRead) Slate200 else Gold500.copy(alpha = 0.5f)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                notifications = notifications.map {
                                    if (it.id == notif.id) it.copy(isRead = true) else it
                                }
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .background(notif.type.badgeColor.copy(alpha = 0.12f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = notif.type.icon,
                                    contentDescription = notif.title,
                                    tint = notif.type.badgeColor,
                                    modifier = Modifier.size(20.dp)
                                )
                            }

                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = notif.title,
                                        fontSize = 13.sp,
                                        fontWeight = if (notif.isRead) FontWeight.Bold else FontWeight.Black,
                                        color = Slate900,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Text(
                                        text = notif.timestamp,
                                        fontSize = 10.sp,
                                        color = Slate400
                                    )
                                }

                                Text(
                                    text = notif.description,
                                    fontSize = 12.sp,
                                    color = Slate600,
                                    lineHeight = 16.sp
                                )

                                if (notif.actionLabel != null) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Surface(
                                            shape = RoundedCornerShape(8.dp),
                                            color = Slate900,
                                            modifier = Modifier.clickable {
                                                when (notif.type) {
                                                    NotificationType.PAYMENT -> onOpenWallet()
                                                    NotificationType.OFFER -> onOpenOffers()
                                                    else -> onBack()
                                                }
                                            }
                                        ) {
                                            Text(
                                                text = notif.actionLabel,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White,
                                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                            )
                                        }
                                    }
                                }
                            }

                            if (!notif.isRead) {
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .background(Gold500, CircleShape)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
