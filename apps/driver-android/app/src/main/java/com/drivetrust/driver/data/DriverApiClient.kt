package com.drivetrust.driver.data

import android.util.Log
import com.drivetrust.driver.model.RideOffer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class DriverApiClient(
    private val baseUrl: String = "http://10.0.2.2:8080"
) {
    private val tag = "DriverApiClient"

    suspend fun fetchActiveOffer(driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834"): Result<RideOffer?> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/driver/active-offer?driver_id=$driverId")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 3000
                readTimeout = 3000
            }

            if (conn.responseCode in 200..299) {
                val text = BufferedReader(InputStreamReader(conn.inputStream)).use { it.readText() }
                val json = JSONObject(text)
                if (json.optBoolean("has_offer")) {
                    val offer = RideOffer(
                        offerId = json.optString("booking_id"),
                        bookingCode = json.optString("booking_code"),
                        customerName = json.optString("customer_name"),
                        customerRating = json.optString("customer_rating", "4.95 ★"),
                        pickupAddress = json.optString("pickup_address"),
                        destinationAddress = json.optString("destination_address"),
                        distanceKm = json.optString("distance_km", "6.4 km"),
                        estMinutes = json.optString("est_minutes", "22 mins"),
                        fare = json.optString("fare", "₹540"),
                        carModel = json.optString("car_model", "Toyota Fortuner (Automatic)"),
                        otp = json.optString("start_otp", "8492")
                    )
                    Result.success(offer)
                } else {
                    Result.success(null)
                }
            } else {
                Result.failure(Exception("HTTP ${conn.responseCode}"))
            }
        } catch (e: Exception) {
            Log.w(tag, "Driver active offer poll fallback: ${e.message}")
            Result.failure(e)
        }
    }

    suspend fun acceptOffer(bookingId: String, driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834"): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/accept")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 3000
                readTimeout = 3000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("booking_id", bookingId)
                put("driver_id", driverId)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun notifyDriverArrived(bookingId: String, driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834"): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/arrive")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 3000
                readTimeout = 3000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("booking_id", bookingId)
                put("driver_id", driverId)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun startTripWithOtp(bookingId: String, driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834", otp: String): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/start")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 3000
                readTimeout = 3000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("booking_id", bookingId)
                put("driver_id", driverId)
                put("otp", otp)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun completeTrip(bookingId: String, driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834"): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/complete")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 3000
                readTimeout = 3000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("booking_id", bookingId)
                put("driver_id", driverId)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendLocation(driverId: String = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834", lat: Double, lng: Double): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/driver/location")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 2000
                readTimeout = 2000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("driver_id", driverId)
                put("lat", lat)
                put("lng", lng)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
