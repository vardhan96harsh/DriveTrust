package com.drivetrust.customer.data

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

data class RemoteBookingResult(
    val success: Boolean,
    val bookingId: String,
    val bookingCode: String,
    val status: String,
    val startOtp: String,
    val driverId: String?,
    val driverName: String?,
    val driverPhone: String?,
    val error: String? = null
)

data class LiveTrackResult(
    val status: String,
    val lat: Double,
    val lng: Double,
    val bearing: Float,
    val etaMins: Int
)

class CustomerApiClient(
    private val baseUrl: String = "http://10.0.2.2:8080" // Standard Android emulator localhost host
) {
    private val tag = "CustomerApiClient"

    suspend fun createAndDispatchBooking(
        pickup: String,
        dropoff: String,
        serviceType: String,
        vehicleModel: String,
        vehiclePlate: String,
        fare: Double,
        customerName: String,
        customerPhone: String
    ): Result<RemoteBookingResult> = withContext(Dispatchers.IO) {
        try {
            // 1. Call /api/v1/bookings/create
            val createUrl = URL("$baseUrl/api/v1/bookings/create")
            val conn = (createUrl.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Accept", "application/json")
                connectTimeout = 4000
                readTimeout = 4000
                doOutput = true
            }

            val reqBody = JSONObject().apply {
                put("customer_id", "cust-" + customerPhone.filter { it.isDigit() })
                put("customer_name", customerName)
                put("customer_phone", customerPhone)
                put("service_type", serviceType)
                put("transmission_required", "AUTOMATIC")
                put("vehicle_model", vehicleModel)
                put("vehicle_plate", vehiclePlate)
                put("pickup_address", pickup)
                put("pickup_lat", 23.5262)
                put("pickup_lng", 77.8211)
                put("dropoff_address", dropoff)
                put("dropoff_lat", 23.5350)
                put("dropoff_lng", 77.8150)
                put("estimated_fare", fare)
            }

            OutputStreamWriter(conn.outputStream).use { it.write(reqBody.toString()) }

            val responseCode = conn.responseCode
            if (responseCode !in 200..299) {
                return@withContext Result.failure(Exception("HTTP $responseCode creating booking"))
            }

            val responseStr = BufferedReader(InputStreamReader(conn.inputStream)).use { it.readText() }
            val json = JSONObject(responseStr)
            val bookingId = json.optString("id")
            val bookingCode = json.optString("booking_code")
            val startOtp = json.optString("start_otp", "8492")

            // 2. Dispatch offer via /api/v1/bookings/dispatch
            val dispatchUrl = URL("$baseUrl/api/v1/bookings/dispatch")
            val dispatchConn = (dispatchUrl.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 4000
                readTimeout = 4000
                doOutput = true
            }

            val dispatchReq = JSONObject().apply {
                put("booking_id", bookingId)
                put("service_type", serviceType)
                put("transmission", "AUTOMATIC")
                val pickupObj = JSONObject().apply {
                    put("lat", 23.5262)
                    put("lng", 77.8211)
                }
                put("pickup_location", pickupObj)
            }
            OutputStreamWriter(dispatchConn.outputStream).use { it.write(dispatchReq.toString()) }

            var assignedDriverId: String? = null
            if (dispatchConn.responseCode in 200..299) {
                val dResp = BufferedReader(InputStreamReader(dispatchConn.inputStream)).use { it.readText() }
                val dJson = JSONObject(dResp)
                if (dJson.optBoolean("success")) {
                    assignedDriverId = dJson.optString("assigned_driver_id")
                }
            }

            Result.success(
                RemoteBookingResult(
                    success = true,
                    bookingId = bookingId,
                    bookingCode = bookingCode,
                    status = if (assignedDriverId != null) "DISPATCHED" else "SEARCHING",
                    startOtp = startOtp,
                    driverId = assignedDriverId,
                    driverName = "Rajesh Kumar",
                    driverPhone = "+91 99801 84920"
                )
            )
        } catch (e: Exception) {
            Log.w(tag, "Backend unreachable, using offline fallback: ${e.message}")
            Result.failure(e)
        }
    }

    suspend fun pollBookingStatus(bookingId: String): Result<RemoteBookingResult> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/status?booking_id=$bookingId")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 3000
                readTimeout = 3000
            }

            if (conn.responseCode in 200..299) {
                val text = BufferedReader(InputStreamReader(conn.inputStream)).use { it.readText() }
                val json = JSONObject(text)
                Result.success(
                    RemoteBookingResult(
                        success = true,
                        bookingId = json.optString("booking_id"),
                        bookingCode = json.optString("booking_code"),
                        status = json.optString("status"),
                        startOtp = json.optString("start_otp"),
                        driverId = json.optString("driver_id"),
                        driverName = json.optString("driver_name"),
                        driverPhone = json.optString("driver_phone")
                    )
                )
            } else {
                Result.failure(Exception("HTTP ${conn.responseCode}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getLiveTrack(bookingId: String): Result<LiveTrackResult> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/track?booking_id=$bookingId")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 3000
                readTimeout = 3000
            }

            if (conn.responseCode in 200..299) {
                val text = BufferedReader(InputStreamReader(conn.inputStream)).use { it.readText() }
                val json = JSONObject(text)
                Result.success(
                    LiveTrackResult(
                        status = json.optString("status"),
                        lat = json.optDouble("lat", 23.5262),
                        lng = json.optDouble("lng", 77.8211),
                        bearing = json.optDouble("bearing", 45.0).toFloat(),
                        etaMins = json.optInt("eta_mins", 6)
                    )
                )
            } else {
                Result.failure(Exception("HTTP ${conn.responseCode}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun cancelBooking(bookingId: String, reason: String): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/v1/bookings/cancel")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 3000
                readTimeout = 3000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("booking_id", bookingId)
                put("cancelled_by", "CUSTOMER")
                put("reason", reason)
            }
            OutputStreamWriter(conn.outputStream).use { it.write(body.toString()) }

            Result.success(conn.responseCode in 200..299)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
