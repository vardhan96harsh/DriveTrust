package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class TripEarningsItem(
    val tripId: String,
    val time: String,
    val customerName: String,
    val fare: String,
    val tip: String,
    val rating: String,
    val route: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WalletScreen(
    driverName: String,
    initialBalance: Int = 3420,
    onBack: () -> Unit,
    onPayoutSuccess: (String) -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    var isWithdrawing by remember { mutableStateOf(false) }
    var withdrawalSuccessMsg by remember { mutableStateOf<String?>(null) }
    var currentBalance by remember { mutableStateOf(initialBalance) }
    var showPayoutSheet by remember { mutableStateOf(false) }
    var payoutUpiId by remember { mutableStateOf("rajesh.kumar@okhdfcbank") }
    var payoutAmountInput by remember { mutableStateOf(initialBalance.toString()) }

    var tripLedger by remember {
        mutableStateOf(
            listOf(
                TripEarningsItem(
                    tripId = "TRIP-KA-9921",
                    time = "Today, 17:15 PM",
                    customerName = "Vikram Aditya",
                    fare = "₹850",
                    tip = "₹100",
                    rating = "5.0 ★",
                    route = "Koramangala 4th Block → BLR Airport Terminal 2"
                ),
                TripEarningsItem(
                    tripId = "TRIP-KA-9804",
                    time = "Today, 14:30 PM",
                    customerName = "Pooja Hegde",
                    fare = "₹620",
                    tip = "₹50",
                    rating = "4.9 ★",
                    route = "Indiranagar 100ft Rd → Embassy GolfLinks"
                ),
                TripEarningsItem(
                    tripId = "TRIP-KA-9712",
                    time = "Today, 11:10 AM",
                    customerName = "Suresh Patel",
                    fare = "₹950",
                    tip = "₹0",
                    rating = "5.0 ★",
                    route = "Whitefield ITPL → MG Road Chauffeur Drive"
                ),
                TripEarningsItem(
                    tripId = "TRIP-KA-9601",
                    time = "Yesterday, 20:45 PM",
                    customerName = "Dr. Anita Rao",
                    fare = "₹1,000",
                    tip = "₹150",
                    rating = "5.0 ★",
                    route = "Jayanagar 4th Block → Manyata Tech Park"
                )
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Executive Chauffeur Wallet", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text("Partner: $driverName (Instant Settlement Active)", fontSize = 12.sp, color = Slate400)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Rounded.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MidnightCard
                )
            )
        },
        containerColor = MidnightDark
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Balance Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MidnightCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("WITHDRAWABLE BALANCE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Gold500, letterSpacing = 1.sp)
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = Emerald400.copy(alpha = 0.15f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.3f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Rounded.Bolt, contentDescription = null, tint = Emerald400, modifier = Modifier.size(14.dp))
                                    Text("Instant UPI / IMPS", color = Emerald400, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text("₹$currentBalance", fontSize = 42.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                        
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Slate400, modifier = Modifier.size(14.dp))
                            Text("Linked to HDFC Bank A/c •••• 9812 ($payoutUpiId)", fontSize = 12.sp, color = Slate400)
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        if (withdrawalSuccessMsg != null) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Emerald400.copy(alpha = 0.12f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.3f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Emerald400, modifier = Modifier.size(18.dp))
                                    Text(
                                        withdrawalSuccessMsg!!,
                                        color = Emerald400,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = {
                                payoutAmountInput = currentBalance.toString()
                                showPayoutSheet = true
                            },
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                            enabled = currentBalance > 0 && !isWithdrawing
                        ) {
                            Icon(Icons.Rounded.Payment, contentDescription = null, tint = MidnightDark, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                if (isWithdrawing) "Processing Instant Transfer..." else "Request Instant UPI Transfer",
                                fontWeight = FontWeight.Bold,
                                color = MidnightDark
                            )
                        }
                    }
                }
            }

            // Earnings Breakdown Summary
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MidnightCard),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("BASE FARES", fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹2,420", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text("4 rides completed", fontSize = 10.sp, color = Slate500)
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MidnightCard),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("TIPS EARNED", fontSize = 10.sp, color = Gold500, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹300", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Gold500)
                            Text("100% kept by driver", fontSize = 10.sp, color = Slate500)
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = MidnightCard),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("INCENTIVE", fontSize = 10.sp, color = Emerald400, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹700", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                            Text("Zero Cancellation", fontSize = 10.sp, color = Slate500)
                        }
                    }
                }
            }

            // Ledger Title
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Trip Settlement History", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text("Auto-Settled to Account", fontSize = 11.sp, color = Slate400)
                }
            }

            // Trip items
            items(tripLedger) { trip ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MidnightCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(trip.customerName, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 14.sp)
                                Text("${trip.tripId} • ${trip.time}", fontSize = 11.sp, color = Slate400)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(trip.fare, fontWeight = FontWeight.ExtraBold, color = Emerald400, fontSize = 15.sp)
                                if (trip.tip != "₹0") {
                                    Text("+${trip.tip} Tip", color = Gold500, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(trip.route, fontSize = 12.sp, color = Slate300)

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Rating: ${trip.rating}", fontSize = 11.sp, color = Gold500, fontWeight = FontWeight.Bold)
                            Text("Payment: Paid via UPI (Direct Credit)", fontSize = 10.sp, color = Slate500)
                        }
                    }
                }
            }
        }
    }

    // Instant Payout Dialog
    if (showPayoutSheet) {
        AlertDialog(
            onDismissRequest = { if (!isWithdrawing) showPayoutSheet = false },
            containerColor = MidnightCard,
            shape = RoundedCornerShape(18.dp),
            title = {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Rounded.Bolt, contentDescription = null, tint = Gold500)
                    Text("Instant UPI Transfer", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "Funds are dispatched via NPCI Instant IMPS / UPI 2.0 network directly to your registered VPA.",
                        fontSize = 12.sp,
                        color = Slate400,
                        lineHeight = 16.sp
                    )

                    OutlinedTextField(
                        value = payoutUpiId,
                        onValueChange = { payoutUpiId = it },
                        label = { Text("Destination UPI ID", color = Slate400) },
                        leadingIcon = { Icon(Icons.Rounded.AccountBalance, contentDescription = null, tint = Gold500) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Gold500,
                            unfocusedBorderColor = MidnightBorder
                        ),
                        shape = RoundedCornerShape(10.dp)
                    )

                    OutlinedTextField(
                        value = payoutAmountInput,
                        onValueChange = { payoutAmountInput = it },
                        label = { Text("Withdraw Amount (₹)", color = Slate400) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Gold500,
                            unfocusedBorderColor = MidnightBorder
                        ),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Transfer Fee", fontSize = 11.sp, color = Slate400)
                            Text("₹0.00 (Free for Partners)", fontSize = 11.sp, color = Emerald400, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amountToWithdraw = payoutAmountInput.toIntOrNull() ?: currentBalance
                        if (amountToWithdraw > 0 && amountToWithdraw <= currentBalance && !isWithdrawing) {
                            coroutineScope.launch {
                                isWithdrawing = true
                                delay(1200)
                                currentBalance -= amountToWithdraw
                                val refId = "IMPS${(10000000..99999999).random()}"
                                withdrawalSuccessMsg = "Transfer Successful! ₹$amountToWithdraw credited to $payoutUpiId (Ref #$refId)."
                                onPayoutSuccess("₹$amountToWithdraw")
                                isWithdrawing = false
                                showPayoutSheet = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                    shape = RoundedCornerShape(10.dp),
                    enabled = !isWithdrawing
                ) {
                    Text(if (isWithdrawing) "Sending ₹$payoutAmountInput..." else "Confirm & Pay Now", fontWeight = FontWeight.Bold, color = Color.White)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showPayoutSheet = false },
                    enabled = !isWithdrawing
                ) {
                    Text("Cancel", color = Slate400)
                }
            }
        )
    }
}
