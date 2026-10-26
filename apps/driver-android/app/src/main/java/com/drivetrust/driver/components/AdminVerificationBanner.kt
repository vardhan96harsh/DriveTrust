package com.drivetrust.driver.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
            shape = RoundedCornerShape(14.dp),
            color = Amber50,
            border = androidx.compose.foundation.BorderStroke(1.dp, Amber600.copy(alpha = 0.3f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "⚠️", fontSize = 14.sp)
                        Text(
                            text = "AWAITING ADMIN VERIFICATION",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Amber600
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = Amber600.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = kycStatus.name,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Amber600,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Text(
                    text = "Commercial Driving License ($licenseNumber) is currently UNDER REVIEW in the Admin KYC Vault. You cannot go online or receive customer rides until verified by Operations Admin.",
                    fontSize = 11.sp,
                    color = Slate700,
                    lineHeight = 16.sp
                )
            }
        }
    } else {
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = Emerald50,
            border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.2f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "🛡️", fontSize = 16.sp)
                Column {
                    Text(
                        text = "ADMIN VERIFIED & CLEARED",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = Emerald600
                    )
                    Text(
                        text = "MoRTH Sarathi Commercial Clearance active. Eligible for instant trip dispatches.",
                        fontSize = 11.sp,
                        color = Slate700
                    )
                }
            }
        }
    }
}
