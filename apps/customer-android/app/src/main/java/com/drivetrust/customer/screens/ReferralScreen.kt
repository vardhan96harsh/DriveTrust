package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.drivetrust.customer.theme.*

@Composable
fun CustomerReferralScreen(
    onBack: () -> Unit,
    onOpenWallet: () -> Unit = {}
) {
    val referralCode = "DTHARSH2026"
    var isCopied by remember { mutableStateOf(false) }

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
                            text = "Executive Referral Privilege",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Share the prestige. Earn ₹100 wallet credit.",
                            fontSize = 11.sp,
                            color = CustomerTextSecondary
                        )
                    }
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
            // Hero Referral Banner
            item {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .background(Gold50, CircleShape)
                                .border(1.5.dp, Gold500.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.CardGiftcard,
                                contentDescription = "Referral Reward",
                                tint = Gold600,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "GIVE ₹100, GET ₹100 CREDIT",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = Gold600,
                                letterSpacing = 0.8.sp
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Invite Your Network to DriveTrust",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = CustomerTextPrimary
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Share verified executive chauffeur convenience. When your referral completes their first verified ride, both of you receive ₹100 instantly in your DT Wallet.",
                                fontSize = 12.sp,
                                color = CustomerTextSecondary,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                lineHeight = 16.sp
                            )
                        }

                        // Referral Code Box
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("YOUR EXCLUSIVE INVITE CODE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = CustomerTextSecondary, letterSpacing = 0.6.sp)
                                    Text(referralCode, fontSize = 20.sp, fontWeight = FontWeight.Black, color = Gold600, letterSpacing = 1.sp)
                                }
                                Button(
                                    onClick = { isCopied = true },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isCopied) Mint500 else Gold500
                                    )
                                ) {
                                    Text(
                                        text = if (isCopied) "COPIED ✓" else "COPY",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Color.White
                                    )
                                }
                            }
                        }

                        // WhatsApp Share Action
                        Button(
                            onClick = { /* WhatsApp share intent */ },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366))
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Share,
                                    contentDescription = "Share",
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text("Share Invite Link", fontWeight = FontWeight.Black, color = Color.White, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }

            // Stats Card
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("YOUR REFERRAL PRIVILEGES", fontSize = 10.sp, fontWeight = FontWeight.Black, color = CustomerTextSecondary, letterSpacing = 0.8.sp)
                            Text(
                                text = "View Wallet →",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Mint600,
                                modifier = Modifier.clickable { onOpenWallet() }
                            )
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = CustomerInnerSurfaceLight,
                                border = androidx.compose.foundation.BorderStroke(0.8.dp, CustomerCardBorderLight),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("Friends Joined", fontSize = 10.sp, color = CustomerTextSecondary)
                                    Text("3", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                                }
                            }
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Gold50.copy(alpha = 0.8f),
                                border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.4f)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("Total Earned", fontSize = 10.sp, color = Gold600)
                                    Text("₹300.00", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Gold600)
                                }
                            }
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = CustomerInnerSurfaceLight,
                                border = androidx.compose.foundation.BorderStroke(0.8.dp, CustomerCardBorderLight),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("Pending", fontSize = 10.sp, color = CustomerTextSecondary)
                                    Text("₹100.00", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                                }
                            }
                        }
                    }
                }
            }

            // How It Works Steps
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Text("HOW IT WORKS", fontSize = 10.sp, fontWeight = FontWeight.Black, color = CustomerTextSecondary, letterSpacing = 0.8.sp)

                        val steps = listOf(
                            Triple("1", "Share Exclusive Code", "Send code DTHARSH2026 to your colleagues and family."),
                            Triple("2", "Recipient Books Chauffeur", "They receive ₹100 instant welcome savings on their first booking."),
                            Triple("3", "Earn ₹100 Cash Credit", "Instant credit deposited directly into your active DT Wallet balance.")
                        )

                        steps.forEach { (num, title, desc) ->
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .background(Mint50, CircleShape)
                                        .border(1.dp, Mint500.copy(alpha = 0.5f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(num, color = Mint600, fontSize = 12.sp, fontWeight = FontWeight.Black)
                                }
                                Column {
                                    Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CustomerTextPrimary)
                                    Text(desc, fontSize = 11.sp, color = CustomerTextSecondary)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
