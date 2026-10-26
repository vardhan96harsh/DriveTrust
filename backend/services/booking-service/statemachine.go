package bookingservice

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"sync"
	"time"

	"drivetrust/pkg/logger"
)

type BookingStatus string

const (
	StatusSearching     BookingStatus = "SEARCHING"
	StatusDispatched    BookingStatus = "DISPATCHED"
	StatusAccepted      BookingStatus = "ACCEPTED"
	StatusDriverArrived BookingStatus = "DRIVER_ARRIVED"
	StatusInProgress    BookingStatus = "IN_PROGRESS"
	StatusCompleted     BookingStatus = "COMPLETED"
	StatusCancelled     BookingStatus = "CANCELLED"
)

type Booking struct {
	ID                   string        `json:"id"`
	BookingCode          string        `json:"booking_code"`
	CustomerID           string        `json:"customer_id"`
	CustomerName         string        `json:"customer_name,omitempty"`
	CustomerPhone        string        `json:"customer_phone,omitempty"`
	DriverID             string        `json:"driver_id,omitempty"`
	Status               BookingStatus `json:"status"`
	ServiceType          string        `json:"service_type"` // HOURLY, NIGHT_DROP, OUTSTATION
	TransmissionRequired string        `json:"transmission_required"`
	VehicleModel         string        `json:"vehicle_model,omitempty"`
	VehiclePlate         string        `json:"vehicle_plate,omitempty"`
	PickupAddress        string        `json:"pickup_address"`
	PickupLat            float64       `json:"pickup_lat"`
	PickupLng            float64       `json:"pickup_lng"`
	DropoffAddress       string        `json:"dropoff_address,omitempty"`
	DropoffLat           float64       `json:"dropoff_lat,omitempty"`
	DropoffLng           float64       `json:"dropoff_lng,omitempty"`
	EstimatedFare        float64       `json:"estimated_fare,omitempty"`
	StartOTP             string        `json:"start_otp"`
	AcceptedAt           *time.Time    `json:"accepted_at,omitempty"`
	ArrivedAt            *time.Time    `json:"arrived_at,omitempty"`
	StartedAt            *time.Time    `json:"started_at,omitempty"`
	CompletedAt          *time.Time    `json:"completed_at,omitempty"`
	CancelledAt          *time.Time    `json:"cancelled_at,omitempty"`
	CancellationReason   string        `json:"cancellation_reason,omitempty"`
	CancelledBy          string        `json:"cancelled_by,omitempty"`
	CancellationFee      float64       `json:"cancellation_fee,omitempty"`
	DriverCompensation   float64       `json:"driver_compensation,omitempty"`
	CreatedAt            time.Time     `json:"created_at"`
	UpdatedAt            time.Time     `json:"updated_at"`
}

type Service struct {
	mu       sync.RWMutex
	bookings map[string]*Booking
	logger   *logger.Logger
}

func NewService(log *logger.Logger) *Service {
	return &Service{
		bookings: make(map[string]*Booking),
		logger:   log,
	}
}

// GenerateOTP produces a cryptographically secure 4-digit numeric OTP
func GenerateOTP() string {
	n, err := rand.Int(rand.Reader, big.NewInt(9000))
	if err != nil || n == nil {
		return fmt.Sprintf("%04d", (time.Now().UnixNano()%9000)+1000)
	}
	return fmt.Sprintf("%04d", n.Int64()+1000)
}

// CreateBooking initializes a booking in SEARCHING state
func (s *Service) CreateBooking(b *Booking) *Booking {
	s.mu.Lock()
	defer s.mu.Unlock()

	b.Status = StatusSearching
	if b.StartOTP == "" {
		b.StartOTP = GenerateOTP()
	}
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	s.bookings[b.ID] = b

	s.logger.Info("Booking created in SEARCHING state", map[string]interface{}{
		"booking_id":   b.ID,
		"booking_code": b.BookingCode,
		"service":      b.ServiceType,
	})

	return b
}

// DispatchOffer transitions SEARCHING -> DISPATCHED
func (s *Service) DispatchOffer(bookingID, driverID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status != StatusSearching && b.Status != StatusDispatched {
		return fmt.Errorf("invalid transition to DISPATCHED from %s", b.Status)
	}

	b.Status = StatusDispatched
	b.DriverID = driverID
	b.UpdatedAt = time.Now()

	s.logger.Info("Booking offer DISPATCHED to driver", map[string]interface{}{
		"booking_id": bookingID,
		"driver_id":  driverID,
	})

	return nil
}

// AcceptBooking transitions DISPATCHED -> ACCEPTED
func (s *Service) AcceptBooking(bookingID, driverID string) (*Booking, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return nil, fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status != StatusDispatched {
		return nil, fmt.Errorf("cannot accept booking in %s status", b.Status)
	}

	if b.DriverID != "" && b.DriverID != driverID {
		return nil, fmt.Errorf("409 Conflict: Booking offer claimed by another driver")
	}

	now := time.Now()
	b.Status = StatusAccepted
	b.DriverID = driverID
	b.AcceptedAt = &now
	b.UpdatedAt = now

	s.logger.Info("Booking ACCEPTED by driver", map[string]interface{}{
		"booking_id": bookingID,
		"driver_id":  driverID,
	})

	return b, nil
}

// DriverArrived transitions ACCEPTED -> DRIVER_ARRIVED
func (s *Service) DriverArrived(bookingID, driverID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status != StatusAccepted {
		return fmt.Errorf("cannot arrive when booking status is %s", b.Status)
	}

	if b.DriverID != driverID {
		return fmt.Errorf("unauthorized driver")
	}

	now := time.Now()
	b.Status = StatusDriverArrived
	b.ArrivedAt = &now
	b.UpdatedAt = now

	s.logger.Info("Driver marked ARRIVED at pickup location", map[string]interface{}{
		"booking_id": bookingID,
		"driver_id":  driverID,
	})

	return nil
}

// StartTrip transitions DRIVER_ARRIVED -> IN_PROGRESS after 4-digit OTP validation
func (s *Service) StartTrip(bookingID, driverID, enteredOTP string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status != StatusDriverArrived {
		return fmt.Errorf("cannot start trip when booking status is %s", b.Status)
	}

	if b.DriverID != driverID {
		return fmt.Errorf("unauthorized driver")
	}

	if b.StartOTP != enteredOTP {
		return fmt.Errorf("invalid start OTP")
	}

	now := time.Now()
	b.Status = StatusInProgress
	b.StartedAt = &now
	b.UpdatedAt = now

	s.logger.Info("Trip IN_PROGRESS - Verified by customer OTP", map[string]interface{}{
		"booking_id": bookingID,
		"driver_id":  driverID,
	})

	return nil
}

// CompleteTrip transitions IN_PROGRESS -> COMPLETED
func (s *Service) CompleteTrip(bookingID, driverID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status != StatusInProgress {
		return fmt.Errorf("cannot complete trip when booking status is %s", b.Status)
	}

	if b.DriverID != driverID {
		return fmt.Errorf("unauthorized driver")
	}

	now := time.Now()
	b.Status = StatusCompleted
	b.CompletedAt = &now
	b.UpdatedAt = now

	s.logger.Info("Trip COMPLETED successfully", map[string]interface{}{
		"booking_id": bookingID,
		"driver_id":  driverID,
	})

	return nil
}

// CancelBooking handles edge-case cancellations and calculates Tier-1 compensation
func (s *Service) CancelBooking(bookingID, cancelledBy, reason string) (*Booking, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, exists := s.bookings[bookingID]
	if !exists {
		return nil, fmt.Errorf("booking %s not found", bookingID)
	}

	if b.Status == StatusCompleted || b.Status == StatusCancelled {
		return nil, fmt.Errorf("booking is already in terminal state %s", b.Status)
	}

	now := time.Now()
	prevStatus := b.Status
	b.Status = StatusCancelled
	b.CancelledAt = &now
	b.CancelledBy = cancelledBy
	b.CancellationReason = reason
	b.UpdatedAt = now

	// Cancellation Fee Policy:
	// If customer cancels > 3 minutes after driver acceptance OR after driver arrived:
	// Charge ₹100 penalty (₹75 credited to driver's wallet, ₹25 platform fee)
	if cancelledBy == "CUSTOMER" && b.AcceptedAt != nil {
		durationAfterAccept := now.Sub(*b.AcceptedAt)
		if durationAfterAccept > 3*time.Minute || prevStatus == StatusDriverArrived || prevStatus == StatusInProgress {
			b.CancellationFee = 100.00
			b.DriverCompensation = 75.00
			s.logger.Warn("Applied cancellation fee to customer & credited driver wallet", map[string]interface{}{
				"booking_id":          bookingID,
				"cancellation_fee":    b.CancellationFee,
				"driver_compensation": b.DriverCompensation,
			})
		}
	}

	return b, nil
}

// GetBooking retrieves a booking by ID
func (s *Service) GetBooking(id string) (*Booking, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	b, exists := s.bookings[id]
	if !exists {
		return nil, fmt.Errorf("booking %s not found", id)
	}
	return b, nil
}

// FindActiveOfferForDriver returns the current active booking for a given driver
func (s *Service) FindActiveOfferForDriver(driverID string) *Booking {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, b := range s.bookings {
		if b.DriverID == driverID && (b.Status == StatusDispatched || b.Status == StatusAccepted || b.Status == StatusDriverArrived || b.Status == StatusInProgress) {
			return b
		}
	}
	return nil
}

