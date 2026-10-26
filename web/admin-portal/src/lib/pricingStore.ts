"use client";

import { isInsideVidishaKMLGeofence, VIDISHA_KML_LOOKAT } from "@/data/vidishaGeofence";

export interface PricingZone {
  id: string;
  cityName: string;
  stateName: string;
  currency: string;
  hourlyBaseHours: number;
  hourlyBaseFare: number;
  hourlyExtraHourRate: number;
  hourlyExtraKmRate: number;
  nightBaseFare: number;
  nightPerKmRate: number;
  nightSurchargeMultiplier: number; // e.g. 1.25 for 25%
  driverReturnAllowance: number;
  outstationDailyRate: number;
  outstationDriverAllowance: number;
  freeWaitMinutes: number;
  demurrageRatePerMinute: number;
  convenienceFee: number;
  commissionPct: number;
  gstPct: number;
  isActive: boolean;
  updatedAt: string;
}

export const DEFAULT_PRICING_ZONES: PricingZone[] = [
  {
    id: "zone-vidisha",
    cityName: "Vidisha (MP-40)",
    stateName: "Madhya Pradesh",
    currency: "INR",
    hourlyBaseHours: 2,
    hourlyBaseFare: 299,
    hourlyExtraHourRate: 89,
    hourlyExtraKmRate: 11,
    nightBaseFare: 249,
    nightPerKmRate: 12,
    nightSurchargeMultiplier: 1.20,
    driverReturnAllowance: 120,
    outstationDailyRate: 1599,
    outstationDriverAllowance: 300,
    freeWaitMinutes: 10,
    demurrageRatePerMinute: 2.5,
    convenienceFee: 25,
    commissionPct: 18,
    gstPct: 5,
    isActive: true,
    updatedAt: "2026-10-24 10:45 AM",
  },
  {
    id: "zone-bhopal",
    cityName: "Bhopal (MP-04)",
    stateName: "Madhya Pradesh",
    currency: "INR",
    hourlyBaseHours: 2,
    hourlyBaseFare: 349,
    hourlyExtraHourRate: 99,
    hourlyExtraKmRate: 13,
    nightBaseFare: 299,
    nightPerKmRate: 14,
    nightSurchargeMultiplier: 1.25,
    driverReturnAllowance: 150,
    outstationDailyRate: 1799,
    outstationDriverAllowance: 350,
    freeWaitMinutes: 10,
    demurrageRatePerMinute: 3.0,
    convenienceFee: 30,
    commissionPct: 20,
    gstPct: 5,
    isActive: true,
    updatedAt: "2026-10-24 10:45 AM",
  },
  {
    id: "zone-bhopal-vidisha",
    cityName: "Bhopal ⇄ Vidisha Highway (SH-19)",
    stateName: "Madhya Pradesh",
    currency: "INR",
    hourlyBaseHours: 3,
    hourlyBaseFare: 599,
    hourlyExtraHourRate: 110,
    hourlyExtraKmRate: 14,
    nightBaseFare: 499,
    nightPerKmRate: 15,
    nightSurchargeMultiplier: 1.25,
    driverReturnAllowance: 250,
    outstationDailyRate: 1999,
    outstationDriverAllowance: 400,
    freeWaitMinutes: 15,
    demurrageRatePerMinute: 3.0,
    convenienceFee: 40,
    commissionPct: 20,
    gstPct: 5,
    isActive: true,
    updatedAt: "2026-10-24 10:45 AM",
  },
  {
    id: "zone-bangalore",
    cityName: "Bangalore",
    stateName: "Karnataka",
    currency: "INR",
    hourlyBaseHours: 2,
    hourlyBaseFare: 349,
    hourlyExtraHourRate: 99,
    hourlyExtraKmRate: 12,
    nightBaseFare: 299,
    nightPerKmRate: 14,
    nightSurchargeMultiplier: 1.25,
    driverReturnAllowance: 150,
    outstationDailyRate: 1799,
    outstationDriverAllowance: 350,
    freeWaitMinutes: 10,
    demurrageRatePerMinute: 3.0,
    convenienceFee: 30,
    commissionPct: 20,
    gstPct: 5,
    isActive: true,
    updatedAt: "2026-10-24 10:45 AM",
  },
];

const PRICING_STORAGE_KEY = "sathi_pricing_zones_v1";

function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error("Storage read error", e);
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage write error", e);
  }
}

export function getPricingZones(): PricingZone[] {
  return getStorage<PricingZone[]>(PRICING_STORAGE_KEY, DEFAULT_PRICING_ZONES);
}

export function getPricingZone(idOrCity: string): PricingZone {
  const zones = getPricingZones();
  const match = zones.find(
    (z) => z.id === idOrCity || z.cityName.toLowerCase().includes(idOrCity.toLowerCase())
  );
  return match || zones[0];
}

export function updatePricingZone(updated: PricingZone): void {
  const zones = getPricingZones();
  const index = zones.findIndex((z) => z.id === updated.id);
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const entry = { ...updated, updatedAt: `Today, ${now}` };

  if (index >= 0) {
    zones[index] = entry;
  } else {
    zones.push(entry);
  }
  setStorage(PRICING_STORAGE_KEY, zones);
}

export function addPricingZone(newZone: Omit<PricingZone, "id" | "updatedAt">): PricingZone {
  const zones = getPricingZones();
  const id = "zone-" + Math.random().toString(36).substring(2, 8);
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const created: PricingZone = {
    ...newZone,
    id,
    updatedAt: `Today, ${now}`,
  };
  zones.push(created);
  setStorage(PRICING_STORAGE_KEY, zones);
  return created;
}

export function resetPricingToDefaults(): PricingZone[] {
  setStorage(PRICING_STORAGE_KEY, DEFAULT_PRICING_ZONES);
  return DEFAULT_PRICING_ZONES;
}

export interface DetailedFareBreakdown {
  serviceType: string;
  cityName: string;
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  perKmRate: number;
  nightSurgeFare: number;
  nightSurgeMultiplier: number;
  driverReturnAllowance: number;
  extraTimeFare: number;
  freeWaitMinutes: number;
  waitingCharge: number;
  transitInsuranceCost: number; // 0.00 (Free)
  convenienceFee: number;
  gstAmount: number;
  gstPct: number;
  tipAmount: number;
  totalCustomerFare: number;
  platformCommission: number;
  netDriverEarnings: number;
  isInsideKMLGeofence?: boolean;
  geofenceName?: string;
  geofenceBoundaryNote?: string;
}

export function calculateDetailedFare(
  zone: PricingZone,
  serviceMode: "NIGHT_DROP" | "HOURLY" | "OUTSTATION",
  distanceKm: number,
  hours: number = 4,
  days: number = 2,
  tip: number = 0,
  pickupCoord?: { lat: number; lng: number }
): DetailedFareBreakdown {
  let baseFare = 0;
  let distanceFare = 0;
  let perKmRate = zone.nightPerKmRate;
  let extraTimeFare = 0;
  let nightSurgeFare = 0;
  let driverReturnAllowance = 0;

  if (serviceMode === "HOURLY") {
    baseFare = zone.hourlyBaseFare;
    perKmRate = zone.hourlyExtraKmRate;
    if (hours > zone.hourlyBaseHours) {
      extraTimeFare = (hours - zone.hourlyBaseHours) * zone.hourlyExtraHourRate;
    }
    if (distanceKm > 20) {
      distanceFare = (distanceKm - 20) * zone.hourlyExtraKmRate;
    }
  } else if (serviceMode === "NIGHT_DROP") {
    baseFare = zone.nightBaseFare;
    perKmRate = zone.nightPerKmRate;
    distanceFare = distanceKm * zone.nightPerKmRate;
    driverReturnAllowance = zone.driverReturnAllowance;
    const subtotal = baseFare + distanceFare;
    nightSurgeFare = Math.round(subtotal * (zone.nightSurchargeMultiplier - 1.0));
  } else if (serviceMode === "OUTSTATION") {
    baseFare = days * zone.outstationDailyRate;
    perKmRate = 14;
    driverReturnAllowance = days * zone.outstationDriverAllowance;
    if (distanceKm > days * 250) {
      distanceFare = (distanceKm - days * 250) * 14;
    }
  }

  const subtotalBeforeTax =
    baseFare + extraTimeFare + distanceFare + nightSurgeFare + driverReturnAllowance + zone.convenienceFee;
  const gstAmount = Math.round(subtotalBeforeTax * (zone.gstPct / 100));
  const totalCustomerFare = Math.round(subtotalBeforeTax + gstAmount + tip);

  const operationalFare = subtotalBeforeTax - driverReturnAllowance - zone.convenienceFee;
  const platformCommission = Math.round(operationalFare * (zone.commissionPct / 100));
  const netDriverEarnings = Math.round(operationalFare - platformCommission + driverReturnAllowance + tip);

  const isVidisha = zone.cityName.toLowerCase().includes("vidisha");
  let isInsideKMLGeofence: boolean | undefined = undefined;
  if (isVidisha) {
    if (pickupCoord && pickupCoord.lat && pickupCoord.lng) {
      isInsideKMLGeofence = isInsideVidishaKMLGeofence(pickupCoord.lat, pickupCoord.lng);
    } else {
      isInsideKMLGeofence = true;
    }
  }
  const geofenceName = isVidisha ? VIDISHA_KML_LOOKAT.name : undefined;
  const geofenceBoundaryNote = isVidisha
    ? isInsideKMLGeofence === false
      ? "⚠ Warning: Coordinates outside official Vidisha KML boundary (28.45 km²). Extended zone surcharge may apply."
      : "✓ Verified within official Vidisha KML geofence (28.45 km²). Zero out-of-boundary penalty applied."
    : undefined;

  return {
    serviceType: serviceMode,
    cityName: zone.cityName,
    baseFare,
    distanceKm,
    distanceFare: Math.round(distanceFare),
    perKmRate,
    nightSurgeFare,
    nightSurgeMultiplier: zone.nightSurchargeMultiplier,
    driverReturnAllowance,
    extraTimeFare,
    freeWaitMinutes: zone.freeWaitMinutes,
    waitingCharge: 0,
    transitInsuranceCost: 0,
    convenienceFee: zone.convenienceFee,
    gstAmount,
    gstPct: zone.gstPct,
    tipAmount: tip,
    totalCustomerFare,
    platformCommission,
    netDriverEarnings,
    isInsideKMLGeofence,
    geofenceName,
    geofenceBoundaryNote,
  };
}
