"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Trash2,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Upload,
  Check,
  X,
  ExternalLink,
  Copy,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Compass,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  UserCheck,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import {
  getRegions,
  addRegion,
  deleteRegion,
  toggleRegionActive,
  generateRadialPolygon,
  assignRegionManager,
  Region,
} from "@/lib/regionStore";
import {
  getPricingZones,
  addPricingZone,
  updatePricingZone,
  PricingZone,
} from "@/lib/pricingStore";
import { parseKMLString, ParsedKMLRegion } from "@/lib/kmlParser";
import RealStreetMap from "@/components/RealStreetMap";

const LANDMARK_PRESETS = [
  { name: "Vidisha Railway Station Road", lat: 23.5262, lng: 77.8211, defaultRadius: 8, rto: "MP-40" },
  { name: "Vidisha Collectorate / Civil Lines", lat: 23.5350, lng: 77.8115, defaultRadius: 6, rto: "MP-40" },
  { name: "Sanchi Stupa Heritage Gate (SH-19)", lat: 23.4793, lng: 77.7397, defaultRadius: 10, rto: "MP-40" },
  { name: "DB City Mall / MP Nagar Zone-1, Bhopal", lat: 23.2332, lng: 77.4334, defaultRadius: 12, rto: "MP-04" },
  { name: "Raja Bhoj International Airport, Bhopal", lat: 23.2875, lng: 77.3378, defaultRadius: 8, rto: "MP-04" },
  { name: "Rani Kamlapati Station & Arera Colony, Bhopal", lat: 23.2167, lng: 77.4398, defaultRadius: 10, rto: "MP-04" },
  { name: "Dewanganj & Salamatpur Highway Hub (SH-19)", lat: 23.4010, lng: 77.6250, defaultRadius: 14, rto: "MP-40/04" },
  { name: "Vijay Nagar / AB Road, Indore", lat: 22.7533, lng: 75.8937, defaultRadius: 12, rto: "MP-09" },
];

function UnifiedZonesContent() {
  const [zones, setZones] = useState<Region[]>([]);
  const [pricingList, setPricingList] = useState<PricingZone[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [viewMapZone, setViewMapZone] = useState<Region | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal: Add Operating Zone
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [creationMode, setCreationMode] = useState<"RADIUS" | "KML">("RADIUS");
  const [zoneName, setZoneName] = useState<string>("");
  const [rtoCode, setRtoCode] = useState<string>("MP-40");
  const [stateName, setStateName] = useState<string>("Madhya Pradesh");
  const [isInitialActive, setIsInitialActive] = useState<boolean>(true);
  const [hourlyBaseFare, setHourlyBaseFare] = useState<number>(299);
  const [nightPerKmRate, setNightPerKmRate] = useState<number>(12);
  const [formError, setFormError] = useState<string>("");

  // Radial Mode State
  const [centerLat, setCenterLat] = useState<number>(23.5262);
  const [centerLng, setCenterLng] = useState<number>(77.8211);
  const [radiusKm, setRadiusKm] = useState<number>(8);

  // KML Mode State
  const [kmlFileText, setKmlFileText] = useState<string>("");
  const [parsedPreview, setParsedPreview] = useState<ParsedKMLRegion | null>(null);

  // Modal: Assign Region Manager
  const [assignModalZone, setAssignModalZone] = useState<Region | null>(null);
  const [mgrName, setMgrName] = useState<string>("");
  const [mgrEmail, setMgrEmail] = useState<string>("");
  const [mgrPhone, setMgrPhone] = useState<string>("");

  const handleOpenAssignManager = (zone: Region) => {
    setAssignModalZone(zone);
    setMgrName(zone.managerName || "");
    setMgrEmail(zone.managerEmail || "");
    setMgrPhone(zone.managerPhone || "");
  };

  const handleSaveManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalZone) return;
    assignRegionManager(assignModalZone.id, mgrName.trim(), mgrEmail.trim(), mgrPhone.trim());
    refreshData();
    setAssignModalZone(null);
  };

  const refreshData = () => {
    setZones(getRegions());
    setPricingList(getPricingZones());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggle = (id: string) => {
    toggleRegionActive(id);
    refreshData();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete operating zone "${name}"? Chauffeur dispatch will be disabled here.`)) {
      deleteRegion(id);
      refreshData();
    }
  };

  const handleCopyCoords = (id: string, lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectLandmarkPreset = (presetName: string) => {
    const lm = LANDMARK_PRESETS.find((p) => p.name === presetName);
    if (!lm) return;
    setCenterLat(lm.lat);
    setCenterLng(lm.lng);
    setRadiusKm(lm.defaultRadius);
    setRtoCode(lm.rto);
    if (!zoneName) {
      setZoneName(`${lm.name} Zone`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setKmlFileText(text);
        const parsed = parseKMLString(text, file.name.replace(/\.[^/.]+$/, ""));
        if (parsed.polygonCoords.length === 0) {
          setFormError("No polygon coordinates found in this KML file. Please ensure it contains <Polygon> data.");
          setParsedPreview(null);
        } else {
          setParsedPreview(parsed);
          if (!zoneName) setZoneName(parsed.name);
          setCenterLat(parsed.center[0]);
          setCenterLng(parsed.center[1]);
        }
      } catch (err: any) {
        setFormError(`Failed to parse KML: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveZone = () => {
    setFormError("");
    if (!zoneName.trim()) {
      setFormError("Please enter a Zone Name.");
      return;
    }

    let finalCoords: [number, number][] = [];
    let googleCoords: { lat: number; lng: number }[] = [];
    let finalAreaKm2 = 0;
    let finalCenter: [number, number] = [centerLat, centerLng];
    let finalZoom = 13;

    if (creationMode === "RADIUS") {
      finalCoords = generateRadialPolygon(centerLat, centerLng, radiusKm, 18);
      googleCoords = finalCoords.map(([lat, lng]) => ({ lat, lng }));
      finalAreaKm2 = Math.round(Math.PI * radiusKm * radiusKm * 10) / 10;
      finalZoom = radiusKm > 15 ? 11 : radiusKm > 8 ? 12 : 13;
    } else {
      if (!parsedPreview || parsedPreview.polygonCoords.length === 0) {
        setFormError("Please upload or parse a valid KML file with polygon coordinates.");
        return;
      }
      finalCoords = parsedPreview.polygonCoords;
      googleCoords = parsedPreview.googlePolygonCoords;
      finalAreaKm2 = parsedPreview.areaKm2 || 25.5;
      finalCenter = parsedPreview.center;
      finalZoom = parsedPreview.zoom;
    }

    // 1. Save as Operating Region / Geofence
    const createdRegion = addRegion({
      name: zoneName.trim(),
      rtoCode: rtoCode.trim().toUpperCase() || "MP-40",
      state: stateName.trim() || "Madhya Pradesh",
      center: finalCenter,
      zoom: finalZoom,
      areaKm2: finalAreaKm2,
      polygonCoords: finalCoords,
      googlePolygonCoords: googleCoords,
      isActive: isInitialActive,
    });

    // 2. Also register in Pricing Matrix so Zone & Pricing are 100% unified!
    try {
      addPricingZone({
        cityName: zoneName.trim(),
        stateName: stateName.trim() || "Madhya Pradesh",
        currency: "INR",
        hourlyBaseHours: 2,
        hourlyBaseFare,
        hourlyExtraHourRate: 89,
        hourlyExtraKmRate: 11,
        nightBaseFare: 249,
        nightPerKmRate,
        nightSurchargeMultiplier: 1.20,
        driverReturnAllowance: 120,
        outstationDailyRate: 1599,
        outstationDriverAllowance: 300,
        freeWaitMinutes: 10,
        demurrageRatePerMinute: 2.5,
        convenienceFee: 25,
        commissionPct: 18,
        gstPct: 5,
        isActive: isInitialActive,
      });
    } catch (e) {
      // Ignored if already registered
    }

    refreshData();
    setShowCreateModal(false);
    setZoneName("");
    setKmlFileText("");
    setParsedPreview(null);
  };

  const previewPolygon =
    creationMode === "RADIUS"
      ? generateRadialPolygon(centerLat, centerLng, radiusKm, 18)
      : parsedPreview?.polygonCoords || [];

  const filteredZones = zones.filter((z) => {
    const matchesSearch =
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.rtoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && z.isActive) ||
      (statusFilter === "INACTIVE" && !z.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Operating Zones &amp; Geofences
              </h1>
              <p className="text-xs text-slate-500">
                Each zone defines the geographic boundary, tariff rules, and chauffeur dispatch availability for that territory.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Tariff Rates</span>
          </Link>

          <button
            onClick={() => {
              setFormError("");
              setShowCreateModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Operating Zone</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Operating Zones
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{zones.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Configured territories</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online (Open for Booking)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {zones.filter((z) => z.isActive).length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Dispatches active</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Suspended</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {zones.filter((z) => !z.isActive).length}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Bookings paused</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Total Service Area
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {zones.reduce((acc, z) => acc + (z.areaKm2 || 0), 0).toFixed(1)} km²
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Geofence coverage</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search zones by name, RTO code (MP-40), or state..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Zones ({zones.length})
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === "ACTIVE"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Online ({zones.filter((z) => z.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter("INACTIVE")}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === "INACTIVE"
                ? "bg-white text-rose-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Suspended ({zones.filter((z) => !z.isActive).length})
          </button>
        </div>
      </div>

      {/* Operating Zones List */}
      <div className="space-y-4">
        {filteredZones.map((zone) => {
          const isExpanded = expandedZoneId === zone.id;
          const matchedPricing = pricingList.find(
            (p) => p.id === zone.id || p.cityName.toLowerCase() === zone.name.toLowerCase()
          );

          return (
            <div
              key={zone.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs transition hover:shadow-md space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200">
                      {zone.rtoCode}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                        zone.isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          zone.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      />
                      <span>{zone.isActive ? "ONLINE & DISPATCHING" : "SUSPENDED (OFF)"}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {zone.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {zone.state} • Service Geofence: <b>{zone.areaKm2.toFixed(1)} km²</b> • Boundary Vertices:{" "}
                    <b>{zone.polygonCoords.length} pts</b>
                  </p>
                </div>

                {/* Status Toggle & Fare Pill */}
                <div className="flex items-center gap-3">
                  {matchedPricing && (
                    <div className="text-right hidden sm:block text-xs">
                      <div className="font-extrabold text-slate-900">
                        ₹{matchedPricing.hourlyBaseFare} <span className="text-[10px] font-normal text-slate-400">({matchedPricing.hourlyBaseHours}h)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Night: ₹{matchedPricing.nightBaseFare} • ₹{matchedPricing.nightPerKmRate}/km
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleToggle(zone.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      zone.isActive
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    }`}
                  >
                    {zone.isActive ? "✓ Online" : "Turn Online"}
                  </button>
                </div>
              </div>

              {/* Region Manager / Hub Operations Lead */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {zone.managerName ? zone.managerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "RM"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {zone.managerName || "Unassigned Region Manager"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                        HUB OPERATIONS LEAD
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 mt-0.5 font-mono">
                      {zone.managerEmail && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{zone.managerEmail}</span>
                        </span>
                      )}
                      {zone.managerPhone && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{zone.managerPhone}</span>
                        </span>
                      )}
                      {!zone.managerEmail && (
                        <span className="text-amber-600 font-sans">No city manager assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAssignManager(zone)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{zone.managerName ? "Change Manager" : "Assign Manager"}</span>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewMapZone(zone)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Geofence Map</span>
                  </button>

                  <Link
                    href={`/pricing`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Tariff Rates</span>
                  </Link>

                  <button
                    onClick={() => setExpandedZoneId(isExpanded ? null : zone.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isExpanded ? "Hide Details" : "Boundary Coordinates"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleCopyCoords(zone.id, zone.center[0], zone.center[1])}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-mono text-[11px] border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>
                      {copiedId === zone.id
                        ? "Copied!"
                        : `${zone.center[0].toFixed(4)}°N, ${zone.center[1].toFixed(4)}°E`}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(zone.id, zone.name)}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Expandable Boundary Coordinates */}
              {isExpanded && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>PostGIS Raycasting Boundary Telemetry (Centroid: {zone.center[0].toFixed(4)}°N, {zone.center[1].toFixed(4)}°E)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 max-h-28 overflow-y-auto space-y-1">
                    {zone.polygonCoords.slice(0, 8).map((pt, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-400">Vertex #{idx + 1}:</span>
                        <span className="font-semibold text-slate-800">
                          [{pt[0].toFixed(5)}, {pt[1].toFixed(5)}]
                        </span>
                      </div>
                    ))}
                    {zone.polygonCoords.length > 8 && (
                      <div className="text-slate-400 italic text-[10px] pt-1">
                        ... and {zone.polygonCoords.length - 8} more boundary vertices verified.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* MODAL: ADD OPERATING ZONE                                            */}
      {/* ==================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Add Operating Zone
                </h3>
                <p className="text-xs text-slate-500">
                  Set the geographic territory and tariff rates for the new operating zone.
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Zone Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Zone Name
                  </label>
                  <input
                    type="text"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    placeholder="e.g. Indore (MP-09) or Ujjain (MP-13)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    RTO Code
                  </label>
                  <input
                    type="text"
                    value={rtoCode}
                    onChange={(e) => setRtoCode(e.target.value)}
                    placeholder="MP-09"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Boundary Creation Mode Selector */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
                    Service Boundary Geofence
                  </label>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCreationMode("RADIUS")}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        creationMode === "RADIUS"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Point &amp; Radius KM
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode("KML")}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                        creationMode === "KML"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Upload KML
                    </button>
                  </div>
                </div>

                {creationMode === "RADIUS" ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                        Quick Landmark Center Preset
                      </label>
                      <select
                        onChange={(e) => handleSelectLandmarkPreset(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white text-xs cursor-pointer"
                      >
                        <option value="">-- Choose Center Landmark --</option>
                        {LANDMARK_PRESETS.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} ({p.rto})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Center Latitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={centerLat}
                          onChange={(e) => setCenterLat(parseFloat(e.target.value) || 0)}
                          className="w-full p-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Center Longitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={centerLng}
                          onChange={(e) => setCenterLng(parseFloat(e.target.value) || 0)}
                          className="w-full p-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Operational Service Radius</span>
                        <span className="text-emerald-700 font-mono font-extrabold">{radiusKm} KM ({Math.round(Math.PI * radiusKm * radiusKm)} km² Area)</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="35"
                        step="1"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Choose .kml File from Google Earth
                    </label>
                    <input
                      type="file"
                      accept=".kml,.xml"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                        Or Paste KML XML String
                      </label>
                      <textarea
                        rows={3}
                        value={kmlFileText}
                        onChange={(e) => setKmlFileText(e.target.value)}
                        placeholder="<coordinates>77.8211,23.5262,0 ...</coordinates>"
                        className="w-full p-2 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Initial Tariff Rates */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-xs block">
                  Initial Tariff Rates for this Zone
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                      Hourly Chauffeur Base Fare
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min={99}
                        value={hourlyBaseFare}
                        onChange={(e) => setHourlyBaseFare(parseInt(e.target.value) || 299)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                      Night Per KM Rate
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min={8}
                        value={nightPerKmRate}
                        onChange={(e) => setNightPerKmRate(parseInt(e.target.value) || 12)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      />
                      <span className="text-slate-400 text-[10px]">/km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dispatch Availability Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    Immediate Customer Booking Availability
                  </span>
                  <span className="text-[11px] text-slate-500">
                    If enabled, riders inside this geofence can immediately request chauffeurs.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isInitialActive}
                  onChange={(e) => setIsInitialActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Interactive Live Map Preview */}
              {previewPolygon.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Live Boundary Preview
                    </span>
                    <span className="text-slate-400 font-mono font-normal">
                      {previewPolygon.length} Boundary Vertices
                    </span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                    <RealStreetMap
                      center={[centerLat, centerLng]}
                      zoom={creationMode === "RADIUS" && radiusKm > 15 ? 11 : 12}
                      polygon={previewPolygon}
                      polygonLabel={zoneName || "New Operating Zone"}
                      height="230px"
                      hideCitySelector={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveZone}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition shadow-md cursor-pointer"
              >
                Save &amp; Activate Zone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: VIEW FULLSCREEN GEOFENCE STREET MAP                           */}
      {/* ==================================================================== */}
      {viewMapZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setViewMapZone(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                    {viewMapZone.rtoCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{viewMapZone.state}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {viewMapZone.name}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  viewMapZone.isActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {viewMapZone.isActive ? "● ONLINE & ACTIVE" : "○ SUSPENDED"}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <RealStreetMap
                center={viewMapZone.center}
                polygon={viewMapZone.polygonCoords}
                polygonLabel={`${viewMapZone.name} Geofence`}
                height="450px"
                hideCitySelector={true}
                customTitle={`${viewMapZone.name} (${viewMapZone.rtoCode})`}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Centroid: {viewMapZone.center[0].toFixed(4)}°N, {viewMapZone.center[1].toFixed(4)}°E • Area: {viewMapZone.areaKm2.toFixed(1)} km²
              </span>
              <button
                onClick={() => setViewMapZone(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Region Manager Modal */}
      {assignModalZone && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                  City Operations Leadership
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Assign Region Manager
                </h3>
                <p className="text-xs text-slate-500">
                  Zone: <b>{assignModalZone.name}</b> ({assignModalZone.rtoCode})
                </p>
              </div>
              <button
                onClick={() => setAssignModalZone(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Governance Policy Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Super Admin Pricing &amp; Governance Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Region Managers are responsible for local driver onboarding, local customer relationships, and garage compliance. <b>Tariff rates and platform commissions are governed exclusively by Super Admin</b> and cannot be altered by Region Managers.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Hub Manager Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMgrName("Ankit Sharma");
                    setMgrEmail("ankit.mp40@sathi.in");
                    setMgrPhone("+91 94251 22001");
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition text-xs space-y-0.5 cursor-pointer"
                >
                  <div className="font-bold text-slate-900">Ankit Sharma</div>
                  <div className="text-[10px] text-slate-500 font-mono">ankit.mp40@sathi.in</div>
                  <div className="text-[10px] text-indigo-700 font-semibold">Vidisha Hub Lead</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMgrName("Sunita Patel");
                    setMgrEmail("sunita.mp04@sathi.in");
                    setMgrPhone("+91 98930 44002");
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition text-xs space-y-0.5 cursor-pointer"
                >
                  <div className="font-bold text-slate-900">Sunita Patel</div>
                  <div className="text-[10px] text-slate-500 font-mono">sunita.mp04@sathi.in</div>
                  <div className="text-[10px] text-indigo-700 font-semibold">Bhopal Hub Lead</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveManager} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Manager Full Name
                </label>
                <input
                  type="text"
                  required
                  value={mgrName}
                  onChange={(e) => setMgrName(e.target.value)}
                  placeholder="e.g. Ankit Sharma"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official Email (Staff Portal Login)
                </label>
                <input
                  type="email"
                  required
                  value={mgrEmail}
                  onChange={(e) => setMgrEmail(e.target.value)}
                  placeholder="e.g. ankit.mp40@sathi.in"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={mgrPhone}
                  onChange={(e) => setMgrPhone(e.target.value)}
                  placeholder="e.g. +91 94251 22001"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalZone(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Hub Manager</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegionsManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading Operating Zones...</div>}>
      <UnifiedZonesContent />
    </Suspense>
  );
}
