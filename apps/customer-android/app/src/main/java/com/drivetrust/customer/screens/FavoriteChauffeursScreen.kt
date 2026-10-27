package com.drivetrust.customer.screens

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
import com.drivetrust.customer.theme.*

data class FavoriteChauffeur(
    val id: String,
    val name: String,
    val phone: String,
    val rating: Float,
    val totalTrips: Int,
    val licenseNumber: String,
    val specialty: String,
    val isAvailableNow: Boolean = true,
    val vehicleExpertise: List<String> = listOf("SUV 4x4", "Automatic", "Sedan")
)

@Composable
fun CustomerFavoriteChauffeursScreen(
    onBack: () -> Unit,
    onSelectDriverForRide: (FavoriteChauffeur) -> Unit = {}
) {
    var chauffeurs by remember {
        mutableStateOf(
            listOf(
                FavoriteChauffeur(
                    id = "drv-01",
                    name = "Rajesh Sharma",
                    phone = "+91 99801 84920",
                    rating = 4.96f,
                    totalTrips = 1420,
                    licenseNumber = "MP4020190012345",
                    specialty = "Toyota Fortuner & Luxury 4x4 Specialist",
                    isAvailableNow = true,
                    vehicleExpertise = listOf("Fortuner 4x4", "Automatic", "Night Drive")
                ),
                FavoriteChauffeur(
                    id = "drv-02",
                    name = "Suresh Patel",
                    phone = "+91 98270 19283",
                    rating = 4.90f,
                    totalTrips = 980,
                    licenseNumber = "MP0420180054321",
                    specialty = "BMW & Dual-Clutch Luxury Specialist",
                    isAvailableNow = true,
                    vehicleExpertise = listOf("BMW 3-Series", "Luxury EV", "City Commute")
                ),
                FavoriteChauffeur(
                    id = "drv-03",
                    name = "Vikram Aditya",
                    phone = "+91 94250 88219",
                    rating = 5.0f,
                    totalTrips = 610,
                    licenseNumber = "MP4020210088991",
                    specialty = "Outstation & Long Distance Highway Expert",
                    isAvailableNow = false,
                    vehicleExpertise = listOf("Manual & Auto", "Highway", "Hill Driving")
                )
            )
        )
    }

    var selectedFeedback by remember { mutableStateOf<String?>(null) }

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
                            text = "Favorite Chauffeurs",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Your verified, preferred executive drivers",
                            fontSize = 11.sp,
                            color = Slate400
                        )
                    }
                }
            }
        }

        if (selectedFeedback != null) {
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
                        contentDescription = "Confirmed",
                        tint = Emerald400,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        selectedFeedback!!,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Emerald400
                    )
                }
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
        ) {
            // Guarantee banner
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Gold500.copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .background(Gold500.copy(alpha = 0.12f), CircleShape)
                                .border(1.dp, Gold500.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Star,
                                contentDescription = "Preferred Dispatch",
                                tint = Gold400,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Column {
                            Text("PREFERRED CHAUFFEUR DISPATCH", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Gold400, letterSpacing = 0.8.sp)
                            Text("Priority Fleet Allocation", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color.White)
                            Text(
                                "When requested, DriveTrust notifies your preferred chauffeur first before general dispatch.",
                                fontSize = 11.sp,
                                color = Slate400,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            items(chauffeurs, key = { it.id }) { driver ->
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MidnightCard,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MidnightBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(50.dp)
                                        .background(MidnightDark, CircleShape)
                                        .border(1.5.dp, Gold500.copy(alpha = 0.6f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = driver.name.split(" ").mapNotNull { it.firstOrNull()?.toString() }.take(2).joinToString(""),
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Gold400
                                    )
                                }
                                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(driver.name, fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color.White)
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = Gold500.copy(alpha = 0.15f),
                                            border = androidx.compose.foundation.BorderStroke(0.8.dp, Gold500.copy(alpha = 0.4f))
                                        ) {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Rounded.Star,
                                                    contentDescription = "Rating",
                                                    tint = Gold400,
                                                    modifier = Modifier.size(11.dp)
                                                )
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Text(
                                                    "${driver.rating}",
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Black,
                                                    color = Gold400
                                                )
                                            }
                                        }
                                    }
                                    Text(driver.specialty, fontSize = 11.sp, color = Slate300)
                                    Text("DL: ${driver.licenseNumber} • ${driver.totalTrips} Completed Trips", fontSize = 10.sp, color = Slate500)
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (driver.isAvailableNow) Emerald500.copy(alpha = 0.15f) else Slate800,
                                border = androidx.compose.foundation.BorderStroke(
                                    0.8.dp,
                                    if (driver.isAvailableNow) Emerald400.copy(alpha = 0.5f) else MidnightBorder
                                )
                            ) {
                                Text(
                                    text = if (driver.isAvailableNow) "● Available" else "○ On Duty",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (driver.isAvailableNow) Emerald400 else Slate400,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        // Vehicle expertise pills
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            driver.vehicleExpertise.forEach { exp ->
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = MidnightDark,
                                    border = androidx.compose.foundation.BorderStroke(0.8.dp, MidnightBorder)
                                ) {
                                    Text(
                                        text = exp,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Slate300,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                            }
                        }

                        HorizontalDivider(color = MidnightBorder)

                        // Action buttons
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            OutlinedButton(
                                onClick = {
                                    chauffeurs = chauffeurs.filter { it.id != driver.id }
                                    selectedFeedback = "Removed ${driver.name} from favorites"
                                },
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Red500.copy(alpha = 0.5f)),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Red400),
                                modifier = Modifier.weight(1f).height(40.dp)
                            ) {
                                Text("Remove", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = {
                                    selectedFeedback = "Selected ${driver.name} as preferred chauffeur for next ride!"
                                    onSelectDriverForRide(driver)
                                },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Gold500),
                                modifier = Modifier.weight(1.5f).height(40.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.DirectionsCar,
                                        contentDescription = "Book",
                                        tint = Slate900,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Text("Request Chauffeur", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate900)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
