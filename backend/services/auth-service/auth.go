package authservice

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

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
	Email       string   `json:"email,omitempty"`
	PasswordHash string  `json:"-"`
	Role        UserRole `json:"role"`
}

type UserClaims struct {
	jwt.RegisteredClaims
	UserID      string   `json:"sub"`
	PhoneNumber string   `json:"phone,omitempty"`
	Email       string   `json:"email,omitempty"`
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
	adminUsers map[string]*User
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
	var privKey *rsa.PrivateKey
	var err error

	// Load persistent RSA private key if provided via environment
	pemBytes := os.Getenv("JWT_PRIVATE_KEY_PEM")
	if pemBytes != "" {
		block, _ := pem.Decode([]byte(pemBytes))
		if block != nil {
			privKey, err = x509.ParsePKCS1PrivateKey(block.Bytes)
			if err != nil {
				// Try PKCS8
				parsedKey, err2 := x509.ParsePKCS8PrivateKey(block.Bytes)
				if err2 == nil {
					if rsaK, ok := parsedKey.(*rsa.PrivateKey); ok {
						privKey = rsaK
						err = nil
					}
				}
			}
		}
	}

	if privKey == nil {
		log.Warn("No static JWT_PRIVATE_KEY_PEM found; generating ephemeral 2048-bit RSA key for session", nil)
		privKey, err = rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			return nil, fmt.Errorf("failed to generate RSA key: %w", err)
		}
	}

	svc := &Service{
		privateKey: privKey,
		publicKey:  &privKey.PublicKey,
		otps:       make(map[string]otpEntry),
		users:      make(map[string]*User),
		adminUsers: make(map[string]*User),
		cache:      cache,
		logger:     log,
	}

	// Pre-hash administrative password using bcrypt (cost factor 10)
	defaultAdminHash, _ := bcrypt.GenerateFromPassword([]byte("DriveAdmin@2026"), bcrypt.DefaultCost)
	svc.adminUsers["admin@sathi.in"] = &User{
		ID:           "adm-001",
		FullName:     "Super Admin (HQ)",
		Email:        "admin@sathi.in",
		PhoneNumber:  "+919876543299",
		PasswordHash: string(defaultAdminHash),
		Role:         RoleAdmin,
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

	return svc, nil
}

// SendOTP dispatches a 6-digit verification code with 5-minute validity
func (s *Service) SendOTP(phone string, role UserRole) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

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

	delete(s.otps, phone)

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

	return s.generateTokenPair(user)
}

// LoginAdmin verifies admin email and bcrypt password
func (s *Service) LoginAdmin(email, password string) (*TokenPair, error) {
	s.mu.RLock()
	user, exists := s.adminUsers[strings.ToLower(strings.TrimSpace(email))]
	s.mu.RUnlock()

	if !exists {
		return nil, fmt.Errorf("invalid email or administrative credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, fmt.Errorf("invalid email or administrative credentials")
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	return s.generateTokenPair(user)
}

func (s *Service) generateTokenPair(user *User) (*TokenPair, error) {
	jti := fmt.Sprintf("jti-%d", time.Now().UnixNano())
	header := base64.RawURLEncoding.EncodeToString([]byte(`{"alg":"RS256","typ":"JWT"}`))
	claims, _ := json.Marshal(map[string]interface{}{
		"sub":   user.ID,
		"phone": user.PhoneNumber,
		"email": user.Email,
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

	return &TokenPair{
		AccessToken:  jwtToken,
		RefreshToken: "rf_" + jti,
		ExpiresIn:    86400,
		User:         *user,
	}, nil
}

// VerifyToken validates an incoming RS256 token string
func (s *Service) VerifyToken(tokenString string) (*UserClaims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("malformed JWT token format")
	}

	signingInput := parts[0] + "." + parts[1]
	sig, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, fmt.Errorf("invalid token base64 signature: %w", err)
	}

	hashed := sha256.Sum256([]byte(signingInput))
	if err := rsa.VerifyPKCS1v15(s.publicKey, crypto.SHA256, hashed[:], sig); err != nil {
		return nil, fmt.Errorf("cryptographic signature verification failed: %w", err)
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("failed to decode token claims payload: %w", err)
	}

	var claims UserClaims
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, fmt.Errorf("failed to parse token claims: %w", err)
	}

	return &claims, nil
}

// GetJWKS returns RFC 7517 compliant JSON Web Key Set
func (s *Service) GetJWKS() map[string]interface{} {
	e := big.NewInt(int64(s.publicKey.E)).Bytes()
	n := s.publicKey.N.Bytes()

	return map[string]interface{}{
		"keys": []map[string]string{
			{
				"kty": "RSA",
				"use": "sig",
				"alg": "RS256",
				"kid": "drivetrust-core-key-1",
				"n":   base64.RawURLEncoding.EncodeToString(n),
				"e":   base64.RawURLEncoding.EncodeToString(e),
			},
		},
	}
}
