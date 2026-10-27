"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Users,
  Eye,
  X,
  Sparkles,
  Download,
} from "lucide-react";
import { getCustomers, Customer, CustomerVehicle } from "@/lib/userStore";

interface EnrichedVehicle extends CustomerVehicle {
  ownerName: string;
  ownerPhone: string;
  ownerCity: string;
  insurancePolicyNumber: string;
  insuranceStatus: "ACTIVE" | "PENDING_RENEWAL";
  coverageAmount: string;
  verifiedAt: string;
}

export default function FleetRegistryPage() {
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState<EnrichedVehicle | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const customers = getCustomers();
    const allVehicles: EnrichedVehicle[] = [];

    customers.forEach((cust) => {
      cust.vehicles.forEach((veh, idx) => {
        allVehicles.push({
          ...veh,
          ownerName: cust.fullName,
          ownerPhone: cust.phone,
          ownerCity: cust.city,
          insurancePolicyNumber: `DT-INS-${veh.plate.replace(/[^A-Z0-9]/g, "")}-${idx + 101}`,
          insuranceStatus: "ACTIVE",
          coverageAmount: "₹10,00,000",
          verifiedAt: "2024-01-15",
        });
      });
    });

    setVehicles(allVehicles);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTransmission =
      transmissionFilter === "ALL" || v.transmission === transmissionFilter;

    return matchesSearch && matchesTransmission;
  });

  const automaticCount = vehicles.filter((v) => v.transmission === "AUTOMATIC" || v.transmission === "LUXURY").length;
  const manualCount = vehicles.filter((v) => v.transmission === "MANUAL").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vehicle Fleet & Insurance Registry</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              ₹10L Policy Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Centralized registry of client cars, transmission types, and comprehensive in-transit insurance certificates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>View Client Accounts</span>
          </Link>
          <button
            onClick={() => showToast("Exporting registered fleet CSV with policy certificates...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Fleet Ledger</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Cars</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{vehicles.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across Vidisha & Bhopal hubs</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Automatic & Luxury</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{automaticCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Requires Automatic certified driver</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manual Transmission</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{manualCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Standard manual gearbox</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Insurance Coverage</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Active</div>
          <div className="text-[11px] text-slate-500 mt-0.5">₹10L transit damage protection</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Plate (e.g. MP-40-CA-4921), Brand, Model, or Owner..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Transmission:</span>
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Transmissions</option>
            <option value="AUTOMATIC">Automatic Only</option>
            <option value="MANUAL">Manual Only</option>
            <option value="LUXURY">Luxury (BMW / Merc / Audi)</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Registration Plate</th>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4">Transmission</th>
                <th className="py-3 px-4">Registered Client</th>
                <th className="py-3 px-4">Hub City</th>
                <th className="py-3 px-4">₹10L Transit Insurance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Car className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No vehicles found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((veh) => (
                  <tr key={veh.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                        {veh.plate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{veh.brand} {veh.model}</div>
                      <div className="text-[10px] text-slate-400">{veh.color || "Standard"} • {veh.year || 2023}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          veh.transmission === "LUXURY"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : veh.transmission === "AUTOMATIC"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {veh.transmission}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{veh.ownerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{veh.ownerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {veh.ownerCity}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Policy Verified</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedVehicle(veh)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      >
                        Policy Certificate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insurance Policy Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Transit Insurance Certificate
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedVehicle.insurancePolicyNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-bold uppercase text-[10px]">Underwritten Cover:</span>
                <span className="text-emerald-700 font-black text-base">{selectedVehicle.coverageAmount}</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                Covers accidental physical damage, scratches, dents, and third-party liabilities occurring strictly while a certified DriveTrust chauffeur is on duty.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registered Car</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </span>
                <span className="text-amber-700 font-mono font-bold">{selectedVehicle.plate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Client / Owner</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedVehicle.ownerName}</span>
                <span className="text-slate-500 font-mono">{selectedVehicle.ownerPhone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Gearbox Requirement</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedVehicle.transmission}</span>
                <span className="text-[10px] text-slate-400">Strict driver match filter</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Policy Audit Status</span>
                <span className="font-bold text-emerald-600 block mt-0.5">ACTIVE & CERTIFIED</span>
                <span className="text-[10px] text-slate-400">Verified: {selectedVehicle.verifiedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  showToast(`Insurance certificate ${selectedVehicle.insurancePolicyNumber} downloaded.`);
                  setSelectedVehicle(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Policy PDF</span>
              </button>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
