"use client";

import React, { useState, useEffect } from "react";
import {
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
  Radio,
  MapPin,
  Volume2,
  Clock,
  CheckCircle2,
  Phone,
  AlertTriangle,
  Car,
  User,
  Shield,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  getSOSEvents,
  acknowledgeSOS,
  dispatchPolice,
  resolveSOSEvent,
  SOSEvent,
  SOSStatus,
} from "@/lib/emergencyStore";

const STATUS_STYLE: Record<SOSStatus, string> = {
  ACTIVE: "bg-rose-600 text-white animate-pulse",
  ACKNOWLEDGED: "bg-amber-500 text-white",
  POLICE_DISPATCHED: "bg-blue-600 text-white",
  RESOLVED: "bg-emerald-600 text-white",
};

export default function EmergencyPage() {
  const [sosEvents, setSosEvents] = useState<SOSEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SOSEvent | null>(null);
  const [policeThana, setPoliceThana] = useState("");
  const [policeContact, setPoliceContact] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setSosEvents(getSOSEvents());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAcknowledge = (id: string) => {
    const updated = acknowledgeSOS(id);
    setSosEvents(updated);
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) => prev ? { ...prev, status: "ACKNOWLEDGED" } : null);
    }
    showNotif("⚠️ SOS Acknowledged. Dispatching Ops team protocol.");
  };

  const handleDispatchPolice = () => {
    if (!selectedEvent || !policeThana.trim()) {
      showNotif("❌ Enter Police Thana name.");
      return;
    }
    const updated = dispatchPolice(selectedEvent.id, policeThana, policeContact || "112 Emergency");
    setSosEvents(updated);
    setSelectedEvent((prev) => prev ? { ...prev, status: "POLICE_DISPATCHED", policeStationAssigned: policeThana } : null);
    showNotif(`🚨 Police dispatched via ${policeThana} (PCR Notified)!`);
  };

  const handleResolve = () => {
    if (!selectedEvent || !resolutionSummary.trim()) {
      showNotif("❌ Enter resolution summary.");
      return;
    }
    const updated = resolveSOSEvent(selectedEvent.id, resolutionSummary, "Admin Harsh");
    setSosEvents(updated);
    setSelectedEvent(null);
    setResolutionSummary("");
    showNotif("✅ SOS incident verified and marked resolved.");
  };

  const activeCount = sosEvents.filter((e) => e.status === "ACTIVE").length;
  const inProgressCount = sosEvents.filter((e) => e.status === "ACKNOWLEDGED" || e.status === "POLICE_DISPATCHED").length;

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
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              24/7 SOS &amp; Emergency Escalation Desk
              {activeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-extrabold animate-bounce">
                  {activeCount} CRITICAL ALERT
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500">
              Live MoRTH-compliant passenger &amp; chauffeur emergency response and 112 India police escalation.
            </p>
          </div>
        </div>

        {/* 112 Speed Dial */}
        <div className="flex items-center gap-3">
          <a
            href="tel:112"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm transition shadow-sm"
          >
            <PhoneCall className="w-4 h-4" /> Dial 112 Police Control
          </a>
        </div>
      </div>

      {/* 3-Step Emergency Response SOP Protocol */}
      <div className="bg-rose-950/90 text-white rounded-2xl p-5 border border-rose-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-rose-900 mb-3">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black">!</span>
            <span>Emergency Operations Standard Operating Procedure (आपातकालीन SOP)</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-900/60 px-2.5 py-0.5 rounded border border-rose-700">
            TARGET RESOLUTION: &lt; 3 MINUTES
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-800/60 space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <span>Step 1: Immediate Callback (&lt;30s)</span>
            </div>
            <p className="text-rose-100/80 text-[11px] leading-relaxed">
              Click &quot;Acknowledge&quot; to halt audio alarm. Call passenger and driver simultaneously to verify vehicle safety status.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-800/60 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>Step 2: Police 112 Dispatch</span>
            </div>
            <p className="text-rose-100/80 text-[11px] leading-relaxed">
              If client reports danger or call is unreachable, assign nearest Police Thana (e.g. Kotwali Vidisha) &amp; share GPS telemetry.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-900/40 border border-rose-800/60 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>Step 3: Verification &amp; Archive</span>
            </div>
            <p className="text-rose-100/80 text-[11px] leading-relaxed">
              Once passenger confirms safety, log resolution notes with operator signature and mark incident safely resolved.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-4 shadow-xs ${activeCount > 0 ? "bg-rose-50 border-rose-300" : "bg-white border-slate-200"}`}>
          <div className="text-[11px] font-bold uppercase text-rose-600 mb-1">Active Alarms</div>
          <div className="text-3xl font-extrabold text-rose-600">{activeCount}</div>
          <div className="text-xs text-rose-500 mt-1">Requires immediate response</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-amber-600 mb-1">In Escalation / Police</div>
          <div className="text-3xl font-extrabold text-amber-600">{inProgressCount}</div>
          <div className="text-xs text-slate-500 mt-1">PCR patrol assigned</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-emerald-600 mb-1">Resolved Safely</div>
          <div className="text-3xl font-extrabold text-emerald-600">{sosEvents.filter((e) => e.status === "RESOLVED").length}</div>
          <div className="text-xs text-slate-500 mt-1">Incident reports closed</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Avg Response Time</div>
          <div className="text-3xl font-extrabold text-slate-900">1.8 <span className="text-sm font-normal text-slate-500">min</span></div>
          <div className="text-xs text-slate-500 mt-1">Target: &lt; 3 minutes</div>
        </div>
      </div>

      {/* SOS Events Feed */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> Live Emergency Incident Stream
        </div>

        <div className="space-y-3">
          {sosEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition hover:shadow-md cursor-pointer ${
                event.status === "ACTIVE"
                  ? "border-rose-400 ring-2 ring-rose-200 bg-rose-50/20"
                  : event.status === "POLICE_DISPATCHED"
                  ? "border-blue-300 bg-blue-50/10"
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    event.status === "ACTIVE" ? "bg-rose-600 text-white animate-pulse" : "bg-slate-900 text-white"
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-extrabold text-slate-900">{event.id}</span>
                      <span className="font-mono text-xs text-slate-500">· {event.bookingCode}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[event.status]}`}>
                        {event.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        Triggered by: <b>{event.triggeredBy}</b>
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{event.locationName}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>👤 Customer: <b>{event.customerName}</b> ({event.customerPhone})</span>
                      <span>🚗 Chauffeur: <b>{event.driverName}</b> ({event.driverPhone})</span>
                      <span>🚘 Vehicle: <b>{event.vehicleModel}</b> ({event.vehiclePlate})</span>
                      <span>⚡ Speed: <b>{event.speedKmH} km/h</b></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(event.timestamp).toLocaleTimeString("en-IN")}
                  </div>

                  {event.status === "ACTIVE" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAcknowledge(event.id); }}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Acknowledge &amp; Escalate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500">{selectedEvent.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[selectedEvent.status]}`}>
                    {selectedEvent.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  SOS Incident Review · {selectedEvent.locationName}
                </h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live GPS Coordinates Banner */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 mb-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-rose-900">Live GPS Coordinates</div>
                  <div className="font-mono text-rose-700">{selectedEvent.lat.toFixed(5)}° N, {selectedEvent.lng.toFixed(5)}° E ({selectedEvent.city})</div>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${selectedEvent.lat},${selectedEvent.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition"
              >
                Open in Maps
              </a>
            </div>

            {/* Audio Clip Player */}
            {selectedEvent.audioClipAvailable && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cabin Ambient Audio Recording</div>
                    <div className="text-[11px] text-slate-500">{selectedEvent.audioClipDurationSec} seconds auto-recorded on SOS trigger</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  {isPlayingAudio ? "Playing..." : "Play Recording"}
                </button>
              </div>
            )}

            {/* Contacts Row */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Customer Contact</span>
                <div className="font-bold text-slate-900 text-sm">{selectedEvent.customerName}</div>
                <a href={`tel:${selectedEvent.customerPhone}`} className="text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {selectedEvent.customerPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Chauffeur Contact</span>
                <div className="font-bold text-slate-900 text-sm">{selectedEvent.driverName}</div>
                <a href={`tel:${selectedEvent.driverPhone}`} className="text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {selectedEvent.driverPhone}
                </a>
              </div>
            </div>

            {/* Police Dispatch Section */}
            {selectedEvent.status !== "RESOLVED" && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-100/70 border border-slate-200 mb-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600" /> Police Control Escalation
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Police Thana / Station Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kotwali Vidisha / MP Nagar Thana"
                      value={policeThana}
                      onChange={(e) => setPoliceThana(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Duty Officer Contact</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 7592 232100"
                      value={policeContact}
                      onChange={(e) => setPoliceContact(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleDispatchPolice}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Dispatch Police / Log PCR Reference
                </button>
              </div>
            )}

            {/* Resolve Section */}
            {selectedEvent.status !== "RESOLVED" ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Incident Resolution Summary</label>
                <textarea
                  rows={2}
                  placeholder="Record call outcome, safety confirmation, escort status..."
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 resize-none"
                />
                <button
                  onClick={handleResolve}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Incident Resolved &amp; Safe
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Resolved by {selectedEvent.resolvedBy} on {selectedEvent.resolvedAt && new Date(selectedEvent.resolvedAt).toLocaleString("en-IN")}
                </div>
                <div className="text-emerald-700">{selectedEvent.resolutionSummary}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
