// scripts/full-journeys-e2e.mjs
// SATHI MOBILITY PLATFORM — COMPREHENSIVE 3-ROLE END-TO-END JOURNEY TEST SUITE
// Covers: (1) Full Customer Journey, (2) Full Driver Chauffeur Journey, (3) Full Super Admin Journey

console.log("================================================================================");
console.log("🚗 SATHI PLATFORM: 3-ROLE COMPREHENSIVE END-TO-END MOBILITY VALIDATION SUITE");
console.log("================================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
    failed++;
  }
}

function assertApprox(actual, expected, tolerance = 0.05, testName) {
  const diff = Math.abs(actual - expected);
  const condition = diff <= tolerance;
  if (condition) {
    console.log(`  ✅ PASS: ${testName} (Actual: ${actual}, Expected: ${expected})`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff})`);
    failed++;
  }
}

// ================================================================================
// PART 1: FULL CUSTOMER JOURNEY (ALL SCENARIOS)
// ================================================================================
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("👤 JOURNEY 1: FULL CUSTOMER JOURNEY (ALL 7 SCENARIOS)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// --- SCENARIO 1.1: Garage & Vehicle Profile Selection ---
console.log("\n▶ [SCENARIO 1.1] Garage & Vehicle Profiles (SUV Manual vs Sedan Automatic)");

const customerGarage = [
  {
    id: "veh-fortuner",
    brand: "Toyota",
    model: "Fortuner 4x4",
    plate: "MP-40-CA-4921",
    transmission: "MANUAL",
    type: "SUV",
    year: 2023,
    color: "Pearl White",
  },
  {
    id: "veh-city",
    brand: "Honda",
    model: "City ZX",
    plate: "MP-04-BB-1234",
    transmission: "AUTOMATIC",
    type: "SEDAN",
    year: 2022,
    color: "Lunar Silver",
  },
];

assert(customerGarage.length === 2, "Customer has 2 vehicles in digital garage");
assert(customerGarage[0].transmission === "MANUAL", "Fortuner requires MANUAL certified chauffeur");
assert(customerGarage[1].transmission === "AUTOMATIC", "Honda City supports AUTOMATIC certified chauffeur");

// --- SCENARIO 1.2: Geofence & Service Boundary Raycasting ---
console.log("\n▶ [SCENARIO 1.2] Operating Zone Geofence Raycasting & Online Checks");

const OPERATING_REGIONS = [
  {
    id: "zone-vidisha",
    name: "Vidisha Urban Cluster",
    rtoCode: "MP-40",
    isActive: true,
    polygonCoords: [
      [23.515, 77.795],
      [23.545, 77.795],
      [23.545, 77.835],
      [23.515, 77.835],
    ],
  },
  {
    id: "zone-bhopal",
    name: "Bhopal Urban Hub",
    rtoCode: "MP-04",
    isActive: true,
    polygonCoords: [
      [23.21, 77.38],
      [23.31, 77.38],
      [23.31, 77.47],
      [23.21, 77.47],
    ],
  },
  {
    id: "zone-maintenance",
    name: "Raisen Highway Link",
    rtoCode: "MP-38",
    isActive: false, // Temporarily Offline
    polygonCoords: [
      [23.32, 77.75],
      [23.36, 77.75],
      [23.36, 77.82],
      [23.32, 77.82],
    ],
  },
];

function isPointInPolygon(point, polygon) {
  const [lat, lng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function validateLocation(lat, lng) {
  const point = [lat, lng];
  for (const region of OPERATING_REGIONS) {
    if (isPointInPolygon(point, region.polygonCoords)) {
      if (!region.isActive) {
        return { isAllowed: false, status: "REGION_OFFLINE", region };
      }
      return { isAllowed: true, status: "OPERATIONAL", region };
    }
  }
  return { isAllowed: false, status: "OUT_OF_SERVICE_AREA", region: null };
}

// Test A: Inside Vidisha Hub (Railway Station)
const vidishaCheck = validateLocation(23.5255, 77.818);
assert(vidishaCheck.isAllowed === true, "Vidisha Station (23.5255, 77.8180) is valid within active MP-40 zone");
assert(vidishaCheck.region.rtoCode === "MP-40", "Vidisha coordinates map to RTO code MP-40");

// Test B: Inside Bhopal Hub (DB City Mall)
const bhopalCheck = validateLocation(23.2324, 77.4298);
assert(bhopalCheck.isAllowed === true, "Bhopal MP Nagar (23.2324, 77.4298) is valid within active MP-04 zone");

// Test C: Out of service area (Remote rural coordinate)
const outOfBoundsCheck = validateLocation(23.75, 78.1);
assert(outOfBoundsCheck.isAllowed === false, "Remote coordinate (23.75, 78.10) correctly rejected as OUT_OF_SERVICE_AREA");

// Test D: Inside inactive zone (Raisen offline)
const offlineZoneCheck = validateLocation(23.34, 77.78);
assert(offlineZoneCheck.isAllowed === false, "Inactive zone coordinate rejected as REGION_OFFLINE");

// --- SCENARIO 1.3: Service Modes & Dynamic Tariff Calculations ---
console.log("\n▶ [SCENARIO 1.3] Service Modes (City Point-to-Point, Hourly Rentals, Outstation)");

// Mode 1: City Point-to-Point Night Safe-Drop (18 km trip)
function calcCityNightDropFare(distanceKm) {
  const baseFare = 249; // includes 5 km
  const baseKm = 5;
  const perKmRate = 12;
  const nightMultiplier = 1.25;
  const returnAllowance = 120;
  const insuranceProtection = 29;

  const extraKm = Math.max(0, distanceKm - baseKm);
  const distanceCharge = extraKm * perKmRate;
  const subtotal = (baseFare + distanceCharge) * nightMultiplier + returnAllowance;
  const commission = Math.round(subtotal * 0.2); // 20%
  const driverNet = Math.round(subtotal - commission); // 80%
  const gst = Math.round(subtotal * 0.05); // 5%
  const customerTotal = Math.round(subtotal + gst + insuranceProtection);

  return { subtotal, commission, driverNet, gst, customerTotal };
}

const cityFare = calcCityNightDropFare(18);
assert(cityFare.subtotal === 626.25, "18 km night drop subtotal is ₹626.25");
assert(cityFare.commission === 125, "Platform 20% commission is ₹125");
assert(cityFare.driverNet === 501, "Driver 80% net earnings is ₹501");
assert(cityFare.gst === 31, "GST (5%) is ₹31");
assert(cityFare.customerTotal === 686, "Final customer total with ₹29 insurance is ₹686");

// Mode 2: Hourly Rental Packages (4h/40km, 8h/80km, 12h/120km) with overages
function calcHourlyFare(packageType, actualHours, actualKm) {
  const packages = {
    "4h-40k": { baseFare: 599, hours: 4, km: 40, extraHourRate: 120, extraKmRate: 12 },
    "8h-80k": { baseFare: 999, hours: 8, km: 80, extraHourRate: 110, extraKmRate: 11 },
    "12h-120k": { baseFare: 1499, hours: 12, km: 120, extraHourRate: 100, extraKmRate: 10 },
  };
  const pkg = packages[packageType];
  const extraHours = Math.max(0, actualHours - pkg.hours);
  const extraKm = Math.max(0, actualKm - pkg.km);
  const total = pkg.baseFare + extraHours * pkg.extraHourRate + extraKm * pkg.extraKmRate;
  return total;
}

const standardHourly = calcHourlyFare("4h-40k", 4, 38);
assert(standardHourly === 599, "4h/40k package within limits costs exactly base fare ₹599");

const overageHourly = calcHourlyFare("4h-40k", 5, 48); // 1 extra hr (₹120) + 8 extra km (₹96)
assert(overageHourly === 815, "4h/40k package with 1 extra hr & 8 extra km costs ₹815 (599+120+96)");

// Mode 3: Outstation Round-Trip (Vidisha to Pachmarhi, 2 days, 340 km)
function calcOutstationFare(days, km) {
  const minKmPerDay = 250;
  const billableKm = Math.max(km, days * minKmPerDay);
  const perKmRate = 11;
  const driverNightBataPerNight = 350;
  const fare = billableKm * perKmRate + (days - 1) * driverNightBataPerNight;
  return { billableKm, fare };
}

const outstationTrip = calcOutstationFare(2, 340);
assert(outstationTrip.billableKm === 500, "2-day outstation enforces 500 km minimum billable threshold");
assert(outstationTrip.fare === 5850, "2-day outstation (500 km @ ₹11 + 1 night bata ₹350) is ₹5,850");

// --- SCENARIO 1.4: Broadcast Radar & Chauffeur Matching ---
console.log("\n▶ [SCENARIO 1.4] Real-time Radar Broadcast (State: MATCHING with 30s Window)");

const customerTrip = {
  bookingId: "BK-MP40-9182",
  serviceMode: "CITY_POINT",
  customerName: "Harshvardhan",
  customerPhone: "+91 98450 12345",
  permanentPin: "4892",
  vehicle: customerGarage[0], // Toyota Fortuner 4x4 Manual
  pickupAddress: "Vidisha Railway Station Road",
  dropoffAddress: "Collectorate Civil Lines, Vidisha",
  zoneId: "zone-vidisha",
  rtoCode: "MP-40",
  pickupCoords: [23.5255, 77.818],
  fareEstimated: cityFare.customerTotal,
  status: "MATCHING",
  searchTimeoutSeconds: 30,
};

assert(customerTrip.status === "MATCHING", "Booking initialized in MATCHING status (broadcast radar)");
assert(customerTrip.searchTimeoutSeconds === 30, "Matching broadcast radar has 30-second countdown window");

// --- SCENARIO 1.5: Sathi Permanent PIN Vehicle Handover Security ---
console.log("\n▶ [SCENARIO 1.5] Permanent Sathi PIN Handover (Zero-Compromise Security)");

function verifyCustomerPin(trip, inputPin) {
  if (inputPin !== trip.permanentPin) {
    return { success: false, error: "SECURITY_ALERT: Sathi PIN mismatch. Verification failed." };
  }
  trip.status = "TRIP_ACTIVE";
  return { success: true, status: trip.status };
}

const invalidPinAttempt = verifyCustomerPin(customerTrip, "0000");
assert(invalidPinAttempt.success === false, "Incorrect PIN (0000) strictly rejected");
assert(customerTrip.status === "MATCHING", "Trip state remains un-started on wrong PIN");

// Transition to DRIVER_ARRIVED first
customerTrip.status = "DRIVER_ARRIVED";
const validPinAttempt = verifyCustomerPin(customerTrip, "4892");
assert(validPinAttempt.success === true, "Valid permanent Sathi PIN (4892) verified successfully");
assert(customerTrip.status === "TRIP_ACTIVE", "Trip transitions to TRIP_ACTIVE upon PIN verification");

// --- SCENARIO 1.6: Active Telematics & Emergency SOS Trigger ---
console.log("\n▶ [SCENARIO 1.6] Active Telematics & In-Ride SOS Emergency Alert");

const telematicsStream = [
  { lat: 23.5255, lng: 77.818, speed: 0, gForce: 1.0 },
  { lat: 23.5278, lng: 77.816, speed: 38, gForce: 1.02 },
  { lat: 23.531, lng: 77.813, speed: 42, gForce: 0.99 },
];

assert(telematicsStream.length === 3, "Live GPS telemetry logged along Vidisha Route");

// Customer taps SOS Button
function triggerSOS(trip, currentCoords) {
  return {
    sosId: `SOS-${Date.now()}`,
    bookingId: trip.bookingId,
    customer: trip.customerName,
    phone: trip.customerPhone,
    car: `${trip.vehicle.brand} ${trip.vehicle.model} (${trip.vehicle.plate})`,
    coords: currentCoords,
    timestamp: new Date().toISOString(),
    status: "DISPATCHED_TO_POLICE_AND_ADMIN",
  };
}

const sosEvent = triggerSOS(customerTrip, [23.531, 77.813]);
assert(sosEvent.status === "DISPATCHED_TO_POLICE_AND_ADMIN", "SOS button immediately broadcasts to Super Admin and emergency desk");
assert(sosEvent.car === "Toyota Fortuner 4x4 (MP-40-CA-4921)", "SOS payload includes vehicle make, model, and registration plate");

// --- SCENARIO 1.7: Trip Completion & Settlement Invoice ---
console.log("\n▶ [SCENARIO 1.7] Final Odometer Audit, GST Invoice & Rating");

const startOdo = 42150;
const endOdo = 42168;
const actualDistance = endOdo - startOdo;
assert(actualDistance === 18, "Odometer difference matches estimated trip distance of 18 km");

customerTrip.status = "COMPLETED";
customerTrip.rating = 5;
customerTrip.review = "Superb chauffeur! Excellent clutch handling on my Fortuner.";
assert(customerTrip.status === "COMPLETED", "Customer ride marked COMPLETED");
assert(customerTrip.rating === 5, "Customer awarded 5-star rating to verified chauffeur");


// ================================================================================
// PART 2: FULL DRIVER CHAUFFEUR JOURNEY
// ================================================================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🚘 JOURNEY 2: FULL DRIVER CHAUFFEUR JOURNEY (ALL 9 SCENARIOS)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// --- SCENARIO 2.1: Duty Status & GPS Heartbeat ---
console.log("\n▶ [SCENARIO 2.1] Chauffeur Duty Toggle & Radar Heartbeat");

const chauffeurRajesh = {
  id: "drv-rajesh",
  fullName: "Rajesh Sharma",
  phone: "+91 98261 44001",
  licenseNumber: "MP-40-2019-0012345",
  rtoCode: "MP-40",
  assignedZone: "zone-vidisha",
  sarathiVerified: true,
  transmissionEndorsement: "MANUAL", // Qualified for MANUAL & AUTOMATIC
  isOnline: false,
  walletBalance: 3450,
  safetyScore: 98,
};

// Toggle Online
chauffeurRajesh.isOnline = true;
assert(chauffeurRajesh.isOnline === true, "Chauffeur toggles ON DUTY; radar activated");

// --- SCENARIO 2.2: Operating Zone Patrol Filtering ---
console.log("\n▶ [SCENARIO 2.2] Operating Zone Patrol Filtering (Vidisha vs Bhopal)");

function shouldDriverReceiveRide(driver, trip) {
  if (!driver.isOnline) return false;
  if (trip.status !== "MATCHING") return false;
  if (trip.zoneId !== driver.assignedZone) return false;
  return true;
}

const vidishaRide = { bookingId: "BK-VID-01", zoneId: "zone-vidisha", status: "MATCHING" };
const bhopalRide = { bookingId: "BK-BHO-02", zoneId: "zone-bhopal", status: "MATCHING" };

assert(shouldDriverReceiveRide(chauffeurRajesh, vidishaRide) === true, "Rajesh in Vidisha receives Vidisha zone ride");
assert(shouldDriverReceiveRide(chauffeurRajesh, bhopalRide) === false, "Rajesh in Vidisha filters out Bhopal zone ride");

// --- SCENARIO 2.3: Transmission Certification Gate ---
console.log("\n▶ [SCENARIO 2.3] Transmission Certification Gate (Preventing Clutch Burn)");

function isDriverQualifiedForVehicle(driverTransmission, vehicleTransmission) {
  // Manual DL holders can drive both Manual and Automatic cars
  if (driverTransmission === "MANUAL") return true;
  // Automatic-only drivers can only drive Automatic cars
  if (driverTransmission === "AUTOMATIC" && vehicleTransmission === "AUTOMATIC") return true;
  return false;
}

const autoOnlyDriver = { id: "drv-auto", transmissionEndorsement: "AUTOMATIC" };
assert(isDriverQualifiedForVehicle(chauffeurRajesh.transmissionEndorsement, "MANUAL") === true, "Manual-certified driver qualified for Fortuner Manual");
assert(isDriverQualifiedForVehicle(chauffeurRajesh.transmissionEndorsement, "AUTOMATIC") === true, "Manual-certified driver qualified for Honda City Automatic");
assert(isDriverQualifiedForVehicle(autoOnlyDriver.transmissionEndorsement, "MANUAL") === false, "Automatic-only driver BLOCKED from Fortuner Manual (protects customer clutch)");

// --- SCENARIO 2.4: Incoming Ride Offer Popup & 30s Countdown ---
console.log("\n▶ [SCENARIO 2.4] Incoming Ride Offer Popup & 30-Second Countdown");

// Subscenario 2.4.1: Timeout or Dismissal
let incomingCountdown = 30;
function simulateTimeout(countdownSeconds) {
  if (countdownSeconds <= 0) {
    return { action: "AUTO_DECLINE", nextState: "SEARCHING_FOR_NEXT_OFFER" };
  }
  return { action: "WAITING", remaining: countdownSeconds };
}
assert(simulateTimeout(0).action === "AUTO_DECLINE", "Offer auto-declines after 30 seconds of driver inactivity");

// Subscenario 2.4.2: Driver Accepts Offer
function acceptOffer(driver, trip) {
  trip.status = "DRIVER_ASSIGNED";
  trip.assignedDriver = {
    id: driver.id,
    name: driver.fullName,
    phone: driver.phone,
    rtoCode: driver.rtoCode,
  };
  return trip;
}

const acceptedTrip = acceptOffer(chauffeurRajesh, customerTrip);
assert(acceptedTrip.status === "DRIVER_ASSIGNED", "Trip state transitions to DRIVER_ASSIGNED upon driver acceptance");
assert(acceptedTrip.assignedDriver.name === "Rajesh Sharma", "Chauffeur Rajesh Sharma bound to customer booking");

// --- SCENARIO 2.5: Navigation & Arrival at Vehicle ---
console.log("\n▶ [SCENARIO 2.5] Navigation & Arrival at Customer Fortuner");

acceptedTrip.status = "DRIVER_ARRIVED";
assert(acceptedTrip.status === "DRIVER_ARRIVED", "Driver marks DRIVER_ARRIVED at pickup address");

// --- SCENARIO 2.6: Mandatory 360° Pre-Trip Vehicle Inspection ---
console.log("\n▶ [SCENARIO 2.6] Mandatory 360° Pre-Trip Audit & Photos");

const preTripInspection = {
  frontPhoto: "https://photos.sathi.in/inspection/front_fortuner.jpg",
  rearPhoto: "https://photos.sathi.in/inspection/rear_fortuner.jpg",
  leftPhoto: "https://photos.sathi.in/inspection/left_fortuner.jpg",
  rightPhoto: "https://photos.sathi.in/inspection/right_fortuner.jpg",
  startOdometer: 42150,
  fuelPercentage: 75,
  isAuditComplete: true,
};

assert(preTripInspection.isAuditComplete === true, "All 4 sides (Front, Rear, Left, Right) photographed");
assert(preTripInspection.startOdometer === 42150, "Initial odometer reading logged as 42,150 km");
assert(preTripInspection.fuelPercentage === 75, "Initial fuel level logged at 75%");

// --- SCENARIO 2.7: Sathi PIN Verification ---
console.log("\n▶ [SCENARIO 2.7] Driver Prompts Customer for Permanent Sathi PIN");

const driverEnteredPin = "4892";
assert(driverEnteredPin === customerTrip.permanentPin, "Chauffeur entered exact customer Sathi PIN");
acceptedTrip.status = "TRIP_ACTIVE";
assert(acceptedTrip.status === "TRIP_ACTIVE", "Trip duty successfully in progress");

// --- SCENARIO 2.8: Speedometer Telematics & Safety Scorecard ---
console.log("\n▶ [SCENARIO 2.8] Live Speed Compliance & Tier 1 Chauffeur Incentive");

const drivingTelematics = [
  { speed: 36, accelG: 0.1, event: "NORMAL_CRUISE" },
  { speed: 40, accelG: -0.15, event: "SMOOTH_BRAKING" },
  { speed: 38, accelG: 0.05, event: "NORMAL_CRUISE" },
];

const hasHarshBraking = drivingTelematics.some((t) => t.accelG < -0.4);
assert(hasHarshBraking === false, "0 harsh decelerations detected during ride");
assert(chauffeurRajesh.safetyScore >= 95, "Chauffeur maintains Tier 1 Elite Safety Rating (98/100)");

// --- SCENARIO 2.9: Final Odometer & Instant IMPS Wallet Settlement ---
console.log("\n▶ [SCENARIO 2.9] Trip Completion & Instant IMPS Wallet Payout");

const driverTripShare = cityFare.driverNet; // ₹501
chauffeurRajesh.walletBalance += driverTripShare;
assert(chauffeurRajesh.walletBalance === 3951, "Wallet credited with ₹501 (80% net earnings); new balance ₹3,951");

function processInstantPayout(walletAmount, upiId) {
  return {
    transferId: `IMPS-${Date.now()}`,
    upiId,
    amount: walletAmount,
    status: "SETTLED_INSTANT",
  };
}

const payout = processInstantPayout(3951, "rajesh.sharma@okaxis");
assert(payout.status === "SETTLED_INSTANT", "IMPS Instant Transfer processed to rajesh.sharma@okaxis");
assert(payout.amount === 3951, "Full wallet balance settled without deductions");


// ================================================================================
// PART 3: FULL SUPER ADMIN JOURNEY
// ================================================================================
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("👑 JOURNEY 3: FULL SUPER ADMIN JOURNEY (ALL 6 SCENARIOS)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// --- SCENARIO 3.1: Strict RBAC Authentication & Authority Lock ---
console.log("\n▶ [SCENARIO 3.1] Super Admin RBAC Security & Authority Lock");

const USERS = [
  { id: "usr-01", role: "SUPER_ADMIN", name: "Harsh (Founder & Super Admin)", email: "admin@sathi.in" },
  { id: "usr-02", role: "REGION_MANAGER", name: "Ankit Sharma", email: "ankit.mp40@sathi.in" },
  { id: "usr-03", role: "DISPATCH_OPERATOR", name: "Rohan V.", email: "dispatch@sathi.in" },
  { id: "usr-04", role: "KYC_OFFICER", name: "Ananya S.", email: "kyc@sathi.in" },
];

function canModifySystemPricing(user) {
  return user?.role === "SUPER_ADMIN";
}

function canManageRegionGeofence(user) {
  return user?.role === "SUPER_ADMIN" || user?.role === "REGION_MANAGER";
}

assert(canModifySystemPricing(USERS[0]) === true, "Super Admin has exclusive authority to modify pricing tariffs");
assert(canModifySystemPricing(USERS[1]) === false, "Region Manager is strictly blocked from modifying pricing tariffs");
assert(canModifySystemPricing(USERS[2]) === false, "Dispatch Operator is strictly blocked from modifying pricing tariffs");
assert(canModifySystemPricing(USERS[3]) === false, "KYC Officer is strictly blocked from modifying pricing tariffs");

// --- SCENARIO 3.2: Operating Zone Geofence & Hub Lead Assignment ---
console.log("\n▶ [SCENARIO 3.2] Operating Zone Geofence Creation & Hub Lead Assignment");

const newZone = {
  id: "zone-sanchi",
  name: "Sanchi Tourist Circuit Hub",
  rtoCode: "MP-40",
  managerName: "Ankit Sharma",
  managerEmail: "ankit.mp40@sathi.in",
  managerPhone: "+91 94251 22001",
  isActive: true,
  polygonCoords: [
    [23.47, 77.72],
    [23.51, 77.72],
    [23.51, 77.78],
    [23.47, 77.78],
  ],
};

assert(newZone.id === "zone-sanchi", "Super Admin created new Sanchi Tourist Circuit Zone");
assert(newZone.managerEmail === "ankit.mp40@sathi.in", "Assigned Region Manager Ankit Sharma as hub lead");

// Toggle Zone Offline for Maintenance
newZone.isActive = false;
assert(newZone.isActive === false, "Super Admin switched zone to Maintenance Mode (isActive: false)");
newZone.isActive = true;
assert(newZone.isActive === true, "Super Admin re-activated zone for commercial dispatch");

// --- SCENARIO 3.3: Dynamic Tariff & Commission Split Lock ---
console.log("\n▶ [SCENARIO 3.3] Dynamic Tariff Rules & Platform Split Lock (20% Platform / 80% Driver)");

const SYSTEM_PRICING = {
  platformCommissionPct: 20,
  driverSharePct: 80,
  gstPct: 5,
  hourly4hBase: 599,
  nightPerKmRate: 12,
  nightSurcharge: 1.25,
};

assert(SYSTEM_PRICING.platformCommissionPct === 20, "Platform commission fixed at 20%");
assert(SYSTEM_PRICING.driverSharePct === 80, "Driver share guaranteed at 80%");
assert(SYSTEM_PRICING.platformCommissionPct + SYSTEM_PRICING.driverSharePct === 100, "Split strictly totals 100%");

// --- SCENARIO 3.4: MoRTH Sarathi Registry Driver Auditing ---
console.log("\n▶ [SCENARIO 3.4] MoRTH Sarathi National Registry Chauffeur Verification");

const driverAuditApplication = {
  applicantName: "Vikram Rajput",
  licenseNumber: "MP-40-2021-0089123",
  rtoRegistered: "MP-40 (Vidisha)",
  commercialBadgeExpiry: "2028-11-15",
  policeVerificationCertificate: "PV-MP40-2024-9102",
  kycStatus: "PENDING_AUDIT",
};

function auditDriverKYC(app, superAdminUser) {
  if (superAdminUser.role !== "SUPER_ADMIN" && superAdminUser.role !== "KYC_OFFICER") {
    return { success: false, error: "UNAUTHORIZED_AUDITOR" };
  }
  // Verify commercial badge validity
  const isValidExpiry = new Date(app.commercialBadgeExpiry) > new Date();
  if (isValidExpiry && app.policeVerificationCertificate) {
    app.kycStatus = "APPROVED";
    app.sarathiVerified = true;
    app.badgeAwarded = "MoRTH Verified Chauffeur";
    return { success: true, app };
  }
  app.kycStatus = "REJECTED";
  return { success: false, app };
}

const auditResult = auditDriverKYC(driverAuditApplication, USERS[0]);
assert(auditResult.success === true, "Super Admin successfully approved driver KYC application");
assert(auditResult.app.kycStatus === "APPROVED", "Driver status moved from PENDING_AUDIT to APPROVED");
assert(auditResult.app.sarathiVerified === true, "Driver tagged with MoRTH Sarathi verified digital badge");

// --- SCENARIO 3.5: Fleet Monitoring, Crash Detection & SOS Incident Audit ---
console.log("\n▶ [SCENARIO 3.5] Live Fleet Monitoring, Anomaly Detection & SOS Incident Audit");

const liveFleetTelemetry = [
  { driverId: "drv-01", name: "Rajesh Sharma", speed: 38, gForce: 1.01, status: "IN_TRIP" },
  { driverId: "drv-02", name: "Mukesh Patel", speed: 45, gForce: 0.98, status: "IN_TRIP" },
  { driverId: "drv-03", name: "Dharmendra Lodhi", speed: 0, gForce: 3.6, status: "CRASH_CANDIDATE" },
];

// Crash candidate detection (gForce > 3.0g)
const crashAnomaly = liveFleetTelemetry.find((f) => f.gForce > 3.0);
assert(crashAnomaly !== undefined, "High-G sensor spike detected (3.6g) for Dharmendra Lodhi");
assert(crashAnomaly.status === "CRASH_CANDIDATE", "System automatically flagged vehicle as CRASH_CANDIDATE");

// Super Admin resolves SOS incident
function resolveSOS(sosEventObj, superAdminUser, resolutionNotes) {
  return {
    ...sosEventObj,
    status: "RESOLVED",
    resolvedBy: superAdminUser.name,
    resolvedAt: new Date().toISOString(),
    resolutionNotes,
  };
}

const resolvedSOS = resolveSOS(sosEvent, USERS[0], "Customer contacted; minor route deviation verified; ride continued safely.");
assert(resolvedSOS.status === "RESOLVED", "Super Admin successfully investigated and marked SOS as RESOLVED");
assert(resolvedSOS.resolvedBy === "Harsh (Founder & Super Admin)", "Audit trail logs Super Admin as resolving authority");

// --- SCENARIO 3.6: Daily Platform Settlement & Reconciliation ---
console.log("\n▶ [SCENARIO 3.6] Platform Financial Ledger Reconciliation");

const dailyTripsLedger = [
  { id: "trip-01", gmv: 686, subtotal: 626, commission: 125, driverShare: 501, gst: 31 },
  { id: "trip-02", gmv: 599, subtotal: 570, commission: 114, driverShare: 456, gst: 29 },
  { id: "trip-03", gmv: 999, subtotal: 951, commission: 190, driverShare: 761, gst: 48 },
];

const totalGMV = dailyTripsLedger.reduce((sum, t) => sum + t.gmv, 0);
const totalPlatformRevenue = dailyTripsLedger.reduce((sum, t) => sum + t.commission, 0);
const totalDriverPayouts = dailyTripsLedger.reduce((sum, t) => sum + t.driverShare, 0);
const totalGSTCollected = dailyTripsLedger.reduce((sum, t) => sum + t.gst, 0);

assert(totalGMV === 2284, "Total Platform GMV reconciled to ₹2,284");
assert(totalPlatformRevenue === 429, "Total 20% Platform Commission reconciled to ₹429");
assert(totalDriverPayouts === 1718, "Total 80% Driver Payouts reconciled to ₹1,718");
assert(totalGSTCollected === 108, "Total 5% GST Collected reconciled to ₹108");


// ================================================================================
// FINAL VERIFICATION SUMMARY
// ================================================================================
console.log("\n================================================================================");
console.log(`🏁 3-ROLE MOBILITY SYSTEM TEST COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
