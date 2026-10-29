package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.theme.Mint500

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChooseLanguageBottomSheet(
    currentLanguage: String,
    onLanguageConfirmed: (String) -> Unit,
    onDismissRequest: () -> Unit
) {
    var selectedLang by remember { mutableStateOf(currentLanguage) }

    val languages = listOf(
        Pair("English", "English"),
        Pair("हिन्दी", "Hindi"),
        Pair("मराठी", "Marathi")
    )

    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        containerColor = Color.White,
        scrimColor = Color.Black.copy(alpha = 0.55f),
        shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp),
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(top = 28.dp, bottom = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Centered Title matching screenshot
            Text(
                text = "Choose Language",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E293B)
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Radio Button Options List
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(26.dp)
            ) {
                languages.forEach { (displayName, _) ->
                    val isSelected = selectedLang.equals(displayName, ignoreCase = true) ||
                            (selectedLang.equals("Hindi", ignoreCase = true) && displayName == "हिन्दी") ||
                            (selectedLang.equals("Marathi", ignoreCase = true) && displayName == "मराठी")

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedLang = displayName }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(18.dp)
                    ) {
                        // High-Fidelity Radio Button (matching uploaded screenshot)
                        Box(
                            modifier = Modifier
                                .size(22.dp)
                                .border(
                                    width = 2.5.dp,
                                    color = if (isSelected) Color(0xFF1E293B) else Color(0xFFCBD5E1),
                                    shape = CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isSelected) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .background(Color(0xFF1E293B), CircleShape)
                                )
                            }
                        }

                        // Language Label
                        Text(
                            text = displayName,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Normal,
                            color = Color(0xFF1E293B)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Vibrant Emerald Mint Confirm Button (matching uploaded screenshot)
            Button(
                onClick = { onLanguageConfirmed(selectedLang) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                shape = RoundedCornerShape(26.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
            ) {
                Text(
                    text = "Confirm",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}

