package dispatchservice

import (
	"context"
	"fmt"
	"sort"
	"time"

	"drivetrust/pkg/h3util"
	"drivetrust/pkg/logger"
	"drivetrust/pkg/rediscache"
)

type DriverCandidate struct {
	DriverID             string   `json:"driver_id"`
	FullName             string   `json:"full_name"`
	RatingAvg            float64  `json:"rating_avg"`
	SafetyScore          int      `json:"safety_score"`
	SupportedTransmissions []string `json:"supported_transmissions"`
	CurrentLocation      h3util.LatLng `json:"current_location"`
	H3Index              string   `json:"h3_index"`
	IsOnline             bool     `json:"is_online"`
	KycStatus            string   `json:"kyc_status"` // APPROVED
	DistanceKm           float64  `json:"distance_km"`
	FinalScore           float64  `json:"final_score"`
}

type DispatchRequest struct {
	BookingID            string        `json:"booking_id"`
	PickupLocation       h3util.LatLng `json:"pickup_location"`
	PickupH3Index        string        `json:"pickup_h3_index"`
	TransmissionRequired string        `json:"transmission_required"`
	ServiceType          string        `json:"service_type"`
	EstimatedEarnings    float64       `json:"estimated_earnings"`
}

type DispatchResult struct {
	Success          bool             `json:"success"`
	AssignedDriverID string           `json:"assigned_driver_id,omitempty"`
	SearchRingRadius int              `json:"search_ring_radius"`
	Message          string           `json:"message"`
	Candidate        *DriverCandidate `json:"candidate,omitempty"`
}

type Engine struct {
	cache  *rediscache.Client
	logger *logger.Logger
}

func NewEngine(cache *rediscache.Client, log *logger.Logger) *Engine {
	return &Engine{
		cache:  cache,
		logger: log,
	}
}

// FindAndDispatch conducts tiered hexagonal k-ring matching (k=0 to 3)
func (e *Engine) FindAndDispatch(ctx context.Context, req DispatchRequest, pool []DriverCandidate) (*DispatchResult, error) {
	e.logger.Info("Starting hexagonal dispatch matching", map[string]interface{}{
		"booking_id": req.BookingID,
		"pickup_h3":  req.PickupH3Index,
		"service":    req.ServiceType,
	})

	pickupH3 := req.PickupH3Index
	if pickupH3 == "" {
		pickupH3 = h3util.LatLngToH3(req.PickupLocation.Lat, req.PickupLocation.Lng, h3util.DefaultResolution)
	}

	// Expand search ring radius: k=0 (0-500m), k=1 (~1.5km), k=2 (~3km), k=3 (~5km)
	for ring := 0; ring <= 3; ring++ {
		e.logger.Debug(fmt.Sprintf("Expanding Uber H3 search ring: k=%d", ring), map[string]interface{}{
			"booking_id": req.BookingID,
			"ring":       ring,
		})

		var candidates []DriverCandidate
		for _, driver := range pool {
			if !driver.IsOnline || driver.KycStatus != "APPROVED" {
				continue
			}

			// Validate transmission support:
			// 1. Exact match (e.g. MANUAL, AUTOMATIC, EV)
			// 2. Chauffeurs certified for MANUAL can safely drive AUTOMATIC
			hasTransmission := false
			for _, t := range driver.SupportedTransmissions {
				if t == req.TransmissionRequired {
					hasTransmission = true
					break
				}
				if req.TransmissionRequired == "AUTOMATIC" && t == "MANUAL" {
					hasTransmission = true
					break
				}
			}
			if !hasTransmission {
				continue
			}

			// Compute distance
			dist := h3util.HaversineDistanceKm(req.PickupLocation, driver.CurrentLocation)

			// Ring distance thresholds:
			// ring 0: <= 1.0 km
			// ring 1: <= 2.5 km
			// ring 2: <= 5.0 km
			// ring 3: <= 8.0 km
			ringThresholds := []float64{1.0, 2.5, 5.0, 8.0}
			maxDist := 8.0
			if ring < len(ringThresholds) {
				maxDist = ringThresholds[ring]
			}
			if dist <= maxDist {
				// Tier-1 Dispatch Ranking Algorithm:
				// Rating weight (40%) + Safety Telematics weight (30%) - Proximity penalty (30%)
				score := (driver.RatingAvg * 20.0) + (float64(driver.SafetyScore) * 0.3) - (dist * 4.0)
				c := driver
				c.DistanceKm = dist
				c.FinalScore = score
				candidates = append(candidates, c)
			}
		}

		if len(candidates) == 0 {
			continue
		}

		// Sort by highest score first
		sort.Slice(candidates, func(i, j int) bool {
			return candidates[i].FinalScore > candidates[j].FinalScore
		})

		// Attempt atomic lock on top candidates
		for _, cand := range candidates {
			acquired, err := e.cache.TryAcquireDriverLock(ctx, cand.DriverID, req.BookingID, 30*time.Second)
			if err != nil {
				e.logger.Error("Failed redis driver lock check", map[string]interface{}{"driver_id": cand.DriverID, "error": err.Error()})
				continue
			}

			if acquired {
				e.logger.Info("Driver successfully locked & offer dispatched", map[string]interface{}{
					"booking_id": req.BookingID,
					"driver_id":  cand.DriverID,
					"ring":       ring,
					"distance":   cand.DistanceKm,
					"score":      cand.FinalScore,
				})

				return &DispatchResult{
					Success:          true,
					AssignedDriverID: cand.DriverID,
					SearchRingRadius: ring,
					Message:          "Ride offer dispatched. Awaiting driver acceptance (30s timer).",
					Candidate:        &cand,
				}, nil
			}
		}
	}

	return &DispatchResult{
		Success:          false,
		SearchRingRadius: 3,
		Message:          "No qualified drivers available within 8km radius.",
	}, nil
}
