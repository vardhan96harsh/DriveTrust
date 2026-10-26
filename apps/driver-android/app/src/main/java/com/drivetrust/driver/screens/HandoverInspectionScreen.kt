package com.drivetrust.driver.screens

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.components.DriverTopBar
import com.drivetrust.driver.model.DriverProfile
import com.drivetrust.driver.theme.*

@Composable
fun DriverHandoverInspectionScreen(
    driver: DriverProfile,
    carModel: String,
    carPlate: String,
    onCompleteAudit: () -> Unit
) {
    var odo by remember { mutableStateOf("42,150 km") }
    var fuel by remember { mutableStateOf("85% Full") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
    ) {
        DriverTopBar(driver = driver, onToggleDuty = {}, onLogoutClick = {})

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column {
                Text(
                    text = "Chauffeur Pre-Trip Inspection",
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    color = Slate900
                )
                Text(
                    text = "Verify vehicle condition with owner before taking the wheel",
                    fontSize = 12.sp,
                    color = Slate500
                )
            }

            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Slate900,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(carModel, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(carPlate, fontWeight = FontWeight.Bold, color = Emerald500)
                }
            }

            Text("360° BODYWORK AUDIT CHECKLIST", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)

            val checks = listOf(
                "Front Bumper & Headlamps" to "Checked & Clear",
                "Rear Bumper & Tail-lamps" to "Checked & Clear",
                "Left Door Panels & Glass" to "Checked & Clear",
                "Right Door Panels & Mirror" to "Checked & Clear"
            )

            checks.forEach { (part, status) ->
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
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
                        Text("✓", color = Emerald600, fontWeight = FontWeight.Black)
                    }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = odo,
                    onValueChange = { odo = it },
                    label = { Text("Odometer") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp)
                )
                OutlinedTextField(
                    value = fuel,
                    onValueChange = { fuel = it },
                    label = { Text("Fuel Level") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp)
                )
            }

            Button(
                onClick = onCompleteAudit,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Confirm Handover Passed →", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun HandoverInspectionScreen(
    tripId: String = "TRIP-KA-9921",
    customerName: String = "Customer",
    onCompleteInspection: () -> Unit,
    onCancel: () -> Unit = {}
) {
    val simulatedDriver = DriverProfile(
        fullName = "Rajesh Kumar",
        phone = "+91 99801 84920"
    )
    DriverHandoverInspectionScreen(
        driver = simulatedDriver,
        carModel = "Toyota Fortuner (Automatic)",
        carPlate = "KA-01-MJ-4921",
        onCompleteAudit = onCompleteInspection
    )
}
