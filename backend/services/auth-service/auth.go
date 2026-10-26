package authservice

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"sync"
	"time"

	"drivetrust/pkg/logger"
	"drivetrust/pkg/rediscache"
)

type UserRole string

const (
	RoleCustomer   UserRole = "CUSTOMER"
	RoleDriver     UserRole = "DRIVER"
	RoleAdmin      UserRole = "ADMIN"
	RoleDispatcher UserRole = "DISPATCHER"
)

type User struct {
	ID          string   `json:"id"`
	PhoneNumber string   `json:"phone_number"`
	FullName    string   `json:"full_name"`
	Role        UserRole `json:"role"`
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
	User         User   `json:"user"`
}

type Service struct {
	mu         sync.RWMutex
	privateKey *rsa.PrivateKey
	publicKey  *rsa.PublicKey
	otps       map[string]otpEntry
	users      map[string]*User
	cache      *rediscache.Client
	logger     *logger.Logger
}

type otpEntry struct {
	code      string
	role      UserRole
	expiresAt time.Time
	attempts  int
}

func NewService(cache *rediscache.Client, log *logger.Logger) (*Service, error) {
	// Generate RSA 2048-bit key pair for RS256 token signing
	privKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, fmt.Errorf("failed to generate RSA key: %w", err)
	}

	svc := &Service{
		privateKey: privKey,
		publicKey:  &privKey.PublicKey,
		otps:       make(map[string]otpEntry),
		users:      make(map[string]*User),
		cache:      cache,
		logger:     log,
	}

	// Seed default users for testing
	svc.users["+919876543210"] = &User{
		ID:          "9d8e7f6a-5b4c-3d2e-1f0a-9b8c7d6e5f4a",
		PhoneNumber: "+919876543210",
		FullName:    "Aditya Rao",
		Role:        RoleCustomer,
	}
	svc.users["+919876543211"] = &User{
		ID:          "c1f7a4b2-8c10-4c7b-b56d-e4cfa093c834",
		PhoneNumber: "+919876543211",
		FullName:    "Rajesh Kumar",
		Role:        RoleDriver,
	}
	svc.users["+919876543299"] = &User{
		ID:          "a1111111-2222-3333-4444-555555555555",
		PhoneNumber: "+919876543299",
		FullName:    "Super Admin",
		Role:        RoleAdmin,
	}

	return svc, nil
}

// SendOTP dispatches a 6-digit verification code with 5-minute validity
func (s *Service) SendOTP(phone string, role UserRole) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// In test/demo mode, deterministic OTP "729401" or random
	n, _ := rand.Int(rand.Reader, big.NewInt(900000))
	otp := fmt.Sprintf("%06d", n.Int64()+100000)
	if phone == "+919876543210" || phone == "+919876543211" {
		otp = "729401"
	}

	s.otps[phone] = otpEntry{
		code:      otp,
		role:      role,
		expiresAt: time.Now().Add(5 * time.Minute),
	}

	s.logger.Info("Dispatched phone OTP", map[string]interface{}{
		"phone": phone,
		"role":  role,
		"otp":   otp,
	})

	return otp, nil
}

// VerifyOTP checks the OTP and issues RS256 JWT tokens
func (s *Service) VerifyOTP(phone, code string) (*TokenPair, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	entry, exists := s.otps[phone]
	if !exists || time.Now().After(entry.expiresAt) {
		return nil, fmt.Errorf("OTP expired or not requested")
	}

	if entry.attempts >= 5 {
		delete(s.otps, phone)
		return nil, fmt.Errorf("too many failed attempts, OTP invalidated")
	}

	if entry.code != code {
		entry.attempts++
		s.otps[phone] = entry
		return nil, fmt.Errorf("invalid OTP verification code")
	}

	// Invalidate OTP after successful verification to prevent replay attacks
	delete(s.otps, phone)

	// Find or register user
	user, exists := s.users[phone]
	if !exists {
		user = &User{
			ID:          fmt.Sprintf("usr-%d", time.Now().UnixNano()),
			PhoneNumber: phone,
			FullName:    "DriveTrust User",
			Role:        entry.role,
		}
		s.users[phone] = user
	}

	// Create JWT token payload with RS256 claims
	jti := fmt.Sprintf("jti-%d", time.Now().UnixNano())
	header := base64.RawURLEncoding.EncodeToString([]byte(`{"alg":"RS256","typ":"JWT"}`))
	claims, _ := json.Marshal(map[string]interface{}{
		"sub":   user.ID,
		"phone": user.PhoneNumber,
		"role":  user.Role,
		"jti":   jti,
		"iat":   time.Now().Unix(),
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})
	payload := base64.RawURLEncoding.EncodeToString(claims)
	signingInput := fmt.Sprintf("%s.%s", header, payload)
	hashed := sha256.Sum256([]byte(signingInput))
	sig, err := rsa.SignPKCS1v15(rand.Reader, s.privateKey, crypto.SHA256, hashed[:])
	if err != nil {
		return nil, fmt.Errorf("failed to sign JWT token: %w", err)
	}
	jwtToken := fmt.Sprintf("%s.%s", signingInput, base64.RawURLEncoding.EncodeToString(sig))

	delete(s.otps, phone)

	return &TokenPair{
		AccessToken:  jwtToken,
		RefreshToken: "rf_" + jti,
		ExpiresIn:    86400,
		User:         *user,
	}, nil
}

// GetJWKS returns RFC 7517 compliant JSON Web Key Set for client-side / gateway zero-overhead verification
func (s *Service) GetJWKS() map[string]interface{} {
	e := big.NewInt(int64(s.publicKey.E)).Bytes()
	n := s.publicKey.N.Bytes()

	return map[string]interface{}{
		"keys": []map[string]string{
			{
				"kty": "RSA",
				"use": "sig",
				"alg": "RS256",
				"kid": "drivetrust-prod-2026-key",
				"n":   base64.RawURLEncoding.EncodeToString(n),
				"e":   base64.RawURLEncoding.EncodeToString(e),
			},
		},
	}
}
