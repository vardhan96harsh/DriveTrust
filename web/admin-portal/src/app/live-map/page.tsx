"use client";

import React, { useState } from "react";
import {
  Compass,
  MapPin,
  ShieldCheck,
  Car,
  Clock,
  Radio,
  Navigation,
} from "lucide-react";
import RealStreetMap, { CITY_PRESETS, CityKey } from "@/components/RealStreetMap";

export default function LiveMapPage() {
  const [activeCityKey, setActiveCityKey] = useState<CityKey>("VIDISHA");
  const preset = CITY_PRESETS[activeCityKey];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Live Fleet Radar
              </h1>
              <p className="text-xs text-slate-500">
                Real-time GPS tracking and live transit corridor for <b>{preset.name} ({preset.state})</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Unified Hub Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          {(["VIDISHA", "BHOPAL", "BHOPAL_VIDISHA"] as CityKey[]).map((cKey) => {
            const isSelected = activeCityKey === cKey;
            return (
              <button
                key={cKey}
                type="button"
                onClick={() => setActiveCityKey(cKey)}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {cKey === "VIDISHA"
                  ? "Vidisha (MP-40)"
                  : cKey === "BHOPAL"
                  ? "Bhopal (MP-04)"
                  : "SH-19 Corridor"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Authoritative Single Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
        <RealStreetMap
          initialCity={activeCityKey}
          height="560px"
          animateCar={true}
          loopAnimation={true}
          showOtherDrivers={true}
          hideCitySelector={true}
          customTitle={`Live Fleet Radar • ${preset.name} Hub`}
        />

        {/* Floating Chauffeur & Dispatch Status Overlay */}
        <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700/80 shadow-2xl max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TRANSIT
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {preset.rtoCode}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              <Car className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">{preset.driverName}</div>
              <div className="text-[11px] text-slate-300 font-mono">
                {preset.vehicleName} • <span className="text-emerald-400 font-bold">{preset.vehiclePlate}</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{preset.pickupLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">{preset.dropoffLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Regional Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Chauffeurs Online
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              {preset.otherDrivers.length + 1} Drivers Available in {preset.name}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Average Arrival ETA
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              3.8 Minutes to Customer
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Police &amp; KYC Verification
            </span>
            <span className="font-extrabold text-emerald-700 text-sm">
              100% MoRTH Sarathi Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
