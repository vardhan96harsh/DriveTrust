package com.drivetrust.customer.ui

import androidx.compose.runtime.Composable
import com.drivetrust.customer.model.TripBooking

@Composable
fun CustomerTrackingScreen(
    booking: TripBooking,
    onOpenInspection: () -> Unit = {},
    onCompleteTrip: () -> Unit = {},
    onLogoutClick: () -> Unit = {},
    onSOSClicked: () -> Unit = {}
) {
    com.drivetrust.customer.screens.CustomerTrackingScreen(
        booking = booking,
        onOpenInspection = onOpenInspection,
        onCompleteTrip = onCompleteTrip,
        onLogoutClick = onLogoutClick
    )
}
