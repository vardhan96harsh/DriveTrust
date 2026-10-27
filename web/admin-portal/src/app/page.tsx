"use client";

import React, { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import Link from "next/link";
import {
  Car,
  Clock,
  CreditCard,
  ShieldCheck,
  Activity,
  ArrowRight,
  AlertTriangle,
  MapPin,
  ExternalLink,
  X,
  Compass,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import RealStreetMap from "@/components/RealStreetMap";
import {
  getDrivers,
  getLiveBookings,
  getSOSIncidents,
  triggerSOSIncident,
  resolveSOSIncident,
  updateDriverKYCStatus,
  reassignBookingDriver,
  LiveBooking,
  SOSIncident,
  Driver,
} from "@/lib/userStore";

export default function DashboardPage() {
  const [activeZone, setActiveZone] = useState("Vidisha (MP-40)");
  const [liveBookings, setLiveBookings] = useState<LiveBooking[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<Driver[]>([]);
  const [approvedDrivers, setApprovedDrivers] = useState<Driver[]>([]);
  const [sosIncidents, setSosIncidents] = useState<SOSIncident[]>([]);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);
  const [selectedTrackingTrip, setSelectedTrackingTrip] = useState<LiveBooking | null>(null);
  const [selectedReassignTrip, setSelectedReassignTrip] = useState<LiveBooking | null>(null);
  const [targetDriverId, setTargetDriverId] = useState<string>("");
  const [reassignReason, setReassignReason] = useState<string>("DRIVER_UNRESPONSIVE");
  const [showQuickGuide, setShowQuickGuide] = useState(true);

  const refreshDashboardData = () => {
    setLiveBookings(getLiveBookings());
    const drivers = getDrivers();
    setPendingDrivers(drivers.filter((d) => d.kycStatus === "UNDER_REVIEW"));
    setApprovedDrivers(drivers.filter((d) => d.kycStatus === "APPROVED"));
    setSosIncidents(getSOSIncidents());
  };

  useEffect(() => {
    refreshDashboardData();
    const interval = setInterval(refreshDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmReassign = () => {
    if (!selectedReassignTrip || !targetDriverId) return;
    const targetDriver = approvedDrivers.find((d) => d.id === targetDriverId);
    if (!targetDriver) return;

    reassignBookingDriver(selectedReassignTrip.bookingCode, targetDriver.fullName, targetDriver.phone);
    refreshDashboardData();
    showToast(`Chauffeur for trip ${selectedReassignTrip.bookingCode} successfully re-assigned to ${targetDriver.fullName}.`);
    setSelectedReassignTrip(null);
  };

  const handleSimulateSOS = () => {
    triggerSOSIncident({
      bookingCode: "DT-849102",
      customerName: "Harshvardhan",
      customerPhone: "+91 98450 12345",
      driverName: "Rajesh Sharma",
      vehiclePlate: "MP-40-CA-4921",
      latitude: 23.5262,
      longitude: 77.8211,
    });
    refreshDashboardData();
    showToast("Emergency SOS broadcast triggered. Routed to National ERSS 112 Desk.");
  };

  const handleResolveIncident = (incidentId: string) => {
    resolveSOSIncident(incidentId);
    refreshDashboardData();
    showToast("Emergency incident resolved and logged in security archive.");
  };

  const handleQuickApproveDriver = (driverId: string, name: string) => {
    updateDriverKYCStatus(driverId, "APPROVED");
    refreshDashboardData();
    showToast(`Chauffeur ${name} verified with MoRTH Sarathi.`);
  };

  const showToast = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  const activeSOS = sosIncidents.filter((inc) => inc.status === "ACTIVE_POLICE_DISPATCHED");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {adminNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminNotification}</span>
        </div>
      )}

      {/* Emergency SOS Critical Incident Banner */}
      {activeSOS.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-600 text-white shadow-xl border border-rose-500 animate-pulse space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base uppercase tracking-wider">
                    Emergency Incident In Progress
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-white text-rose-700">
                    POLICE 112 DISPATCHED
                  </span>
                </div>
                <p className="text-xs text-rose-100">
                  Passenger activated safety alert. Live GPS telemetry streaming to State Emergency Response Desk.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleResolveIncident(activeSOS[0].id)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Mark Incident Resolved
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs font-mono bg-rose-700/50 p-3.5 rounded-xl border border-rose-500/30">
            <div>
              <span className="text-rose-200 block text-[10px] uppercase font-bold">Passenger:</span>
              <span className="font-bold text-white">{activeSOS[0].customerName} ({activeSOS[0].customerPhone})</span>
            </div>
            <div>
              <span className="text-rose-200 block text-[10px] uppercase font-bold">Chauffeur &amp; Vehicle:</span>
              <span className="font-bold text-white">{activeSOS[0].driverName} • {activeSOS[0].vehiclePlate}</span>
            </div>
            <div>
              <span className="text-rose-200 block text-[10px] uppercase font-bold">Coordinates:</span>
              <span className="font-bold text-white">{activeSOS[0].latitude}, {activeSOS[0].longitude}</span>
            </div>
            <div>
              <span className="text-rose-200 block text-[10px] uppercase font-bold">Dispatch Ref:</span>
              <span className="font-bold text-white">{activeSOS[0].policeAckRef}</span>
            </div>
          </div>
        </div>
      )}

      {/* Executive Command Header & Hub Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">
              Operations Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-600 font-mono">
              Live Fleet Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Fleet Operations Command
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Chauffeur deployment, reservation dispatch, and safety telemetry across Madhya Pradesh operational zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Zone Selector */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 text-xs font-semibold shadow-2xs">
            {["Vidisha (MP-40)", "Bhopal (MP-04)", "SH-19 Corridor"].map((zone) => (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeZone === zone
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <Link
            href="/live-map"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-semibold transition shadow-2xs inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Radar</span>
          </Link>

          <Link
            href="/concierge"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs inline-flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Operations Quick Guide / Plain Language Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700/80 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-extrabold tracking-tight text-white">
                  Operations Desk Master Reference (सरल ऑपरेशन्स गाइड)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  HOW EVERYTHING WORKS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Key rules for desk operators managing on-demand drivers, dispatches, and emergency safety.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowQuickGuide(!showQuickGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition cursor-pointer"
          >
            <span>{showQuickGuide ? "Hide Details" : "Show Quick Rules"}</span>
            {showQuickGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showQuickGuide && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-700/80 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>🚘 Private Chauffeur Model</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Drivers drive the <strong>customer&apos;s own car</strong> (sedan, SUV, or luxury). We do not own cabs or taxi fleets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>⏱️ Commute Allowance (~20-25m)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Chauffeurs need transit time to travel to the customer&apos;s garage. The app displays a realistic <strong>~20-25 min arrival timer</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <span>⚡ On-Demand (No Rigid Shifts)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Drivers are independent gig partners. They toggle <strong>Online/Offline</strong> when ready. No fixed shifts or penalties for resting.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <span>🔑 4-Digit Secret Start OTP</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Passenger provides 4-digit PIN upon arrival. Driver enters it in app to begin the meter (visible to admin in <strong>/trips</strong>).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <span>🔁 When to Re-assign Drivers</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Reassign only if: (1) Customer requests change, (2) Driver delayed &gt;10 mins, (3) Driver unreachable, or (4) Gearbox mismatch.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <span>🛡️ Police 112 &amp; ₹10L Insurance</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Every booking is insured for ₹10 Lakh transit liability. Emergency button directly rings National ERSS 112 Control Room (<strong>/emergency</strong>).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          title="Active Online Chauffeurs"
          value="1,482"
          change="+18.4%"
          changeType="positive"
          subtitle="94.2% verified with MoRTH Sarathi"
          icon={<Car className="w-4 h-4" />}
          accentColor="emerald"
        />
        <MetricCard
          title="Median Dispatch Latency"
          value="840 ms"
          change="-120 ms"
          changeType="positive"
          subtitle="Sub-second matching across operational zones"
          icon={<Clock className="w-4 h-4" />}
          accentColor="blue"
        />
        <MetricCard
          title="Daily Gross Bookings"
          value="₹14,82,500"
          change="+24.8%"
          changeType="positive"
          subtitle="Night safe-drop: 62% volume"
          icon={<CreditCard className="w-4 h-4" />}
          accentColor="amber"
        />
        <MetricCard
          title="Fleet Safety Index"
          value="98.2 / 100"
          change="+0.8 pt"
          changeType="positive"
          subtitle="Zero severe telematics alerts in 24 hours"
          icon={<ShieldCheck className="w-4 h-4" />}
          accentColor="purple"
        />
      </div>

      {/* Hub Operational Telemetry & Active Deployment */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Hub Operational Telemetry &amp; Availability
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time fleet readiness and geofence monitoring across <b>{activeZone}</b>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DISPATCH ENGINE: ONLINE (SLA 820ms)</span>
            </span>

            <button
              onClick={handleSimulateSOS}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 border border-slate-200 text-xs font-semibold transition cursor-pointer"
              title="Test Emergency Broadcast Workflow"
            >
              Test SOS Alert
            </button>
          </div>
        </div>

        {/* Operational Hub Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Active Hub Jurisdiction
            </span>
            <span className="font-extrabold text-slate-900 text-sm block">
              {activeZone}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {activeZone.includes("Vidisha") ? "RTO Hub MP-40" : "RTO Hub MP-04"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Verified Chauffeurs On Duty
            </span>
            <span className="font-extrabold text-emerald-700 text-sm block font-mono">
              18 Drivers Available
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              100% Police Verified &amp; Drug Tested
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Average Match Latency
            </span>
            <span className="font-extrabold text-slate-900 text-sm font-mono block">
              ~820 ms
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
              Real-time driver matching
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Geofence Enforcement
            </span>
            <span className="font-extrabold text-blue-700 text-sm block">
              Active Boundary Lock
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Out-of-zone bookings prevented
            </span>
          </div>
        </div>
      </div>

      {/* Operations Panels: Active Bookings & Pending KYC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time State Machine Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-900" />
              <span>Live Trip State Stream</span>
            </h2>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              Active Dispatches ({liveBookings.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Booking Code</th>
                  <th className="py-2.5 px-3">Service Tier</th>
                  <th className="py-2.5 px-3">Chauffeur &amp; Passenger</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3">Elapsed</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {liveBookings.map((b) => (
                  <tr key={b.bookingCode} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono text-slate-900 font-bold">{b.bookingCode}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {b.serviceType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900 font-bold">{b.driverName}</div>
                      <div className="text-[11px] text-slate-500">{b.customerName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          b.state === "IN_PROGRESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : b.state === "DRIVER_ARRIVED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : b.state === "COMPLETED"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {b.state === "IN_PROGRESS" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        )}
                        {b.state}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{b.fare}.00</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{b.startedAt}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTrackingTrip(b)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                          title="Track live trip on street map"
                        >
                          <MapPin className="w-3 h-3 text-slate-600" />
                          <span>Track</span>
                        </button>
                        {b.state !== "COMPLETED" && b.state !== "CANCELLED" && (
                          <button
                            onClick={() => {
                              setSelectedReassignTrip(b);
                              const alternate = approvedDrivers.find((d) => d.fullName !== b.driverName);
                              if (alternate) setTargetDriverId(alternate.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                            title="Re-assign to another chauffeur"
                          >
                            <RefreshCw className="w-3 h-3 text-amber-700" />
                            <span>Reassign</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver KYC Action Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>KYC Verification Queue</span>
              </h2>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  pendingDrivers.length > 0
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {pendingDrivers.length > 0 ? `${pendingDrivers.length} Pending` : "All Verified ✓"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Commercial driving license endorsement and background cross-match before deployment.
            </p>

            <div className="space-y-3">
              {pendingDrivers.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-center text-xs text-slate-500">
                  No drivers pending review. Active roster is 100% MoRTH verified.
                </div>
              ) : (
                pendingDrivers.slice(0, 3).map((drv) => (
                  <div
                    key={drv.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{drv.fullName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">DL: {drv.licenseNumber}</div>
                    </div>
                    <button
                      onClick={() => handleQuickApproveDriver(drv.id, drv.fullName)}
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition cursor-pointer"
                    >
                      ✓ Approve
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/kyc"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide transition text-center shadow-xs block"
          >
            Open Driver KYC Vault ({pendingDrivers.length} Pending) →
          </Link>
        </div>
      </div>

      {/* On-Demand Live Trip Tracking Street Map Modal */}
      {selectedTrackingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Live Telemetry: {selectedTrackingTrip.bookingCode}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] font-mono">
                      {selectedTrackingTrip.state}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Chauffeur <b>{selectedTrackingTrip.driverName}</b> driving for passenger <b>{selectedTrackingTrip.customerName}</b>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrackingTrip(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trip Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Service Tier
                </span>
                <span className="font-extrabold text-slate-900 text-xs">
                  {selectedTrackingTrip.serviceType.replace("_", " ")}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Locked Fare
                </span>
                <span className="font-extrabold text-slate-900 text-xs font-mono">
                  ₹{selectedTrackingTrip.fare}.00
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Elapsed Time
                </span>
                <span className="font-extrabold text-slate-900 text-xs font-mono">
                  {selectedTrackingTrip.startedAt}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Active Region
                </span>
                <span className="font-extrabold text-slate-900 text-xs">
                  Vidisha MP-40 Hub
                </span>
              </div>
            </div>

            {/* Interactive Live Street Map Canvas */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <RealStreetMap
                initialCity="VIDISHA"
                height="450px"
                animateCar={true}
                loopAnimation={true}
                showOtherDrivers={true}
                customTitle={`Live Tracking • ${selectedTrackingTrip.bookingCode}`}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 text-xs">
              <div className="text-slate-500 text-[11px] font-mono">
                Real-time GPS Telemetry Active
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=23.5262,77.8211&destination=23.5350,77.8115`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 font-semibold transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  onClick={() => setSelectedTrackingTrip(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
                >
                  Close Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reassign Chauffeur Operational Modal */}
      {selectedReassignTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Re-assign Chauffeur
                  </h3>
                  <p className="text-xs text-slate-500">
                    Booking Code: <b className="font-mono text-slate-900">{selectedReassignTrip.bookingCode}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReassignTrip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Trip Details Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Passenger:</span>
                <span className="font-bold text-slate-900">{selectedReassignTrip.customerName} ({selectedReassignTrip.customerPhone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Chauffeur:</span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {selectedReassignTrip.driverName} ({selectedReassignTrip.driverPhone})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Pickup Location:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[280px]" title={selectedReassignTrip.pickup}>
                  {selectedReassignTrip.pickup}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Trip Fare &amp; Status:</span>
                <span className="font-bold text-emerald-700">
                  ₹{selectedReassignTrip.fare}.00 • {selectedReassignTrip.state}
                </span>
              </div>
            </div>

            {/* Reason for Reassignment */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Reason for Chauffeur Re-assignment <span className="text-rose-500">*</span>
              </label>
              <select
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
              >
                <option value="DRIVER_UNRESPONSIVE">Chauffeur Unresponsive / Not moving towards pickup (SLA Timeout)</option>
                <option value="DRIVER_EMERGENCY">Chauffeur Reported Emergency / Health / Breakdown</option>
                <option value="CUSTOMER_REQUEST">Customer Requested Specific / Senior 5-Star Chauffeur</option>
                <option value="VEHICLE_MISMATCH">Customer Car Model / Transmission (Automatic / Luxury) Requirement</option>
                <option value="SHIFT_LIMIT">Chauffeur Duty Hours Limit Reached (Safety Compliance)</option>
              </select>
            </div>

            {/* Select Target Approved Driver */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Select Replacement Chauffeur <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {approvedDrivers
                  .filter((d) => d.fullName !== selectedReassignTrip.driverName)
                  .map((drv) => {
                    const isSelected = targetDriverId === drv.id;
                    return (
                      <div
                        key={drv.id}
                        onClick={() => setTargetDriverId(drv.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-400 ring-1 ring-amber-400"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700"
                          }`}>
                            {drv.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{drv.fullName}</span>
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                4.9 ★
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {drv.phone} • DL: {drv.licenseNumber}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <UserCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedReassignTrip(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReassign}
                disabled={!targetDriverId}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Confirm &amp; Re-assign Chauffeur</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
