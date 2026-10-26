"use client";

export type SafetyTier = "ELITE" | "SAFE" | "AT_RISK" | "SUSPENDED";

export interface TelematicsIncident {
  id: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  type: "HARSH_BRAKE" | "OVERSPEEDING" | "RAPID_ACCEL" | "AGGRESSIVE_TURN";
  speedRecordedKmH: number;
  speedLimitKmH: number;
  location: string;
  city: string;
  gForce?: number;
  bookingCode: string;
}

export interface DriverSafetyProfile {
  driverId: string;
  driverName: string;
  driverPhone: string;
  city: string;
  overallScore: number; // 0–100
  safetyTier: SafetyTier;
  totalKmTracked: number;
  totalTripsTracked: number;
  harshBrakesCount: number;
  overspeedingCount: number;
  rapidAccelCount: number;
  aggressiveTurnsCount: number;
  lastIncident?: string;
  status: "ACTIVE" | "WARNING_ISSUED" | "RETRAINING_REQUIRED" | "TEMPORARILY_BLOCKED";
}

export const DEFAULT_TELEMATICS_PROFILES: DriverSafetyProfile[] = [
  {
    driverId: "drv-01",
    driverName: "Rajesh Sharma",
    driverPhone: "+91 98261 44001",
    city: "Vidisha (MP-40)",
    overallScore: 96,
    safetyTier: "ELITE",
    totalKmTracked: 1420,
    totalTripsTracked: 48,
    harshBrakesCount: 1,
    overspeedingCount: 0,
    rapidAccelCount: 0,
    aggressiveTurnsCount: 1,
    status: "ACTIVE",
  },
  {
    driverId: "drv-02",
    driverName: "Mukesh Patel",
    driverPhone: "+91 94250 88912",
    city: "Bhopal (MP-04)",
    overallScore: 91,
    safetyTier: "SAFE",
    totalKmTracked: 1180,
    totalTripsTracked: 39,
    harshBrakesCount: 3,
    overspeedingCount: 1,
    rapidAccelCount: 2,
    aggressiveTurnsCount: 2,
    lastIncident: "2026-10-22: 74 km/h in 60 km/h zone",
    status: "ACTIVE",
  },
  {
    driverId: "drv-03",
    driverName: "Dharmendra Lodhi",
    driverPhone: "+91 98931 11223",
    city: "Vidisha (MP-40)",
    overallScore: 88,
    safetyTier: "SAFE",
    totalKmTracked: 940,
    totalTripsTracked: 31,
    harshBrakesCount: 4,
    overspeedingCount: 2,
    rapidAccelCount: 3,
    aggressiveTurnsCount: 2,
    status: "ACTIVE",
  },
  {
    driverId: "drv-04",
    driverName: "Sunil Yadav",
    driverPhone: "+91 98262 77881",
    city: "Vidisha (MP-40)",
    overallScore: 54,
    safetyTier: "AT_RISK",
    totalKmTracked: 620,
    totalTripsTracked: 19,
    harshBrakesCount: 12,
    overspeedingCount: 8,
    rapidAccelCount: 9,
    aggressiveTurnsCount: 7,
    lastIncident: "2026-10-24: 92 km/h in 50 km/h city limit",
    status: "TEMPORARILY_BLOCKED",
  },
];

export const DEFAULT_INCIDENTS: TelematicsIncident[] = [
  {
    id: "INC-001",
    driverId: "drv-04",
    driverName: "Sunil Yadav",
    timestamp: "2026-10-24T14:10:00",
    type: "OVERSPEEDING",
    speedRecordedKmH: 92,
    speedLimitKmH: 50,
    location: "Civil Lines Tilak Chowk, Vidisha",
    city: "Vidisha",
    bookingCode: "BK-VID-6641",
  },
  {
    id: "INC-002",
    driverId: "drv-04",
    driverName: "Sunil Yadav",
    timestamp: "2026-10-24T14:12:30",
    type: "HARSH_BRAKE",
    speedRecordedKmH: 65,
    speedLimitKmH: 50,
    gForce: 0.68,
    location: "Neem Tal Market Circle, Vidisha",
    city: "Vidisha",
    bookingCode: "BK-VID-6641",
  },
  {
    id: "INC-003",
    driverId: "drv-02",
    driverName: "Mukesh Patel",
    timestamp: "2026-10-22T19:40:00",
    type: "OVERSPEEDING",
    speedRecordedKmH: 74,
    speedLimitKmH: 60,
    location: "VIP Road Lake View, Bhopal",
    city: "Bhopal",
    bookingCode: "BK-BHP-8812",
  },
];

const PROFILES_KEY = "dt_telematics_profiles_v1";

function readProfiles(): DriverSafetyProfile[] {
  if (typeof window === "undefined") return DEFAULT_TELEMATICS_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TELEMATICS_PROFILES;
  } catch {
    return DEFAULT_TELEMATICS_PROFILES;
  }
}

function writeProfiles(profiles: DriverSafetyProfile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getSafetyProfiles(): DriverSafetyProfile[] {
  return readProfiles();
}

export function getRecentIncidents(): TelematicsIncident[] {
  return DEFAULT_INCIDENTS;
}

export function updateDriverSafetyStatus(
  driverId: string,
  newStatus: DriverSafetyProfile["status"]
): DriverSafetyProfile[] {
  const profiles = readProfiles();
  const updated = profiles.map((p) =>
    p.driverId === driverId ? { ...p, status: newStatus } : p
  );
  writeProfiles(updated);
  return updated;
}
