package com.drivetrust.customer.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Crisp Executive Light Theme Palette for Customer App
val CustomerWhite = Color(0xFFFFFFFF)
val CustomerBackgroundLight = Color(0xFFF8FAFC)
val CustomerCardLight = Color(0xFFFFFFFF)
val CustomerCardBorderLight = Color(0xFFE2E8F0)
val CustomerInnerSurfaceLight = Color(0xFFF1F5F9)

// Primary, Secondary & Muted Typography
val CustomerTextPrimary = Color(0xFF0F172A)
val CustomerTextSecondary = Color(0xFF64748B)
val CustomerTextMuted = Color(0xFF94A3B8)

// Compatibility Theme Mappings (repointing legacy Midnight variables to Light Theme)
val Midnight950 = Color(0xFFF1F5F9)     // Soft light inner container / input background
val MidnightDark = Color(0xFFF8FAFC)    // Crisp clean background
val MidnightCard = Color(0xFFFFFFFF)    // Pure white luxury card
val MidnightBorder = Color(0xFFE2E8F0)  // Subtle refined border
val PlatinumText = Color(0xFF0F172A)    // Primary dark text in light theme

val Slate900 = Color(0xFF0F172A)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val Slate600 = Color(0xFF475569)
val Slate500 = Color(0xFF64748B)
val Slate400 = Color(0xFF64748B)        // High readability secondary text
val Slate300 = Color(0xFF94A3B8)
val Slate200 = Color(0xFFE2E8F0)
val Slate100 = Color(0xFFF1F5F9)
val Slate50 = Color(0xFFF8FAFC)

// Mint & Emerald Accents (matching Driver App & Logo)
val Mint500 = Color(0xFF00B779)
val Mint600 = Color(0xFF009663)
val Mint50 = Color(0xFFECFDF5)
val Mint100 = Color(0xFFD1FAE5)

// Champagne Gold & Executive Accents (crisp on white)
val Gold500 = Color(0xFFD97706)
val Gold400 = Color(0xFFF59E0B)
val Gold600 = Color(0xFFB45309)
val Gold50 = Color(0xFFFFFBEB)
val GoldGlow = Color(0x1AD97706)

// Emerald Trust & Compliance
val Emerald600 = Color(0xFF059669)
val Emerald500 = Color(0xFF10B981)
val Emerald400 = Color(0xFF00B779)
val Emerald50 = Color(0xFFECFDF5)

// Amber Surge & Notifications
val Amber600 = Color(0xFFD97706)
val Amber500 = Color(0xFFF59E0B)
val Amber50 = Color(0xFFFFFBEB)

// Red SOS & Alerts
val Red600 = Color(0xFFDC2626)
val Red500 = Color(0xFFEF4444)
val Red400 = Color(0xFFF87171)
val Red50 = Color(0xFFFEF2F2)

// Indigo / Sapphire Business
val Blue600 = Color(0xFF2563EB)
val Blue50 = Color(0xFFEFF6FF)

// Executive Gradients
val LuxuryCardGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFFFFFFFF), Color(0xFFF8FAFC))
)

val GoldAccentGradient = Brush.horizontalGradient(
    colors = listOf(Color(0xFFD97706), Color(0xFFF59E0B))
)

val DarkMeshGradient = Brush.linearGradient(
    colors = listOf(Color(0xFFF8FAFC), Color(0xFFF1F5F9), Color(0xFFE2E8F0))
)
