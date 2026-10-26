package dispatchservice

import (
	"context"
	"testing"

	"drivetrust/pkg/h3util"
	"drivetrust/pkg/logger"
	"drivetrust/pkg/rediscache"
)

func TestDispatchEngineRankingAndLock(t *testing.T) {
	log := logger.New("test-dispatch")
	cache := rediscache.NewClient("localhost:6379", "")
	engine := NewEngine(cache, log)

	pickupLoc := h3util.LatLng{Lat: 12.9716, Lng: 77.5946}
	pickupH3 := h3util.LatLngToH3(pickupLoc.Lat, pickupLoc.Lng, 8)

	pool := []DriverCandidate{
		{
			DriverID:             "drv-near-high-score",
			FullName:             "Rajesh Kumar",
			RatingAvg:            4.95,
			SafetyScore:          98,
			SupportedTransmissions: []string{"AUTOMATIC"},
			CurrentLocation:      h3util.LatLng{Lat: 12.9720, Lng: 77.5950}, // ~0.06 km
			H3Index:              pickupH3,
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
		{
			DriverID:             "drv-far-lower-score",
			FullName:             "Sunil Gowda",
			RatingAvg:            4.70,
			SafetyScore:          85,
			SupportedTransmissions: []string{"AUTOMATIC"},
			CurrentLocation:      h3util.LatLng{Lat: 12.9900, Lng: 77.6100}, // ~2.6 km
			H3Index:              "8860145a27ffffe",
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
	}

	req := DispatchRequest{
		BookingID:            "bk-test-1",
		PickupLocation:       pickupLoc,
		PickupH3Index:        pickupH3,
		TransmissionRequired: "AUTOMATIC",
		ServiceType:          "NIGHT_DROP",
		EstimatedEarnings:    540.0,
	}

	res, err := engine.FindAndDispatch(context.Background(), req, pool)
	if err != nil {
		t.Fatalf("unexpected dispatch error: %v", err)
	}

	if !res.Success {
		t.Fatalf("expected dispatch to succeed")
	}

	if res.AssignedDriverID != "drv-near-high-score" {
		t.Fatalf("expected top-ranked candidate 'drv-near-high-score', got: %s", res.AssignedDriverID)
	}
}
