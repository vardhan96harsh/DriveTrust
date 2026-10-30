package com.drivetrust.customer.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.theme.*

data class ChatMessage(
    val sender: String,
    val text: String,
    val time: String
)

@Composable
fun QuickChatDialog(
    driverName: String,
    onDismiss: () -> Unit
) {
    var messageText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage("DRIVER", "Namaste sir, I am reporting at your pickup location.", "9:42 AM")
        )
    }

    val quickReplies = listOf(
        "I am at the main gate",
        "Coming down in 3 mins",
        "Parked at Basement B14",
        "Please turn on AC in advance"
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 4.dp,
            modifier = Modifier
                .fillMaxWidth()
                .height(490.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Mint50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.5f)),
                            modifier = Modifier.size(38.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = driverName.take(2).uppercase(),
                                    color = Mint600,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp
                                )
                            }
                        }
                        Column {
                            Text(
                                text = driverName,
                                fontWeight = FontWeight.Black,
                                fontSize = 15.sp,
                                color = CustomerTextPrimary
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(Mint500, CircleShape)
                                Oddly = null
                                )
                                Text(
                                    text = "Chauffeur Connected",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Mint600
                                )
                            }
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
                            .background(CustomerInnerSurfaceLight, CircleShape)
                    ) {
                        Icon(
                            Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = CustomerTextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                HorizontalDivider(color = CustomerCardBorderLight)

                // Message Thread
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(vertical = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(messages) { msg ->
                        val isCustomer = msg.sender == "CUSTOMER"
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = if (isCustomer) Alignment.End else Alignment.Start
                        ) {
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = if (isCustomer) Mint500 else CustomerInnerSurfaceLight,
                                border = if (isCustomer) null else androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                                modifier = Modifier.widthIn(max = 250.dp)
                            ) {
                                Text(
                                    text = msg.text,
                                    color = if (isCustomer) Color.White else CustomerTextPrimary,
                                    fontSize = 12.sp,
                                    fontWeight = if (isCustomer) FontWeight.SemiBold else FontWeight.Normal,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                )
                            }
                            Text(
                                text = msg.time,
                                fontSize = 9.sp,
                                color = CustomerTextSecondary,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                // Quick Reply Chips
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    items(quickReplies) { chip ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            onClick = {
                                messages.add(ChatMessage("CUSTOMER", chip, "Just now"))
                            }
                        ) {
                            Text(
                                text = chip,
                                fontSize = 10.sp,
                                color = Mint600,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp)
                            )
                        }
                    }
                }

                // Text Input and Send Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = messageText,
                        onValueChange = { messageText = it },
                        placeholder = { Text("Type instruction for chauffeur...", fontSize = 11.sp, color = CustomerTextSecondary) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = CustomerTextPrimary,
                            unfocusedTextColor = CustomerTextPrimary,
                            focusedBorderColor = Mint500,
                            unfocusedBorderColor = CustomerCardBorderLight,
                            focusedContainerColor = CustomerInnerSurfaceLight,
                            unfocusedContainerColor = CustomerInnerSurfaceLight
                        ),
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    IconButton(
                        onClick = {
                            if (messageText.isNotBlank()) {
                                messages.add(ChatMessage("CUSTOMER", messageText.trim(), "Just now"))
                                messageText = ""
                            }
                        },
                        modifier = Modifier
                            .size(46.dp)
                            .background(Mint500, RoundedCornerShape(12.dp))
                    ) {
                        Icon(
                            Icons.Rounded.Send,
                            contentDescription = "Send",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}
