package telematicsservice

import (
	"context"
	"testing"
	"time"

	"drivetrust/pkg/logger"
)

func TestHarshDrivingAndSafetyScore(t *testing.T) {
	log := logger.New("test-telematics")
	svc := NewService(log)

	driverID := "drv-speedy"
	ctx := context.Background()

	// Initial clean event
	_ = svc.IngestEvent(ctx, TelematicsEvent{
		Timestamp: time.Now().UnixMilli(),
		DriverID:  driverID,
		BookingID: "bk-1",
		Location:  LocationPing{Latitude: 12.9716, Longitude: 77.5946, SpeedKmh: 40},
		Sensors:   SensorReading{AccelX: 0.05, AccelY: -0.1, AccelZ: 0.98, GForce: 1.0},
	})

	rec, _ := svc.GetDriverSafety(driverID)
	if rec.SafetyScore != 100 {
		t.Fatalf("expected initial safety score 100, got: %d", rec.SafetyScore)
	}

	// Ingest Harsh Braking event (accel_y = -0.55g) -> -2 pts
	_ = svc.IngestEvent(ctx, TelematicsEvent{
		Timestamp: time.Now().UnixMilli(),
		DriverID:  driverID,
		BookingID: "bk-1",
		Location:  LocationPing{Latitude: 12.9718, Longitude: 77.5948, SpeedKmh: 20},
		Sensors:   SensorReading{AccelX: 0.02, AccelY: -0.55, AccelZ: 0.98, GForce: 1.15},
	})

	rec, _ = svc.GetDriverSafety(driverID)
	if rec.TotalHarshBraking != 1 || rec.SafetyScore != 98 {
		t.Fatalf("expected 1 harsh braking and safety score 98, got score: %d, harsh: %d", rec.SafetyScore, rec.TotalHarshBraking)
	}

	// Ingest Crash Candidate (G-Force 3.5g) -> -30 pts
	_ = svc.IngestEvent(ctx, TelematicsEvent{
		Timestamp: time.Now().UnixMilli(),
		DriverID:  driverID,
		BookingID: "bk-1",
		Location:  LocationPing{Latitude: 12.9720, Longitude: 77.5950, SpeedKmh: 0},
		Sensors:   SensorReading{AccelX: 1.2, AccelY: -2.8, AccelZ: 2.0, GForce: 3.5},
	})

	rec, _ = svc.GetDriverSafety(driverID)
	if rec.TotalCrashCandidates != 1 || rec.SafetyScore > 70 {
		t.Fatalf("expected crash candidate flagged and score reduced, got score: %d, crashes: %d", rec.SafetyScore, rec.TotalCrashCandidates)
	}
}
