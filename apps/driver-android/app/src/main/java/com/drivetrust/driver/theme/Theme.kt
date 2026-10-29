package com.drivetrust.driver.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Mint500,
    onPrimary = Color.White,
    secondary = Mint600,
    onSecondary = Color.White,
    background = DriverBackgroundLight,
    surface = DriverWhite,
    onBackground = DriverTextPrimary,
    onSurface = DriverTextPrimary
)

@Composable
fun DriveTrustDriverTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}

@Composable
fun DriverTheme(
    content: @Composable () -> Unit
) {
    DriveTrustDriverTheme(content)
}
