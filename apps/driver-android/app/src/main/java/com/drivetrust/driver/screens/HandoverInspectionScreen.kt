package com.drivetrust.driver.screens

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
    var damageNotes by remember { mutableStateOf("Minor pre-existing scratch on rear left bumper noted with owner.") }
    
    var checkBumperFront by remember { mutableStateOf(true) }
    var checkBumperRear by remember { mutableStateOf(true) }
    var checkLeftPanels by remember { mutableStateOf(true) }
    var checkRightPanels by remember { mutableStateOf(true) }
    var checkInteriorCleanliness by remember { mutableStateOf(true) }
    var checkTrunkLuggage by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightDark)
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
                    text = "Chauffeur Pre-Trip Vehicle Handover",
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    color = Color.White
                )
                Text(
                    text = "Verify vehicle condition & odometer with client before taking the wheel",
                    fontSize = 12.sp,
                    color = Slate400
                )
            }

            // Vehicle Badge
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Gold500.copy(alpha = 0.15f),
                            modifier = Modifier.size(42.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Rounded.DirectionsCar, contentDescription = null, tint = Gold500, modifier = Modifier.size(24.dp))
                            }
                        }
                        Column {
                            Text(carModel, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 15.sp)
                            Text("Automatic Luxury Fleet", fontSize = 11.sp, color = Slate400)
                        }
                    }
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.5f))
                    ) {
                        Text(
                            text = carPlate,
                            fontWeight = FontWeight.Bold,
                            color = Gold500,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            Text("360° VEHICLE INSPECTION AUDIT", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Gold500, letterSpacing = 1.sp)

            val checks = listOf(
                Triple("Front Bumper, Grille & Headlamps", "Clear / Verified with Client", checkBumperFront) to { checkBumperFront = !checkBumperFront },
                Triple("Rear Bumper & Tail-lamps", "Clear / Verified with Client", checkBumperRear) to { checkBumperRear = !checkBumperRear },
                Triple("Left Doors, Mirrors & Glass Panels", "Clear / Verified with Client", checkLeftPanels) to { checkLeftPanels = !checkLeftPanels },
                Triple("Right Doors, Mirrors & Glass Panels", "Clear / Verified with Client", checkRightPanels) to { checkRightPanels = !checkRightPanels },
                Triple("Interior Cabin & Seat Hygiene", "Pristine Luxury Standard", checkInteriorCleanliness) to { checkInteriorCleanliness = !checkInteriorCleanliness },
                Triple("Trunk Space & Emergency Kit", "Inspected & Available", checkTrunkLuggage) to { checkTrunkLuggage = !checkTrunkLuggage }
            )

            checks.forEach { (item, toggle) ->
                val (part, status, checked) = item
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (checked) Emerald400.copy(alpha = 0.4f) else MidnightBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { toggle() }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(part, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = Color.White)
                            Text(if (checked) status else "Pending confirmation", fontSize = 11.sp, color = if (checked) Emerald400 else Slate400)
                        }
                        Icon(
                            imageVector = if (checked) Icons.Rounded.CheckCircle else Icons.Rounded.RadioButtonUnchecked,
                            contentDescription = null,
                            tint = if (checked) Emerald400 else Slate500,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }

            Text("METRICS & TELEMETRICS BASELINE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Gold500, letterSpacing = 1.sp)

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = odo,
                    onValueChange = { odo = it },
                    label = { Text("Starting Odometer", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.Speed, contentDescription = null, tint = Gold500, modifier = Modifier.size(18.dp)) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedContainerColor = MidnightCard,
                        unfocusedContainerColor = MidnightCard
                    ),
                    shape = RoundedCornerShape(10.dp)
                )
                OutlinedTextField(
                    value = fuel,
                    onValueChange = { fuel = it },
                    label = { Text("Fuel / Battery", color = Slate400) },
                    leadingIcon = { Icon(Icons.Rounded.LocalGasStation, contentDescription = null, tint = Emerald400, modifier = Modifier.size(18.dp)) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Gold500,
                        unfocusedBorderColor = MidnightBorder,
                        focusedContainerColor = MidnightCard,
                        unfocusedContainerColor = MidnightCard
                    ),
                    shape = RoundedCornerShape(10.dp)
                )
            }

            OutlinedTextField(
                value = damageNotes,
                onValueChange = { damageNotes = it },
                label = { Text("Pre-Trip Noted Scratches / Remarks", color = Slate400) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = Gold500,
                    unfocusedBorderColor = MidnightBorder,
                    focusedContainerColor = MidnightCard,
                    unfocusedContainerColor = MidnightCard
                ),
                shape = RoundedCornerShape(10.dp)
            )

            // Legal guarantee banner
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Rounded.VerifiedUser, contentDescription = null, tint = Gold500, modifier = Modifier.size(24.dp))
                    Text(
                        "DriveTrust Transit Shield: Chauffeur is legally insured under commercial transit liability from handover to return.",
                        fontSize = 11.sp,
                        color = Slate300,
                        lineHeight = 15.sp
                    )
                }
            }

            Button(
                onClick = onCompleteAudit,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Rounded.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Confirm Handover Passed & Start Drive", fontWeight = FontWeight.Bold, color = Color.White)
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
