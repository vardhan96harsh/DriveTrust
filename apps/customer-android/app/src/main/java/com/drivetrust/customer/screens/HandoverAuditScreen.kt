package com.drivetrust.customer.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.customer.components.CustomerTopAppBar
import com.drivetrust.customer.theme.*

@Composable
fun CustomerHandoverAuditScreen(
    carModel: String,
    carPlate: String,
    driverName: String,
    customerName: String = "Customer",
    onConfirmHandover: () -> Unit,
    onBack: () -> Unit
) {
    var odometerKm by remember { mutableStateOf("42,150 km") }
    var fuelLevel by remember { mutableStateOf("85% Full") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        CustomerTopAppBar(customerName = customerName)

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column {
                Text(
                    text = "4-Point Vehicle Pre-Trip Handover",
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    color = Slate900
                )
                Text(
                    text = "Mutual scratch & telematics audit before engine ignition",
                    fontSize = 12.sp,
                    color = Slate500
                )
            }

            // Vehicle Badge
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Slate900,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("VEHICLE ASSIGNED", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate400)
                        Text(carModel, fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color.White)
                    }
                    Text(carPlate, fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, color = Emerald500)
                }
            }

            Text(
                text = "1. 360° EXTERIOR SCRATCH AUDIT",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Slate500
            )

            // 4 Quadrants
            val quadrants = listOf(
                "Front Bumper & Grille" to "✓ Verified Clear (No dents)",
                "Rear Bumper & Boot" to "✓ Factory paint verified",
                "Left Quarter & Mirrors" to "✓ Mirror & glass intact",
                "Right Quarter & Panels" to "✓ Clear / No scratches"
            )

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                quadrants.forEach { (part, status) ->
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color.White,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.3f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(part, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                                Text(status, fontSize = 11.sp, color = Emerald600)
                            }
                            Text("✓", color = Emerald600, fontWeight = FontWeight.Black, fontSize = 16.sp)
                        }
                    }
                }
            }

            Text(
                text = "2. INSTRUMENT CLUSTER VERIFICATION",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Slate500
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = odometerKm,
                    onValueChange = { odometerKm = it },
                    label = { Text("Starting Odometer") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
                OutlinedTextField(
                    value = fuelLevel,
                    onValueChange = { fuelLevel = it },
                    label = { Text("Fuel / Battery") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            // Transit Guarantee Notice
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Blue50,
                border = androidx.compose.foundation.BorderStroke(1.dp, Blue600.copy(alpha = 0.3f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "🛡️ DRIVETRUST ₹10 LAKHS TRANSIT GUARANTEE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = Blue600
                    )
                    Text(
                        text = "Both Chauffeur $driverName and Vehicle Owner acknowledge existing vehicle condition before departure.",
                        fontSize = 11.sp,
                        color = Slate700
                    )
                }
            }

            Button(
                onClick = onConfirmHandover,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("Sign Off Handover & Unlock Trip →", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }
    }
}
