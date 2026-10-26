package com.drivetrust.driver.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "offline_telemetry_queue")
data class OfflineTelemetryRecord(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val bookingId: String,
    val timestamp: Long,
    val latitude: Double,
    val longitude: Double,
    val speedKmh: Float,
    val heading: Float,
    val accelX: Float,
    val accelY: Float,
    val accelZ: Float,
    val gForce: Float,
    val harshBraking: Boolean,
    val harshCornering: Boolean,
    val isSynced: Boolean = false
)

@Dao
interface TelemetryQueueDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun enqueue(record: OfflineTelemetryRecord)

    @Query("SELECT * FROM offline_telemetry_queue WHERE isSynced = 0 ORDER BY timestamp ASC LIMIT :batchSize")
    suspend fun getPendingBatch(batchSize: Int = 50): List<OfflineTelemetryRecord>

    @Query("UPDATE offline_telemetry_queue SET isSynced = 1 WHERE id IN (:ids)")
    suspend fun markSynced(ids: List<Long>)

    @Query("DELETE FROM offline_telemetry_queue WHERE isSynced = 1")
    suspend fun purgeSynced()

    @Query("SELECT COUNT(*) FROM offline_telemetry_queue WHERE isSynced = 0")
    fun getPendingCount(): Flow<Int>
}

@Database(entities = [OfflineTelemetryRecord::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun telemetryQueueDao(): TelemetryQueueDao
}
