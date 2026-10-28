// scripts/test-live-gateway.mjs
const BASE_URL = "http://localhost:8080";

async function run() {
  console.log("==================================================================");
  console.log("🌐 LIVE GATEWAY REST API CONTRACT VALIDATION (PORT 8080)");
  console.log("==================================================================\n");

  let passes = 0;
  let fails = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passes++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      fails++;
    }
  }

  // 1. Health
  await check("GET /health", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== "HEALTHY") throw new Error(`Status: ${data.status}`);
  });

  // 2. JWKS
  await check("GET /.well-known/jwks.json", async () => {
    const res = await fetch(`${BASE_URL}/.well-known/jwks.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.keys || !data.keys.length) throw new Error("No JWKS keys");
    if (data.keys[0].kty !== "RSA") throw new Error("Key type not RSA");
  });

  // 3. Send OTP
  let testOtp = "729401";
  await check("POST /api/v1/auth/send-otp", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: "+919876543210", role: "CUSTOMER" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("send-otp returned success=false");
  });

  // 4. Verify OTP & Token
  let accessToken = "";
  await check("POST /api/v1/auth/verify-otp", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: "+919876543210", otp: testOtp }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.access_token) throw new Error("Missing access_token");
    accessToken = data.access_token;
  });

  // 5. Booking Estimate
  await check("POST /api/v1/bookings/estimate", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_type: "NIGHT_DROP",
        pickup_lat: 23.5262,
        pickup_lng: 77.8211,
        dropoff_lat: 23.5350,
        dropoff_lng: 77.8290,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.breakdown || !data.estimated_fare) {
      throw new Error("Invalid fare breakdown");
    }
  });

  // 6. Create Booking
  let createdBookingId = "";
  let bookingCode = "";
  let startOtp = "";
  await check("POST /api/v1/bookings/create", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_type: "HOURLY",
        pickup_address: "Vidisha Civil Lines, MP-40",
        pickup_lat: 23.5262,
        pickup_lng: 77.8211,
        transmission_required: "AUTOMATIC",
        vehicle_model: "Toyota Fortuner 4x4",
        vehicle_plate: "MP-40-CA-4921",
        customer_name: "Harshvardhan",
        customer_phone: "+91 98450 12345",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.id) throw new Error("Missing booking id");
    createdBookingId = data.id;
    bookingCode = data.booking_code;
    startOtp = data.start_otp;
  });

  // 7. Dispatch Offer
  let assignedDriverId = "";
  await check("POST /api/v1/bookings/dispatch", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: createdBookingId,
        pickup_location: { lat: 23.5262, lng: 77.8211 },
        transmission_required: "AUTOMATIC",
        service_type: "HOURLY",
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.assigned_driver_id) throw new Error("No driver matched in H3 radius");
    assignedDriverId = data.assigned_driver_id;
  });

  // 8. Driver Accepts
  await check("POST /api/v1/bookings/accept", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: createdBookingId,
        driver_id: assignedDriverId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 9. Driver Arrives
  await check("POST /api/v1/bookings/arrive", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/arrive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: createdBookingId,
        driver_id: assignedDriverId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 10. Start Trip with Correct OTP
  await check("POST /api/v1/bookings/start (Verified PIN)", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: createdBookingId,
        driver_id: assignedDriverId,
        otp: startOtp,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 11. Complete Trip
  await check("POST /api/v1/bookings/complete", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: createdBookingId,
        driver_id: assignedDriverId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 12. Telematics Ping
  await check("POST /api/v1/telematics/ping", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/telematics/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: assignedDriverId,
        booking_id: createdBookingId,
        lat: 23.5265,
        lng: 77.8215,
        speed_kmh: 38.5,
        accel_y: -0.15,
        heading: 180.0,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 13. Telematics Safety Score
  await check("GET /api/v1/telematics/driver-score", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/telematics/driver-score?driver_id=${encodeURIComponent(assignedDriverId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.safety_score !== "number") throw new Error("Missing safety_score");
  });

  console.log("\n==================================================================");
  console.log(`🏁 LIVE REST API TEST SUMMARY: ${passes} PASSED, ${fails} FAILED`);
  console.log("==================================================================");
  if (fails > 0) process.exit(1);
}

run();
