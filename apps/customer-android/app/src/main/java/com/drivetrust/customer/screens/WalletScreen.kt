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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.drivetrust.customer.theme.*

// Data models
data class WalletTransaction(
    val id: String,
    val type: TxType,
    val title: String,
    val subtitle: String,
    val amount: Double,
    val date: String,
    val status: TxStatus = TxStatus.SUCCESS
)

enum class TxType { CREDIT, DEBIT }
enum class TxStatus { SUCCESS, PENDING, FAILED }

data class LinkedUpiAccount(
    val id: String,
    val vpa: String,
    val provider: String,
    val isDefault: Boolean = false
)

@Composable
fun CustomerWalletScreen(
    customerName: String,
    onOpenOffers: () -> Unit = {},
    onOpenReferral: () -> Unit = {}
) {
    var walletBalance by remember { mutableStateOf(1240.50) }

    var linkedAccounts by remember {
        mutableStateOf(
            listOf(
                LinkedUpiAccount("upi-01", "harsh@okaxis", "Google Pay", isDefault = true),
                LinkedUpiAccount("upi-02", "98450@ybl", "PhonePe", isDefault = false)
            )
        )
    }

    var transactions by remember {
        mutableStateOf(
            listOf(
                WalletTransaction("tx-01", TxType.DEBIT, "Night Safe-Drop Ride", "Booking DT-982103", 540.00, "22 Oct 2026, 11:30 PM"),
                WalletTransaction("tx-02", TxType.CREDIT, "Added via Google Pay", "harsh@okaxis", 1000.00, "20 Oct 2026, 09:14 AM"),
                WalletTransaction("tx-03", TxType.DEBIT, "Hourly Chauffeur (4 Hrs)", "Booking DT-974910", 1396.00, "19 Oct 2026, 06:15 PM"),
                WalletTransaction("tx-04", TxType.CREDIT, "Ride Cashback 5%", "Promo: DTFIRST5", 27.00, "19 Oct 2026, 06:20 PM"),
                WalletTransaction("tx-05", TxType.CREDIT, "Added via PhonePe", "98450@ybl", 2000.00, "15 Oct 2026, 03:00 PM"),
                WalletTransaction("tx-06", TxType.DEBIT, "Outstation Trip – Bhopal", "Booking DT-961029", 4200.00, "12 Oct 2026, 05:00 AM"),
                WalletTransaction("tx-07", TxType.CREDIT, "Referral Bonus", "Friend joined: Priya R.", 100.00, "10 Oct 2026, 10:05 AM"),
                WalletTransaction("tx-08", TxType.CREDIT, "Added via Google Pay", "harsh@okaxis", 5000.00, "01 Oct 2026, 08:30 AM")
            )
        )
    }

    var showAddMoneyDialog by remember { mutableStateOf(false) }
    var showLinkUpiDialog by remember { mutableStateOf(false) }
    var deleteUpiId by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CustomerBackgroundLight)
    ) {
        // Luxury Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Executive Wallet", fontSize = 20.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary, letterSpacing = (-0.5).sp)
                    Text("Client Balance & Digital UPI Accounts", fontSize = 11.sp, color = CustomerTextSecondary)
                }
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Mint50,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.35f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(Icons.Rounded.Verified, contentDescription = "Active", tint = Mint600, modifier = Modifier.size(12.dp))
                        Text("KYC ACTIVE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Mint600)
                    }
                }
            }
        }

        Column(
            modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Executive Balance Card
            Surface(
                shape = RoundedCornerShape(22.dp),
                color = CustomerWhite,
                shadowElevation = 3.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, Mint500.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Rounded.CreditCard, contentDescription = "Chip", tint = Mint600, modifier = Modifier.size(16.dp))
                                Text("DRIVETRUST EXECUTIVE CARD", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Mint600, letterSpacing = 1.sp)
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "₹${"%,.2f".format(walletBalance)}",
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Black,
                                color = CustomerTextPrimary,
                                letterSpacing = (-0.5).sp
                            )
                            Text("Available Chauffeur Credit", fontSize = 11.sp, color = CustomerTextSecondary)
                        }
                        Box(
                            modifier = Modifier
                                .size(46.dp)
                                .background(Mint50, RoundedCornerShape(12.dp))
                                .border(1.dp, Mint500.copy(alpha = 0.35f), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Rounded.AccountBalanceWallet, contentDescription = "Wallet", tint = Mint600, modifier = Modifier.size(24.dp))
                        }
                    }

                    // Quick Actions
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = { showAddMoneyDialog = true },
                            modifier = Modifier.weight(1f).height(44.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Rounded.Add, contentDescription = "Add", tint = Color.White, modifier = Modifier.size(16.dp))
                                Text("Add Funds", fontWeight = FontWeight.Black, color = Color.White, fontSize = 12.sp)
                            }
                        }
                        OutlinedButton(
                            onClick = { showAddMoneyDialog = true },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = CustomerTextPrimary),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Rounded.QrCode, contentDescription = "Scan", tint = CustomerTextPrimary, modifier = Modifier.size(16.dp))
                                Text("Scan UPI", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = CustomerTextPrimary)
                            }
                        }
                    }
                }
            }

            // Cashback Banner
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = CustomerWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.4f)),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(Gold50, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Rounded.LocalOffer, contentDescription = "Cashback", tint = Gold600, modifier = Modifier.size(18.dp))
                    }
                    Column {
                        Text("5% INSTANT CASHBACK PRIVILEGE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold600)
                        Text("Receive 5% cashback auto-credited into DT Wallet for all night trips.", fontSize = 11.sp, color = CustomerTextSecondary)
                    }
                }
            }

            // Linked UPI Accounts
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("SAVED PAYMENT VPAS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CustomerTextSecondary, letterSpacing = 0.5.sp)
                    TextButton(
                        onClick = { showLinkUpiDialog = true },
                        colors = ButtonDefaults.textButtonColors(contentColor = Mint600),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text("+ Link New UPI", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                linkedAccounts.forEach { upi ->
                    UpiAccountCard(
                        upi = upi,
                        onSetDefault = {
                            linkedAccounts = linkedAccounts.map { it.copy(isDefault = it.id == upi.id) }
                        },
                        onDelete = { deleteUpiId = upi.id }
                    )
                }
            }

            // Transaction History
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("TRANSACTION AUDIT LEDGER", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CustomerTextSecondary, letterSpacing = 0.5.sp)

                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CustomerWhite,
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        transactions.forEachIndexed { index, tx ->
                            TransactionRow(tx = tx)
                            if (index < transactions.lastIndex) {
                                HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), color = CustomerCardBorderLight)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(80.dp))
        }
    }

    // Add Money Dialog (Simulated Bank Gateway)
    if (showAddMoneyDialog) {
        AddMoneyDialog(
            linkedAccounts = linkedAccounts,
            onDismiss = { showAddMoneyDialog = false },
            onAdd = { amount, upi ->
                walletBalance += amount
                val newTx = WalletTransaction(
                    id = "tx-${System.currentTimeMillis()}",
                    type = TxType.CREDIT,
                    title = "Added via ${upi.provider}",
                    subtitle = upi.vpa,
                    amount = amount,
                    date = "Just Now"
                )
                transactions = listOf(newTx) + transactions
                showAddMoneyDialog = false
            }
        )
    }

    // Link UPI Dialog
    if (showLinkUpiDialog) {
        LinkUpiDialog(
            onDismiss = { showLinkUpiDialog = false },
            onLink = { vpa, provider ->
                val newUpi = LinkedUpiAccount(
                    id = "upi-${System.currentTimeMillis()}",
                    vpa = vpa,
                    provider = provider,
                    isDefault = linkedAccounts.isEmpty()
                )
                linkedAccounts = linkedAccounts + newUpi
                showLinkUpiDialog = false
            }
        )
    }

    // Delete UPI Confirm Dialog
    if (deleteUpiId != null) {
        AlertDialog(
            onDismissRequest = { deleteUpiId = null },
            title = { Text("Remove VPA?", fontWeight = FontWeight.Black, color = Slate900) },
            text = { Text("This UPI account will be unlinked from your DriveTrust wallet.", color = Slate600, fontSize = 13.sp) },
            confirmButton = {
                Button(
                    onClick = {
                        linkedAccounts = linkedAccounts.filter { it.id != deleteUpiId }
                        if (linkedAccounts.isNotEmpty() && linkedAccounts.none { it.isDefault }) {
                            linkedAccounts = linkedAccounts.toMutableList().also { it[0] = it[0].copy(isDefault = true) }
                        }
                        deleteUpiId = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900),
                    shape = RoundedCornerShape(10.dp)
                ) { Text("Remove", fontWeight = FontWeight.Bold) }
            },
            dismissButton = {
                TextButton(onClick = { deleteUpiId = null }) { Text("Cancel", color = Slate600) }
            },
            shape = RoundedCornerShape(20.dp)
        )
    }
}

@Composable
private fun UpiAccountCard(upi: LinkedUpiAccount, onSetDefault: () -> Unit, onDelete: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = if (upi.isDefault) Mint50 else CustomerWhite,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (upi.isDefault) Mint500.copy(alpha = 0.5f) else CustomerCardBorderLight
        ),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .background(if (upi.isDefault) Mint100 else CustomerInnerSurfaceLight, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Rounded.QrCode,
                        contentDescription = "UPI",
                        tint = if (upi.isDefault) Mint600 else CustomerTextPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Column {
                    Text(upi.provider, fontSize = 14.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                    Text(upi.vpa, fontSize = 12.sp, color = CustomerTextSecondary)
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                if (upi.isDefault) {
                    Surface(shape = RoundedCornerShape(6.dp), color = Mint500) {
                        Text("PRIMARY", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Color.White, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                    }
                } else {
                    TextButton(
                        onClick = onSetDefault,
                        colors = ButtonDefaults.textButtonColors(contentColor = Mint600),
                        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                    ) { Text("Set Primary", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Rounded.Close, contentDescription = "Delete", tint = CustomerTextSecondary, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@Composable
private fun TransactionRow(tx: WalletTransaction) {
    val isCredit = tx.type == TxType.CREDIT
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(if (isCredit) Mint50 else CustomerInnerSurfaceLight, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isCredit) Icons.Rounded.ArrowDownward else Icons.Rounded.ArrowUpward,
                    contentDescription = if (isCredit) "In" else "Out",
                    tint = if (isCredit) Mint600 else CustomerTextSecondary,
                    modifier = Modifier.size(18.dp)
                )
            }
            Column {
                Text(tx.title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = CustomerTextPrimary)
                Text(tx.subtitle, fontSize = 11.sp, color = CustomerTextSecondary)
                Text(tx.date, fontSize = 10.sp, color = CustomerTextMuted)
            }
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = "${if (isCredit) "+" else "-"}₹${"%,.0f".format(tx.amount)}",
                fontSize = 14.sp,
                fontWeight = FontWeight.Black,
                color = if (isCredit) Mint600 else CustomerTextPrimary
            )
            Surface(shape = RoundedCornerShape(4.dp), color = if (isCredit) Mint50 else CustomerInnerSurfaceLight) {
                Text(
                    text = "SETTLED",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Black,
                    color = if (isCredit) Mint600 else CustomerTextSecondary,
                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                )
            }
        }
    }
}

@Composable
fun AddMoneyDialog(
    linkedAccounts: List<LinkedUpiAccount>,
    onDismiss: () -> Unit,
    onAdd: (Double, LinkedUpiAccount) -> Unit
) {
    var amountText by remember { mutableStateOf("1000") }
    var selectedUpi by remember { mutableStateOf(linkedAccounts.firstOrNull { it.isDefault } ?: linkedAccounts.firstOrNull()) }
    var isProcessing by remember { mutableStateOf(false) }

    val quickAmounts = listOf(500, 1000, 2000, 5000)

    Dialog(onDismissRequest = { if (!isProcessing) onDismiss() }) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("Add Funds to Wallet", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)

                Surface(shape = RoundedCornerShape(8.dp), color = Gold50) {
                    Text(
                        "DEMO BANK GATEWAY • SIMULATED DEPOSIT",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        color = Gold600,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }

                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it.filter { ch -> ch.isDigit() } },
                    label = { Text("Deposit Amount (₹)", color = CustomerTextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = CustomerTextPrimary,
                        unfocusedTextColor = CustomerTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = CustomerCardBorderLight,
                        focusedContainerColor = CustomerInnerSurfaceLight,
                        unfocusedContainerColor = CustomerInnerSurfaceLight
                    )
                )

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    quickAmounts.forEach { amt ->
                        val isSelected = amountText == amt.toString()
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) Mint500 else CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) Mint500 else CustomerCardBorderLight),
                            modifier = Modifier.weight(1f).clickable { amountText = amt.toString() }
                        ) {
                            Text(
                                "+₹$amt",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else CustomerTextPrimary,
                                modifier = Modifier.padding(vertical = 8.dp),
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }

                if (isProcessing) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        CircularProgressIndicator(color = Mint500, strokeWidth = 3.dp)
                        Text("Authorizing simulated deposit...", fontSize = 12.sp, color = CustomerTextSecondary)
                    }
                } else {
                    Button(
                        onClick = {
                            val amt = amountText.toDoubleOrNull() ?: 1000.0
                            val upi = selectedUpi ?: LinkedUpiAccount("demo", "harsh@okaxis", "Google Pay", true)
                            isProcessing = true
                        },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                    ) {
                        Text("AUTHORIZE DEPOSIT (₹$amountText)", fontWeight = FontWeight.Black, color = Color.White)
                    }
                }

                LaunchedEffect(isProcessing) {
                    if (isProcessing) {
                        kotlinx.coroutines.delay(1200)
                        isProcessing = false
                        val amt = amountText.toDoubleOrNull() ?: 1000.0
                        val upi = selectedUpi ?: LinkedUpiAccount("demo", "harsh@okaxis", "Google Pay", true)
                        onAdd(amt, upi)
                    }
                }
            }
        }
    }
}

@Composable
fun LinkUpiDialog(onDismiss: () -> Unit, onLink: (String, String) -> Unit) {
    var vpa by remember { mutableStateOf("") }
    var selectedProvider by remember { mutableStateOf("Google Pay") }
    val providers = listOf("Google Pay", "PhonePe", "Paytm", "BHIM")

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = CustomerWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("Link UPI Payment VPA", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    providers.forEach { p ->
                        val isSelected = selectedProvider == p
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) Mint500 else CustomerInnerSurfaceLight,
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) Mint500 else CustomerCardBorderLight),
                            modifier = Modifier.weight(1f).clickable { selectedProvider = p }
                        ) {
                            Text(
                                p.split(" ").first(),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else CustomerTextPrimary,
                                modifier = Modifier.padding(vertical = 8.dp),
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = vpa,
                    onValueChange = { vpa = it },
                    placeholder = { Text("e.g. yourname@okaxis", fontSize = 12.sp, color = CustomerTextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = CustomerTextPrimary,
                        unfocusedTextColor = CustomerTextPrimary,
                        focusedBorderColor = Mint500,
                        unfocusedBorderColor = CustomerCardBorderLight,
                        focusedContainerColor = CustomerInnerSurfaceLight,
                        unfocusedContainerColor = CustomerInnerSurfaceLight
                    )
                )

                Button(
                    onClick = {
                        if (vpa.isNotBlank()) onLink(vpa, selectedProvider)
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Mint500)
                ) {
                    Text("VERIFY & LINK VPA", fontWeight = FontWeight.Black, color = Color.White)
                }
            }
        }
    }
}
