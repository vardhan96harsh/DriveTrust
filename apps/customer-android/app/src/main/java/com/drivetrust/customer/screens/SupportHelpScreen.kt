package com.drivetrust.customer.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.theme.*

data class FaqItem(
    val category: String,
    val question: String,
    val answer: String
)

data class SupportChatMessage(
    val sender: String, // "BOT" or "USER"
    val message: String,
    val timestamp: String
)

@Composable
fun CustomerSupportHelpScreen(
    onBack: () -> Unit,
    onCallHelpline: () -> Unit = {}
) {
    var showChatDialog by remember { mutableStateOf(false) }
    var showTicketDialog by remember { mutableStateOf(false) }
    var expandedFaqIndex by remember { mutableStateOf<Int?>(null) }
    var ticketSuccessMessage by remember { mutableStateOf<String?>(null) }

    val faqs = remember {
        listOf(
            FaqItem(
                category = "SAFETY & VETTING",
                question = "How are DriveTrust commercial chauffeurs vetted?",
                answer = "Every DriveTrust driver holds a commercial badge, undergoes biometric Aadhaar and MoRTH Sarathi DL verification, passes an in-person luxury car road test, and completes local police background screening."
            ),
            FaqItem(
                category = "VEHICLE CARE",
                question = "Is my vehicle insured while a chauffeur drives it?",
                answer = "Yes. DriveTrust covers every trip with an active ₹10,00,000 Comprehensive Transit Protection Policy. In addition, our mandatory 4-Point Vehicle Handover Audit records photos, odometer, and fuel level before and after every trip."
            ),
            FaqItem(
                category = "FARES & BILLING",
                question = "How are tolls, night charges and waiting fees calculated?",
                answer = "Tolls are billed at actuals. Night surge (1.20x) applies from 10:00 PM to 05:00 AM. Every ride includes 10 minutes of complimentary waiting time; beyond that, waiting demurrage is billed at ₹3/min."
            ),
            FaqItem(
                category = "CANCELLATION",
                question = "What is the cancellation policy for scheduled bookings?",
                answer = "You can cancel free of charge up to 15 minutes before the scheduled arrival time. If cancelled after the chauffeur has arrived at your pickup location, a standard ₹50 arrival compensation is charged."
            ),
            FaqItem(
                category = "DT WALLET",
                question = "How do wallet refunds and cashback work?",
                answer = "Refunds and promo cashback are credited instantaneously to your DT Wallet. Wallet balance can be used across all DriveTrust services or transferred back to your linked UPI VPA anytime."
            )
        )
    }

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
                            text = "Executive Concierge & Support",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "24x7 Priority Chauffeur & Safety Care",
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                }
            }
        }

        if (ticketSuccessMessage != null) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(14.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.6f))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.CheckCircle,
                        contentDescription = "Success",
                        tint = Emerald400,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(ticketSuccessMessage!!, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                }
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            // Quick Assistance Cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // 24x7 Helpline Card
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Red500.copy(alpha = 0.5f)),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onCallHelpline() }
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(Red500.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Emergency,
                                    contentDescription = "Emergency",
                                    tint = Red400,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Text("Emergency Care", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Text("Dial 112 / Central Safety Dispatch", fontSize = 10.sp, color = Slate400)
                            Text("CALL NOW →", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Red400)
                        }
                    }

                    // Live AI / Agent Chat Card
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = MidnightCard,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.5f)),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { showChatDialog = true }
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(Gold500.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Chat,
                                    contentDescription = "Chat",
                                    tint = Gold400,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Text("24x7 Live Concierge", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Text("Instant resolution for trips & fares", fontSize = 10.sp, color = Slate400)
                            Text("START CHAT →", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400)
                        }
                    }
                }
            }

            // Ticket Resolution Banner
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("ISSUE WITH A PAST TRIP?", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
                            Text("Raise a Support Ticket", fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Text("Billing disputes, lost items, or driver feedback.", fontSize = 11.sp, color = Slate400)
                        }
                        Button(
                            onClick = { showTicketDialog = true },
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Gold500)
                        ) {
                            Text("Raise Ticket", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate900)
                        }
                    }
                }
            }

            // FAQs Section Header
            item {
                Text(
                    text = "FREQUENTLY ASKED QUESTIONS",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate400,
                    letterSpacing = 0.8.sp
                )
            }

            // FAQ Accordion items
            items(faqs.indices.toList()) { index ->
                val faq = faqs[index]
                val isExpanded = expandedFaqIndex == index

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            expandedFaqIndex = if (isExpanded) null else index
                        }
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(faq.category, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Gold400, letterSpacing = 0.5.sp)
                                Text(faq.question, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Icon(
                                imageVector = if (isExpanded) Icons.Rounded.ExpandLess else Icons.Rounded.ExpandMore,
                                contentDescription = if (isExpanded) "Collapse" else "Expand",
                                tint = Slate400,
                                modifier = Modifier.padding(start = 8.dp)
                            )
                        }

                        AnimatedVisibility(visible = isExpanded) {
                            Column(modifier = Modifier.padding(top = 6.dp)) {
                                HorizontalDivider(color = MidnightBorder)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(faq.answer, fontSize = 12.sp, color = Slate300, lineHeight = 18.sp)
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal 1: Live Interactive Chat Dialog
    if (showChatDialog) {
        SupportChatModal(onDismiss = { showChatDialog = false })
    }

    // Modal 2: Raise Ticket Dialog
    if (showTicketDialog) {
        RaiseTicketModal(
            onDismiss = { showTicketDialog = false },
            onSubmitTicket = { subject, desc ->
                showTicketDialog = false
                val ticketId = "DT-TCK-" + (1000..9999).random()
                ticketSuccessMessage = "Ticket #$ticketId submitted! DriveTrust safety officer will contact you within 15 minutes."
            }
        )
    }
}

@Composable
fun SupportChatModal(onDismiss: () -> Unit) {
    var userMessageInput by remember { mutableStateOf("") }
    var chatMessages by remember {
        mutableStateOf(
            listOf(
                SupportChatMessage("BOT", "Hello Harshvardhan! Welcome to DriveTrust 24x7 Live Support. How may I assist you today?", "Just now")
            )
        )
    }

    val quickQuestions = listOf(
        "Where is my assigned chauffeur?",
        "How does handover inspection work?",
        "Need a GST Tax invoice copy",
        "Report lost property in car"
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White,
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Chat Header
                Surface(
                    color = MidnightDark,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Box(modifier = Modifier.size(36.dp).background(Gold500.copy(alpha = 0.15f), CircleShape).border(1.dp, Gold500.copy(alpha = 0.4f), CircleShape), contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Rounded.Security,
                                    contentDescription = "Concierge Bot",
                                    tint = Gold400,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Column {
                                Text("DriveTrust Executive Concierge", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color.White)
                                Text("● Online • Average response: Instant", fontSize = 10.sp, color = Emerald400)
                            }
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Close",
                                tint = Slate400,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }

                // Chat Messages
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(chatMessages) { msg ->
                        val isBot = msg.sender == "BOT"
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = if (isBot) Alignment.Start else Alignment.End
                        ) {
                            Surface(
                                shape = RoundedCornerShape(
                                    topStart = 14.dp,
                                    topEnd = 14.dp,
                                    bottomStart = if (isBot) 2.dp else 14.dp,
                                    bottomEnd = if (isBot) 14.dp else 2.dp
                                ),
                                color = if (isBot) Slate100 else Slate900,
                                modifier = Modifier.widthIn(max = 260.dp)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        text = msg.message,
                                        fontSize = 12.sp,
                                        color = if (isBot) Slate900 else Color.White,
                                        lineHeight = 16.sp
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = msg.timestamp,
                                        fontSize = 9.sp,
                                        color = if (isBot) Slate500 else Slate400,
                                        modifier = Modifier.align(Alignment.End)
                                    )
                                }
                            }
                        }
                    }
                }

                // Quick Question Pills
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("QUICK SUGGESTIONS:", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        quickQuestions.take(2).forEach { q ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Slate100,
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        chatMessages = chatMessages + SupportChatMessage("USER", q, "Just now")
                                        val reply = when {
                                            q.contains("assigned chauffeur", ignoreCase = true) ->
                                                "Your assigned chauffeur Rajesh Sharma is on duty in Vidisha. Current ETA is ~3-8 minutes. You can also view his live location on the Tracking screen."
                                            q.contains("handover inspection", ignoreCase = true) ->
                                                "Our 4-Point Pre-Trip Audit checks exterior scratches, tires, starting odometer km, and fuel percentage. Both you and chauffeur digitally sign off before keys are handed over."
                                            q.contains("GST", ignoreCase = true) ->
                                                "GST invoices are automatically generated after every trip. You can download the PDF from the History tab or Corporate Billing screen."
                                            else ->
                                                "If you left personal property in your car, don't worry! Our verified chauffeur is bound by DriveTrust pledge. We have flagged ticket #LF-9921 for dispatch."
                                        }
                                        chatMessages = chatMessages + SupportChatMessage("BOT", reply, "Just now")
                                    }
                            ) {
                                Text(q, fontSize = 10.sp, color = Slate700, modifier = Modifier.padding(6.dp), maxLines = 1)
                            }
                        }
                    }
                }

                // Input bar
                Surface(
                    color = Color.White,
                    shadowElevation = 4.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = userMessageInput,
                            onValueChange = { userMessageInput = it },
                            placeholder = { Text("Type your query...", fontSize = 12.sp) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                        Button(
                            onClick = {
                                if (userMessageInput.isNotBlank()) {
                                    val text = userMessageInput.trim()
                                    userMessageInput = ""
                                    chatMessages = chatMessages + SupportChatMessage("USER", text, "Just now")
                                    chatMessages = chatMessages + SupportChatMessage(
                                        "BOT",
                                        "Thank you for contacting us. A dedicated safety specialist in Vidisha (M.P.) has received your message and will respond shortly.",
                                        "Just now"
                                    )
                                }
                            },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                        ) {
                            Text("Send", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun RaiseTicketModal(
    onDismiss: () -> Unit,
    onSubmitTicket: (subject: String, description: String) -> Unit
) {
    var subject by remember { mutableStateOf("Billing / Fare Discrepancy") }
    var bookingCode by remember { mutableStateOf("DT-982103") }
    var description by remember { mutableStateOf("") }

    val subjects = listOf(
        "Billing / Fare Discrepancy",
        "Vehicle Handover Inspection Concern",
        "Lost & Found Item",
        "Chauffeur Behavior / Delay",
        "Other Operational Issue"
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Raise Support Ticket", fontSize = 16.sp, fontWeight = FontWeight.Black, color = Slate900)
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = Slate500,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Text("SUBJECT / CATEGORY", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    subjects.take(3).forEach { s ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (subject == s) Slate900 else Slate100,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { subject = s }
                        ) {
                            Text(
                                text = s,
                                fontSize = 11.sp,
                                fontWeight = if (subject == s) FontWeight.Bold else FontWeight.Normal,
                                color = if (subject == s) Color.White else Slate800,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)
                            )
                        }
                    }
                }

                Text("BOOKING REFERENCE CODE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                OutlinedTextField(
                    value = bookingCode,
                    onValueChange = { bookingCode = it },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )

                Text("DESCRIPTION", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    placeholder = { Text("Explain your issue in detail...", fontSize = 11.sp) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp),
                    shape = RoundedCornerShape(10.dp)
                )

                Button(
                    onClick = {
                        onSubmitTicket(subject, description)
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                ) {
                    Text("SUBMIT TICKET", fontWeight = FontWeight.Black, color = Color.White)
                }
            }
        }
    }
}
