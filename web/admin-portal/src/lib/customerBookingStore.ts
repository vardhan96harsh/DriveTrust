"use client";

import { CustomerVehicle } from "@/lib/userStore";

export type ServiceMode = "CITY_POINT" | "HOURLY_RENTAL" | "OUTSTATION";
export type TransmissionType = "AUTOMATIC" | "MANUAL" | "LUXURY";

export interface HourlyPackage {
  id: string;
  name: string;
  hours: number;
  kmIncluded: number;
  baseFare: number;
  extraHourRate: number;
  extraKmRate: number;
  tag?: string;
}

export const HOURLY_PACKAGES: HourlyPackage[] = [
  {
    id: "pkg-4h-40k",
    name: "Short City Errands",
    hours: 4,
    kmIncluded: 40,
    baseFare: 599,
    extraHourRate: 120,
    extraKmRate: 12,
    tag: "Popular",
  },
  {
    id: "pkg-8h-80k",
    name: "Full Day City & Meetings",
    hours: 8,
    kmIncluded: 80,
    baseFare: 999,
    extraHourRate: 110,
    extraKmRate: 11,
    tag: "Best Value",
  },
  {
    id: "pkg-12h-wedding",
    name: "Wedding & VIP Events",
    hours: 12,
    kmIncluded: 120,
    baseFare: 1499,
    extraHourRate: 100,
    extraKmRate: 10,
    tag: "VIP Chauffeur",
  },
];

export interface CustomerTrip {
  bookingId: string;
  serviceMode: ServiceMode;
  selectedPackage?: HourlyPackage;
  customerName: string;
  customerPhone: string;
  vehicle: CustomerVehicle;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledTime: string; // ISO string or "NOW"
  isScheduled: boolean;
  driverProtectionInsurance: boolean; // ₹29 add-on
  fareEstimated: number;
  otp: string;
  pickupCoords?: [number, number];
  dropoffCoords?: [number, number];
  zoneId?: string;
  zoneName?: string;
  rtoCode?: string;
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    totalTrips: number;
    rtoCode: string;
    sarathiVerified: boolean;
    photoUrl?: string;
  };
  handoverAccepted: boolean;
  handoverOdometer?: number;
  handoverFuelPct?: number;
  handoverNotes?: string;
  inspectionPhotos?: {
    front?: string;
    rear?: string;
    left?: string;
    right?: string;
  };
  finalOdometer?: number;
  cancellationReason?: string;
  cancelledBy?: "CUSTOMER" | "DRIVER" | "SUPER_ADMIN";
  reassignedBy?: string;
  reassignReason?: string;
  adminOverrideNotes?: string;
  status:
    | "DRAFT"
    | "MATCHING"
    | "DRIVER_ASSIGNED"
    | "DRIVER_ARRIVED"
    | "HANDOVER_PENDING"
    | "TRIP_ACTIVE"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
  trackingToken: string;
}

const CUSTOMER_TRIPS_KEY = "dt_customer_trips_v1";
const CUSTOMER_GARAGE_KEY = "dt_customer_garage_v1";

export const DEFAULT_GARAGE: CustomerVehicle[] = [
  {
    id: "veh-001",
    brand: "Toyota",
    model: "Fortuner 4x4",
    plate: "MP-40-CA-4921",
    transmission: "MANUAL",
    color: "Pearl White",
    year: 2023,
  },
  {
    id: "veh-002",
    brand: "Hyundai",
    model: "Creta SX(O)",
    plate: "MP-40-AB-1290",
    transmission: "AUTOMATIC",
    color: "Titan Grey",
    year: 2024,
  },
  {
    id: "veh-003",
    brand: "Mercedes-Benz",
    model: "E-Class 220d",
    plate: "MP-04-TA-5501",
    transmission: "LUXURY",
    color: "Obsidian Black",
    year: 2024,
  },
];

export const DEFAULT_ACTIVE_TRIP: CustomerTrip = {
  bookingId: "BK-VID-8812",
  serviceMode: "CITY_POINT",
  customerName: "Harshvardhan",
  customerPhone: "+91 98450 12345",
  vehicle: DEFAULT_GARAGE[0],
  pickupAddress: "Vidisha Railway Station, Station Rd",
  dropoffAddress: "Collectorate Civil Lines, Vidisha",
  scheduledTime: "NOW",
  isScheduled: false,
  driverProtectionInsurance: true,
  fareEstimated: 280,
  otp: "4892",
  assignedDriver: {
    id: "drv-01",
    name: "Rajesh Sharma",
    phone: "+91 98261 44001",
    rating: 4.95,
    totalTrips: 342,
    rtoCode: "MP-40 (Vidisha)",
    sarathiVerified: true,
  },
  handoverAccepted: true,
  handoverOdometer: 42150,
  handoverFuelPct: 75,
  handoverNotes: "Clean exterior; existing scratch on rear bumper acknowledged.",
  status: "TRIP_ACTIVE",
  createdAt: new Date().toISOString(),
  trackingToken: "track-vid-8812",
};

export function getCustomerGarage(): CustomerVehicle[] {
  if (typeof window === "undefined") return DEFAULT_GARAGE;
  try {
    const raw = localStorage.getItem(CUSTOMER_GARAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_GARAGE;
  } catch {
    return DEFAULT_GARAGE;
  }
}

export function addVehicleToGarage(vehicle: Omit<CustomerVehicle, "id">): CustomerVehicle[] {
  const garage = getCustomerGarage();
  const newVeh: CustomerVehicle = {
    ...vehicle,
    id: `veh-${Date.now()}`,
  };
  const updated = [...garage, newVeh];
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOMER_GARAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getCustomerTrips(): CustomerTrip[] {
  if (typeof window === "undefined") return [DEFAULT_ACTIVE_TRIP];
  try {
    const raw = localStorage.getItem(CUSTOMER_TRIPS_KEY);
    return raw ? JSON.parse(raw) : [DEFAULT_ACTIVE_TRIP];
  } catch {
    return [DEFAULT_ACTIVE_TRIP];
  }
}

export function saveCustomerTrip(trip: CustomerTrip): void {
  if (typeof window === "undefined") return;
  const trips = getCustomerTrips().filter((t) => t.bookingId !== trip.bookingId);
  localStorage.setItem(CUSTOMER_TRIPS_KEY, JSON.stringify([trip, ...trips]));
  window.dispatchEvent(new CustomEvent("dt_trip_updated", { detail: trip }));
}

export function getTripByToken(token: string): CustomerTrip | undefined {
  const trips = getCustomerTrips();
  return (
    trips.find((t) => t.trackingToken === token || t.bookingId === token) ||
    DEFAULT_ACTIVE_TRIP
  );
}

export function confirmCustomerHandover(
  bookingId: string,
  odometer: number,
  fuelPct: number,
  notes?: string
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    handoverAccepted: true,
    handoverOdometer: odometer,
    handoverFuelPct: fuelPct,
    handoverNotes: notes || trip.handoverNotes,
    status: "TRIP_ACTIVE",
  };
  saveCustomerTrip(updated);
  return updated;
}

export function acceptTripAsDriver(
  bookingId: string,
  driver = {
    id: "drv-01",
    name: "Rajesh Sharma",
    phone: "+91 98261 44001",
    rating: 4.95,
    totalTrips: 342,
    rtoCode: "MP-40 (Vidisha)",
    sarathiVerified: true,
  }
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    assignedDriver: driver,
    status: "DRIVER_ASSIGNED",
  };
  saveCustomerTrip(updated);
  return updated;
}

export function markDriverArrivedAtPickup(bookingId: string): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    status: "DRIVER_ARRIVED",
  };
  saveCustomerTrip(updated);
  return updated;
}

export function startTripWithOtp(
  bookingId: string,
  enteredOtp: string,
  odometer: number,
  fuelPct: number,
  photos?: { front?: string; rear?: string; left?: string; right?: string }
): { success: boolean; error?: string; trip?: CustomerTrip } {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return { success: false, error: "Trip not found." };
  if (trip.otp !== enteredOtp.trim()) {
    return { success: false, error: "Invalid Start OTP. Please ask customer for correct 4-digit OTP." };
  }
  const updated: CustomerTrip = {
    ...trip,
    handoverAccepted: true,
    handoverOdometer: odometer,
    handoverFuelPct: fuelPct,
    inspectionPhotos: photos,
    status: "TRIP_ACTIVE",
  };
  saveCustomerTrip(updated);
  return { success: true, trip: updated };
}

export function completeTripAsDriver(
  bookingId: string,
  finalOdometer: number
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    finalOdometer,
    status: "COMPLETED",
  };
  saveCustomerTrip(updated);
  return updated;
}

export function getActiveDriverTrip(): CustomerTrip | undefined {
  const trips = getCustomerTrips();
  return trips.find(
    (t) =>
      t.status === "MATCHING" ||
      t.status === "DRIVER_ASSIGNED" ||
      t.status === "DRIVER_ARRIVED" ||
      t.status === "HANDOVER_PENDING" ||
      t.status === "TRIP_ACTIVE"
  );
}

export function declineTripAsDriver(bookingId: string): void {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return;
  const updated: CustomerTrip = {
    ...trip,
    status: "CANCELLED",
    cancelledBy: "DRIVER",
    cancellationReason: "Chauffeur declined incoming assignment",
  };
  saveCustomerTrip(updated);
}

export function cancelTrip(
  bookingId: string,
  reason: string = "Customer requested cancellation",
  cancelledBy: "CUSTOMER" | "DRIVER" | "SUPER_ADMIN" = "CUSTOMER"
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    status: "CANCELLED",
    cancelledBy,
    cancellationReason: reason,
  };
  saveCustomerTrip(updated);
  return updated;
}

export function superAdminReassignTrip(
  bookingId: string,
  newDriver: CustomerTrip["assignedDriver"],
  adminName: string = "Harsh (Super Admin)",
  reason: string = "Chauffeur reassignment requested by customer"
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    assignedDriver: newDriver,
    status: "DRIVER_ASSIGNED",
    reassignedBy: adminName,
    reassignReason: reason,
    adminOverrideNotes: `Chauffeur manually reassigned to ${newDriver?.name} (${newDriver?.rtoCode}) by ${adminName} on ${new Date().toISOString()}`,
  };
  saveCustomerTrip(updated);
  return updated;
}

export function superAdminUpdateTrip(
  bookingId: string,
  updates: Partial<CustomerTrip>,
  adminName: string = "Harsh (Super Admin)"
): CustomerTrip | null {
  const trips = getCustomerTrips();
  const trip = trips.find((t) => t.bookingId === bookingId);
  if (!trip) return null;
  const updated: CustomerTrip = {
    ...trip,
    ...updates,
    bookingId, // preserve original booking ID
    adminOverrideNotes: `Trip parameters modified by ${adminName} on ${new Date().toISOString()}`,
  };
  saveCustomerTrip(updated);
  return updated;
}



