package com.drivetrust.customer.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.drivetrust.customer.R

class CustomerRideNotificationService(private val context: Context) {

    companion object {
        const val CHANNEL_ID_RIDE_UPDATES = "drivetrust_ride_updates"
        const val CHANNEL_ID_EMERGENCY = "drivetrust_emergency_alerts"
        const val NOTIFICATION_ID_RIDE = 101
        const val NOTIFICATION_ID_EMERGENCY = 999
    }

    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    init {
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val rideChannel = NotificationChannel(
                CHANNEL_ID_RIDE_UPDATES,
                "Ride Status Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time Chauffeur arrival, OTP, and trip completion updates"
            }

            val emergencyChannel = NotificationChannel(
                CHANNEL_ID_EMERGENCY,
                "Emergency Safety Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical SOS emergency alerts and 112 police broadcast confirmations"
                enableVibration(true)
            }

            notificationManager.createNotificationChannel(rideChannel)
            notificationManager.createNotificationChannel(emergencyChannel)
        }
    }

    fun showChauffeurArrivedNotification(driverName: String, carPlate: String, startOtp: String) {
        val notification = NotificationCompat.Builder(context, CHANNEL_ID_RIDE_UPDATES)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Chauffeur $driverName has arrived")
            .setContentText("Waiting at your vehicle ($carPlate). Share Start PIN: $startOtp")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(NOTIFICATION_ID_RIDE, notification)
    }

    fun showSosDispatchedNotification(latitude: Double, longitude: Double) {
        val notification = NotificationCompat.Builder(context, CHANNEL_ID_EMERGENCY)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("EMERGENCY SOS BROADCAST ACTIVE")
            .setContentText("Police 112 & Trusted Contacts notified with live GPS coordinates ($latitude, $longitude)")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setOngoing(true)
            .build()

        notificationManager.notify(NOTIFICATION_ID_EMERGENCY, notification)
    }

    fun cancelAll() {
        notificationManager.cancelAll()
    }
}
