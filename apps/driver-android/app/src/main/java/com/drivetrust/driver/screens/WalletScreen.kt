package com.drivetrust.driver.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.drivetrust.driver.theme.DriverColors
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

    val tripLedger = remember {
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
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Chauffeur Wallet & Payouts", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text("Partner: $driverName", fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Text("←", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A)
                )
            )
        },
        containerColor = Color(0xFF0B1120)
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
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("WITHDRAWABLE BALANCE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8), letterSpacing = 1.sp)
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = Color(0xFF10B981).copy(alpha = 0.15f)
                            ) {
                                Text("UPI Instant Active", color = Color(0xFF10B981), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text("₹$currentBalance", fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                        Text("Linked to HDFC Bank A/c •••• 9812 (UPI Auto-Credit)", fontSize = 12.sp, color = Color(0xFF64748B))

                        Spacer(modifier = Modifier.height(18.dp))

                        if (withdrawalSuccessMsg != null) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0xFF10B981).copy(alpha = 0.2f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    withdrawalSuccessMsg!!,
                                    color = Color(0xFF34D399),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(12.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                        }

                        Button(
                            onClick = {
                                if (currentBalance > 0 && !isWithdrawing) {
                                    coroutineScope.launch {
                                        isWithdrawing = true
                                        val amount = currentBalance
                                        delay(1000)
                                        currentBalance = 0
                                        withdrawalSuccessMsg = "Transfer Successful! ₹$amount credited via IMPS/UPI reference #IMPS8849201."
                                        onPayoutSuccess("₹$amount")
                                        isWithdrawing = false
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                            enabled = currentBalance > 0 && !isWithdrawing
                        ) {
                            Text(if (isWithdrawing) "Processing Bank Transfer..." else "Withdraw ₹$currentBalance to Bank Account", fontWeight = FontWeight.Bold, color = Color.White)
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
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("BASE FARES", fontSize = 10.sp, color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹2,420", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text("4 rides completed", fontSize = 10.sp, color = Color(0xFF64748B))
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("TIPS EARNED", fontSize = 10.sp, color = Color(0xFFF59E0B), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹300", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF59E0B))
                            Text("100% kept by driver", fontSize = 10.sp, color = Color(0xFF64748B))
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("INCENTIVE", fontSize = 10.sp, color = Color(0xFF38BDF8), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("₹700", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8))
                            Text("Zero Cancellation", fontSize = 10.sp, color = Color(0xFF64748B))
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
                    Text("Auto-Settled Daily", fontSize = 11.sp, color = Color(0xFF94A3B8))
                }
            }

            // Trip items
            items(tripLedger) { trip ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(trip.customerName, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 14.sp)
                                Text("${trip.tripId} • ${trip.time}", fontSize = 11.sp, color = Color(0xFF64748B))
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(trip.fare, fontWeight = FontWeight.ExtraBold, color = Color(0xFF10B981), fontSize = 15.sp)
                                if (trip.tip != "₹0") {
                                    Text("+${trip.tip} Tip", color = Color(0xFFF59E0B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(trip.route, fontSize = 12.sp, color = Color(0xFF94A3B8))

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Rating: ${trip.rating}", fontSize = 11.sp, color = Color(0xFFF59E0B), fontWeight = FontWeight.Bold)
                            Text("Payment: Paid via UPI (Direct Credit)", fontSize = 10.sp, color = Color(0xFF64748B))
                        }
                    }
                }
            }
        }
    }
}
