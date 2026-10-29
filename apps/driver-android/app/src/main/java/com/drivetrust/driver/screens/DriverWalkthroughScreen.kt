package com.drivetrust.driver.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.drivetrust.driver.components.ChooseLanguageBottomSheet
import com.drivetrust.driver.theme.*

data class WalkthroughSlide(
    val title: String,
    val description: String,
    val slideType: SlideIllustrationType
)

enum class SlideIllustrationType {
    DRIVE_SUCCEED,
    INSTANT_PAYOUTS,
    BOOST_EARNINGS
}

@Composable
fun DriverWalkthroughScreen(
    initialLanguage: String = "English",
    onLanguageSelected: (String) -> Unit = {},
    onFinishWalkthrough: () -> Unit
) {
    var currentPage by remember { mutableIntStateOf(0) }
    var showLanguageSheetFirst by remember { mutableStateOf(true) }
    var currentLanguage by remember { mutableStateOf(initialLanguage) }

    val slides = listOf(
        WalkthroughSlide(
            title = if (currentLanguage == "हिन्दी") "चलाएं। कमाएं। सफल बनें।" else "Drive. Earn. Succeed.",
            description = if (currentLanguage == "हिन्दी")
                "फ्लेक्सिबल समय, अधिक राइड्स और DriveTrust के साथ बेहतरीन कमाई का आनंद लें। आपकी यात्रा, आपका विकास।"
            else
                "Enjoy flexible hours, more rides, and higher earnings with DriveTrust. Your journey, your growth, your rewards.",
            slideType = SlideIllustrationType.DRIVE_SUCCEED
        ),
        WalkthroughSlide(
            title = if (currentLanguage == "हिन्दी") "त्वरित भुगतान (Instant Payouts)" else "Instant Payouts",
            description = if (currentLanguage == "हिन्दी")
                "बैंक या UPI में तुरंत और बिना किसी परेशानी के निकासी — लाइव कमाई ट्रैक करें और कभी भी पैसे निकालें।"
            else
                "Instant, hassle-free withdrawals to bank or UPI — track earnings live and cash out anytime.",
            slideType = SlideIllustrationType.INSTANT_PAYOUTS
        ),
        WalkthroughSlide(
            title = if (currentLanguage == "हिन्दी") "अपनी कमाई बढ़ाएं" else "Boost Your Earnings",
            description = if (currentLanguage == "हिन्दी")
                "सर्ज ज़ोन, पीक-ऑवर इंसेंटिव और स्ट्रीक बोनस के साथ अपनी कमाई को और अधिक बढ़ाएं।"
            else
                "Grow earnings with surge zones, peak-hour incentives, and streak bonuses that reward your hustle.",
            slideType = SlideIllustrationType.BOOST_EARNINGS
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DriverWhite)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar with Skip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "skip",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Normal,
                    color = DriverTextSecondary,
                    modifier = Modifier
                        .clickable { onFinishWalkthrough() }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                )
            }

            // Slide Content
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                val slide = slides[currentPage]

                // Slide Title
                Text(
                    text = slide.title,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = DriverTextPrimary,
                    textAlign = TextAlign.Center,
                    lineHeight = 34.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Slide Description
                Text(
                    text = slide.description,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Normal,
                    color = DriverTextSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp,
                    modifier = Modifier.padding(horizontal = 12.dp)
                )

                Spacer(modifier = Modifier.height(36.dp))

                // Dedicated Vector Illustration
                Box(
                    modifier = Modifier.size(280.dp),
                    contentAlignment = Alignment.Center
                ) {
                    when (slide.slideType) {
                        SlideIllustrationType.DRIVE_SUCCEED -> DriveSucceedIllustration()
                        SlideIllustrationType.INSTANT_PAYOUTS -> InstantPayoutsIllustration()
                        SlideIllustrationType.BOOST_EARNINGS -> BoostEarningsIllustration()
                    }
                }
            }

            // Bottom Navigation & Dots
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Page Indicator Dots
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 32.dp)
                ) {
                    repeat(slides.size) { index ->
                        val isSelected = index == currentPage
                        val width by animateDpAsState(
                            targetValue = if (isSelected) 22.dp else 8.dp,
                            label = "dotWidth"
                        )
                        Box(
                            modifier = Modifier
                                .height(8.dp)
                                .width(width)
                                .clip(CircleShape)
                                .background(if (isSelected) Mint500 else DriverDotInactive)
                                .clickable { currentPage = index }
                        )
                    }
                }

                // Primary Bottom Action Button: Next -> Next -> Get Started
                Button(
                    onClick = {
                        if (currentPage < slides.size - 1) {
                            currentPage++
                        } else {
                            onFinishWalkthrough()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Mint500),
                    shape = RoundedCornerShape(16.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
                ) {
                    Text(
                        text = if (currentPage < slides.size - 1) {
                            if (currentLanguage == "हिन्दी") "आगे बढ़ें (Next)" else "Next"
                        } else {
                            if (currentLanguage == "हिन्दी") "शुरू करें (Get Started)" else "Get Started"
                        },
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                }
            }
        }

        // STEP 1: Choose Language Bottom Sheet - Pops up FIRST before the 3 screens!
        if (showLanguageSheetFirst) {
            ChooseLanguageBottomSheet(
                currentLanguage = currentLanguage,
                onLanguageConfirmed = { chosen ->
                    currentLanguage = chosen
                    onLanguageSelected(chosen)
                    showLanguageSheetFirst = false
                },
                onDismissRequest = {
                    showLanguageSheetFirst = false
                }
            )
        }
    }
}

// -------------------------------------------------------------
// Vector Art matching uploaded screenshot 1: Drive. Earn. Succeed.
// -------------------------------------------------------------
@Composable
private fun DriveSucceedIllustration() {
    Canvas(modifier = Modifier.size(240.dp)) {
        val strokeWidth = 5f
        val outlineColor = Color(0xFF1E293B)
        val mintFill = Color(0xFF00B779)

        // Rearview Mirror
        drawRoundRect(
            color = outlineColor,
            topLeft = Offset(size.width * 0.28f, size.height * 0.12f),
            size = Size(size.width * 0.44f, size.height * 0.08f),
            cornerRadius = CornerRadius(14f, 14f),
            style = Stroke(strokeWidth)
        )
        drawLine(
            color = outlineColor,
            start = Offset(size.width * 0.46f, size.height * 0.12f),
            end = Offset(size.width * 0.46f, size.height * 0.06f),
            strokeWidth = strokeWidth
        )
        drawLine(
            color = outlineColor,
            start = Offset(size.width * 0.54f, size.height * 0.12f),
            end = Offset(size.width * 0.54f, size.height * 0.06f),
            strokeWidth = strokeWidth
        )

        // Driver Torso (Polo Shirt in Mint)
        val shirtPath = Path().apply {
            moveTo(size.width * 0.38f, size.height * 0.60f)
            lineTo(size.width * 0.34f, size.height * 0.76f)
            lineTo(size.width * 0.78f, size.height * 0.76f)
            lineTo(size.width * 0.72f, size.height * 0.60f)
            close()
        }
        drawPath(shirtPath, color = mintFill)
        drawPath(shirtPath, color = outlineColor, style = Stroke(strokeWidth))

        // Driver Head & Face
        drawCircle(
            color = Color.White,
            radius = size.width * 0.18f,
            center = Offset(size.width * 0.56f, size.height * 0.44f)
        )
        drawCircle(
            color = outlineColor,
            radius = size.width * 0.18f,
            center = Offset(size.width * 0.56f, size.height * 0.44f),
            style = Stroke(strokeWidth)
        )

        // Eyes & Smile
        drawCircle(
            color = outlineColor,
            radius = 4f,
            center = Offset(size.width * 0.52f, size.height * 0.44f)
        )
        drawCircle(
            color = outlineColor,
            radius = 4f,
            center = Offset(size.width * 0.62f, size.height * 0.44f)
        )
        val smile = Path().apply {
            moveTo(size.width * 0.54f, size.height * 0.49f)
            quadraticBezierTo(
                size.width * 0.58f, size.height * 0.53f,
                size.width * 0.63f, size.height * 0.49f
            )
        }
        drawPath(smile, color = outlineColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))

        // Hair
        val hair = Path().apply {
            moveTo(size.width * 0.42f, size.height * 0.38f)
            quadraticBezierTo(size.width * 0.48f, size.height * 0.28f, size.width * 0.60f, size.height * 0.29f)
            quadraticBezierTo(size.width * 0.74f, size.height * 0.32f, size.width * 0.74f, size.height * 0.44f)
        }
        drawPath(hair, color = outlineColor, style = Stroke(strokeWidth * 1.5f, cap = StrokeCap.Round))

        // Thumbs Up Hand on Left
        val thumb = Path().apply {
            moveTo(size.width * 0.38f, size.height * 0.62f)
            lineTo(size.width * 0.36f, size.height * 0.50f)
            quadraticBezierTo(size.width * 0.38f, size.height * 0.46f, size.width * 0.41f, size.height * 0.50f)
            lineTo(size.width * 0.41f, size.height * 0.57f)
            lineTo(size.width * 0.46f, size.height * 0.59f)
            lineTo(size.width * 0.46f, size.height * 0.68f)
            close()
        }
        drawPath(thumb, color = Color.White)
        drawPath(thumb, color = outlineColor, style = Stroke(strokeWidth, cap = StrokeCap.Round))

        // Steering Wheel (Foreground)
        drawArc(
            color = outlineColor,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(size.width * 0.32f, size.height * 0.66f),
            size = Size(size.width * 0.44f, size.height * 0.34f),
            style = Stroke(strokeWidth * 1.8f, cap = StrokeCap.Round)
        )
    }
}

// -------------------------------------------------------------
// Vector Art matching uploaded screenshot 2: Instant Payouts
// -------------------------------------------------------------
@Composable
private fun InstantPayoutsIllustration() {
    Canvas(modifier = Modifier.size(240.dp)) {
        val strokeWidth = 5f
        val outlineColor = Color(0xFF1E293B)
        val goldCoin = Color(0xFFF59E0B)
        val skyBackdrop = Color(0xFFE0F2FE)

        // Soft Backdrop Bubble
        drawCircle(
            color = skyBackdrop,
            radius = size.width * 0.36f,
            center = Offset(size.width * 0.55f, size.height * 0.52f)
        )

        // Growth Arrow Behind Car
        val arrowPath = Path().apply {
            moveTo(size.width * 0.46f, size.height * 0.52f)
            lineTo(size.width * 0.54f, size.height * 0.46f)
            lineTo(size.width * 0.62f, size.height * 0.40f)
            lineTo(size.width * 0.68f, size.height * 0.34f)
        }
        drawPath(arrowPath, color = Color.White)
        drawPath(arrowPath, color = outlineColor, style = Stroke(strokeWidth * 1.5f, cap = StrokeCap.Round))

        // Arrow Head
        val arrowHead = Path().apply {
            moveTo(size.width * 0.64f, size.height * 0.34f)
            lineTo(size.width * 0.72f, size.height * 0.34f)
            lineTo(size.width * 0.72f, size.height * 0.42f)
        }
        drawPath(arrowHead, color = outlineColor, style = Stroke(strokeWidth * 1.5f, cap = StrokeCap.Round))

        // Gold Rupee Coins
        drawCircle(color = goldCoin, radius = 20f, center = Offset(size.width * 0.46f, size.height * 0.36f))
        drawCircle(color = outlineColor, radius = 20f, center = Offset(size.width * 0.46f, size.height * 0.36f), style = Stroke(3f))
        drawCircle(color = goldCoin, radius = 16f, center = Offset(size.width * 0.76f, size.height * 0.50f))
        drawCircle(color = outlineColor, radius = 16f, center = Offset(size.width * 0.76f, size.height * 0.50f), style = Stroke(3f))

        // Car Body (White with Clean Charcoal Outline)
        val carBody = Path().apply {
            moveTo(size.width * 0.32f, size.height * 0.64f)
            lineTo(size.width * 0.46f, size.height * 0.54f)
            lineTo(size.width * 0.72f, size.height * 0.54f)
            lineTo(size.width * 0.82f, size.height * 0.60f)
            lineTo(size.width * 0.88f, size.height * 0.64f)
            lineTo(size.width * 0.88f, size.height * 0.72f)
            lineTo(size.width * 0.28f, size.height * 0.72f)
            close()
        }
        drawPath(carBody, color = Color.White)
        drawPath(carBody, color = outlineColor, style = Stroke(strokeWidth))

        // Car Windows (Light Teal Tint)
        val carWindow = Path().apply {
            moveTo(size.width * 0.48f, size.height * 0.56f)
            lineTo(size.width * 0.68f, size.height * 0.56f)
            lineTo(size.width * 0.68f, size.height * 0.62f)
            lineTo(size.width * 0.44f, size.height * 0.62f)
            close()
        }
        drawPath(carWindow, color = Color(0xFFBAE6FD))
        drawPath(carWindow, color = outlineColor, style = Stroke(3f))

        // Wheels
        drawCircle(color = Color(0xFF334155), radius = 16f, center = Offset(size.width * 0.38f, size.height * 0.72f))
        drawCircle(color = Color(0xFF334155), radius = 16f, center = Offset(size.width * 0.78f, size.height * 0.72f))

        // Chauffeur Standing in Yellow Jacket & Cap
        drawRoundRect(
            color = Color(0xFFFACC15),
            topLeft = Offset(size.width * 0.24f, size.height * 0.42f),
            size = Size(size.width * 0.12f, size.height * 0.05f),
            cornerRadius = CornerRadius(8f, 8f)
        )
        drawRoundRect(
            color = Color(0xFFFACC15),
            topLeft = Offset(size.width * 0.22f, size.height * 0.50f),
            size = Size(size.width * 0.14f, size.height * 0.16f),
            cornerRadius = CornerRadius(10f, 10f)
        )
        drawRoundRect(
            color = outlineColor,
            topLeft = Offset(size.width * 0.22f, size.height * 0.50f),
            size = Size(size.width * 0.14f, size.height * 0.16f),
            cornerRadius = CornerRadius(10f, 10f),
            style = Stroke(strokeWidth)
        )
    }
}

// -------------------------------------------------------------
// Vector Art matching uploaded screenshot 3: Boost Your Earnings
// -------------------------------------------------------------
@Composable
private fun BoostEarningsIllustration() {
    Canvas(modifier = Modifier.size(240.dp)) {
        val strokeWidth = 5f
        val outlineColor = Color(0xFF1E293B)
        val coatBrown = Color(0xFF8B5E3C)
        val softBlue = Color(0xFFDCEAF7)

        // Lower Semi-Circle Dashboard
        drawArc(
            color = softBlue,
            startAngle = 0f,
            sweepAngle = 180f,
            useCenter = true,
            topLeft = Offset(size.width * 0.18f, size.height * 0.56f),
            size = Size(size.width * 0.64f, size.height * 0.36f)
        )
        drawArc(
            color = outlineColor,
            startAngle = 0f,
            sweepAngle = 180f,
            useCenter = true,
            topLeft = Offset(size.width * 0.18f, size.height * 0.56f),
            size = Size(size.width * 0.64f, size.height * 0.36f),
            style = Stroke(strokeWidth)
        )

        // Driver Head
        drawCircle(
            color = Color(0xFFFED7AA),
            radius = size.width * 0.14f,
            center = Offset(size.width * 0.50f, size.height * 0.40f)
        )
        drawCircle(
            color = outlineColor,
            radius = size.width * 0.14f,
            center = Offset(size.width * 0.50f, size.height * 0.40f),
            style = Stroke(strokeWidth)
        )

        // Hair
        val hair = Path().apply {
            moveTo(size.width * 0.38f, size.height * 0.36f)
            quadraticBezierTo(size.width * 0.46f, size.height * 0.28f, size.width * 0.56f, size.height * 0.28f)
            quadraticBezierTo(size.width * 0.64f, size.height * 0.32f, size.width * 0.62f, size.height * 0.40f)
        }
        drawPath(hair, color = Color(0xFF5A3825))
        drawPath(hair, color = outlineColor, style = Stroke(strokeWidth * 1.4f, cap = StrokeCap.Round))

        // Glasses
        drawCircle(color = outlineColor, radius = 12f, center = Offset(size.width * 0.45f, size.height * 0.40f), style = Stroke(3f))
        drawCircle(color = outlineColor, radius = 12f, center = Offset(size.width * 0.55f, size.height * 0.40f), style = Stroke(3f))
        drawLine(color = outlineColor, start = Offset(size.width * 0.48f, size.height * 0.40f), end = Offset(size.width * 0.52f, size.height * 0.40f), strokeWidth = 3f)

        // Jacket
        val coat = Path().apply {
            moveTo(size.width * 0.32f, size.height * 0.54f)
            lineTo(size.width * 0.22f, size.height * 0.68f)
            lineTo(size.width * 0.78f, size.height * 0.68f)
            lineTo(size.width * 0.68f, size.height * 0.54f)
            close()
        }
        drawPath(coat, color = coatBrown)
        drawPath(coat, color = outlineColor, style = Stroke(strokeWidth))

        // Seatbelt
        drawLine(
            color = Color(0xFF0F172A),
            start = Offset(size.width * 0.62f, size.height * 0.54f),
            end = Offset(size.width * 0.38f, size.height * 0.68f),
            strokeWidth = 14f,
            cap = StrokeCap.Square
        )

        // Steering Wheel
        drawArc(
            color = Color(0xFF94A3B8),
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(size.width * 0.34f, size.height * 0.56f),
            size = Size(size.width * 0.32f, size.height * 0.22f),
            style = Stroke(strokeWidth * 2.2f, cap = StrokeCap.Round)
        )
    }
}
