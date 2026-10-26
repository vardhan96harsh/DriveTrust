package rediscache

import (
	"context"
	"fmt"
	"sync"
	"time"
)

// DriverPosition holds real-time location and spatial metadata
type DriverPosition struct {
	DriverID  string    `json:"driver_id"`
	Lat       float64   `json:"lat"`
	Lng       float64   `json:"lng"`
	H3Index   string    `json:"h3_index"`
	Heading   float64   `json:"heading"`
	SpeedKmh  float64   `json:"speed_kmh"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Client abstracts Redis interactions with thread-safe atomic locking
type Client struct {
	mu           sync.RWMutex
	driverPos    map[string]DriverPosition
	h3Registry   map[string]map[string]bool
	driverLocks  map[string]lockEntry
	tokenRevoked map[string]time.Time
}

type lockEntry struct {
	bookingID string
	expiresAt time.Time
}

// NewClient initializes a caching client
func NewClient(addr, password string) *Client {
	_ = addr
	_ = password
	return &Client{
		driverPos:    make(map[string]DriverPosition),
		h3Registry:   make(map[string]map[string]bool),
		driverLocks:  make(map[string]lockEntry),
		tokenRevoked: make(map[string]time.Time),
	}
}

// UpdateDriverPosition records the driver's real-time position and updates H3 cell index registry
func (c *Client) UpdateDriverPosition(ctx context.Context, pos DriverPosition) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	// If driver was previously registered in an H3 cell, remove from old cell
	if old, exists := c.driverPos[pos.DriverID]; exists && old.H3Index != pos.H3Index {
		if cellSet, ok := c.h3Registry[old.H3Index]; ok {
			delete(cellSet, pos.DriverID)
		}
	}

	// Register in new H3 cell set
	if _, ok := c.h3Registry[pos.H3Index]; !ok {
		c.h3Registry[pos.H3Index] = make(map[string]bool)
	}
	c.h3Registry[pos.H3Index][pos.DriverID] = true
	c.driverPos[pos.DriverID] = pos

	return nil
}

// GetDriversInH3Cell returns all driver IDs currently in a given H3 cell
func (c *Client) GetDriversInH3Cell(ctx context.Context, h3Cell string) ([]string, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	cellSet, exists := c.h3Registry[h3Cell]
	if !exists {
		return []string{}, nil
	}

	drivers := make([]string, 0, len(cellSet))
	now := time.Now()
	for dID := range cellSet {
		// Verify position is fresh (TTL: 15s)
		if pos, ok := c.driverPos[dID]; ok && now.Sub(pos.UpdatedAt) <= 15*time.Second {
			drivers = append(drivers, dID)
		}
	}
	return drivers, nil
}

// EvictStalePositions cleans up drivers who have been offline longer than maxAge
func (c *Client) EvictStalePositions(ctx context.Context, maxAge time.Duration) int {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now()
	evicted := 0
	for dID, pos := range c.driverPos {
		if now.Sub(pos.UpdatedAt) > maxAge {
			if cellSet, ok := c.h3Registry[pos.H3Index]; ok {
				delete(cellSet, dID)
				if len(cellSet) == 0 {
					delete(c.h3Registry, pos.H3Index)
				}
			}
			delete(c.driverPos, dID)
			evicted++
		}
	}
	return evicted
}

// RemoveDriver removes driver position and index upon going offline
func (c *Client) RemoveDriver(ctx context.Context, driverID string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if pos, exists := c.driverPos[driverID]; exists {
		if cellSet, ok := c.h3Registry[pos.H3Index]; ok {
			delete(cellSet, driverID)
			if len(cellSet) == 0 {
				delete(c.h3Registry, pos.H3Index)
			}
		}
		delete(c.driverPos, driverID)
	}
}

// TryAcquireDriverLock attempts atomic acquisition of a driver lock for a booking.
// Matches Redis Lua script: SET lock:driver:<id> <booking_id> EX <ttl> NX
func (c *Client) TryAcquireDriverLock(ctx context.Context, driverID, bookingID string, ttl time.Duration) (bool, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now()
	if entry, exists := c.driverLocks[driverID]; exists {
		if now.Before(entry.expiresAt) {
			// Lock is active and held
			return false, nil
		}
	}

	// Acquire lock
	c.driverLocks[driverID] = lockEntry{
		bookingID: bookingID,
		expiresAt: now.Add(ttl),
	}
	return true, nil
}

// ReleaseDriverLock releases a lock if it matches the booking
func (c *Client) ReleaseDriverLock(ctx context.Context, driverID, bookingID string) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if entry, exists := c.driverLocks[driverID]; exists {
		if entry.bookingID == bookingID {
			delete(c.driverLocks, driverID)
		}
	}
	return nil
}

// RevokeToken marks a JWT token JTI as revoked
func (c *Client) RevokeToken(ctx context.Context, jti string, remainingTTL time.Duration) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.tokenRevoked[jti] = time.Now().Add(remainingTTL)
	return nil
}

// IsTokenRevoked checks if a JWT token is revoked
func (c *Client) IsTokenRevoked(ctx context.Context, jti string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	exp, exists := c.tokenRevoked[jti]
	if !exists {
		return false
	}
	return time.Now().Before(exp)
}

// GetDriverPosition returns driver position if available
func (c *Client) GetDriverPosition(ctx context.Context, driverID string) (*DriverPosition, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	pos, exists := c.driverPos[driverID]
	if !exists {
		return nil, fmt.Errorf("driver %s position not found", driverID)
	}
	return &pos, nil
}
