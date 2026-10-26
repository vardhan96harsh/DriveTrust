package h3util

import (
	"strings"
	"testing"
)

func TestLatLngToH3(t *testing.T) {
	lat := 12.9716
	lng := 77.5946

	h3Index := LatLngToH3(lat, lng, DefaultResolution)
	if !strings.HasPrefix(h3Index, "88") {
		t.Fatalf("expected resolution 8 prefix '88', got: %s", h3Index)
	}

	if len(h3Index) != 15 {
		t.Fatalf("expected 15-character H3 index string, got len %d (%s)", len(h3Index), h3Index)
	}
}

func TestGetKRing(t *testing.T) {
	origin := "8860145a27fffff"
	ring0 := GetKRing(origin, 0)
	if len(ring0) != 1 || ring0[0] != origin {
		t.Fatalf("ring 0 must return exactly the origin cell")
	}

	ring1 := GetKRing(origin, 1)
	// Origin (1) + 6 neighbors = 7 cells
	if len(ring1) != 7 {
		t.Fatalf("expected 7 cells in ring 1, got %d", len(ring1))
	}

	ring2 := GetKRing(origin, 2)
	// Origin (1) + 6 + 12 = 19 cells
	if len(ring2) != 19 {
		t.Fatalf("expected 19 cells in ring 2, got %d", len(ring2))
	}
}

func TestHaversineDistanceKm(t *testing.T) {
	// Bangalore MG Road to Koramangala (~5.5 km)
	p1 := LatLng{Lat: 12.9750, Lng: 77.6090}
	p2 := LatLng{Lat: 12.9352, Lng: 77.6245}

	dist := HaversineDistanceKm(p1, p2)
	if dist < 4.0 || dist > 7.0 {
		t.Fatalf("expected distance between 4 and 7 km, got: %.2f", dist)
	}
}
