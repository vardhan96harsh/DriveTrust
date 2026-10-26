package com.drivetrust.customer.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
            color = Color.White,
            modifier = Modifier.fillMaxWidth().height(480.dp)
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
                    Column {
                        Text(
                            text = driverName,
                            fontWeight = FontWeight.Black,
                            fontSize = 16.sp,
                            color = Slate900
                        )
                        Text(
                            text = "● Chauffeur is Online",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald600
                        )
                    }
                    TextButton(onClick = onDismiss) {
                        Text(text = "Close", color = Slate500, fontSize = 12.sp)
                    }
                }

                HorizontalDivider(color = Slate200)

                // Message Thread
                LazyColumn(
                    modifier = Modifier.weight(1f).padding(vertical = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(messages) { msg ->
                        val isCustomer = msg.sender == "CUSTOMER"
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = if (isCustomer) Alignment.End else Alignment.Start
                        ) {
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = if (isCustomer) Slate900 else Slate100,
                                modifier = Modifier.widthIn(max = 240.dp)
                            ) {
                                Text(
                                    text = msg.text,
                                    color = if (isCustomer) Color.White else Slate900,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(10.dp)
                                )
                            }
                            Text(
                                text = msg.time,
                                fontSize = 9.sp,
                                color = Slate400,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                // Quick Reply Chips
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(vertical = 6.dp)
                ) {
                    items(quickReplies) { chip ->
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Slate100,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                            onClick = {
                                messages.add(ChatMessage("CUSTOMER", chip, "Just now"))
                            }
                        ) {
                            Text(
                                text = chip,
                                fontSize = 11.sp,
                                color = Slate700,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                // Input Box
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = messageText,
                        onValueChange = { messageText = it },
                        placeholder = { Text("Message chauffeur...", fontSize = 12.sp) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    )
                    Button(
                        onClick = {
                            if (messageText.isNotBlank()) {
                                messages.add(ChatMessage("CUSTOMER", messageText, "Just now"))
                                messageText = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Send", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
