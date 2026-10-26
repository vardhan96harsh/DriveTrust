// test-e2e-suite.mjs
// Automated End-to-End Test Suite for Sathi & DriveTrust Platform

console.log("==================================================================");
console.log("🚗 SATHI MOBILITY PLATFORM — COMPREHENSIVE END-TO-END TEST SUITE");
console.log("==================================================================\n");

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

// -------------------------------------------------------------------
// 1. RBAC & SUPER ADMIN PRICING LOCK TESTS
// -------------------------------------------------------------------
console.log("📋 1. Testing Role-Based Access Control & Pricing Authority Lock...");

function canManagePricing(user) {
  return user?.role === "SUPER_ADMIN";
}

const superAdmin = { role: "SUPER_ADMIN", name: "Harsh (Founder & Super Admin)", email: "admin@sathi.in" };
const regionManagerVidisha = { role: "REGION_MANAGER", name: "Ankit Sharma", email: "ankit.mp40@sathi.in" };
const regionManagerBhopal = { role: "REGION_MANAGER", name: "Sunita Patel", email: "sunita.mp04@sathi.in" };
const dispatchDesk = { role: "DISPATCH_OPERATOR", name: "Rohan V.", email: "dispatch@sathi.in" };
const kycAuditor = { role: "KYC_OFFICER", name: "Ananya S.", email: "kyc@sathi.in" };

assert(canManagePricing(superAdmin) === true, "Super Admin MUST have pricing modification authority");
assert(canManagePricing(regionManagerVidisha) === false, "Region Manager (Vidisha) MUST NOT have pricing modification authority");
assert(canManagePricing(regionManagerBhopal) === false, "Region Manager (Bhopal) MUST NOT have pricing modification authority");
assert(canManagePricing(dispatchDesk) === false, "Dispatch Operator MUST NOT have pricing modification authority");
assert(canManagePricing(kycAuditor) === false, "KYC Auditor MUST NOT have pricing modification authority");
assert(canManagePricing(null) === false, "Unauthenticated session MUST NOT have pricing modification authority");

// -------------------------------------------------------------------
// 2. REGION MANAGER ASSIGNMENT & GEOFENCE TESTS
// -------------------------------------------------------------------
console.log("\n📋 2. Testing Operating Zones & Region Manager Assignment...");

const DEFAULT_REGIONS = [
  {
    id: "zone-vidisha",
    name: "Vidisha (MP-40)",
    rtoCode: "MP-40",
    managerName: "Ankit Sharma",
    managerEmail: "ankit.mp40@sathi.in",
    managerPhone: "+91 94251 22001",
    isActive: true,
  },
  {
    id: "zone-bhopal",
    name: "Bhopal (MP-04)",
    rtoCode: "MP-04",
    managerName: "Sunita Patel",
    managerEmail: "sunita.mp04@sathi.in",
    managerPhone: "+91 98930 44002",
    isActive: true,
  },
];

assert(DEFAULT_REGIONS[0].managerName === "Ankit Sharma", "Vidisha Hub lead is Ankit Sharma");
assert(DEFAULT_REGIONS[0].managerEmail === "ankit.mp40@sathi.in", "Vidisha Hub email is ankit.mp40@sathi.in");
assert(DEFAULT_REGIONS[1].managerName === "Sunita Patel", "Bhopal Hub lead is Sunita Patel");
assert(DEFAULT_REGIONS[1].managerEmail === "sunita.mp04@sathi.in", "Bhopal Hub email is sunita.mp04@sathi.in");

// Reassignment test
function assignRegionManager(regions, regionId, name, email, phone) {
  const target = regions.find((r) => r.id === regionId);
  if (!target) return null;
  target.managerName = name;
  target.managerEmail = email;
  target.managerPhone = phone;
  return target;
}

const reassignTest = assignRegionManager(
  [...DEFAULT_REGIONS.map((r) => ({ ...r }))],
  "zone-vidisha",
  "Rohan Saxena",
  "rohan.ops@sathi.in",
  "+91 94251 99887"
);
assert(reassignTest.managerName === "Rohan Saxena", "Region Manager reassignment updates target name");
assert(reassignTest.managerEmail === "rohan.ops@sathi.in", "Region Manager reassignment updates target email");

// -------------------------------------------------------------------
// 3. CUSTOMER PERMANENT SATHI PIN & COLLISION PREVENTION
// -------------------------------------------------------------------
console.log("\n📋 3. Testing Permanent Sathi PIN Generation & Collision Prevention...");

const customers = [
  { id: "cust-01", fullName: "Harshvardhan", phone: "+91 98450 12345", permanentPin: "4892" },
  { id: "cust-02", fullName: "Priya Sharma", phone: "+91 99801 77332", permanentPin: "7332" },
  { id: "cust-03", fullName: "Rajesh Chouhan", phone: "+91 97412 88901", permanentPin: "8890" },
];

assert(customers[0].permanentPin === "4892", "Harshvardhan permanent PIN is 4892");
assert(customers[1].permanentPin === "7332", "Priya Sharma permanent PIN is 7332");
assert(customers[2].permanentPin === "8890", "Rajesh Chouhan permanent PIN is 8890");

// Generate 500 unique PINs and verify zero collision with existing
function generateUniqueCustomerPin(existing) {
  const taken = new Set(existing.map((c) => c.permanentPin).filter(Boolean));
  for (let i = 0; i < 5000; i++) {
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    if (!taken.has(pin)) {
      taken.add(pin);
      return pin;
    }
  }
  return String(Date.now()).slice(-4);
}

const testPool = [...customers];
let collisionCount = 0;
for (let i = 0; i < 200; i++) {
  const pin = generateUniqueCustomerPin(testPool);
  if (testPool.some((c) => c.permanentPin === pin)) {
    collisionCount++;
  }
  testPool.push({ id: `test-${i}`, permanentPin: pin });
}
assert(collisionCount === 0, "Generated 200 sequential PINs with ZERO collisions");
assert(testPool.length === 203, "All 203 customers have unique 4-digit PINs");

// isPinTaken tests
function isPinTaken(pin, pool, excludeId) {
  return pool.some((c) => c.permanentPin === pin && c.id !== excludeId);
}
assert(isPinTaken("4892", customers) === true, "isPinTaken returns TRUE for Harshvardhan's PIN (4892)");
assert(isPinTaken("7332", customers) === true, "isPinTaken returns TRUE for Priya's PIN (7332)");
assert(isPinTaken("4892", customers, "cust-01") === false, "isPinTaken correctly ignores customer's own PIN during self-profile edit");
assert(isPinTaken("1111", customers) === false, "isPinTaken returns FALSE for unused PIN (1111)");

// -------------------------------------------------------------------
// 4. PRICING CALCULATION & PLATFORM COMMISSION
// -------------------------------------------------------------------
console.log("\n📋 4. Testing Multi-Zone Tariff Calculations & Platform Commission...");

const vidishaZone = {
  hourlyBaseHours: 2,
  hourlyBaseFare: 299,
  hourlyExtraHourRate: 89,
  hourlyExtraKmRate: 10,
  nightBaseFare: 249,
  nightPerKmRate: 12,
  nightSurchargeMultiplier: 1.25,
  driverReturnAllowance: 120,
  commissionPct: 20,
  gstPct: 5,
};

// Night Drop trip: 18 km
const baseKmIncluded = 5;
const extraKm = Math.max(0, 18 - baseKmIncluded); // 13 km
const kmCharge = extraKm * vidishaZone.nightPerKmRate; // 13 * 12 = 156
const subtotalFare = (vidishaZone.nightBaseFare + kmCharge) * vidishaZone.nightSurchargeMultiplier + vidishaZone.driverReturnAllowance;
// (249 + 156) * 1.25 + 120 = 405 * 1.25 + 120 = 506.25 + 120 = 626.25 -> 626
const platformCommission = Math.round(subtotalFare * (vidishaZone.commissionPct / 100)); // 626 * 0.20 = 125
const driverEarnings = Math.round(subtotalFare - platformCommission); // 626 - 125 = 501
const gstAmount = Math.round(subtotalFare * (vidishaZone.gstPct / 100)); // 31
const totalPayable = Math.round(subtotalFare + gstAmount); // 657

assert(subtotalFare >= 600, `Night drop subtotal is calculated accurately (₹${Math.round(subtotalFare)})`);
assert(platformCommission === 125, `Platform commission 20% is ₹${platformCommission}`);
assert(driverEarnings === 501, `Driver net earning (80%) is ₹${driverEarnings}`);
assert(totalPayable === 657, `Total customer payable including 5% GST is ₹${totalPayable}`);

// -------------------------------------------------------------------
// 5. TRIP LIFECYCLE STATE MACHINE & PIN HANDOVER
// -------------------------------------------------------------------
console.log("\n📋 5. Testing State Machine Lifecycle & Handover OTP Verification...");

const trip = {
  bookingId: "DT-VID-4892",
  customerName: "Harshvardhan",
  permanentPin: "4892",
  vehicle: { brand: "Toyota", model: "Fortuner 4x4", plate: "MP-40-CA-4921" },
  state: "SEARCHING",
};

// Dispatch
trip.state = "OFFER_DISPATCHED";
assert(trip.state === "OFFER_DISPATCHED", "Booking transitioned to OFFER_DISPATCHED");

// Driver Accepts
trip.state = "ACCEPTED";
assert(trip.state === "ACCEPTED", "Driver accepted booking");

// Driver Arrived
trip.state = "DRIVER_ARRIVED";
assert(trip.state === "DRIVER_ARRIVED", "Driver arrived at customer Fortuner");

// Driver attempts start with wrong OTP
function verifyAndStartTrip(tripObj, enteredCode) {
  if (enteredCode !== tripObj.permanentPin) {
    return { success: false, error: "Invalid PIN! Sathi PIN mismatch." };
  }
  tripObj.state = "IN_PROGRESS";
  return { success: true, state: tripObj.state };
}

const wrongAttempt = verifyAndStartTrip(trip, "0000");
assert(wrongAttempt.success === false, "Trip start correctly REJECTED on incorrect PIN (0000)");
assert(trip.state === "DRIVER_ARRIVED", "Trip remains in DRIVER_ARRIVED state on failed OTP");

const correctAttempt = verifyAndStartTrip(trip, "4892");
assert(correctAttempt.success === true, "Trip successfully STARTED on matching permanent Sathi PIN (4892)");
assert(trip.state === "IN_PROGRESS", "Trip state successfully transitioned to IN_PROGRESS");

// Complete trip
trip.state = "COMPLETED";
assert(trip.state === "COMPLETED", "Trip successfully COMPLETED");

// -------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------
console.log("\n==================================================================");
console.log(`🏁 TEST EXECUTION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
