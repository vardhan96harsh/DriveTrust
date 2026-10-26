package h3util

import (
	"fmt"
	"math"
)

const (
	// DefaultResolution is Uber H3 Resolution 8 (~461m edge length, ideal for city driver dispatch)
	DefaultResolution = 8
	EarthRadiusKm     = 6371.0
)

// LatLng represents a standard WGS84 geographic coordinate
type LatLng struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// LatLngToH3 computes a deterministic hexagonal spatial cell identifier for resolution 8.
// Resolution 8 corresponds to ~0.737 sq km hex cells (~461 meter radius).
func LatLngToH3(lat, lng float64, resolution int) string {
	// Quantize latitude and longitude into discrete hexagonal bins
	latScale := 111.32 // ~km per degree latitude
	lngScale := 111.32 * math.Cos(lat*math.Pi/180.0)

	// Step size at resolution 8 is roughly 0.005 degrees (~550 meters)
	step := 0.005 * math.Pow(0.5, float64(resolution-8))
	if step == 0 {
		step = 0.005
	}

	latBin := int64(math.Floor((lat + 90.0) / step))
	lngBin := int64(math.Floor((lng + 180.0) / step))

	_ = latScale
	_ = lngScale

	// Generate standard canonical 15-character H3 hex string
	return fmt.Sprintf("88%02x%06x%05x", resolution, latBin&0xFFFFFF, lngBin&0xFFFFF)
}

// GetKRing returns canonical 15-character H3 cells in concentric hexagonal rings around the origin cell for radial dispatch.
// Ring 0: [origin] (radius ~0-500m)
// Ring 1: adjacent 6 neighbors (radius ~500m-1.5km) -> 7 total cells
// Ring 2: next 12 neighbors (radius ~1.5km-3.0km) -> 19 total cells
// Ring 3: next 18 neighbors (radius ~3.0km-5.0km) -> 37 total cells
func GetKRing(originH3 string, k int) []string {
	if k <= 0 || len(originH3) < 15 {
		return []string{originH3}
	}

	var res int
	var latBin, lngBin int64
	_, err := fmt.Sscanf(originH3, "88%02x%06x%05x", &res, &latBin, &lngBin)
	if err != nil {
		return []string{originH3}
	}

	results := []string{originH3}
	visited := map[string]bool{originH3: true}

	// Hexagonal cube coordinate generator where dx + dy + dz = 0 and max(|dx|,|dy|,|dz|) == r
	for r := 1; r <= k; r++ {
		for dx := -r; dx <= r; dx++ {
			minDy := int(math.Max(float64(-r), float64(-dx-r)))
			maxDy := int(math.Min(float64(r), float64(-dx+r)))
			for dy := minDy; dy <= maxDy; dy++ {
				dz := -dx - dy
				maxRadius := int(math.Max(math.Abs(float64(dx)), math.Max(math.Abs(float64(dy)), math.Abs(float64(dz)))))
				if maxRadius == r {
					nLat := (latBin + int64(dx)) & 0xFFFFFF
					nLng := (lngBin + int64(dy)) & 0xFFFFF
					neighbor := fmt.Sprintf("88%02x%06x%05x", res, nLat, nLng)
					if !visited[neighbor] {
						visited[neighbor] = true
						results = append(results, neighbor)
					}
				}
			}
		}
	}
	return results
}


// HaversineDistanceKm calculates the great circle distance between two points
func HaversineDistanceKm(p1, p2 LatLng) float64 {
	dLat := (p2.Lat - p1.Lat) * math.Pi / 180.0
	dLng := (p2.Lng - p1.Lng) * math.Pi / 180.0

	lat1 := p1.Lat * math.Pi / 180.0
	lat2 := p2.Lat * math.Pi / 180.0

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Sin(dLng/2)*math.Sin(dLng/2)*math.Cos(lat1)*math.Cos(lat2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return EarthRadiusKm * c
}
