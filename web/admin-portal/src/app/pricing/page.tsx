"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Save,
  RotateCcw,
  Edit3,
  Check,
  AlertCircle,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  Info,
  Percent,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Lock,
  Coins,
} from "lucide-react";
import Link from "next/link";
import {
  getPricingZones,
  updatePricingZone,
  addPricingZone,
  resetPricingToDefaults,
  calculateDetailedFare,
  PricingZone,
  DetailedFareBreakdown,
} from "@/lib/pricingStore";
import { getRegionsByZoneId, Region } from "@/lib/regionStore";
import { getAdminSession, canManagePricing, AdminUser } from "@/lib/adminAuthStore";

type MobilityMode = "NIGHT_DROP" | "HOURLY" | "OUTSTATION";

export default function PricingPage() {
  const [zones, setZones] = useState<PricingZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone-vidisha");
  const [activeTab, setActiveTab] = useState<"MANAGE" | "SIMULATE" | "MATRIX_TABLE">("MANAGE");

  // Admin Session & Super Admin Pricing Authority State
  const [adminSession, setAdminSession] = useState<AdminUser | null>(null);

  useEffect(() => {
    setAdminSession(getAdminSession());
    const handleSessionChange = () => setAdminSession(getAdminSession());
    window.addEventListener("admin_session_changed", handleSessionChange);
    return () => window.removeEventListener("admin_session_changed", handleSessionChange);
  }, []);

  // Pricing rule: ONLY Super Admin can modify platform fares, commission %, and surge multipliers
  const isSuperAdmin = Boolean(adminSession && canManagePricing(adminSession));

  // Edit Form State for currently selected zone
  const [editForm, setEditForm] = useState<PricingZone | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Simulation Sandbox State
  const [simMode, setSimMode] = useState<MobilityMode>("NIGHT_DROP");
  const [simDistanceKm, setSimDistanceKm] = useState<number>(18);
  const [simHours, setSimHours] = useState<number>(4);
  const [simDays, setSimDays] = useState<number>(2);
  const [simTip, setSimTip] = useState<number>(50);

  // Add Zone Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCityName, setNewCityName] = useState<string>("");
  const [newStateName, setNewStateName] = useState<string>("Madhya Pradesh");

  // Load zones on mount
  const refreshZones = (preferredId?: string) => {
    const list = getPricingZones();
    setZones(list);
    const target = preferredId
      ? list.find((z) => z.id === preferredId) || list[0]
      : list.find((z) => z.id === selectedZoneId) || list[0];
    if (target) {
      setSelectedZoneId(target.id);
      setEditForm({ ...target });
    }
  };

  useEffect(() => {
    refreshZones();
  }, []);

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const target = zones.find((z) => z.id === zoneId);
    if (target) {
      setEditForm({ ...target });
    }
  };

  const handleFieldChange = (field: keyof PricingZone, value: any) => {
    if (!editForm) return;
    if (!isSuperAdmin) return;
    setEditForm({
      ...editForm,
      [field]: typeof value === "number" ? Math.max(0, value) : value,
    });
  };

  const handleSaveChanges = () => {
    if (!isSuperAdmin) {
      alert("Access Denied: Pricing matrix modifications are strictly restricted to Super Admin. Region Managers operate in Read-Only Mode.");
      return;
    }
    if (!editForm) return;
    updatePricingZone(editForm);
    refreshZones(editForm.id);
    setSaveSuccessToast(`Pricing Matrix updated & saved for ${editForm.cityName}!`);
    setTimeout(() => setSaveSuccessToast(null), 4000);
  };

  const handleResetDefaults = () => {
    if (!isSuperAdmin) {
      alert("Access Denied: Resetting the platform pricing matrix requires Super Admin authorization.");
      return;
    }
    if (window.confirm("Reset all pricing matrix rates to official Sathi factory defaults?")) {
      const defs = resetPricingToDefaults();
      setZones(defs);
      setSelectedZoneId(defs[0].id);
      setEditForm({ ...defs[0] });
      setSaveSuccessToast("Pricing Matrix successfully reset to defaults.");
      setTimeout(() => setSaveSuccessToast(null), 3500);
    }
  };

  const handleCreateNewZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert("Access Denied: Only Super Admin can create new pricing zones.");
      return;
    }
    if (!newCityName.trim()) return;

    const created = addPricingZone({
      cityName: newCityName.trim(),
      stateName: newStateName.trim(),
      currency: "INR",
      hourlyBaseHours: 2,
      hourlyBaseFare: 349,
      hourlyExtraHourRate: 99,
      hourlyExtraKmRate: 12,
      nightBaseFare: 299,
      nightPerKmRate: 14,
      nightSurchargeMultiplier: 1.25,
      driverReturnAllowance: 150,
      outstationDailyRate: 1799,
      outstationDriverAllowance: 350,
      freeWaitMinutes: 10,
      demurrageRatePerMinute: 3.0,
      convenienceFee: 30,
      commissionPct: 20,
      gstPct: 5,
      isActive: true,
    });

    setNewCityName("");
    setShowAddModal(false);
    refreshZones(created.id);
    setSaveSuccessToast(`New pricing zone '${created.cityName}' created successfully!`);
    setTimeout(() => setSaveSuccessToast(null), 4000);
  };

  const activeZone = editForm || zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Calculate detailed fare breakdown in real time for sandbox
  const simulationBreakdown: DetailedFareBreakdown | null = activeZone
    ? calculateDetailedFare(
        activeZone,
        simMode,
        simDistanceKm,
        simHours,
        simDays,
        simTip,
        activeZone.cityName.toLowerCase().includes("vidisha") ? { lat: 23.5312, lng: 77.8175 } : undefined
      )
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Multi-Zone Pricing Matrix Manager</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  ADMIN ENGINE • LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure base fares, per-KM rates, night surge, chauffeur return allowances, and platform commission.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (!isSuperAdmin) {
                alert("Only Super Admin can create or add new pricing zones.");
                return;
              }
              setShowAddModal(true);
            }}
            disabled={!isSuperAdmin}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
              isSuperAdmin
                ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            {isSuperAdmin ? (
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Add City / Zone</span>
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={!isSuperAdmin}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 shadow-xs ${
              isSuperAdmin
                ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer"
                : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
            }`}
            title={isSuperAdmin ? "Reset matrix to factory defaults" : "Super Admin only"}
          >
            {isSuperAdmin ? (
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Super Admin Pricing Authority Banner */}
      {!isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Lock className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>Super Admin Pricing Lock Active</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                  READ-ONLY AUDIT MODE
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Signed in as <b>{adminSession?.name}</b> ({adminSession?.roleLabel}). Per company governance policy,
                <b> pricing is strictly controlled by Super Admin</b>. Regional Managers and staff have full visibility
                to simulate fares and review matrix rates, but cannot alter live tariffs or commission percentages.
              </p>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Super Admin Only</span>
          </div>
        </div>
      )}

      {isSuperAdmin && adminSession && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <b>Super Admin Pricing Authority Active:</b> You have full read/write privileges to modify multi-zone tariff rates, platform commission, and night surcharges.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold shrink-0 border border-emerald-300">
            SUPER_ADMIN • {adminSession.email}
          </span>
        </div>
      )}

      {/* Save Toast Banner */}
      {saveSuccessToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessToast}</span>
          </div>
          <button onClick={() => setSaveSuccessToast(null)} className="text-emerald-700 hover:text-emerald-950">
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("MANAGE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "MANAGE"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Zone Matrix Editor</span>
          </button>

          <button
            onClick={() => setActiveTab("SIMULATE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "SIMULATE"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Fare & Payout Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("MATRIX_TABLE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "MATRIX_TABLE"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cross-Zone Comparison Matrix</span>
          </button>
        </div>

        {/* Selected Zone Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Active Zone:
          </span>
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => handleSelectZone(z.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
                selectedZoneId === z.id
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>{z.cityName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: ZONE MATRIX EDITOR (ADMIN MANAGEMENT)                         */}
      {/* ==================================================================== */}
      {activeTab === "MANAGE" && editForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form to Edit Matrix Rules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Zone Identity Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Configuring Regional Matrix
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{editForm.cityName}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-normal bg-slate-100 text-slate-600 border border-slate-200">
                    {editForm.stateName}
                  </span>
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  Zone ID: {editForm.id} • Last Updated: {editForm.updatedAt}
                </div>
              </div>

              {isSuperAdmin ? (
                <button
                  onClick={handleSaveChanges}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition flex items-center gap-2 shadow-sm transform active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>SAVE PRICING MATRIX</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Super Admin Only</span>
                </div>
              )}
            </div>

            {/* Zone Service Boundary & Geofence (1 Zone = 1 Region) */}
            {(() => {
              const matchedRegion = getRegionsByZoneId(editForm.id)[0];
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>Zone Service Boundary (Geofence)</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          matchedRegion?.isActive ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}>
                          {matchedRegion?.isActive ? "● DISPATCH ONLINE" : "○ SUSPENDED"}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Geographic territory where {editForm.cityName} tariff rates apply for chauffeur dispatch.
                      </p>
                    </div>

                    <Link
                      href="/regions"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View &amp; Edit Boundary</span>
                    </Link>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {matchedRegion ? matchedRegion.name : editForm.cityName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Area: <b>{matchedRegion ? matchedRegion.areaKm2.toFixed(1) : "35.0"} km²</b> • Center:{" "}
                        <span className="font-mono text-slate-700">
                          {matchedRegion ? `${matchedRegion.center[0].toFixed(4)}°N, ${matchedRegion.center[1].toFixed(4)}°E` : "Vidisha Centroid"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/regions"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Manage Geofences</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Matrix Form Sections */}
            <fieldset disabled={!isSuperAdmin} className={`space-y-6 ${!isSuperAdmin ? "opacity-90" : ""}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Section 1: Hourly Chauffeur Package */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Hourly Chauffeur Service</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Included Base Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={editForm.hourlyBaseHours}
                        onChange={(e) => handleFieldChange("hourlyBaseHours", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">Hours</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Base Fare (Initial Package)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={99}
                        max={2000}
                        value={editForm.hourlyBaseFare}
                        onChange={(e) => handleFieldChange("hourlyBaseFare", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Extra Hour Rate (Beyond Base)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={20}
                        max={500}
                        value={editForm.hourlyExtraHourRate}
                        onChange={(e) => handleFieldChange("hourlyExtraHourRate", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ hour</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Extra Distance Charge
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={editForm.hourlyExtraKmRate}
                        onChange={(e) => handleFieldChange("hourlyExtraKmRate", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Night Safe-Drop Package */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Night Safe-Drop (10 PM - 6 AM)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Base Booking Charge
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={99}
                        max={1500}
                        value={editForm.nightBaseFare}
                        onChange={(e) => handleFieldChange("nightBaseFare", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Running Distance Rate
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={8}
                        max={40}
                        value={editForm.nightPerKmRate}
                        onChange={(e) => handleFieldChange("nightPerKmRate", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ km</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Night Surge Multiplier (10 PM - 6 AM)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.05}
                        min={1.0}
                        max={2.5}
                        value={editForm.nightSurchargeMultiplier}
                        onChange={(e) =>
                          handleFieldChange("nightSurchargeMultiplier", parseFloat(e.target.value) || 1.0)
                        }
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-emerald-700 font-bold text-xs whitespace-nowrap">
                        +{Math.round((editForm.nightSurchargeMultiplier - 1) * 100)}% Surge
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Driver Return Allowance (Direct to Driver)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={50}
                        max={600}
                        value={editForm.driverReturnAllowance}
                        onChange={(e) => handleFieldChange("driverReturnAllowance", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ trip</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Outstation Daily Trips */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Outstation Multi-Day Packages</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Daily Chauffeur Fee (250 km included)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={800}
                        max={5000}
                        value={editForm.outstationDailyRate}
                        onChange={(e) => handleFieldChange("outstationDailyRate", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ day</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Driver Food & Overnight Stay Allowance
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={100}
                        max={1000}
                        value={editForm.outstationDriverAllowance}
                        onChange={(e) =>
                          handleFieldChange("outstationDriverAllowance", Number(e.target.value))
                        }
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                      <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">/ day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Waiting Time, Platform Take-Rate & Taxes */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Waiting, Take-Rate & Taxes</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Free Wait Time</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={5}
                          max={60}
                          value={editForm.freeWaitMinutes}
                          onChange={(e) => handleFieldChange("freeWaitMinutes", Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-500 font-semibold">min</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Demurrage Rate</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step={0.5}
                          min={1}
                          max={15}
                          value={editForm.demurrageRatePerMinute}
                          onChange={(e) =>
                            handleFieldChange("demurrageRatePerMinute", parseFloat(e.target.value) || 2.0)
                          }
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-500 font-semibold">₹/min</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">Platform Commission</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={5}
                          max={35}
                          value={editForm.commissionPct}
                          onChange={(e) => handleFieldChange("commissionPct", Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-500 font-semibold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-600 font-semibold block mb-1">GST Rate</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={18}
                          value={editForm.gstPct}
                          onChange={(e) => handleFieldChange("gstPct", Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-500 font-semibold">%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Convenience Fee</label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editForm.convenienceFee}
                        onChange={(e) => handleFieldChange("convenienceFee", Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

            {/* Bottom Save Action Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-md">
              <div className="text-xs">
                {isSuperAdmin ? (
                  <>
                    <span className="font-bold text-emerald-400">Ready to publish rates?</span> Changes take effect
                    immediately in customer bookings and simulator.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-amber-400">Pricing changes locked:</span> Super Admin authorization
                    is required to update regional tariffs &amp; platform commissions.
                  </>
                )}
              </div>
              {isSuperAdmin ? (
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>SAVE CHANGES NOW</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center gap-2 cursor-not-allowed border border-slate-700"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>SUPER ADMIN ONLY</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Col: Instant Live Preview Ledger */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-extrabold text-slate-900 text-sm">Real-Time Sample Payout</h4>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                  {editForm.cityName}
                </span>
              </div>

              {simulationBreakdown && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Sample Test Trip</div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Service Mode:</span>
                      <span className="text-slate-900">{simMode.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Trip Distance:</span>
                      <span className="font-mono font-bold">{simDistanceKm} km</span>
                    </div>
                    {simulationBreakdown.geofenceBoundaryNote && (
                      <div className="pt-1 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 border-t border-slate-200 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{simulationBreakdown.geofenceBoundaryNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Fare Itemization */}
                  <div className="space-y-2 border-b border-slate-100 pb-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Service Fare</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.baseFare}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Distance Charge ({simDistanceKm} km)</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.distanceFare}</span>
                    </div>
                    {simulationBreakdown.nightSurgeFare > 0 && (
                      <div className="flex justify-between text-amber-700 font-medium">
                        <span>Night Surcharge ({Math.round((simulationBreakdown.nightSurgeMultiplier - 1) * 100)}%)</span>
                        <span className="font-mono font-bold">₹{simulationBreakdown.nightSurgeFare}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-blue-700">
                      <span>Chauffeur Return Allowance</span>
                      <span className="font-mono font-bold">₹{simulationBreakdown.driverReturnAllowance}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Transit Guarantee (₹10L Policy)</span>
                      <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST ({simulationBreakdown.gstPct}%)</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.gstAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Convenience Fee</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.convenienceFee}</span>
                    </div>
                  </div>

                  {/* Total Customer Fare */}
                  <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Customer Total Bill</div>
                      <div className="text-xl font-black font-mono text-emerald-400">
                        ₹{simulationBreakdown.totalCustomerFare}.00
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                      All-Inclusive
                    </span>
                  </div>

                  {/* Payout Split */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase flex items-center justify-between">
                      <span>Transparent Revenue Split</span>
                      <span>No Hidden Fees</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs">
                      <span>Net Driver Payout (80% + Return):</span>
                      <span className="text-emerald-700 font-mono text-sm">
                        ₹{simulationBreakdown.netDriverEarnings}.00
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Platform Commission ({editForm.commissionPct}%):</span>
                      <span className="font-mono font-semibold">₹{simulationBreakdown.platformCommission}.00</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: LIVE FARE & PAYOUT SANDBOX                                    */}
      {/* ==================================================================== */}
      {activeTab === "SIMULATE" && simulationBreakdown && activeZone && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Controls */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Mobility Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "NIGHT_DROP", label: "Night Safe" },
                  { id: "HOURLY", label: "Hourly Chauffeur" },
                  { id: "OUTSTATION", label: "Outstation" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSimMode(m.id as MobilityMode)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center ${
                      simMode === m.id
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Simulated Trip Distance</span>
                  <span className="text-slate-900 font-mono font-bold">{simDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={250}
                  value={simDistanceKm}
                  onChange={(e) => setSimDistanceKm(Number(e.target.value))}
                  className="w-full accent-slate-900 bg-slate-100 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {simMode === "HOURLY" && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Package Hours</span>
                    <span className="text-purple-700 font-mono font-bold">{simHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={simHours}
                    onChange={(e) => setSimHours(Number(e.target.value))}
                    className="w-full accent-purple-600 bg-slate-100 rounded-lg h-2 cursor-pointer"
                  />
                </div>
              )}

              {simMode === "OUTSTATION" && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Trip Duration (Days)</span>
                    <span className="text-amber-800 font-mono font-bold">{simDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={simDays}
                    onChange={(e) => setSimDays(Number(e.target.value))}
                    className="w-full accent-amber-600 bg-slate-100 rounded-lg h-2 cursor-pointer"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Rider Tip (100% to Driver)</span>
                  <span className="text-emerald-700 font-mono font-bold">₹{simTip}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 50, 100, 200].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSimTip(t)}
                      className={`flex-1 py-1 rounded text-xs font-bold border transition ${
                        simTip === t
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {t === 0 ? "No Tip" : `+₹${t}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Rules in Effect ({activeZone.cityName}):</div>
              <div>• Base Fare: ₹{simulationBreakdown.baseFare}</div>
              <div>• Per KM: ₹{simulationBreakdown.perKmRate}/km</div>
              <div>• Free Wait: {simulationBreakdown.freeWaitMinutes} mins included</div>
              <div>• Platform Take-Rate: {activeZone.commissionPct}%</div>
            </div>
          </div>

          {/* Right 2 Cols: Detailed Itemized Statement */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Itemized Fare Breakdown & Payout Statement</h3>
                <p className="text-xs text-slate-500">Live generated breakdown shown to customers upon booking</p>
              </div>
              <span className="text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Verified Transparent Ledger
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer View */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Customer Invoice</span>
                  <span className="text-slate-400 font-mono">RECEIPT</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Base Chauffeur Service</span>
                    <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.baseFare}.00</span>
                  </div>
                  {simulationBreakdown.extraTimeFare > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Extra Hours Rate</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.extraTimeFare}.00</span>
                    </div>
                  )}
                  {simulationBreakdown.distanceFare > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Distance ({simDistanceKm} km)</span>
                      <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.distanceFare}.00</span>
                    </div>
                  )}
                  {simulationBreakdown.nightSurgeFare > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-amber-800">
                      <span>Night Surge (+{Math.round((simulationBreakdown.nightSurgeMultiplier - 1) * 100)}%)</span>
                      <span className="font-mono font-bold">₹{simulationBreakdown.nightSurgeFare}.00</span>
                    </div>
                  )}
                  {simulationBreakdown.driverReturnAllowance > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-blue-800">
                      <span>Chauffeur Night Return Allowance</span>
                      <span className="font-mono font-bold">₹{simulationBreakdown.driverReturnAllowance}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                    <span>Sathi Transit Guarantee</span>
                    <span className="font-bold">₹0.00 (Free)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">GST ({simulationBreakdown.gstPct}%)</span>
                    <span className="font-mono font-bold text-slate-900">₹{simulationBreakdown.gstAmount}.00</span>
                  </div>
                  {simTip > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                      <span>Chauffeur Tip (100% to Driver)</span>
                      <span className="font-mono">₹{simTip}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
                    <span>Total Fare Charged</span>
                    <span className="font-mono text-emerald-600">₹{simulationBreakdown.totalCustomerFare}.00</span>
                  </div>
                </div>
              </div>

              {/* Driver Partner View */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Driver Partner Settlement</span>
                  <span className="text-slate-400 font-mono">CREDIT</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Operational Fare Base</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{simulationBreakdown.totalCustomerFare - simulationBreakdown.driverReturnAllowance - simulationBreakdown.convenienceFee - simulationBreakdown.gstAmount - simTip}.00
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-red-600">
                    <span>Platform Commission ({activeZone.commissionPct}%)</span>
                    <span className="font-mono font-bold">-₹{simulationBreakdown.platformCommission}.00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                    <span>Return Allowance (100% Driver)</span>
                    <span className="font-mono">+₹{simulationBreakdown.driverReturnAllowance}.00</span>
                  </div>
                  {simTip > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                      <span>Rider Tip (100% Driver)</span>
                      <span className="font-mono">+₹{simTip}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
                    <span>Net Instant Wallet Credit</span>
                    <span className="font-mono text-emerald-600">₹{simulationBreakdown.netDriverEarnings}.00</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                  <b>Driver Retention Guarantee:</b> Chauffeur retains ~
                  {Math.round((simulationBreakdown.netDriverEarnings / simulationBreakdown.totalCustomerFare) * 100)}%
                  of customer billing. Dispatched directly to UPI.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: CROSS-ZONE COMPARISON MATRIX TABLE                            */}
      {/* ==================================================================== */}
      {activeTab === "MATRIX_TABLE" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">All Configured Regional Pricing Matrices</h3>
              <p className="text-xs text-slate-500">Side-by-side comparison across Madhya Pradesh and metro corridors</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              + Add New Region
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <th className="p-3">Region / Zone</th>
                  <th className="p-3">Hourly Base</th>
                  <th className="p-3">Night Base</th>
                  <th className="p-3">Night /KM</th>
                  <th className="p-3">Night Surge</th>
                  <th className="p-3">Return Allowance</th>
                  <th className="p-3">Commission %</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{z.cityName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">{z.stateName}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold">
                      ₹{z.hourlyBaseFare} ({z.hourlyBaseHours}h)
                    </td>
                    <td className="p-3 font-mono font-semibold">₹{z.nightBaseFare}</td>
                    <td className="p-3 font-mono font-semibold">₹{z.nightPerKmRate}/km</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">
                      {z.nightSurchargeMultiplier}x (+{Math.round((z.nightSurchargeMultiplier - 1) * 100)}%)
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">₹{z.driverReturnAllowance}</td>
                    <td className="p-3 font-mono font-bold">{z.commissionPct}%</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          handleSelectZone(z.id);
                          setActiveTab("MANAGE");
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold text-[11px] transition"
                      >
                        Edit Matrix
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New City/Zone */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Pricing Region</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewZone} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">City / Region Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indore (MP-09) or Ujjain (MP-13)"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">State / Territory</label>
                <input
                  type="text"
                  required
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                New zone will be initialized with Sathi baseline rates for quick configuration.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Create Zone Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
