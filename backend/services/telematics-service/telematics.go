package telematicsservice

import (
	"context"
	"math"
	"sync"
	"time"

	"drivetrust/pkg/logger"
)

type LocationPing struct {
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	H3Index        string  `json:"h3_index"`
	SpeedKmh       float64 `json:"speed_kmh"`
	Heading        float64 `json:"heading"`
	AccuracyMeters float64 `json:"accuracy_meters"`
}

type SensorReading struct {
	AccelX         float64 `json:"accel_x"`
	AccelY         float64 `json:"accel_y"`
	AccelZ         float64 `json:"accel_z"`
	GForce         float64 `json:"g_force"`
	HarshBraking   bool    `json:"harsh_braking"`
	HarshCornering bool    `json:"harsh_cornering"`
	CrashCandidate bool    `json:"crash_candidate"`
}

type TelematicsEvent struct {
	Timestamp int64         `json:"timestamp"`
	DriverID  string        `json:"driver_id"`
	BookingID string        `json:"booking_id"`
	Location  LocationPing  `json:"location"`
	Sensors   SensorReading `json:"sensors"`
}

type DriverSafetyRecord struct {
	DriverID             string    `json:"driver_id"`
	SafetyScore          int       `json:"safety_score"` // 0 to 100
	TotalEvents          int       `json:"total_events"`
	TotalHarshBraking    int       `json:"total_harsh_braking"`
	TotalHarshCornering  int       `json:"total_harsh_cornering"`
	TotalCrashCandidates int       `json:"total_crash_candidates"`
	LastEventTime        time.Time `json:"last_event_time"`
}

type Service struct {
	mu            sync.RWMutex
	safetyRecords map[string]*DriverSafetyRecord
	eventsLog     []TelematicsEvent
	logger        *logger.Logger
}

func NewService(log *logger.Logger) *Service {
	return &Service{
		safetyRecords: make(map[string]*DriverSafetyRecord),
		eventsLog:     make([]TelematicsEvent, 0),
		logger:        log,
	}
}

// IngestEvent processes an incoming real-time telematics event and computes harsh events
func (s *Service) IngestEvent(ctx context.Context, ev TelematicsEvent) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Anomaly & G-force validation
	// Harsh braking: accel_y < -0.45g (sudden deceleration)
	if ev.Sensors.AccelY < -0.45 {
		ev.Sensors.HarshBraking = true
	}
	// Harsh cornering: abs(accel_x) > 0.40g (sudden lateral tilt)
	if math.Abs(ev.Sensors.AccelX) > 0.40 {
		ev.Sensors.HarshCornering = true
	}
	// Crash candidate: G-force spike > 3.0g
	if ev.Sensors.GForce > 3.0 {
		ev.Sensors.CrashCandidate = true
		s.logger.Error("CRASH CANDIDATE DETECTED - Triggering SOS Panic Alert", map[string]interface{}{
			"driver_id":  ev.DriverID,
			"booking_id": ev.BookingID,
			"g_force":    ev.Sensors.GForce,
			"lat":        ev.Location.Latitude,
			"lng":        ev.Location.Longitude,
		})
	}

	// 2. Buffer for ClickHouse ingestion (bounded ring buffer to prevent memory exhaustion)
	s.eventsLog = append(s.eventsLog, ev)
	if len(s.eventsLog) > 10000 {
		s.eventsLog = s.eventsLog[len(s.eventsLog)-5000:]
	}

	// 3. Update driver safety score
	rec, exists := s.safetyRecords[ev.DriverID]
	if !exists {
		rec = &DriverSafetyRecord{
			DriverID:    ev.DriverID,
			SafetyScore: 100,
		}
		s.safetyRecords[ev.DriverID] = rec
	}

	rec.TotalEvents++
	rec.LastEventTime = time.UnixMilli(ev.Timestamp)

	if ev.Sensors.HarshBraking {
		rec.TotalHarshBraking++
	}
	if ev.Sensors.HarshCornering {
		rec.TotalHarshCornering++
	}
	if ev.Sensors.CrashCandidate {
		rec.TotalCrashCandidates++
		// Crash deduction (-30) subsumes braking/cornering for the same event
		rec.SafetyScore = int(math.Max(0, float64(rec.SafetyScore-30)))
	} else {
		deduction := 0
		if ev.Sensors.HarshBraking {
			deduction += 2
		}
		if ev.Sensors.HarshCornering {
			deduction += 3
		}
		rec.SafetyScore = int(math.Max(0, float64(rec.SafetyScore-deduction)))
	}

	return nil
}

// GetDriverSafety returns calculated telemetry score
func (s *Service) GetDriverSafety(driverID string) (*DriverSafetyRecord, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	rec, exists := s.safetyRecords[driverID]
	if !exists {
		return &DriverSafetyRecord{
			DriverID:    driverID,
			SafetyScore: 100,
		}, false
	}
	return rec, true
}

// GetRecentEvents returns the last n events for ClickHouse flush or admin inspector
func (s *Service) GetRecentEvents(limit int) []TelematicsEvent {
	s.mu.RLock()
	defer s.mu.RUnlock()

	count := len(s.eventsLog)
	if count == 0 {
		return []TelematicsEvent{}
	}
	if limit > count {
		limit = count
	}
	return s.eventsLog[count-limit:]
}
