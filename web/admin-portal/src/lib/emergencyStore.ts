"use client";

export type SOSSeverity = "CRITICAL" | "HIGH" | "MEDIUM";
export type SOSTriggeredBy = "CUSTOMER" | "CHAUFFEUR";
export type SOSStatus = "ACTIVE" | "ACKNOWLEDGED" | "POLICE_DISPATCHED" | "RESOLVED";

export interface SOSEvent {
  id: string;
  timestamp: string;
  bookingCode: string;
  triggeredBy: SOSTriggeredBy;
  initiatorName: string;
  initiatorPhone: string;
  driverName: string;
  driverPhone: string;
  customerName: string;
  customerPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  lat: number;
  lng: number;
  locationName: string;
  city: string;
  severity: SOSSeverity;
  status: SOSStatus;
  speedKmH: number;
  audioClipAvailable: boolean;
  audioClipDurationSec?: number;
  policeStationAssigned?: string;
  policeOfficerContact?: string;
  policeControlRoomNotifiedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionSummary?: string;
}

const EMERGENCY_STORE_KEY = "dt_sos_events_v2";

export const DEFAULT_SOS_EVENTS: SOSEvent[] = [
  {
    id: "SOS-2026-001",
    timestamp: "2026-10-24T16:45:10",
    bookingCode: "BK-VID-9921",
    triggeredBy: "CUSTOMER",
    initiatorName: "Anita Saxena",
    initiatorPhone: "+91 98260 11442",
    driverName: "Rajesh Sharma",
    driverPhone: "+91 98261 44001",
    customerName: "Anita Saxena",
    customerPhone: "+91 98260 11442",
    vehiclePlate: "MP-40-CA-4921",
    vehicleModel: "Toyota Fortuner (White)",
    lat: 23.5285,
    lng: 77.8180,
    locationName: "Station Road Circle, Near Tilak Chowk, Vidisha",
    city: "Vidisha",
    severity: "CRITICAL",
    status: "ACTIVE",
    speedKmH: 0,
    audioClipAvailable: true,
    audioClipDurationSec: 15,
  },
  {
    id: "SOS-2026-002",
    timestamp: "2026-10-23T22:15:30",
    bookingCode: "BK-BHP-8812",
    triggeredBy: "CHAUFFEUR",
    initiatorName: "Mukesh Patel (Chauffeur)",
    initiatorPhone: "+91 94250 88912",
    driverName: "Mukesh Patel",
    driverPhone: "+91 94250 88912",
    customerName: "Gaurav Malhotra",
    customerPhone: "+91 98930 22319",
    vehiclePlate: "MP-04-TA-5501",
    vehicleModel: "Hyundai Creta SX (Silver)",
    lat: 23.235,
    lng: 77.429,
    locationName: "MP Nagar Zone-1, Near Chetak Bridge, Bhopal",
    city: "Bhopal",
    severity: "HIGH",
    status: "POLICE_DISPATCHED",
    speedKmH: 12,
    audioClipAvailable: true,
    audioClipDurationSec: 30,
    policeStationAssigned: "MP Nagar Thana Bhopal",
    policeOfficerContact: "SI Verma (+91 755 255 1100)",
    policeControlRoomNotifiedAt: "2026-10-23T22:18:00",
  },
  {
    id: "SOS-2026-003",
    timestamp: "2026-10-21T02:10:00",
    bookingCode: "BK-VID-6641",
    triggeredBy: "CUSTOMER",
    initiatorName: "Ritu Verma",
    initiatorPhone: "+91 99260 44321",
    driverName: "Sunil Yadav",
    driverPhone: "+91 98262 77881",
    customerName: "Ritu Verma",
    customerPhone: "+91 99260 44321",
    vehiclePlate: "MP-40-AB-3390",
    vehicleModel: "Maruti Swift Dzire",
    lat: 23.504,
    lng: 77.791,
    locationName: "Sanchi Highway Road, Vidisha Toll Gate",
    city: "Vidisha",
    severity: "CRITICAL",
    status: "RESOLVED",
    speedKmH: 0,
    audioClipAvailable: true,
    audioClipDurationSec: 20,
    policeStationAssigned: "Kotwali Police Station Vidisha",
    policeOfficerContact: "Inspector Raghuwanshi (+91 7592 232100)",
    policeControlRoomNotifiedAt: "2026-10-21T02:13:00",
    resolvedAt: "2026-10-21T02:45:00",
    resolvedBy: "Admin Harsh",
    resolutionSummary: "Tyre puncture in dark stretch; driver replaced tyre safely under police patrol supervision. Customer escorted home safely.",
  },
];

function readEvents(): SOSEvent[] {
  if (typeof window === "undefined") return DEFAULT_SOS_EVENTS;
  try {
    const raw = localStorage.getItem(EMERGENCY_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SOS_EVENTS;
  } catch {
    return DEFAULT_SOS_EVENTS;
  }
}

function writeEvents(events: SOSEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMERGENCY_STORE_KEY, JSON.stringify(events));
}

export function getSOSEvents(): SOSEvent[] {
  return readEvents().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function acknowledgeSOS(id: string): SOSEvent[] {
  const events = readEvents();
  const updated = events.map((e) =>
    e.id === id ? { ...e, status: "ACKNOWLEDGED" as SOSStatus } : e
  );
  writeEvents(updated);
  return updated;
}

export function dispatchPolice(
  id: string,
  thanaName: string,
  contactNumber: string
): SOSEvent[] {
  const events = readEvents();
  const updated = events.map((e) =>
    e.id === id
      ? {
          ...e,
          status: "POLICE_DISPATCHED" as SOSStatus,
          policeStationAssigned: thanaName,
          policeOfficerContact: contactNumber,
          policeControlRoomNotifiedAt: new Date().toISOString(),
        }
      : e
  );
  writeEvents(updated);
  return updated;
}

export function resolveSOSEvent(
  id: string,
  resolutionSummary: string,
  resolvedBy: string
): SOSEvent[] {
  const events = readEvents();
  const updated = events.map((e) =>
    e.id === id
      ? {
          ...e,
          status: "RESOLVED" as SOSStatus,
          resolvedAt: new Date().toISOString(),
          resolvedBy,
          resolutionSummary,
        }
      : e
  );
  writeEvents(updated);
  return updated;
}
