-- KEYS[1]: lock:driver:<driver_id>
-- ARGV[1]: booking_id
-- ARGV[2]: ttl_seconds (e.g., 30)
--
-- Atomically acquires a lock on a driver candidate for 30s.
-- Returns 1 if acquired, 0 if driver is already locked by another dispatch/ride.

if redis.call("EXISTS", KEYS[1]) == 0 then
    redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
    return 1
else
    return 0
end
