package rediscache

import (
	"context"
	"testing"
	"time"
)

func TestAtomicDriverLock(t *testing.T) {
	client := NewClient("localhost:6379", "")
	ctx := context.Background()

	driverID := "drv-101"
	bookingA := "bk-1"
	bookingB := "bk-2"

	// 1. Driver A claims lock
	acquiredA, err := client.TryAcquireDriverLock(ctx, driverID, bookingA, 10*time.Second)
	if err != nil || !acquiredA {
		t.Fatalf("expected Driver A to acquire lock, got: %v (err: %v)", acquiredA, err)
	}

	// 2. Driver B tries to claim the same driver concurrently -> MUST FAIL (atomic Redlock)
	acquiredB, err := client.TryAcquireDriverLock(ctx, driverID, bookingB, 10*time.Second)
	if err != nil {
		t.Fatalf("unexpected error on second lock attempt: %v", err)
	}
	if acquiredB {
		t.Fatalf("RACE CONDITION DETECTED! Second booking acquired already locked driver!")
	}

	// 3. Release lock
	_ = client.ReleaseDriverLock(ctx, driverID, bookingA)

	// 4. Now Driver B should succeed
	acquiredB2, _ := client.TryAcquireDriverLock(ctx, driverID, bookingB, 10*time.Second)
	if !acquiredB2 {
		t.Fatalf("expected Driver B to acquire lock after release")
	}
}

func TestDriverPositionH3Registry(t *testing.T) {
	client := NewClient("localhost:6379", "")
	ctx := context.Background()

	pos := DriverPosition{
		DriverID:  "drv-202",
		Lat:       12.9716,
		Lng:       77.5946,
		H3Index:   "8860145a27fffff",
		Heading:   180.0,
		SpeedKmh:  35.0,
		UpdatedAt: time.Now(),
	}

	_ = client.UpdateDriverPosition(ctx, pos)

	drivers, err := client.GetDriversInH3Cell(ctx, "8860145a27fffff")
	if err != nil || len(drivers) != 1 || drivers[0] != "drv-202" {
		t.Fatalf("expected driver drv-202 in H3 cell, got: %v", drivers)
	}
}
