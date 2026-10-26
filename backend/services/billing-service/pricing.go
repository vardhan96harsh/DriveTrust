package billingservice

import (
	"fmt"
	"math"
	"strings"
)

type ServiceType string

const (
	ServiceHourly     ServiceType = "HOURLY"
	ServiceNightDrop  ServiceType = "NIGHT_DROP"
	ServiceOutstation ServiceType = "OUTSTATION"
)

type PricingZone struct {
	CityName                 string  `json:"city_name"`
	StateName                string  `json:"state_name"`
	HourlyBaseHours          int     `json:"hourly_base_hours"`
	HourlyBaseFare           float64 `json:"hourly_base_fare"`
	HourlyExtraHourRate      float64 `json:"hourly_extra_hour_rate"`
	HourlyExtraKmRate        float64 `json:"hourly_extra_km_rate"`
	NightBaseFare            float64 `json:"night_base_fare"`
	NightPerKmRate           float64 `json:"night_per_km_rate"`
	NightSurchargeMultiplier float64 `json:"night_surcharge_multiplier"`
	DriverReturnAllowance    float64 `json:"driver_return_allowance"`
	OutstationDailyRate      float64 `json:"outstation_daily_rate"`
	OutstationDriverAllowance float64 `json:"outstation_driver_allowance"`
	OutstationNightFee       float64 `json:"outstation_night_fee"`
	PlatformCommissionPct    float64 `json:"platform_commission_percent"` // e.g. 20.0
	ConvenienceFee           float64 `json:"convenience_fee"`            // e.g. 30.0
	CancellationFee          float64 `json:"cancellation_fee"`           // e.g. 100.0
}

type FareBreakdown struct {
	BaseFare              float64 `json:"base_fare"`
	ExtraTimeFare         float64 `json:"extra_time_fare"`
	DistanceFare          float64 `json:"distance_fare"`
	NightSurgeFare        float64 `json:"night_surge_fare"`
	DriverReturnAllowance float64 `json:"driver_return_allowance"`
	ConvenienceFee        float64 `json:"convenience_fee"`
	Subtotal              float64 `json:"subtotal"`
	GST                   float64 `json:"gst"`
	TotalCustomerFare     float64 `json:"total_customer_fare"`
	PlatformCommission    float64 `json:"platform_commission"`
	DriverEarnings        float64 `json:"driver_earnings"`
}

type PricingEngine struct {
	zones map[string]PricingZone
}

func NewPricingEngine() *PricingEngine {
	pe := &PricingEngine{
		zones: make(map[string]PricingZone),
	}

	// Seed Vidisha (MP-40) Hub
	pe.zones["Vidisha"] = PricingZone{
		CityName:                  "Vidisha",
		StateName:                 "Madhya Pradesh",
		HourlyBaseHours:           2,
		HourlyBaseFare:            299.00,
		HourlyExtraHourRate:       89.00,
		HourlyExtraKmRate:         11.00,
		NightBaseFare:             249.00,
		NightPerKmRate:            12.00,
		NightSurchargeMultiplier:  1.20,
		DriverReturnAllowance:     120.00,
		OutstationDailyRate:       1599.00,
		OutstationDriverAllowance: 300.00,
		OutstationNightFee:        250.00,
		PlatformCommissionPct:     18.00,
		ConvenienceFee:            25.00,
		CancellationFee:           100.00,
	}

	// Seed Bhopal (MP-04) Hub
	pe.zones["Bhopal"] = PricingZone{
		CityName:                  "Bhopal",
		StateName:                 "Madhya Pradesh",
		HourlyBaseHours:           2,
		HourlyBaseFare:            349.00,
		HourlyExtraHourRate:       99.00,
		HourlyExtraKmRate:         13.00,
		NightBaseFare:             299.00,
		NightPerKmRate:            14.00,
		NightSurchargeMultiplier:  1.25,
		DriverReturnAllowance:     150.00,
		OutstationDailyRate:       1799.00,
		OutstationDriverAllowance: 350.00,
		OutstationNightFee:        250.00,
		PlatformCommissionPct:     20.00,
		ConvenienceFee:            30.00,
		CancellationFee:           100.00,
	}

	// Seed Tier-1 Indian metros
	pe.zones["Bangalore"] = PricingZone{
		CityName:                 "Bangalore",
		StateName:                "Karnataka",
		HourlyBaseHours:          2,
		HourlyBaseFare:           349.00,
		HourlyExtraHourRate:      99.00,
		HourlyExtraKmRate:        12.00,
		NightBaseFare:            299.00,
		NightPerKmRate:           14.00,
		NightSurchargeMultiplier: 1.25,
		DriverReturnAllowance:    150.00,
		OutstationDailyRate:      1799.00,
		OutstationDriverAllowance: 350.00,
		OutstationNightFee:       250.00,
		PlatformCommissionPct:    20.00,
		ConvenienceFee:           30.00,
		CancellationFee:          100.00,
	}

	pe.zones["Mumbai"] = PricingZone{
		CityName:                 "Mumbai",
		StateName:                "Maharashtra",
		HourlyBaseHours:          2,
		HourlyBaseFare:           399.00,
		HourlyExtraHourRate:      119.00,
		HourlyExtraKmRate:        14.00,
		NightBaseFare:            349.00,
		NightPerKmRate:           16.00,
		NightSurchargeMultiplier: 1.30,
		DriverReturnAllowance:    200.00,
		OutstationDailyRate:      1999.00,
		OutstationDriverAllowance: 400.00,
		OutstationNightFee:       300.00,
		PlatformCommissionPct:    20.00,
		ConvenienceFee:           30.00,
		CancellationFee:          100.00,
	}

	return pe
}

// CalculateEstimate computes the complete fare breakdown according to the service type
func (pe *PricingEngine) CalculateEstimate(city string, sType ServiceType, distanceKm float64, packageHours int, days int) (*FareBreakdown, error) {
	zone, exists := pe.zones[city]
	if !exists {
		// Case-insensitive exact match
		for zName, z := range pe.zones {
			if strings.EqualFold(city, zName) {
				zone = z
				exists = true
				break
			}
		}
	}
	if !exists {
		// Clean prefix matching (at least 3 characters)
		cleanCity := strings.ToLower(strings.TrimSpace(city))
		for zName, z := range pe.zones {
			cleanZone := strings.ToLower(zName)
			if len(cleanCity) >= 3 && (strings.HasPrefix(cleanCity, cleanZone) || strings.HasPrefix(cleanZone, cleanCity)) {
				zone = z
				exists = true
				break
			}
		}
	}
	if !exists {
		// Fallback to Vidisha if explicitly Vidisha-related, else default to Bangalore
		cleanCity := strings.ToLower(strings.TrimSpace(city))
		if strings.HasPrefix(cleanCity, "vid") {
			zone = pe.zones["Vidisha"]
		} else if strings.HasPrefix(cleanCity, "bho") {
			zone = pe.zones["Bhopal"]
		} else if strings.HasPrefix(cleanCity, "mum") {
			zone = pe.zones["Mumbai"]
		} else {
			zone = pe.zones["Bangalore"]
		}
	}

	breakdown := &FareBreakdown{
		ConvenienceFee: zone.ConvenienceFee,
	}

	switch sType {
	case ServiceHourly:
		baseHours := zone.HourlyBaseHours
		breakdown.BaseFare = zone.HourlyBaseFare
		if packageHours > baseHours {
			extraHours := packageHours - baseHours
			breakdown.ExtraTimeFare = float64(extraHours) * zone.HourlyExtraHourRate
		}
		// Extra KM allowance beyond 20km standard package
		if distanceKm > 20.0 {
			breakdown.DistanceFare = (distanceKm - 20.0) * zone.HourlyExtraKmRate
		}

	case ServiceNightDrop:
		breakdown.BaseFare = zone.NightBaseFare
		breakdown.DistanceFare = distanceKm * zone.NightPerKmRate
		breakdown.DriverReturnAllowance = zone.DriverReturnAllowance
		// Night surcharge applied to base + distance
		sub := breakdown.BaseFare + breakdown.DistanceFare
		breakdown.NightSurgeFare = sub * (zone.NightSurchargeMultiplier - 1.0)

	case ServiceOutstation:
		if days < 1 {
			days = 1
		}
		breakdown.BaseFare = float64(days) * zone.OutstationDailyRate
		breakdown.DriverReturnAllowance = float64(days) * zone.OutstationDriverAllowance
		if distanceKm > float64(days*250) {
			breakdown.DistanceFare = (distanceKm - float64(days*250)) * 14.00
		}

	default:
		return nil, fmt.Errorf("unknown service type: %s", sType)
	}

	// Subtotal calculation
	subtotal := breakdown.BaseFare + breakdown.ExtraTimeFare + breakdown.DistanceFare +
		breakdown.NightSurgeFare + breakdown.DriverReturnAllowance + breakdown.ConvenienceFee
	breakdown.Subtotal = math.Round(subtotal*100) / 100

	// 5% GST computation
	gst := breakdown.Subtotal * 0.05
	breakdown.GST = math.Round(gst*100) / 100

	total := breakdown.Subtotal + breakdown.GST
	breakdown.TotalCustomerFare = math.Round(total*100) / 100

	// Platform commission calculation: applied on operational fare (excluding driver return allowance & convenience fee)
	fareSubjectToCommission := breakdown.Subtotal - breakdown.DriverReturnAllowance - breakdown.ConvenienceFee
	commission := fareSubjectToCommission * (zone.PlatformCommissionPct / 100.0)
	breakdown.PlatformCommission = math.Round(commission*100) / 100

	// Driver earnings: (fare - commission) + driver return allowance
	driverEarnings := (fareSubjectToCommission - breakdown.PlatformCommission) + breakdown.DriverReturnAllowance
	breakdown.DriverEarnings = math.Round(driverEarnings*100) / 100

	return breakdown, nil
}

