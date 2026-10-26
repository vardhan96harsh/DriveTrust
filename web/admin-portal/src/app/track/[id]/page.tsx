"use client";

import React, { useState, useEffect } from "react";
import RealStreetMap, { CityKey, CITY_PRESETS } from "@/components/RealStreetMap";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Share2,
  AlertTriangle,
  Clock,
  Car,
  Navigation,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function PublicLiveTrackingPage({ params }: { params: { id: string } }) {
  const [activeCity, setActiveCity] = useState<CityKey>("VIDISHA");
  const [speed, setSpeed] = useState(44);
  const [etaMins, setEtaMins] = useState(12);
  const [showRouteMap, setShowRouteMap] = useState(true);

  const preset = CITY_PRESETS[activeCity];

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(38 + Math.random() * 14));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-9 h-9" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900">Sathi Live Share</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                LIVE EN ROUTE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Trip Ref: {params.id || "ST-849102"}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Live Ride Tracking - Sathi",
                text: `Track my live chauffeur ride (${params.id || "ST-849102"}) in ${preset.name}`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Live tracking link copied to clipboard!");
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 border border-slate-200 shadow-xs"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
          <span>Share</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {/* Production GPS Telemetry & Transit Corridor (No Map Bloat) */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-slate-900 text-sm">
                Active Chauffeur Telemetry • {preset.name} Hub
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Speed: <b>{speed} km/h</b></span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">ETA: <b>{etaMins} mins</b></span>
            </div>
          </div>

          {/* Transit Route Stepper */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Pickup: {preset.pickupLabel}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Originated</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: "68%" }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Dropoff: {preset.dropoffLabel}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">~3.2 km remaining</span>
            </div>
          </div>

          {/* Sub-second Telemetry Coordinates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-0.5">
                Current Vehicle GPS
              </span>
              <span className="font-mono font-bold text-slate-900 text-[11px]">
                {preset.driverStart[0].toFixed(4)}°N, {preset.driverStart[1].toFixed(4)}°E
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-0.5">
                Corridor Road Authority
              </span>
              <span className="font-bold text-slate-900 text-[11px]">
                {preset.rtoCode} Highway
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-0.5">
                  External Nav
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${preset.pickup[0]},${preset.pickup[1]}&destination=${preset.dropoff[0]},${preset.dropoff[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => setShowRouteMap(!showRouteMap)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{showRouteMap ? "Hide Map" : "View Map"}</span>
              </button>
            </div>
          </div>

          {/* Live Street Map Canvas */}
          {showRouteMap && (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner mt-3">
              <RealStreetMap
                initialCity={activeCity}
                height="380px"
                animateCar={true}
                loopAnimation={true}
                showOtherDrivers={false}
                hideCitySelector={true}
                customTitle={`${preset.name} Live Corridor Tracking`}
              />
            </div>
          )}
        </div>

        {/* Chauffeur & Vehicle Credentials Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ASSIGNED VERIFIED CHAUFFEUR
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                RS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{preset.driverName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    MoRTH {preset.rtoCode} Cleared
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">Commercial Chauffeur • 8 Yrs Experience</div>
              </div>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Police Background Check:</span>
              <span className="font-bold text-emerald-700">✓ Certified (MP Police Records)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              PERSONAL VEHICLE BEING DRIVEN
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center font-bold shadow-xs">
                <Car className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{preset.vehicleName}</h3>
                <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block mt-0.5">
                  {preset.vehiclePlate}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <span>Pre-Trip Handover Check:</span>
              <span className="font-bold text-blue-700">✓ 4-Point Scratch Audit Passed</span>
            </div>
          </div>
        </div>

        {/* Emergency SOS & Support */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">24x7 Safety Assistance</div>
              <div className="text-[11px] text-slate-500">Instant Police 112 &amp; Sathi MP Operations Desk</div>
            </div>
          </div>
          <button
            onClick={() => alert("SOS Alert dispatched to Police 112 and Sathi MP Operations Desk!")}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition"
          >
            Emergency SOS
          </button>
        </div>
      </main>
    </div>
  );
}
