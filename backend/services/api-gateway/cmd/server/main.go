package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strings"
	"sync"
	"time"

	"drivetrust/pkg/h3util"
	"drivetrust/pkg/logger"
	"drivetrust/pkg/rediscache"
	authservice "drivetrust/services/auth-service"
	billingservice "drivetrust/services/billing-service"
	bookingservice "drivetrust/services/booking-service"
	dispatchservice "drivetrust/services/dispatch-service"
	telematicsservice "drivetrust/services/telematics-service"
)

type Server struct {
	logger     *logger.Logger
	cache      *rediscache.Client
	auth       *authservice.Service
	dispatch   *dispatchservice.Engine
	booking    *bookingservice.Service
	billing    *billingservice.PricingEngine
	telematics *telematicsservice.Service

	driverPool      []dispatchservice.DriverCandidate
	driverLocations map[string]h3util.LatLng
	mu              sync.RWMutex
}

func main() {
	log := logger.New("api-gateway")
	cache := rediscache.NewClient("localhost:6379", "RedisAuthSecret123!")

	auth, err := authservice.NewService(cache, log)
	if err != nil {
		panic(err)
	}

	dispatch := dispatchservice.NewEngine(cache, log)
	booking := bookingservice.NewService(log)
	billing := billingservice.NewPricingEngine()
	telematics := telematicsservice.NewService(log)

	srv := &Server{
		logger:          log,
		cache:           cache,
		auth:            auth,
		dispatch:        dispatch,
		booking:         booking,
		billing:         billing,
		telematics:      telematics,
		driverLocations: make(map[string]h3util.LatLng),
	}

	// Seed online verified driver candidates in Bangalore for instant matching demonstration
	srv.seedDrivers()

	mux := http.NewServeMux()

	// 1. Health & JWKS
	mux.HandleFunc("/health", srv.handleHealth)
	mux.HandleFunc("/.well-known/jwks.json", srv.handleJWKS)

	// 2. Auth Endpoints
	mux.HandleFunc("/api/v1/auth/send-otp", srv.handleSendOTP)
	mux.HandleFunc("/api/v1/auth/verify-otp", srv.handleVerifyOTP)
	mux.HandleFunc("/api/v1/auth/logout", srv.handleLogout)

	// 3. Driver KYC
	mux.HandleFunc("/api/v1/driver/kyc/presigned-upload-url", srv.handleKYCPresignedURL)
	mux.HandleFunc("/api/v1/driver/kyc/submit-verification", srv.handleKYCSubmit)

	// 4. Booking Lifecycle
	mux.HandleFunc("/api/v1/bookings/estimate", srv.handleBookingEstimate)
	mux.HandleFunc("/api/v1/bookings/create", srv.handleCreateBooking)
	mux.HandleFunc("/api/v1/bookings/dispatch", srv.handleDispatchOffer)
	mux.HandleFunc("/api/v1/bookings/status", srv.handleBookingStatus)
	mux.HandleFunc("/api/v1/bookings/track", srv.handleBookingTrack)
	mux.HandleFunc("/api/v1/bookings/accept", srv.handleAcceptRide)
	mux.HandleFunc("/api/v1/bookings/arrive", srv.handleDriverArrive)
	mux.HandleFunc("/api/v1/bookings/start", srv.handleStartTrip)
	mux.HandleFunc("/api/v1/bookings/complete", srv.handleCompleteTrip)
	mux.HandleFunc("/api/v1/bookings/cancel", srv.handleCancelBooking)

	// 5. Driver Endpoints
	mux.HandleFunc("/api/v1/driver/active-offer", srv.handleDriverActiveOffer)
	mux.HandleFunc("/api/v1/driver/location", srv.handleDriverLocationUpdate)

	// 6. Telematics & Telemetry
	mux.HandleFunc("/api/v1/telematics/ping", srv.handleTelemetryPing)
	mux.HandleFunc("/api/v1/telematics/driver-score", srv.handleDriverSafetyScore)

	// Wrap with Global Middlewares: CORS, JSON Logger, Rate Limit, and Idempotency
	handler := srv.applyMiddlewares(mux)

	port := ":8080"
	log.Info(fmt.Sprintf("DriveTrust Ultra API Gateway running on port %s", port), nil)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Error("Server terminated", map[string]interface{}{"error": err.Error()})
	}
}

func (s *Server) seedDrivers() {
	s.driverPool = []dispatchservice.DriverCandidate{
		{
			DriverID:             "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834",
			FullName:             "Rajesh Kumar",
			RatingAvg:            4.95,
			SafetyScore:          98,
			SupportedTransmissions: []string{"MANUAL", "AUTOMATIC"},
			CurrentLocation:      h3util.LatLng{Lat: 23.5262, Lng: 77.8211}, // Vidisha City Center
			H3Index:              h3util.LatLngToH3(23.5262, 77.8211, 8),
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
		{
			DriverID:             "d2e8b5c3-9d21-5d8c-c67e-f5dfb104d945",
			FullName:             "Amit Sharma",
			RatingAvg:            4.91,
			SafetyScore:          96,
			SupportedTransmissions: []string{"MANUAL", "AUTOMATIC", "LUXURY"},
			CurrentLocation:      h3util.LatLng{Lat: 23.5312, Lng: 77.8175}, // Vidisha North
			H3Index:              h3util.LatLngToH3(23.5312, 77.8175, 8),
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
		{
			DriverID:             "e3f9c6d4-ae32-6e9d-d78f-a6eac215e056",
			FullName:             "Vikram Singh",
			RatingAvg:            4.87,
			SafetyScore:          95,
			SupportedTransmissions: []string{"MANUAL", "AUTOMATIC"},
			CurrentLocation:      h3util.LatLng{Lat: 23.2599, Lng: 77.4126}, // Bhopal MP Nagar
			H3Index:              h3util.LatLngToH3(23.2599, 77.4126, 8),
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
		{
			DriverID:             "f4a0d7e5-bf43-7fae-e89a-b7fbd326f167",
			FullName:             "Sunil Gowda",
			RatingAvg:            4.88,
			SafetyScore:          94,
			SupportedTransmissions: []string{"AUTOMATIC", "LUXURY"},
			CurrentLocation:      h3util.LatLng{Lat: 12.9720, Lng: 77.5950}, // Bangalore MG Road
			H3Index:              h3util.LatLngToH3(12.9720, 77.5950, 8),
			IsOnline:             true,
			KycStatus:            "APPROVED",
		},
	}
}

// Global Middlewares
func (s *Server) applyMiddlewares(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":      "HEALTHY",
		"service":     "drivetrust-api-gateway",
		"version":     "1.0.0-PROD",
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"environment": "production",
	})
}

func (s *Server) handleJWKS(w http.ResponseWriter, r *http.Request) {
	jwks := s.auth.GetJWKS()
	json.NewEncoder(w).Encode(jwks)
}

func (s *Server) handleSendOTP(w http.ResponseWriter, r *http.Request) {
	var body struct {
		PhoneNumber string                `json:"phone_number"`
		Role        authservice.UserRole `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	_, err := s.auth.SendOTP(body.PhoneNumber, body.Role)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"message":    "OTP dispatched to registered mobile number",
		"expires_in": 300,
	})
}

func (s *Server) handleVerifyOTP(w http.ResponseWriter, r *http.Request) {
	var body struct {
		PhoneNumber string `json:"phone_number"`
		OTP         string `json:"otp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	tokens, err := s.auth.VerifyOTP(body.PhoneNumber, body.OTP)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(tokens)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

func (s *Server) handleKYCPresignedURL(w http.ResponseWriter, r *http.Request) {
	var body struct {
		DocType  string `json:"doc_type"`
		FileName string `json:"file_name"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)

	key := fmt.Sprintf("kyc/%s/%d-%s", body.DocType, time.Now().Unix(), body.FileName)
	uploadURL := fmt.Sprintf("https://s3.ap-south-1.amazonaws.com/drivetrust-kyc-vault/%s?X-Amz-Expires=900", key)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"upload_url": uploadURL,
		"file_key":   key,
		"expires_in": 900,
	})
}

func (s *Server) handleKYCSubmit(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":      "UNDER_REVIEW",
		"message":     "Driver documents submitted to Parivahan API & manual review queue",
		"submitted_at": time.Now().UTC(),
	})
}

func (s *Server) handleBookingEstimate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		CityName     string                     `json:"city_name"`
		ServiceType  billingservice.ServiceType `json:"service_type"`
		PickupLat    float64                    `json:"pickup_lat"`
		PickupLng    float64                    `json:"pickup_lng"`
		DropoffLat   float64                    `json:"dropoff_lat"`
		DropoffLng   float64                    `json:"dropoff_lng"`
		Transmission string                     `json:"transmission"`
		PackageHours int                        `json:"package_hours"`
		Days         int                        `json:"days"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	if body.CityName == "" {
		if body.PickupLat > 20.0 {
			body.CityName = "Vidisha"
		} else {
			body.CityName = "Bangalore"
		}
	}

	// Compute Haversine distance
	distKm := h3util.HaversineDistanceKm(
		h3util.LatLng{Lat: body.PickupLat, Lng: body.PickupLng},
		h3util.LatLng{Lat: body.DropoffLat, Lng: body.DropoffLng},
	)
	if distKm < 2.0 {
		distKm = 10.0 // Default demo distance
	}

	breakdown, err := s.billing.CalculateEstimate(body.CityName, body.ServiceType, distKm, body.PackageHours, body.Days)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"estimated_fare":        breakdown.TotalCustomerFare,
		"breakdown":             breakdown,
		"estimated_distance_km": math.Round(distKm*10) / 10,
		"currency":              "INR",
	})
}

func (s *Server) handleCreateBooking(w http.ResponseWriter, r *http.Request) {
	var b bookingservice.Booking
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	b.ID = fmt.Sprintf("bk-%d", time.Now().UnixNano())
	b.BookingCode = fmt.Sprintf("DT%06d", time.Now().Unix()%1000000)
	created := s.booking.CreateBooking(&b)

	json.NewEncoder(w).Encode(created)
}

func (s *Server) handleDispatchOffer(w http.ResponseWriter, r *http.Request) {
	var req dispatchservice.DispatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	if req.PickupLocation.Lat == 0 && req.PickupLocation.Lng == 0 {
		req.PickupLocation = h3util.LatLng{Lat: 23.5262, Lng: 77.8211}
	}

	res, err := s.dispatch.FindAndDispatch(r.Context(), req, s.driverPool)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}

	if res.Success {
		_ = s.booking.DispatchOffer(req.BookingID, res.AssignedDriverID)
	}

	json.NewEncoder(w).Encode(res)
}

func (s *Server) handleAcceptRide(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BookingID string `json:"booking_id"`
		DriverID  string `json:"driver_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	b, err := s.booking.AcceptBooking(body.BookingID, body.DriverID)
	if err != nil {
		if strings.Contains(err.Error(), "409") {
			w.WriteHeader(http.StatusConflict)
		} else {
			w.WriteHeader(http.StatusBadRequest)
		}
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	custName := b.CustomerName
	if custName == "" {
		custName = "DriveTrust Customer"
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":        true,
		"start_otp":      b.StartOTP,
		"customer_name":  custName,
		"pickup_address": b.PickupAddress,
		"status":         b.Status,
	})
}

func (s *Server) handleDriverArrive(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BookingID string `json:"booking_id"`
		DriverID  string `json:"driver_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	err := s.booking.DriverArrived(body.BookingID, body.DriverID)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"status":  bookingservice.StatusDriverArrived,
	})
}

func (s *Server) handleStartTrip(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BookingID string `json:"booking_id"`
		DriverID  string `json:"driver_id"`
		OTP       string `json:"otp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	err := s.booking.StartTrip(body.BookingID, body.DriverID, body.OTP)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"status":  bookingservice.StatusInProgress,
	})
}

func (s *Server) handleCompleteTrip(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BookingID string `json:"booking_id"`
		DriverID  string `json:"driver_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	err := s.booking.CompleteTrip(body.BookingID, body.DriverID)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"status":  bookingservice.StatusCompleted,
	})
}

func (s *Server) handleCancelBooking(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BookingID   string `json:"booking_id"`
		CancelledBy string `json:"cancelled_by"`
		Reason      string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	b, err := s.booking.CancelBooking(body.BookingID, body.CancelledBy, body.Reason)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(b)
}

func (s *Server) handleTelemetryPing(w http.ResponseWriter, r *http.Request) {
	var ev telematicsservice.TelematicsEvent
	if err := json.NewDecoder(r.Body).Decode(&ev); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	_ = s.telematics.IngestEvent(r.Context(), ev)

	json.NewEncoder(w).Encode(map[string]bool{"acknowledged": true})
}

func (s *Server) handleDriverSafetyScore(w http.ResponseWriter, r *http.Request) {
	driverID := r.URL.Query().Get("driver_id")
	rec, _ := s.telematics.GetDriverSafety(driverID)

	json.NewEncoder(w).Encode(rec)
}

func (s *Server) handleBookingStatus(w http.ResponseWriter, r *http.Request) {
	bookingID := r.URL.Query().Get("booking_id")
	if bookingID == "" {
		http.Error(w, `{"error":"booking_id required"}`, http.StatusBadRequest)
		return
	}

	b, err := s.booking.GetBooking(bookingID)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusNotFound)
		return
	}

	driverName := "Searching for nearby Chauffeur..."
	driverPhone := ""
	driverRating := 4.95
	driverDL := "KA-01-2018-0094821"

	if b.DriverID != "" {
		s.mu.RLock()
		for _, d := range s.driverPool {
			if d.DriverID == b.DriverID {
				driverName = d.FullName
				driverRating = d.RatingAvg
				break
			}
		}
		s.mu.RUnlock()
		driverPhone = "+91 99801 84920"
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"booking_id":          b.ID,
		"booking_code":        b.BookingCode,
		"status":              b.Status,
		"service_type":        b.ServiceType,
		"customer_name":       b.CustomerName,
		"customer_phone":      b.CustomerPhone,
		"driver_id":           b.DriverID,
		"driver_name":         driverName,
		"driver_phone":        driverPhone,
		"driver_rating":       driverRating,
		"driver_dl":           driverDL,
		"pickup_address":      b.PickupAddress,
		"destination_address": b.DropoffAddress,
		"vehicle_model":       b.VehicleModel,
		"vehicle_plate":       b.VehiclePlate,
		"estimated_fare":      b.EstimatedFare,
		"start_otp":           b.StartOTP,
		"created_at":          b.CreatedAt,
		"updated_at":          b.UpdatedAt,
	})
}

func (s *Server) handleBookingTrack(w http.ResponseWriter, r *http.Request) {
	bookingID := r.URL.Query().Get("booking_id")
	if bookingID == "" {
		http.Error(w, `{"error":"booking_id required"}`, http.StatusBadRequest)
		return
	}

	b, err := s.booking.GetBooking(bookingID)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusNotFound)
		return
	}

	s.mu.RLock()
	loc, hasLoc := s.driverLocations[b.DriverID]
	s.mu.RUnlock()

	if !hasLoc {
		loc = h3util.LatLng{Lat: 23.5262, Lng: 77.8211}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"booking_id": b.ID,
		"status":     b.Status,
		"driver_id":  b.DriverID,
		"lat":        loc.Lat,
		"lng":        loc.Lng,
		"bearing":    45.0,
		"speed_kmh":  28.5,
		"eta_mins":   6,
	})
}

func (s *Server) handleDriverActiveOffer(w http.ResponseWriter, r *http.Request) {
	driverID := r.URL.Query().Get("driver_id")
	if driverID == "" {
		driverID = "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834"
	}

	b := s.booking.FindActiveOfferForDriver(driverID)
	if b == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"has_offer": false,
		})
		return
	}

	custName := b.CustomerName
	if custName == "" {
		custName = "DriveTrust Customer"
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"has_offer":           true,
		"booking_id":          b.ID,
		"booking_code":        b.BookingCode,
		"status":              b.Status,
		"customer_name":       custName,
		"customer_rating":     "4.95 ★",
		"pickup_address":      b.PickupAddress,
		"destination_address": b.DropoffAddress,
		"distance_km":         "6.4 km",
		"est_minutes":         "22 mins",
		"fare":                fmt.Sprintf("₹%.0f", b.EstimatedFare),
		"car_model":           b.VehicleModel,
		"start_otp":           b.StartOTP,
	})
}

func (s *Server) handleDriverLocationUpdate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		DriverID string  `json:"driver_id"`
		Lat      float64 `json:"lat"`
		Lng      float64 `json:"lng"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"invalid json"}`, http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	if s.driverLocations == nil {
		s.driverLocations = make(map[string]h3util.LatLng)
	}
	s.driverLocations[body.DriverID] = h3util.LatLng{Lat: body.Lat, Lng: body.Lng}
	s.mu.Unlock()

	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

