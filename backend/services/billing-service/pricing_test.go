package billingservice

import (
	"testing"
)

func TestPricingNightDrop(t *testing.T) {
	pe := NewPricingEngine()

	// Bangalore Night Safe-Drop for 10 km
	breakdown, err := pe.CalculateEstimate("Bangalore", ServiceNightDrop, 10.0, 0, 0)
	if err != nil {
		t.Fatalf("calculation error: %v", err)
	}

	// Base fare: 299, Distance: 10 * 14 = 140 -> sub = 439
	// Night surge 25% = 109.75
	// Driver return allowance: 150
	// Convenience fee: 30
	// Total: 299 + 140 + 109.75 + 150 + 30 = 728.75
	if breakdown.TotalCustomerFare <= 0 {
		t.Fatalf("expected positive fare, got: %.2f", breakdown.TotalCustomerFare)
	}
	if breakdown.DriverEarnings <= 0 {
		t.Fatalf("expected positive driver earnings, got: %.2f", breakdown.DriverEarnings)
	}
	if breakdown.PlatformCommission <= 0 {
		t.Fatalf("expected positive platform commission, got: %.2f", breakdown.PlatformCommission)
	}
}

func TestPricingHourly(t *testing.T) {
	pe := NewPricingEngine()

	// 4 hours package in Mumbai
	breakdown, err := pe.CalculateEstimate("Mumbai", ServiceHourly, 15.0, 4, 0)
	if err != nil {
		t.Fatalf("calculation error: %v", err)
	}

	// Base 2 hrs: 399 + 2 extra hrs * 119 = 238 + 30 fee = 667
	if breakdown.ExtraTimeFare != 238.00 {
		t.Fatalf("expected extra time fare ₹238, got: %.2f", breakdown.ExtraTimeFare)
	}
}
