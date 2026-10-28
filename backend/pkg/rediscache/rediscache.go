package rediscache

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
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

// Client abstracts Redis interactions with real redis connection & fallback
type Client struct {
	rdb    *redis.Client
	isLive bool

	// In-memory fallback structures
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

// Lua script for atomic driver locking
const acquireLockLua = `
if redis.call("EXISTS", KEYS[1]) == 1 then
    return 0
else
    redis.call("SET", KEYS[1], ARGV[1], "PX", ARGV[2])
    return 1
end
`

// Lua script for atomic driver unlock
const releaseLockLua = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
`

// NewClient initializes a caching client connecting to real Redis or falling back
func NewClient(addr, password string) *Client {
	c := &Client{
		driverPos:    make(map[string]DriverPosition),
		h3Registry:   make(map[string]map[string]bool),
		driverLocks:  make(map[string]lockEntry),
		tokenRevoked: make(map[string]time.Time),
	}

	if addr != "" {
		rdb := redis.NewClient(&redis.Options{
			Addr:        addr,
			Password:    password,
			DB:          0,
			DialTimeout: 200 * time.Millisecond,
			ReadTimeout: 200 * time.Millisecond,
			MaxRetries:  0,
		})

		ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
		defer cancel()

		if err := rdb.Ping(ctx).Err(); err == nil {
			c.rdb = rdb
			c.isLive = true
		} else {
			_ = rdb.Close()
		}
	}

	return c
}

// IsLive returns whether real Redis is connected
func (c *Client) IsLive() bool {
	return c.isLive
}

// UpdateDriverPosition records the driver's real-time position and updates H3 cell index registry
func (c *Client) UpdateDriverPosition(ctx context.Context, pos DriverPosition) error {
	if c.isLive && c.rdb != nil {
		posJSON, _ := json.Marshal(pos)
		pipe := c.rdb.Pipeline()
		pipe.Set(ctx, fmt.Sprintf("pos:driver:%s", pos.DriverID), posJSON, 30*time.Second)
		pipe.SAdd(ctx, fmt.Sprintf("h3:cell:%s", pos.H3Index), pos.DriverID)
		pipe.Expire(ctx, fmt.Sprintf("h3:cell:%s", pos.H3Index), 30*time.Second)
		_, err := pipe.Exec(ctx)
		if err == nil {
			return nil
		}
	}

	// In-memory fallback
	c.mu.Lock()
	defer c.mu.Unlock()

	if old, exists := c.driverPos[pos.DriverID]; exists && old.H3Index != pos.H3Index {
		if cellSet, ok := c.h3Registry[old.H3Index]; ok {
			delete(cellSet, pos.DriverID)
		}
	}

	if _, ok := c.h3Registry[pos.H3Index]; !ok {
		c.h3Registry[pos.H3Index] = make(map[string]bool)
	}
	c.h3Registry[pos.H3Index][pos.DriverID] = true
	c.driverPos[pos.DriverID] = pos

	return nil
}

// GetDriversInH3Cell returns all driver IDs currently in a given H3 cell
func (c *Client) GetDriversInH3Cell(ctx context.Context, h3Cell string) ([]string, error) {
	if c.isLive && c.rdb != nil {
		drivers, err := c.rdb.SMembers(ctx, fmt.Sprintf("h3:cell:%s", h3Cell)).Result()
		if err == nil {
			return drivers, nil
		}
	}

	c.mu.RLock()
	defer c.mu.RUnlock()

	cellSet, exists := c.h3Registry[h3Cell]
	if !exists {
		return []string{}, nil
	}

	drivers := make([]string, 0, len(cellSet))
	now := time.Now()
	for dID := range cellSet {
		if pos, ok := c.driverPos[dID]; ok && now.Sub(pos.UpdatedAt) <= 15*time.Second {
			drivers = append(drivers, dID)
		}
	}
	return drivers, nil
}

// TryAcquireDriverLock attempts atomic acquisition of a driver lock for a booking.
func (c *Client) TryAcquireDriverLock(ctx context.Context, driverID, bookingID string, ttl time.Duration) (bool, error) {
	if c.isLive && c.rdb != nil {
		key := fmt.Sprintf("lock:driver:%s", driverID)
		res, err := c.rdb.Eval(ctx, acquireLockLua, []string{key}, bookingID, ttl.Milliseconds()).Int()
		if err == nil {
			return res == 1, nil
		}
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now()
	if entry, exists := c.driverLocks[driverID]; exists {
		if now.Before(entry.expiresAt) {
			return false, nil
		}
	}

	c.driverLocks[driverID] = lockEntry{
		bookingID: bookingID,
		expiresAt: now.Add(ttl),
	}
	return true, nil
}

// ReleaseDriverLock releases a lock if it matches the booking
func (c *Client) ReleaseDriverLock(ctx context.Context, driverID, bookingID string) error {
	if c.isLive && c.rdb != nil {
		key := fmt.Sprintf("lock:driver:%s", driverID)
		_, err := c.rdb.Eval(ctx, releaseLockLua, []string{key}, bookingID).Result()
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	if entry, exists := c.driverLocks[driverID]; exists {
		if entry.bookingID == bookingID {
			delete(c.driverLocks, driverID)
		}
	}
	return nil
}
