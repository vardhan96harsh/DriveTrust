package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.VerifiedUser
import androidx.compose.material.icons.rounded.WarningAmber
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.model.KycStatus
import com.drivetrust.driver.theme.*

@Composable
fun AdminVerificationBanner(
    kycStatus: KycStatus,
    licenseNumber: String
) {
    if (kycStatus != KycStatus.APPROVED) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Amber500.copy(alpha = 0.12f),
            border = androidx.compose.foundation.BorderStroke(1.dp, Amber500.copy(alpha = 0.35f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Rounded.WarningAmber,
                            contentDescription = null,
                            tint = Amber500,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "AWAITING ADMIN VERIFICATION",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Amber500,
                            letterSpacing = 0.5.sp
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Amber500.copy(alpha = 0.2f)
                    ) {
                        Text(
                            text = kycStatus.name,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Amber500,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }

                Text(
                    text = "Commercial Driving License ($licenseNumber) is currently under review in the Admin KYC Vault. Dispatch matching will unlock immediately once approved.",
                    fontSize = 12.sp,
                    color = Slate300,
                    lineHeight = 18.sp
                )
            }
        }
    } else {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Emerald400.copy(alpha = 0.12f),
            border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.3f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(14.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Emerald400.copy(alpha = 0.2f),
                    modifier = Modifier.size(38.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Rounded.VerifiedUser,
                            contentDescription = null,
                            tint = Emerald400,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
                Column {
                    Text(
                        text = "ADMIN VERIFIED & CLEARED",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = Emerald400,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "MoRTH Sarathi Commercial clearance active. Instant ride offer dispatch ready.",
                        fontSize = 12.sp,
                        color = Slate300
                    )
                }
            }
        }
    }
}
