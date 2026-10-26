"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface RemoteBookingStatus {
  booking_id: string;
  booking_code: string;
  status: string;
  service_type: string;
  customer_name: string;
  customer_phone: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_rating?: number;
  driver_dl?: string;
  pickup_address: string;
  destination_address: string;
  vehicle_model: string;
  vehicle_plate: string;
  estimated_fare: number;
  start_otp: string;
  created_at: string;
  updated_at: string;
}

export interface DriverSafetyRecord {
  driver_id: string;
  current_score: number;
  trips_monitored: number;
  harsh_accels: number;
  harsh_brakes: number;
  harsh_corners: number;
  speeding_events: number;
  crash_signals: number;
  status: string;
}

export async function checkBackendHealth(): Promise<{ isOnline: boolean; jwksConfigured: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return { isOnline: false, jwksConfigured: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return {
      isOnline: data.status === "HEALTHY",
      jwksConfigured: !!data.jwks_fingerprint,
    };
  } catch (err: any) {
    return { isOnline: false, jwksConfigured: false, error: err.message };
  }
}

export async function fetchBookingFromBackend(bookingId: string): Promise<RemoteBookingStatus | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/bookings/status?booking_id=${encodeURIComponent(bookingId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchDriverSafetyScore(driverId: string): Promise<DriverSafetyRecord | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/telematics/driver-score?driver_id=${encodeURIComponent(driverId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function cancelRemoteBooking(bookingId: string, reason: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/bookings/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: bookingId,
        cancelled_by: "ADMIN",
        reason: reason || "Administrative intervention / dispatch reroute",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
