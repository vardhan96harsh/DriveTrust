"use client";

import React, { useState } from "react";
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Camera,
  Eye,
  FileText,
  Clock,
  Gauge,
  Fuel,
  Check,
  X,
  UserCheck,
} from "lucide-react";

interface InspectionRecord {
  id: string;
  bookingCode: string;
  customerName: string;
  driverName: string;
  vehicleModel: string;
  vehiclePlate: string;
  transmission: "AUTOMATIC" | "MANUAL" | "LUXURY";
  preTripOdometer: number;
  postTripOdometer: number;
  fuelStartPercent: number;
  fuelEndPercent: number;
  preExistingScratches: string[];
  newDamageReported: string[];
  status: "CLEAN_AUDIT" | "DISPUTE_REVIEW" | "PENDING_CHECKOUT";
  timestamp: string;
}

const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: "INSP-849102",
    bookingCode: "DT-849102",
    customerName: "Harshvardhan (Vidisha)",
    driverName: "Rajesh Sharma",
    vehicleModel: "Toyota Fortuner 4x4",
    vehiclePlate: "MP-40-CA-4921",
    transmission: "AUTOMATIC",
    preTripOdometer: 48210,
    postTripOdometer: 48234,
    fuelStartPercent: 75,
    fuelEndPercent: 70,
    preExistingScratches: [
      "Minor 2cm stone chip on front-right bumper lip",
      "Hairline clearcoat scratch near left rear wheel arch",
    ],
    newDamageReported: [],
    status: "CLEAN_AUDIT",
    timestamp: "Today, 14:22 PM",
  },
  {
    id: "INSP-849103",
    bookingCode: "DT-849103",
    customerName: "Amitabh Verma (Bhopal)",
    driverName: "Mukesh Patel",
    vehicleModel: "BMW 330Li M Sport",
    vehiclePlate: "MP-04-BK-8822",
    transmission: "LUXURY",
    preTripOdometer: 18450,
    postTripOdometer: 18492,
    fuelStartPercent: 90,
    fuelEndPercent: 82,
    preExistingScratches: ["Alloy wheel kerb rash on front-left 18-inch wheel"],
    newDamageReported: [],
    status: "CLEAN_AUDIT",
    timestamp: "Today, 12:45 PM",
  },
  {
    id: "INSP-849104",
    bookingCode: "DT-849104",
    customerName: "Pooja Sharma (Vidisha)",
    driverName: "Dharmendra Lodhi",
    vehicleModel: "Mahindra Scorpio-N",
    vehiclePlate: "MP-40-MB-7788",
    transmission: "MANUAL",
    preTripOdometer: 29110,
    postTripOdometer: 29148,
    fuelStartPercent: 60,
    fuelEndPercent: 54,
    preExistingScratches: ["Tailgate badge light scuff"],
    newDamageReported: [
      "Customer reported right door lower trim mud splatter & scuff mark under investigation",
    ],
    status: "DISPUTE_REVIEW",
    timestamp: "Yesterday, 19:10 PM",
  },
  {
    id: "INSP-849105",
    bookingCode: "DT-849105",
    customerName: "Dr. Alok Saxena (Bhopal VIP Rd)",
    driverName: "Imran Qureshi",
    vehicleModel: "Honda City 1.5 i-VTEC",
    vehiclePlate: "MP-04-CC-1120",
    transmission: "AUTOMATIC",
    preTripOdometer: 54800,
    postTripOdometer: 54832,
    fuelStartPercent: 50,
    fuelEndPercent: 45,
    preExistingScratches: ["Rear bumper minor parking rub mark"],
    newDamageReported: [],
    status: "CLEAN_AUDIT",
    timestamp: "23 Oct 2026, 11:30 AM",
  },
];

export default function VehicleInspectionsPage() {
  const [inspections, setInspections] = useState<InspectionRecord[]>(INITIAL_INSPECTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CLEAN_AUDIT" | "DISPUTE_REVIEW">("ALL");
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cleanCount = inspections.filter((i) => i.status === "CLEAN_AUDIT").length;
  const disputeCount = inspections.filter((i) => i.status === "DISPUTE_REVIEW").length;

  const handleResolveDispute = (id: string) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "CLEAN_AUDIT", newDamageReported: ["Resolved: Pre-existing road dirt confirmed by camera audit"] } : i))
    );
    setSelectedInspection(null);
    showToast("✓ Vehicle inspection dispute resolved! Customer & Chauffeur notified.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtered = inspections.filter((i) => {
    if (filterStatus === "CLEAN_AUDIT") return i.status === "CLEAN_AUDIT";
    if (filterStatus === "DISPUTE_REVIEW") return i.status === "DISPUTE_REVIEW";
    return true;
  }).filter((i) =>
    i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Pre &amp; Post Trip Vehicle Condition Audit
              </h1>
              <p className="text-xs text-slate-500">
                Essential chauffeur protection: 360° scratch &amp; dent photo records, odometer tracking, and fuel level audits.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
            LIABILITY SHIELD: 100% PROTECTED
          </span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Total Vehicle Audits
          </span>
          <div className="text-2xl font-black text-slate-900">{inspections.length}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">100% Photos Uploaded</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Clean Trip Handover
          </span>
          <div className="text-2xl font-black text-emerald-700">{cleanCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Zero Damage Claims</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Dispute Claims
          </span>
          <div className="text-2xl font-black text-amber-700">{disputeCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Under Camera Verification</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Average Trip Distance
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">34.5 km</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Odometer Verified</span>
        </div>
      </div>

      {/* Inspection List Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "ALL"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Inspections ({inspections.length})
            </button>
            <button
              onClick={() => setFilterStatus("CLEAN_AUDIT")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "CLEAN_AUDIT"
                  ? "bg-white text-emerald-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Clean ({cleanCount})
            </button>
            <button
              onClick={() => setFilterStatus("DISPUTE_REVIEW")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === "DISPUTE_REVIEW"
                  ? "bg-white text-amber-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Disputes ({disputeCount})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicle plate, customer, chauffeur..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer &amp; Vehicle</th>
                <th className="py-3 px-4">Assigned Chauffeur</th>
                <th className="py-3 px-4">Odometer Run</th>
                <th className="py-3 px-4">Fuel Usage</th>
                <th className="py-3 px-4">Damage Status</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-900 font-bold">{row.bookingCode}</span>
                    <div className="text-[10px] text-slate-400">{row.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{row.vehicleModel}</div>
                    <div className="text-[11px] text-blue-700 font-mono font-bold">{row.vehiclePlate}</div>
                    <div className="text-[10px] text-slate-500">{row.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{row.driverName}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                      {row.transmission}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    <div>{row.postTripOdometer} km</div>
                    <div className="text-[10px] text-slate-400">+{row.postTripOdometer - row.preTripOdometer} km driven</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{row.fuelStartPercent}% → {row.fuelEndPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.status === "CLEAN_AUDIT"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "CLEAN_AUDIT" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {row.status === "CLEAN_AUDIT" ? "Clean Handover" : "Dispute Flagged"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInspection(row)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Inspection Audit Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Vehicle Inspection Dossier • {selectedInspection.bookingCode}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      selectedInspection.status === "CLEAN_AUDIT"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {selectedInspection.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vehicle: <b>{selectedInspection.vehicleModel}</b> ({selectedInspection.vehiclePlate}) • Customer: {selectedInspection.customerName}
                </p>
              </div>

              <button
                onClick={() => setSelectedInspection(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 360° Photo Inspection Grid */}
            <div className="my-5 space-y-3">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono block">
                Pre-Trip 4-Angle Camera Capture (Verified by Chauffeur {selectedInspection.driverName})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="h-28 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 text-xs font-mono font-bold">
                    [Front Bumper Photo]
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 block">Angle 1: Front 180°</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Timestamp Verified ✓</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="h-28 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 text-xs font-mono font-bold">
                    [Rear Trunk Photo]
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 block">Angle 2: Rear Tailgate</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Timestamp Verified ✓</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="h-28 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 text-xs font-mono font-bold">
                    [Driver Left Side]
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 block">Angle 3: Driver Flank</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Timestamp Verified ✓</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="h-28 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 text-xs font-mono font-bold">
                    [Passenger Right Side]
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 block">Angle 4: Passenger Flank</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">Timestamp Verified ✓</span>
                </div>
              </div>
            </div>

            {/* Scratches & Odometer Dossier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs my-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block font-mono">
                  PRE-EXISTING VEHICLE CONDITIONS
                </span>
                {selectedInspection.preExistingScratches.map((scratch, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{scratch}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-extrabold text-slate-900 block font-mono">
                  POST-TRIP DAMAGE STATUS
                </span>
                {selectedInspection.newDamageReported.length > 0 ? (
                  selectedInspection.newDamageReported.map((dam, i) => (
                    <div key={i} className="flex items-center gap-2 text-rose-700 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{dam}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>No new damage, dents or scratches detected on handover.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedInspection(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              >
                Close Audit
              </button>
              {selectedInspection.status === "DISPUTE_REVIEW" && (
                <button
                  onClick={() => handleResolveDispute(selectedInspection.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-100" />
                  <span>Resolve &amp; Clear Chauffeur</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
