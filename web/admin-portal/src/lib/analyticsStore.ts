"use client";

export interface DemandHeatmapPoint {
  lat: number;
  lng: number;
  locationName: string;
  city: string;
  searchCount: number; // customers who searched
  bookedCount: number; // successful bookings
  abandonedCount: number; // zero-car events
  peakHour: number; // 0–23
  date: string;
}

export interface ZeroCarEvent {
  id: string;
  timestamp: string;
  city: string;
  locationName: string;
  lat: number;
  lng: number;
  customerPhone: string; // anonymized last 4 digits
  requestedTransmission: "AUTOMATIC" | "MANUAL" | "LUXURY";
  reasonCode: "NO_DRIVERS_ONLINE" | "TIMEOUT_NO_ACCEPT" | "ALL_DRIVERS_BUSY";
  nearestDriverDistanceKm?: number;
}

export interface DemandAnalyticsSummary {
  dateRange: string;
  city: string;
  totalSearches: number;
  totalBookings: number;
  totalAbandoned: number;
  conversionRate: number; // %
  topZeroCarLocations: { location: string; count: number }[];
  peakHour: number;
  recommendedRecruitmentAreas: string[];
}

export const DEFAULT_DEMAND_HEATMAP: DemandHeatmapPoint[] = [
  { lat: 23.5251, lng: 77.8082, locationName: "Vidisha Railway Station", city: "Vidisha", searchCount: 89, bookedCount: 62, abandonedCount: 27, peakHour: 7, date: "2026-10-24" },
  { lat: 23.5122, lng: 77.8001, locationName: "Collectorate Civil Lines", city: "Vidisha", searchCount: 54, bookedCount: 41, abandonedCount: 13, peakHour: 9, date: "2026-10-24" },
  { lat: 23.5310, lng: 77.8190, locationName: "Vidisha Bus Stand", city: "Vidisha", searchCount: 71, bookedCount: 38, abandonedCount: 33, peakHour: 18, date: "2026-10-24" },
  { lat: 23.5035, lng: 77.7890, locationName: "Sanchi Stupa Tourist Entry", city: "Vidisha", searchCount: 48, bookedCount: 30, abandonedCount: 18, peakHour: 10, date: "2026-10-24" },
  { lat: 23.5200, lng: 77.8300, locationName: "Gyaraspur Bypass Road", city: "Vidisha", searchCount: 22, bookedCount: 8, abandonedCount: 14, peakHour: 21, date: "2026-10-24" },
  { lat: 23.2599, lng: 77.4126, locationName: "Raja Bhoj Airport Bhopal", city: "Bhopal", searchCount: 130, bookedCount: 110, abandonedCount: 20, peakHour: 6, date: "2026-10-24" },
  { lat: 23.2332, lng: 77.4273, locationName: "MP Nagar Zone-1", city: "Bhopal", searchCount: 95, bookedCount: 78, abandonedCount: 17, peakHour: 9, date: "2026-10-24" },
  { lat: 23.2500, lng: 77.4000, locationName: "Arera Colony", city: "Bhopal", searchCount: 68, bookedCount: 55, abandonedCount: 13, peakHour: 8, date: "2026-10-24" },
  { lat: 23.2156, lng: 77.3780, locationName: "Habibganj / Rani Kamlapati Station", city: "Bhopal", searchCount: 112, bookedCount: 72, abandonedCount: 40, peakHour: 7, date: "2026-10-24" },
  { lat: 23.2710, lng: 77.3950, locationName: "Shyamla Hills", city: "Bhopal", searchCount: 41, bookedCount: 29, abandonedCount: 12, peakHour: 20, date: "2026-10-24" },
];

export const DEFAULT_ZERO_CAR_EVENTS: ZeroCarEvent[] = [
  { id: "zc-001", timestamp: "2026-10-24T07:18:00", city: "Vidisha", locationName: "Vidisha Bus Stand", lat: 23.531, lng: 77.819, customerPhone: "****8901", requestedTransmission: "MANUAL", reasonCode: "NO_DRIVERS_ONLINE", nearestDriverDistanceKm: 8.4 },
  { id: "zc-002", timestamp: "2026-10-24T07:24:00", city: "Vidisha", locationName: "Vidisha Bus Stand", lat: 23.531, lng: 77.819, customerPhone: "****7723", requestedTransmission: "AUTOMATIC", reasonCode: "TIMEOUT_NO_ACCEPT" },
  { id: "zc-003", timestamp: "2026-10-24T21:10:00", city: "Vidisha", locationName: "Gyaraspur Bypass Road", lat: 23.52, lng: 77.83, customerPhone: "****4412", requestedTransmission: "AUTOMATIC", reasonCode: "NO_DRIVERS_ONLINE", nearestDriverDistanceKm: 12.1 },
  { id: "zc-004", timestamp: "2026-10-24T07:05:00", city: "Bhopal", locationName: "Habibganj / Rani Kamlapati Station", lat: 23.2156, lng: 77.378, customerPhone: "****5520", requestedTransmission: "LUXURY", reasonCode: "ALL_DRIVERS_BUSY" },
  { id: "zc-005", timestamp: "2026-10-24T07:11:00", city: "Bhopal", locationName: "Habibganj / Rani Kamlapati Station", lat: 23.2156, lng: 77.378, customerPhone: "****3381", requestedTransmission: "AUTOMATIC", reasonCode: "TIMEOUT_NO_ACCEPT" },
  { id: "zc-006", timestamp: "2026-10-23T23:40:00", city: "Vidisha", locationName: "Vidisha Bus Stand", lat: 23.531, lng: 77.819, customerPhone: "****1190", requestedTransmission: "MANUAL", reasonCode: "NO_DRIVERS_ONLINE", nearestDriverDistanceKm: 9.2 },
];

export const DEMAND_ANALYTICS_SUMMARIES: DemandAnalyticsSummary[] = [
  {
    dateRange: "18 Oct – 24 Oct 2026",
    city: "Vidisha",
    totalSearches: 284,
    totalBookings: 179,
    totalAbandoned: 105,
    conversionRate: 63.0,
    topZeroCarLocations: [
      { location: "Vidisha Bus Stand", count: 33 },
      { location: "Gyaraspur Bypass", count: 14 },
      { location: "Sanchi Stupa Entry", count: 18 },
    ],
    peakHour: 7,
    recommendedRecruitmentAreas: ["Vidisha Bus Stand area (need 2 more drivers, 6–9 PM)", "Gyaraspur Bypass (late-night coverage gap, 9 PM–midnight)"],
  },
  {
    dateRange: "18 Oct – 24 Oct 2026",
    city: "Bhopal",
    totalSearches: 446,
    totalBookings: 344,
    totalAbandoned: 102,
    conversionRate: 77.1,
    topZeroCarLocations: [
      { location: "Habibganj / RKS Station", count: 40 },
      { location: "Raja Bhoj Airport", count: 20 },
      { location: "MP Nagar Zone-1", count: 17 },
    ],
    peakHour: 6,
    recommendedRecruitmentAreas: ["Habibganj / RKS Station (early morning 5–7 AM coverage critical)", "Luxury segment: 0 luxury drivers in Bhopal after 10 PM"],
  },
];

export function getDemandHeatmap(): DemandHeatmapPoint[] {
  return DEFAULT_DEMAND_HEATMAP;
}

export function getZeroCarEvents(): ZeroCarEvent[] {
  return DEFAULT_ZERO_CAR_EVENTS;
}

export function getDemandSummaries(): DemandAnalyticsSummary[] {
  return DEMAND_ANALYTICS_SUMMARIES;
}

export function getTopUnfulfilledLocations(city?: string): { location: string; count: number; lat: number; lng: number }[] {
  const points = city
    ? DEFAULT_DEMAND_HEATMAP.filter((p) => p.city === city)
    : DEFAULT_DEMAND_HEATMAP;
  return points
    .sort((a, b) => b.abandonedCount - a.abandonedCount)
    .slice(0, 5)
    .map((p) => ({ location: p.locationName, count: p.abandonedCount, lat: p.lat, lng: p.lng }));
}
