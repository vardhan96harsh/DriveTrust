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
import com.drivetrust.customer.model.CustomerVehicle
import com.drivetrust.customer.theme.*

@Composable
fun MyGarageScreen(
    vehicles: List<CustomerVehicle>,
    selectedVehicleId: String,
    onSelectVehicle: (CustomerVehicle) -> Unit,
    onAddVehicle: (CustomerVehicle) -> Unit,
    onDeleteVehicle: (String) -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }
    var deleteConfirmId by remember { mutableStateOf<String?>(null) }

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
                Column {
                    Text(
                        text = "Executive Fleet Garage",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Black,
                        color = CustomerTextPrimary,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "${vehicles.size} vehicle(s) registered for chauffeur transit",
                        fontSize = 11.sp,
                        color = Slate400
                    )
                }
                Button(
                    onClick = { showAddDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Icon(
                            imageVector = Icons.Rounded.Add,
                            contentDescription = "Add",
                            tint = Slate900,
                            modifier = Modifier.size(16.dp)
                        )
                        Text("Add Vehicle", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Slate900)
                    }
                }
            }
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Info banner
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.35f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .background(Gold500.copy(alpha = 0.12f), CircleShape)
                            .border(1.dp, Gold500.copy(alpha = 0.4f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.DirectionsCar,
                            contentDescription = "Car",
                            tint = Gold400,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "ACTIVE CHAUFFEUR VEHICLE ALLOCATION",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Gold400,
                            letterSpacing = 0.8.sp
                        )
                        Text(
                            text = "Select your vehicle prior to dispatch. Chauffeur assignments are certified strictly by transmission proficiency.",
                            fontSize = 11.sp,
                            color = Slate300,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            if (vehicles.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 60.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .background(MidnightCard, CircleShape)
                                .border(1.dp, Gold500.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.DirectionsCar,
                                contentDescription = "Empty Garage",
                                tint = Gold400,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                        Text("No Vehicles Registered", fontSize = 18.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                        Text("Register your personal car to request an executive chauffeur", fontSize = 12.sp, color = Slate400)
                        Button(
                            onClick = { showAddDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Add My First Vehicle", fontWeight = FontWeight.Black, color = Slate900)
                        }
                    }
                }
            } else {
                Text(
                    text = "REGISTERED FLEET (${vehicles.size})",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate400,
                    letterSpacing = 0.8.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )

                vehicles.forEach { vehicle ->
                    val isSelected = vehicle.id == selectedVehicleId
                    VehicleCard(
                        vehicle = vehicle,
                        isSelected = isSelected,
                        onSelect = { onSelectVehicle(vehicle) },
                        onDelete = { deleteConfirmId = vehicle.id }
                    )
                }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth().clickable { showAddDialog = true }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Add,
                            contentDescription = "Add",
                            tint = Gold400,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("+ Add Another Vehicle", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Gold400)
                    }
                }
            }

            Surface(
                shape = RoundedCornerShape(14.dp),
                color = MidnightCard,
                border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Lightbulb,
                        contentDescription = "Tip",
                        tint = Gold400,
                        modifier = Modifier.size(18.dp)
                    )
                    Column {
                        Text("TRANSMISSION PROTOCOL", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
                        Text(
                            "Automatic, Luxury & Dual-Clutch vehicles dispatch specialized category-1 chauffeurs with verified experience.",
                            fontSize = 11.sp, color = Slate300, lineHeight = 15.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(80.dp))
        }
    }

    if (deleteConfirmId != null) {
        AlertDialog(
            onDismissRequest = { deleteConfirmId = null },
            title = { Text("Remove Vehicle?", fontWeight = FontWeight.Black, color = Slate900) },
            text = { Text("This vehicle will be removed from your garage. You can add it back anytime.", color = Slate600, fontSize = 13.sp) },
            confirmButton = {
                Button(
                    onClick = { deleteConfirmId?.let { onDeleteVehicle(it) }; deleteConfirmId = null },
                    colors = ButtonDefaults.buttonColors(containerColor = Red600),
                    shape = RoundedCornerShape(10.dp)
                ) { Text("Remove", fontWeight = FontWeight.Bold) }
            },
            dismissButton = {
                TextButton(onClick = { deleteConfirmId = null }) { Text("Cancel", color = Slate600) }
            },
            shape = RoundedCornerShape(20.dp)
        )
    }

    if (showAddDialog) {
        AddVehicleDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { vehicle -> onAddVehicle(vehicle); showAddDialog = false }
        )
    }
}

@Composable
private fun VehicleCard(
    vehicle: CustomerVehicle,
    isSelected: Boolean,
    onSelect: () -> Unit,
    onDelete: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = if (isSelected) MidnightDark else MidnightCard,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) Gold500.copy(alpha = 0.8f) else MidnightBorder
        ),
        modifier = Modifier.fillMaxWidth().clickable { onSelect() }
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .background(MidnightDark, CircleShape)
                            .border(1.dp, if (isSelected) Gold500.copy(alpha = 0.7f) else MidnightBorder, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when (vehicle.transmission) {
                                "LUXURY" -> Icons.Rounded.Star
                                "AUTOMATIC" -> Icons.Rounded.Sync
                                else -> Icons.Rounded.DirectionsCar
                            },
                            contentDescription = vehicle.transmission,
                            tint = if (vehicle.transmission == "LUXURY") Gold400 else if (isSelected) Emerald400 else Slate400,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Column {
                        Text(
                            "${vehicle.brand} ${vehicle.model}",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = CustomerTextPrimary
                        )
                        Text(
                            vehicle.plate,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = if (isSelected) Gold400 else Slate400,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
                if (isSelected) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Gold500.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.5f))
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.CheckCircle,
                                contentDescription = "Active",
                                tint = Gold400,
                                modifier = Modifier.size(12.dp)
                            )
                            Text("ACTIVE VEHICLE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.5.sp)
                        }
                    }
                }
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(0.8.dp, MidnightBorder)
                    ) {
                        Text(
                            vehicle.transmission,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (vehicle.transmission == "LUXURY") Gold400 else Slate300,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(0.8.dp, MidnightBorder)
                    ) {
                        Text(
                            "${vehicle.year}",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate300,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MidnightDark,
                        border = androidx.compose.foundation.BorderStroke(0.8.dp, MidnightBorder)
                    ) {
                        Text(
                            vehicle.color,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate300,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
                TextButton(
                    onClick = onDelete,
                    colors = ButtonDefaults.textButtonColors(contentColor = Red400),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text("Remove", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            if (!isSelected) {
                OutlinedButton(
                    onClick = onSelect,
                    modifier = Modifier.fillMaxWidth().height(38.dp),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Mint500)
                ) {
                    Text("Select For Next Chauffeur Ride", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun AddVehicleDialog(onDismiss: () -> Unit, onAdd: (CustomerVehicle) -> Unit) {
    var brand by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("") }
    var plate by remember { mutableStateOf("") }
    var color by remember { mutableStateOf("") }
    var year by remember { mutableStateOf("2024") }
    var transmission by remember { mutableStateOf("AUTOMATIC") }
    var hasError by remember { mutableStateOf(false) }

    val tfColors = OutlinedTextFieldDefaults.colors(
        focusedBorderColor = Mint500,
        unfocusedBorderColor = CustomerCardBorderLight,
        focusedTextColor = CustomerTextPrimary,
        unfocusedTextColor = CustomerTextPrimary,
        focusedContainerColor = CustomerWhite,
        unfocusedContainerColor = CustomerInnerSurfaceLight,
        focusedLabelColor = Mint500,
        unfocusedLabelColor = CustomerTextSecondary
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = CustomerCardLight,
            border = androidx.compose.foundation.BorderStroke(1.dp, CustomerCardBorderLight),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("Register Vehicle to Garage", fontSize = 17.sp, fontWeight = FontWeight.Black, color = CustomerTextPrimary)
                Text("Enter specifications to ensure certified chauffeur matching.", fontSize = 11.sp, color = Slate400)

                OutlinedTextField(value = brand, onValueChange = { brand = it; hasError = false }, label = { Text("Brand (e.g. Toyota, BMW)") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), isError = hasError && brand.isBlank(), colors = tfColors)
                OutlinedTextField(value = model, onValueChange = { model = it; hasError = false }, label = { Text("Model (e.g. Fortuner 4x4, Creta)") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), isError = hasError && model.isBlank(), colors = tfColors)
                OutlinedTextField(value = plate, onValueChange = { plate = it.uppercase(); hasError = false }, label = { Text("Registration Plate (e.g. MP-40-CA-4921)") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), isError = hasError && plate.isBlank(), colors = tfColors)
                OutlinedTextField(value = color, onValueChange = { color = it }, label = { Text("Color (e.g. Pearl White)") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), colors = tfColors)
                OutlinedTextField(value = year, onValueChange = { year = it }, label = { Text("Year (e.g. 2024)") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), colors = tfColors)

                Text("TRANSMISSION CLASSIFICATION", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("AUTOMATIC", "MANUAL", "LUXURY").forEach { option ->
                        val isActive = option == transmission
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (isActive) Gold500 else MidnightDark,
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isActive) Gold400 else MidnightBorder),
                            modifier = Modifier.weight(1f).clickable { transmission = option }
                        ) {
                            Column(modifier = Modifier.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(
                                    imageVector = when (option) {
                                        "AUTOMATIC" -> Icons.Rounded.Sync
                                        "MANUAL" -> Icons.Rounded.Build
                                        else -> Icons.Rounded.Star
                                    },
                                    contentDescription = option,
                                    tint = if (isActive) Slate900 else Gold400,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    option,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (isActive) Slate900 else Slate300
                                )
                            }
                        }
                    }
                }

                if (hasError) Text("Please fill in Brand, Model, and Plate Number.", fontSize = 11.sp, color = Red400, fontWeight = FontWeight.SemiBold)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Slate300)
                    ) {
                        Text("Cancel", fontWeight = FontWeight.Bold)
                    }
                    Button(
                        onClick = {
                            if (brand.isBlank() || model.isBlank() || plate.isBlank()) {
                                hasError = true
                            } else {
                                onAdd(CustomerVehicle(id = "veh-${System.currentTimeMillis()}", brand = brand.trim(), model = model.trim(), plate = plate.trim(), transmission = transmission, color = color.trim().ifEmpty { "White" }, year = year.trim().toIntOrNull() ?: 2024))
                            }
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                        shape = RoundedCornerShape(10.dp)
                    ) { Text("Add Vehicle", fontWeight = FontWeight.Black, color = Slate900) }
                }
            }
        }
    }
}
