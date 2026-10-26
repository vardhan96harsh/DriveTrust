"use client";

import {
  VIDISHA_KML_POLYGON_LEAFLET,
  VIDISHA_KML_POLYGON_GOOGLE,
  VIDISHA_KML_LOOKAT,
} from "@/data/vidishaGeofence";

export interface Region {
  id: string;
  name: string;
  rtoCode: string;
  state: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  areaKm2: number;
  polygonCoords: [number, number][]; // [lat, lng]
  googlePolygonCoords: { lat: number; lng: number }[];
  isActive: boolean; // ON / OFF switch for region bookings
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  reasonIfDisabled?: string;
  createdAt: string;
  updatedAt: string;
}

const BHOPAL_METRO_POLYGON: [number, number][] = [
  [23.2875, 77.3378], // Airport VIP Rd
  [23.2720, 77.3620], // Lalghati Square
  [23.2684, 77.4107], // Bhopal Junction Railway Station
  [23.2540, 77.4550], // Govindpura Industrial Area
  [23.2332, 77.4650], // ISBT / Hoshangabad Rd
  [23.2167, 77.4398], // Rani Kamlapati Station
  [23.2050, 77.4100], // Kolar Road
  [23.2300, 77.3780], // Upper Lake / Van Vihar
  [23.2650, 77.3500], // Gandhi Nagar
  [23.2875, 77.3378], // Close
];

export const DEFAULT_REGIONS: Region[] = [
  {
    id: "zone-vidisha",
    name: "Vidisha (MP-40)",
    rtoCode: "MP-40",
    state: "Madhya Pradesh",
    center: [VIDISHA_KML_LOOKAT.center.lat, VIDISHA_KML_LOOKAT.center.lng],
    zoom: 13,
    areaKm2: VIDISHA_KML_LOOKAT.areaKm2,
    polygonCoords: VIDISHA_KML_POLYGON_LEAFLET,
    googlePolygonCoords: VIDISHA_KML_POLYGON_GOOGLE,
    isActive: true, // ON by default
    managerName: "Ankit Sharma",
    managerEmail: "ankit.mp40@sathi.in",
    managerPhone: "+91 94251 22001",
    createdAt: "2026-10-24",
    updatedAt: "2026-10-24 11:30 AM",
  },
  {
    id: "zone-bhopal",
    name: "Bhopal (MP-04)",
    rtoCode: "MP-04",
    state: "Madhya Pradesh",
    center: [23.2599, 77.4126],
    zoom: 12,
    areaKm2: 48.6,
    polygonCoords: BHOPAL_METRO_POLYGON,
    googlePolygonCoords: BHOPAL_METRO_POLYGON.map(([lat, lng]) => ({ lat, lng })),
    isActive: true, // ON by default
    managerName: "Sunita Patel",
    managerEmail: "sunita.mp04@sathi.in",
    managerPhone: "+91 98930 44002",
    createdAt: "2026-10-24",
    updatedAt: "2026-10-24 11:30 AM",
  },
  {
    id: "zone-bhopal-vidisha",
    name: "Bhopal ⇄ Vidisha Highway (SH-19)",
    rtoCode: "MP-40/04",
    state: "Madhya Pradesh",
    center: [23.3850, 77.6200],
    zoom: 11,
    areaKm2: 32.4,
    polygonCoords: [
      [23.2800, 77.4650],
      [23.3420, 77.5140],
      [23.4010, 77.6250],
      [23.4450, 77.6890],
      [23.4793, 77.7397],
      [23.5180, 77.8020],
      [23.5000, 77.8100],
      [23.4300, 77.6700],
      [23.3200, 77.4900],
      [23.2800, 77.4650],
    ],
    googlePolygonCoords: [
      { lat: 23.2800, lng: 77.4650 },
      { lat: 23.3420, lng: 77.5140 },
      { lat: 23.4010, lng: 77.6250 },
      { lat: 23.4450, lng: 77.6890 },
      { lat: 23.4793, lng: 77.7397 },
      { lat: 23.5180, lng: 77.8020 },
      { lat: 23.5000, lng: 77.8100 },
      { lat: 23.4300, lng: 77.6700 },
      { lat: 23.3200, lng: 77.4900 },
      { lat: 23.2800, lng: 77.4650 },
    ],
    isActive: true,
    createdAt: "2026-10-24",
    updatedAt: "2026-10-24 11:30 AM",
  },
];

const REGIONS_STORAGE_KEY = "sathi_regions_v1";

function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Failed to persist regions:", e);
  }
}

export function getRegions(): Region[] {
  return getStorage<Region[]>(REGIONS_STORAGE_KEY, DEFAULT_REGIONS);
}

export function getRegionById(id: string): Region | undefined {
  return getRegions().find((r) => r.id === id);
}

export function getRegionsByZoneId(zoneId: string): Region[] {
  const match = getRegions().find((r) => r.id === zoneId);
  return match ? [match] : [];
}

/**
 * Generates an approximated closed geodesic polygon for a circular region
 * given a center latitude/longitude and a radius in kilometers.
 */
export function generateRadialPolygon(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  numPoints: number = 16
): [number, number][] {
  const coords: [number, number][] = [];
  const kmPerLat = 110.574;
  const kmPerLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);

  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const dLat = (radiusKm * Math.sin(angle)) / kmPerLat;
    const dLng = (radiusKm * Math.cos(angle)) / kmPerLng;
    coords.push([
      Math.round((centerLat + dLat) * 100000) / 100000,
      Math.round((centerLng + dLng) * 100000) / 100000,
    ]);
  }
  // Close the loop
  coords.push([coords[0][0], coords[0][1]]);
  return coords;
}

export function addRegion(newRegion: Omit<Region, "id" | "createdAt" | "updatedAt">): Region {
  const regions = getRegions();
  const id = `region-${Date.now()}`;
  const now = new Date().toLocaleString();
  const created: Region = {
    ...newRegion,
    id,
    createdAt: now,
    updatedAt: now,
  };
  regions.push(created);
  setStorage(REGIONS_STORAGE_KEY, regions);
  return created;
}

export function updateRegion(id: string, updates: Partial<Region>): void {
  const regions = getRegions();
  const idx = regions.findIndex((r) => r.id === id);
  if (idx >= 0) {
    regions[idx] = {
      ...regions[idx],
      ...updates,
      updatedAt: new Date().toLocaleString(),
    };
    setStorage(REGIONS_STORAGE_KEY, regions);
  }
}

export function deleteRegion(id: string): boolean {
  const regions = getRegions();
  const filtered = regions.filter((r) => r.id !== id);
  if (filtered.length !== regions.length) {
    setStorage(REGIONS_STORAGE_KEY, filtered);
    return true;
  }
  return false;
}

/**
 * Toggle ON / OFF switch for a region
 * Returns the new active state (true = ON, false = OFF)
 */
export function toggleRegionActive(id: string, reasonIfDisabled?: string): boolean {
  const regions = getRegions();
  const target = regions.find((r) => r.id === id);
  if (!target) return false;

  target.isActive = !target.isActive;
  if (!target.isActive && reasonIfDisabled) {
    target.reasonIfDisabled = reasonIfDisabled;
  } else if (target.isActive) {
    target.reasonIfDisabled = undefined;
  }
  target.updatedAt = new Date().toLocaleString();
  setStorage(REGIONS_STORAGE_KEY, regions);
  return target.isActive;
}

export function assignRegionManager(
  regionId: string,
  managerName: string,
  managerEmail: string,
  managerPhone?: string
): Region | null {
  const regions = getRegions();
  const target = regions.find((r) => r.id === regionId);
  if (!target) return null;
  target.managerName = managerName;
  target.managerEmail = managerEmail;
  target.managerPhone = managerPhone;
  target.updatedAt = new Date().toLocaleString();
  setStorage(REGIONS_STORAGE_KEY, regions);
  return target;
}

/**
 * Ray-casting algorithm to test if a point is inside a polygon
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  if (!polygon || polygon.length < 3) return false;
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const yi = polygon[i][0];
    const xi = polygon[i][1];
    const yj = polygon[j][0];
    const xj = polygon[j][1];

    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export interface BookingValidationResult {
  isAllowed: boolean;
  matchedRegion: Region | null;
  status: "ALLOWED" | "REGION_OFFLINE" | "OUT_OF_SERVICE_AREA";
  message: string;
}

/**
 * Strictly verifies whether a customer can book a ride from a given pickup coordinate
 * Enforces:
 * 1. Must be inside a registered region polygon.
 * 2. That region MUST BE TOGGLED ON (isActive === true).
 */
export function validateBookingLocation(
  lat: number,
  lng: number
): BookingValidationResult {
  const regions = getRegions();
  const point: [number, number] = [lat, lng];

  for (const region of regions) {
    if (isPointInPolygon(point, region.polygonCoords)) {
      if (!region.isActive) {
        return {
          isAllowed: false,
          matchedRegion: region,
          status: "REGION_OFFLINE",
          message: `Booking Suspended: ${region.name} (${region.rtoCode}) is currently turned OFF by Admin. ${
            region.reasonIfDisabled ? `Reason: ${region.reasonIfDisabled}` : "Please check back later."
          }`,
        };
      }

      return {
        isAllowed: true,
        matchedRegion: region,
        status: "ALLOWED",
        message: `✓ Location verified inside ${region.name} (${region.rtoCode}). Chauffeur dispatch active.`,
      };
    }
  }

  return {
    isAllowed: false,
    matchedRegion: null,
    status: "OUT_OF_SERVICE_AREA",
    message:
      "Out of Service Area: Sathi commercial chauffeur service is only available inside active service regions (Vidisha MP-40 / Bhopal MP-04).",
  };
}
