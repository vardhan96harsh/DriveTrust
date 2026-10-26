package com.drivetrust.driver.service

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.PowerManager
import android.os.Vibrator
import android.os.VibrationEffect
import android.os.Build

class RideOfferAlarmHelper(private val context: Context) {

    private var mediaPlayer: MediaPlayer? = null
    private var screenWakeLock: PowerManager.WakeLock? = null

    // Override Silent/Vibrate mode using USAGE_ALARM stream
    fun startRideAlert() {
        // 1. Wake screen up safely
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            @Suppress("DEPRECATION")
            screenWakeLock = powerManager.newWakeLock(
                PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "DriveTrust::IncomingOfferWakeLock"
            ).apply {
                acquire(30 * 1000L) // 30s offer duration
            }
        } catch (e: Exception) {
            // Logged or handled gracefully
        }

        // 2. Play audible alarm sound
        try {
            val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            mediaPlayer = MediaPlayer().apply {
                alarmUri?.let { setDataSource(context, it) }
                setAudioAttributes(audioAttributes)
                isLooping = true
                prepare()
                start()
            }
        } catch (e: Exception) {
            // Fallback gracefully without crashing
        }

        // 3. Continuous heavy haptic pulse
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val timings = longArrayOf(0, 500, 200, 500)
            val amplitudes = intArrayOf(0, 255, 0, 255)
            vibrator.vibrate(VibrationEffect.createWaveform(timings, amplitudes, 0))
        } else {
            vibrator.vibrate(longArrayOf(0, 500, 200, 500), 0)
        }
    }

    fun stopRideAlert() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null

            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            vibrator.cancel()

            if (screenWakeLock?.isHeld == true) {
                screenWakeLock?.release()
            }
        } catch (e: Exception) {
            // Safe cleanup
        }
    }
}
