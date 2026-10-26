"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Gauge,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Car,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  getSafetyProfiles,
  getRecentIncidents,
  updateDriverSafetyStatus,
  DriverSafetyProfile,
  TelematicsIncident,
  SafetyTier,
} from "@/lib/telematicsStore";

const TIER_STYLE: Record<SafetyTier, string> = {
  ELITE: "bg-emerald-50 text-emerald-800 border-emerald-200",
  SAFE: "bg-blue-50 text-blue-800 border-blue-200",
  AT_RISK: "bg-amber-50 text-amber-800 border-amber-200",
  SUSPENDED: "bg-rose-50 text-rose-800 border-rose-200",
};

const INCIDENT_BADGE: Record<TelematicsIncident["type"], string> = {
  HARSH_BRAKE: "bg-rose-100 text-rose-800 border-rose-200",
  OVERSPEEDING: "bg-purple-100 text-purple-800 border-purple-200",
  RAPID_ACCEL: "bg-amber-100 text-amber-800 border-amber-200",
  AGGRESSIVE_TURN: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function TelematicsPage() {
  const [profiles, setProfiles] = useState<DriverSafetyProfile[]>([]);
  const [incidents, setIncidents] = useState<TelematicsIncident[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverSafetyProfile | null>(null);
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(getSafetyProfiles());
    setIncidents(getRecentIncidents());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = (driverId: string, status: DriverSafetyProfile["status"], label: string) => {
    const updated = updateDriverSafetyStatus(driverId, status);
    setProfiles(updated);
    if (selectedDriver?.driverId === driverId) {
      setSelectedDriver((prev) => prev ? { ...prev, status } : null);
    }
    showNotif(`Status updated: ${label}`);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchTier = tierFilter === "ALL" || p.safetyTier === tierFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.driverName.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    return matchTier && matchSearch;
  });

  const avgScore = profiles.length > 0
    ? Math.round(profiles.reduce((a, p) => a + p.overallScore, 0) / profiles.length)
    : 0;

  const totalOverSpeedEvents = profiles.reduce((a, p) => a + p.overspeedingCount, 0);
  const atRiskCount = profiles.filter((p) => p.safetyTier === "AT_RISK" || p.safetyTier === "SUSPENDED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2 max-w-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Chauffeur Telematics &amp; Driving Safety Scorecard
            </h1>
            <p className="text-xs text-slate-500">
              Sensor-based driving behavior monitoring: harsh braking, over-speeding, and safety tiers.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Fleet Safety Index</div>
          <div className="text-3xl font-extrabold text-indigo-600">{avgScore} <span className="text-sm font-semibold text-slate-400">/ 100</span></div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +3.2 pts vs last week</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Elite Chauffeurs</div>
          <div className="text-3xl font-extrabold text-emerald-600">{profiles.filter((p) => p.safetyTier === "ELITE").length}</div>
          <div className="text-xs text-slate-500 mt-1">&gt; 95 safety rating</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs bg-amber-50">
          <div className="text-[11px] font-bold uppercase text-amber-600 mb-1">At-Risk Drivers</div>
          <div className="text-3xl font-extrabold text-amber-700">{atRiskCount}</div>
          <div className="text-xs text-amber-600 mt-1">Requires intervention</div>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs bg-rose-50">
          <div className="text-[11px] font-bold uppercase text-rose-600 mb-1">Speeding Violations</div>
          <div className="text-3xl font-extrabold text-rose-700">{totalOverSpeedEvents}</div>
          <div className="text-xs text-rose-600 mt-1">&gt; speed limit recorded</div>
        </div>
      </div>

      {/* Driver Scorecard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by driver name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Safety Tiers</option>
            <option value="ELITE">Elite (95+)</option>
            <option value="SAFE">Safe (85–94)</option>
            <option value="AT_RISK">At-Risk (&lt; 85)</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Chauffeur</th>
                <th className="py-3 px-4 text-left">Safety Score</th>
                <th className="py-3 px-4 text-left">Tier</th>
                <th className="py-3 px-4 text-right">Harsh Brakes</th>
                <th className="py-3 px-4 text-right">Speeding</th>
                <th className="py-3 px-4 text-right">Tracked Distance</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((driver) => {
                const scoreColor =
                  driver.overallScore >= 90 ? "text-emerald-600" : driver.overallScore >= 75 ? "text-amber-600" : "text-rose-600";
                return (
                  <tr key={driver.driverId} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{driver.driverName}</div>
                      <div className="text-xs text-slate-400 font-mono">{driver.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-black font-mono ${scoreColor}`}>{driver.overallScore}</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${driver.overallScore >= 90 ? "bg-emerald-500" : driver.overallScore >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${driver.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${TIER_STYLE[driver.safetyTier]}`}>
                        {driver.safetyTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700">{driver.harshBrakesCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-rose-600">{driver.overspeedingCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500">{driver.totalKmTracked} km ({driver.totalTripsTracked} trips)</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {driver.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {driver.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleStatusChange(driver.driverId, "WARNING_ISSUED", "Warning Issued")}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
                        >
                          Issue Warning
                        </button>
                      ) : driver.status === "TEMPORARILY_BLOCKED" ? (
                        <button
                          onClick={() => handleStatusChange(driver.driverId, "ACTIVE", "Chauffeur Unblocked")}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(driver.driverId, "TEMPORARILY_BLOCKED", "Chauffeur Blocked")}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Telematics Incident Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-slate-700">Recent Driving Infractions</span>
          <span className="ml-auto text-xs text-slate-400">{incidents.length} recorded events</span>
        </div>

        <div className="divide-y divide-slate-100">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900">{incident.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${INCIDENT_BADGE[incident.type]}`}>
                    {incident.type.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono text-xs text-slate-400">· {incident.bookingCode}</span>
                </div>
                <div className="font-semibold text-slate-800 text-sm">{incident.driverName}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  📍 {incident.location} ({incident.city})
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-rose-600 font-mono">
                  {incident.speedRecordedKmH} km/h
                </div>
                <div className="text-[11px] text-slate-400">Limit: {incident.speedLimitKmH} km/h</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {new Date(incident.timestamp).toLocaleTimeString("en-IN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
