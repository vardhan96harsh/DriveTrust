-- DriveTrust Ultra: ClickHouse Telematics & Safety Events Engine
-- Version: 1.0.0-PROD

CREATE DATABASE IF NOT EXISTS drivetrust_analytics;

CREATE TABLE IF NOT EXISTS drivetrust_analytics.telematics_events (
    event_time DateTime64(3, 'UTC'),
    booking_id UUID,
    driver_id UUID,
    latitude Float64,
    longitude Float64,
    speed_kmh Float32,
    heading Float32,
    accel_x Float32,
    accel_y Float32,
    accel_z Float32,
    g_force Float32,
    is_harsh_braking UInt8,
    is_harsh_cornering UInt8,
    is_crash_candidate UInt8
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_time)
ORDER BY (driver_id, booking_id, event_time)
SETTINGS index_granularity = 8192;

-- Materialized View for Hourly Driver Telematics Aggregates
CREATE TABLE IF NOT EXISTS drivetrust_analytics.driver_safety_hourly (
    window_start DateTime,
    driver_id UUID,
    total_events SimpleAggregateFunction(sum, UInt32),
    speed_sum SimpleAggregateFunction(sum, Float64),
    max_speed SimpleAggregateFunction(max, Float32),
    total_harsh_braking SimpleAggregateFunction(sum, UInt32),
    total_harsh_cornering SimpleAggregateFunction(sum, UInt32),
    total_crash_flags SimpleAggregateFunction(sum, UInt32)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(window_start)
ORDER BY (driver_id, window_start);

CREATE MATERIALIZED VIEW IF NOT EXISTS drivetrust_analytics.mv_driver_safety_hourly
TO drivetrust_analytics.driver_safety_hourly AS
SELECT
    toStartOfHour(event_time) AS window_start,
    driver_id,
    count() AS total_events,
    sum(speed_kmh) AS speed_sum,
    max(speed_kmh) AS max_speed,
    sum(is_harsh_braking) AS total_harsh_braking,
    sum(is_harsh_cornering) AS total_harsh_cornering,
    sum(is_crash_candidate) AS total_crash_flags
FROM drivetrust_analytics.telematics_events
GROUP BY window_start, driver_id;

-- Friendly queryable view computing true average speed
CREATE VIEW IF NOT EXISTS drivetrust_analytics.v_driver_safety_hourly AS
SELECT
    window_start,
    driver_id,
    sum(total_events) AS total_events,
    round(sum(speed_sum) / nullIf(sum(total_events), 0), 2) AS avg_speed,
    max(max_speed) AS max_speed,
    sum(total_harsh_braking) AS total_harsh_braking,
    sum(total_harsh_cornering) AS total_harsh_cornering,
    sum(total_crash_flags) AS total_crash_flags
FROM drivetrust_analytics.driver_safety_hourly
GROUP BY window_start, driver_id;
