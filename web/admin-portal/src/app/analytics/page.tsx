"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingDown,
  MapPin,
  AlertTriangle,
  Clock,
  Car,
  ChevronRight,
  Search,
  Info,
  Users,
  Zap,
} from "lucide-react";
import {
  getDemandHeatmap,
  getZeroCarEvents,
  getDemandSummaries,
  getTopUnfulfilledLocations,
  DemandHeatmapPoint,
  ZeroCarEvent,
  DemandAnalyticsSummary,
} from "@/lib/analyticsStore";

const REASON_STYLE: Record<ZeroCarEvent["reasonCode"], string> = {
  NO_DRIVERS_ONLINE: "bg-rose-50 text-rose-800 border-rose-200",
  TIMEOUT_NO_ACCEPT: "bg-amber-50 text-amber-800 border-amber-200",
  ALL_DRIVERS_BUSY: "bg-purple-50 text-purple-800 border-purple-200",
};

const REASON_LABELS: Record<ZeroCarEvent["reasonCode"], string> = {
  NO_DRIVERS_ONLINE: "No Drivers Online",
  TIMEOUT_NO_ACCEPT: "Timeout / No Accept",
  ALL_DRIVERS_BUSY: "All Drivers Busy",
};

const TRANSMISSION_STYLE: Record<string, string> = {
  AUTOMATIC: "bg-blue-100 text-blue-800 border-blue-200",
  MANUAL: "bg-slate-100 text-slate-700 border-slate-200",
  LUXURY: "bg-violet-100 text-violet-800 border-violet-200",
};

export default function AnalyticsPage() {
  const [activeCity, setActiveCity] = useState<"ALL" | "Vidisha" | "Bhopal">("ALL");
  const [heatmapData, setHeatmapData] = useState<DemandHeatmapPoint[]>([]);
  const [zeroCarEvents, setZeroCarEvents] = useState<ZeroCarEvent[]>([]);
  const [summaries, setSummaries] = useState<DemandAnalyticsSummary[]>([]);
  const [topUnfulfilled, setTopUnfulfilled] = useState<{ location: string; count: number; lat: number; lng: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setHeatmapData(getDemandHeatmap());
    setZeroCarEvents(getZeroCarEvents());
    setSummaries(getDemandSummaries());
    setTopUnfulfilled(getTopUnfulfilledLocations());
  }, []);

  const filteredHeatmap = heatmapData.filter((p) => {
    const matchCity = activeCity === "ALL" || p.city === activeCity;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.locationName.toLowerCase().includes(q);
    return matchCity && matchSearch;
  });

  const filteredZeroCar = zeroCarEvents.filter((e) => activeCity === "ALL" || e.city === activeCity);

  const totalSearches = filteredHeatmap.reduce((a, p) => a + p.searchCount, 0);
  const totalBooked = filteredHeatmap.reduce((a, p) => a + p.bookedCount, 0);
  const totalAbandoned = filteredHeatmap.reduce((a, p) => a + p.abandonedCount, 0);
  const conversionRate = totalSearches > 0 ? ((totalBooked / totalSearches) * 100).toFixed(1) : "0";

  const filteredSummaries = summaries.filter((s) => activeCity === "ALL" || s.city === activeCity);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Demand Analytics &amp; Unfulfilled Bookings
            </h1>
            <p className="text-xs text-slate-500">
              Zero-car event tracking, location heat maps, and driver recruitment intelligence for Vidisha &amp; Bhopal hubs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(["ALL", "Vidisha", "Bhopal"] as const).map((city) => (
            <button key={city} onClick={() => setActiveCity(city)} className={`px-4 py-1.5 rounded-lg transition ${activeCity === city ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
              {city === "ALL" ? "All Hubs" : city}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Total Searches</div>
          <div className="text-3xl font-extrabold text-slate-900">{totalSearches.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">This week (18–24 Oct)</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs bg-emerald-50">
          <div className="text-[11px] font-bold uppercase text-emerald-600 mb-1">Bookings Fulfilled</div>
          <div className="text-3xl font-extrabold text-emerald-700">{totalBooked.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 mt-1">{conversionRate}% conversion rate</div>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs bg-rose-50">
          <div className="text-[11px] font-bold uppercase text-rose-600 mb-1">Zero-Car Drops</div>
          <div className="text-3xl font-extrabold text-rose-700">{totalAbandoned.toLocaleString()}</div>
          <div className="text-xs text-rose-600 mt-1">Lost revenue events</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Zero-Car Events</div>
          <div className="text-3xl font-extrabold text-slate-900">{filteredZeroCar.length}</div>
          <div className="text-xs text-slate-500 mt-1">Timestamped incidents</div>
        </div>
      </div>

      {/* Recruitment Recommendations */}
      {filteredSummaries.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Ops Recruitment Intelligence
          </div>
          {filteredSummaries.map((summary, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-slate-900">{summary.city} Hub · {summary.dateRange}</div>
                <div className="text-sm font-bold text-rose-600">{(100 - summary.conversionRate).toFixed(1)}% drop rate</div>
              </div>
              <div className="space-y-1.5">
                {summary.recommendedRecruitmentAreas.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                    <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Unfulfilled Locations */}
      <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Top Locations with Unfulfilled Demand (Zero-Car Events)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topUnfulfilled.map((loc, idx) => {
            const maxCount = topUnfulfilled[0]?.count || 1;
            const pct = Math.round((loc.count / maxCount) * 100);
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-extrabold flex items-center justify-center shrink-0">{idx + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-800">{loc.location}</span>
                    <span className="text-xs font-bold text-rose-600">{loc.count} drops</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-rose-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demand Heat Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" /> Location Demand Breakdown
          </div>
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Filter locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">City</th>
                <th className="py-3 px-4 text-right">Searches</th>
                <th className="py-3 px-4 text-right">Booked</th>
                <th className="py-3 px-4 text-right">Zero-Car Drops</th>
                <th className="py-3 px-4 text-right">Conversion</th>
                <th className="py-3 px-4 text-right">Peak Hour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHeatmap
                .sort((a, b) => b.abandonedCount - a.abandonedCount)
                .map((point, idx) => {
                  const conv = ((point.bookedCount / point.searchCount) * 100).toFixed(0);
                  const convNum = parseInt(conv);
                  return (
                    <tr key={idx} className={`hover:bg-slate-50 transition ${point.abandonedCount >= 25 ? "bg-rose-50/30" : ""}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${point.abandonedCount >= 25 ? "text-rose-500" : "text-slate-400"}`} />
                          <span className="font-semibold text-slate-800">{point.locationName}</span>
                          {point.abandonedCount >= 25 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">CRITICAL</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">{point.city}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{point.searchCount}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">{point.bookedCount}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-mono font-extrabold ${point.abandonedCount >= 25 ? "text-rose-600" : point.abandonedCount >= 15 ? "text-amber-600" : "text-slate-700"}`}>
                          {point.abandonedCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${convNum >= 75 ? "bg-emerald-500" : convNum >= 55 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${conv}%` }} />
                          </div>
                          <span className={`text-xs font-bold font-mono ${convNum >= 75 ? "text-emerald-700" : convNum >= 55 ? "text-amber-700" : "text-rose-700"}`}>{conv}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-xs font-mono text-slate-600">
                        {point.peakHour < 12 ? `${point.peakHour}:00 AM` : point.peakHour === 12 ? "12:00 PM" : `${point.peakHour - 12}:00 PM`}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zero-Car Event Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-slate-700">Recent Zero-Car Events (Timestamped)</span>
          <span className="ml-auto text-xs text-slate-400">{filteredZeroCar.length} events</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredZeroCar.map((event) => (
            <div key={event.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{event.locationName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${REASON_STYLE[event.reasonCode]}`}>
                    {REASON_LABELS[event.reasonCode]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TRANSMISSION_STYLE[event.requestedTransmission]}`}>
                    {event.requestedTransmission}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                  <span><Clock className="w-3 h-3 inline mr-0.5" />{new Date(event.timestamp).toLocaleString("en-IN")}</span>
                  <span>Customer: {event.customerPhone}</span>
                  <span>City: {event.city}</span>
                  {event.nearestDriverDistanceKm && (
                    <span className="text-amber-600 font-semibold">Nearest driver: {event.nearestDriverDistanceKm} km away</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
