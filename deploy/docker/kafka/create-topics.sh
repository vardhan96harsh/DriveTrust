#!/bin/bash
# DriveTrust Ultra: Kafka Initial Topics Provisioning
set -e

BOOTSTRAP_SERVER="localhost:9092"

echo "Waiting for Kafka broker at $BOOTSTRAP_SERVER..."
cub kafka-ready 1 30 -b $BOOTSTRAP_SERVER || sleep 5

echo "Creating topic: driver.telemetry.v1 (12 partitions, key: driver_id)..."
kafka-topics --create --if-not-exists \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --partitions 12 \
  --replication-factor 1 \
  --topic driver.telemetry.v1 \
  --config cleanup.policy=compact,delete \
  --config retention.ms=604800000

echo "Creating topic: booking.state.v1 (6 partitions, key: booking_id)..."
kafka-topics --create --if-not-exists \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --partitions 6 \
  --replication-factor 1 \
  --topic booking.state.v1 \
  --config retention.ms=1209600000

echo "Creating topic: billing.events.v1 (6 partitions, key: booking_id)..."
kafka-topics --create --if-not-exists \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --partitions 6 \
  --replication-factor 1 \
  --topic billing.events.v1

echo "Creating topic: safety.sos.v1 (6 partitions, key: booking_id, high priority)..."
kafka-topics --create --if-not-exists \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --partitions 6 \
  --replication-factor 1 \
  --topic safety.sos.v1 \
  --config retention.ms=2592000000

echo "Creating topic: vehicle.handover.v1 (6 partitions, key: booking_id)..."
kafka-topics --create --if-not-exists \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --partitions 6 \
  --replication-factor 1 \
  --topic vehicle.handover.v1 \
  --config retention.ms=2592000000

echo "Kafka topics verified successfully."

