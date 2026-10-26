package bookingservice

import (
	"testing"
	"time"

	"drivetrust/pkg/logger"
)

func TestTripLifecycleStateMachine(t *testing.T) {
	log := logger.New("test-booking")
	svc := NewService(log)

	// 1. Create Booking in SEARCHING
	b := &Booking{
		ID:                   "bk-100",
		BookingCode:          "DT123456",
		CustomerID:           "cust-1",
		ServiceType:          "NIGHT_DROP",
		TransmissionRequired: "AUTOMATIC",
		PickupAddress:        "MG Road, Bangalore",
	}
	created := svc.CreateBooking(b)
	if created.Status != StatusSearching {
		t.Fatalf("expected initial status SEARCHING, got: %s", created.Status)
	}

	// 2. Dispatch offer
	err := svc.DispatchOffer(b.ID, "drv-1")
	if err != nil {
		t.Fatalf("dispatch error: %v", err)
	}

	// 3. Driver accepts
	accepted, err := svc.AcceptBooking(b.ID, "drv-1")
	if err != nil || accepted.Status != StatusAccepted {
		t.Fatalf("accept error: %v", err)
	}

	// 4. Driver arrives at pickup
	err = svc.DriverArrived(b.ID, "drv-1")
	if err != nil {
		t.Fatalf("arrive error: %v", err)
	}

	// 5. Test Invalid OTP rejection
	err = svc.StartTrip(b.ID, "drv-1", "0000")
	if err == nil {
		t.Fatalf("expected error on incorrect OTP")
	}

	// 6. Test Valid OTP verification
	err = svc.StartTrip(b.ID, "drv-1", accepted.StartOTP)
	if err != nil {
		t.Fatalf("expected OTP validation to succeed, got: %v", err)
	}

	// 7. Complete Trip
	err = svc.CompleteTrip(b.ID, "drv-1")
	if err != nil {
		t.Fatalf("complete error: %v", err)
	}

	finalBooking, _ := svc.GetBooking(b.ID)
	if finalBooking.Status != StatusCompleted {
		t.Fatalf("expected final status COMPLETED, got: %s", finalBooking.Status)
	}
}

func TestCancellationFeePolicy(t *testing.T) {
	log := logger.New("test-cancel")
	svc := NewService(log)

	b := &Booking{
		ID:          "bk-cancel",
		BookingCode: "DTCANCEL",
		CustomerID:  "cust-2",
		ServiceType: "HOURLY",
	}
	svc.CreateBooking(b)
	_ = svc.DispatchOffer(b.ID, "drv-2")
	accepted, _ := svc.AcceptBooking(b.ID, "drv-2")

	// Artificially simulate 5 minutes elapsed after acceptance
	pastTime := time.Now().Add(-5 * time.Minute)
	accepted.AcceptedAt = &pastTime

	cancelled, err := svc.CancelBooking(b.ID, "CUSTOMER", "Plans changed")
	if err != nil {
		t.Fatalf("cancel error: %v", err)
	}

	if cancelled.CancellationFee != 100.00 {
		t.Fatalf("expected ₹100 cancellation fee, got: %.2f", cancelled.CancellationFee)
	}
	if cancelled.DriverCompensation != 75.00 {
		t.Fatalf("expected ₹75 driver compensation, got: %.2f", cancelled.DriverCompensation)
	}
}

func TestPermanentCustomerStartPIN(t *testing.T) {
	log := logger.New("test-permanent-pin")
	svc := NewService(log)

	// Customer with permanent unique PIN "4892"
	b := &Booking{
		ID:            "bk-perm-pin",
		BookingCode:   "DTPERM",
		CustomerID:    "cust-harsh",
		StartOTP:      "4892", // Customer's unique permanent Sathi PIN
		ServiceType:   "NIGHT_DROP",
		PickupAddress: "Vidisha Railway Station",
	}

	created := svc.CreateBooking(b)
	if created.StartOTP != "4892" {
		t.Fatalf("expected permanent StartOTP to remain 4892, got: %s", created.StartOTP)
	}

	_ = svc.DispatchOffer(b.ID, "drv-lead")
	accepted, err := svc.AcceptBooking(b.ID, "drv-lead")
	if err != nil || accepted.StartOTP != "4892" {
		t.Fatalf("expected accepted booking to have permanent OTP 4892, got: %s", accepted.StartOTP)
	}

	_ = svc.DriverArrived(b.ID, "drv-lead")

	// Entering wrong PIN must be rejected
	if err := svc.StartTrip(b.ID, "drv-lead", "1111"); err == nil {
		t.Fatalf("expected wrong PIN rejection")
	}

	// Entering customer's permanent PIN "4892" must succeed
	if err := svc.StartTrip(b.ID, "drv-lead", "4892"); err != nil {
		t.Fatalf("expected trip start to succeed with customer permanent PIN: %v", err)
	}
}

