"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  Phone,
  Share2,
  Navigation,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import RealStreetMap from "@/components/RealStreetMap";
import { getTripByToken, CustomerTrip, DEFAULT_ACTIVE_TRIP } from "@/lib/customerBookingStore";
import BrandLogo from "@/components/BrandLogo";

function LiveTrackingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("id") || "track-vid-8812";
  const [trip, setTrip] = useState<CustomerTrip>(DEFAULT_ACTIVE_TRIP);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = getTripByToken(token);
    if (found) setTrip(found);
  }, [token]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      {/* Top Banner */}
      <div className="flex items-center justify-between py-4 border-b border-slate-200 mb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo className="w-8 h-8" />
          <div>
            <div className="font-black text-slate-900 text-sm">Sathi Live Radar</div>
            <div className="text-[10px] text-slate-500 font-mono">Trip: {trip.bookingId}</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live GPS Stream
          </span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            {copied ? "✓ Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Live Map Display */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-6">
        <RealStreetMap
          initialCity="VIDISHA"
          height="450px"
          animateCar={true}
          loopAnimation={true}
          driverName={trip.assignedDriver?.name}
          vehicleName={`${trip.vehicle.brand} ${trip.vehicle.model}`}
          vehiclePlate={trip.vehicle.plate}
        />
      </div>

      {/* Chauffeur & Vehicle Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chauffeur Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {trip.assignedDriver?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{trip.assignedDriver?.name}</h3>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> MoRTH Sarathi
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                ★ {trip.assignedDriver?.rating} · {trip.assignedDriver?.totalTrips} Trips · {trip.assignedDriver?.rtoCode}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <a
              href={`tel:${trip.assignedDriver?.phone}`}
              className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Call Chauffeur
            </a>
            <a
              href="tel:112"
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-extrabold text-xs hover:bg-rose-100 transition flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" /> 112 SOS
            </a>
          </div>
        </div>

        {/* Route Details Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
            <span>Trip Route &amp; Car</span>
            <span className="font-mono text-blue-700 font-bold">{trip.vehicle.plate}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px]">PICKUP</span>
                <span className="font-semibold text-slate-800">{trip.pickupAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                <span className="font-semibold text-slate-800">{trip.dropoffAddress}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-mono text-[11px]">
            <span>Vehicle: {trip.vehicle.brand} {trip.vehicle.model}</span>
            <span>Speed: 42 km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveTrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Live GPS stream...</div>}>
      <LiveTrackingContent />
    </Suspense>
  );
}
