"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { getDrivers, Driver } from "@/lib/userStore";

interface ChauffeurShift {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  city: string;
  shiftType: "MORNING" | "EVENING" | "NIGHT_SAFE";
  slotTime: string;
  status: "CHECKED_IN" | "SCHEDULED" | "COMPLETED" | "ABSENT";
  minimumGuarantee: number;
  tripsCompleted: number;
  date: string;
}

export default function ChauffeurShiftsPage() {
  const [shifts, setShifts] = useState<ChauffeurShift[]>([]);
  const [activeShiftFilter, setActiveShiftFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const drivers = getDrivers().filter((d) => d.kycStatus === "APPROVED");
    const mockShifts: ChauffeurShift[] = drivers.map((d, idx) => {
      const shiftType: "MORNING" | "EVENING" | "NIGHT_SAFE" =
        idx % 3 === 0 ? "MORNING" : idx % 3 === 1 ? "EVENING" : "NIGHT_SAFE";

      const slotTime =
        shiftType === "MORNING"
          ? "06:00 - 14:00"
          : shiftType === "EVENING"
          ? "14:00 - 22:00"
          : "22:00 - 06:00";

      return {
        id: `shift-${d.id}`,
        driverId: d.id,
        driverName: d.fullName,
        driverPhone: d.phone,
        city: d.city,
        shiftType,
        slotTime,
        status: d.isOnline ? "CHECKED_IN" : idx % 2 === 0 ? "SCHEDULED" : "COMPLETED",
        minimumGuarantee: shiftType === "NIGHT_SAFE" ? 1100 : 850,
        tripsCompleted: d.isOnline ? 3 : 5,
        date: "Today, Oct 27",
      };
    });

    setShifts(mockShifts);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDuty = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          const nextStatus = s.status === "CHECKED_IN" ? "COMPLETED" : "CHECKED_IN";
          showToast(`${s.driverName} duty status updated to ${nextStatus}.`);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const filteredShifts = shifts.filter((s) => {
    const matchesSearch =
      s.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.driverPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShift = activeShiftFilter === "ALL" || s.shiftType === activeShiftFilter;
    const matchesCity = cityFilter === "ALL" || s.city.toLowerCase().includes(cityFilter.toLowerCase());

    return matchesSearch && matchesShift && matchesCity;
  });

  const checkedInCount = shifts.filter((s) => s.status === "CHECKED_IN").length;

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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Chauffeur Shifts & Roster</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-800 border border-indigo-300 uppercase tracking-wider">
              24/7 Coverage
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage daily duty rosters, Morning / Evening / Night Safe shifts, and Minimum Guarantee attendance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/drivers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Driver Profiles</span>
          </Link>
          <button
            onClick={() => showToast("Auto-balancing roster for weekend demand across Vidisha & Bhopal...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Optimize Roster</span>
          </button>
        </div>
      </div>

      {/* Shift Slots Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Morning Shift */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-slate-900 text-sm">Morning Shift</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400">06:00 - 14:00</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {shifts.filter((s) => s.shiftType === "MORNING" && s.status === "CHECKED_IN").length} /{" "}
            {shifts.filter((s) => s.shiftType === "MORNING").length}
          </div>
          <p className="text-[11px] text-slate-500">Early airport flights & morning office drops</p>
        </div>

        {/* Evening Shift */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sunset className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-slate-900 text-sm">Evening Shift</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400">14:00 - 22:00</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {shifts.filter((s) => s.shiftType === "EVENING" && s.status === "CHECKED_IN").length} /{" "}
            {shifts.filter((s) => s.shiftType === "EVENING").length}
          </div>
          <p className="text-[11px] text-slate-500">Shopping trips, dinner & corporate meetings</p>
        </div>

        {/* Night Safe Shift */}
        <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-sm">Night Safe Shift</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400">22:00 - 06:00</span>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {shifts.filter((s) => s.shiftType === "NIGHT_SAFE" && s.status === "CHECKED_IN").length} /{" "}
            {shifts.filter((s) => s.shiftType === "NIGHT_SAFE").length}
          </div>
          <p className="text-[11px] text-slate-400">Night safety chauffeurs (₹1100 MG bonus)</p>
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
            placeholder="Search by Chauffeur Name, Phone, or City..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Shift Slot:</span>
          <select
            value={activeShiftFilter}
            onChange={(e) => setActiveShiftFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Shifts</option>
            <option value="MORNING">Morning (06:00 - 14:00)</option>
            <option value="EVENING">Evening (14:00 - 22:00)</option>
            <option value="NIGHT_SAFE">Night Safe (22:00 - 06:00)</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Hubs</option>
            <option value="Vidisha">Vidisha (MP-40)</option>
            <option value="Bhopal">Bhopal (MP-04)</option>
          </select>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Chauffeur</th>
                <th className="py-3 px-4">Operating Hub</th>
                <th className="py-3 px-4">Shift Type</th>
                <th className="py-3 px-4">Timing Slot</th>
                <th className="py-3 px-4">Trips Today</th>
                <th className="py-3 px-4">Min Guarantee</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4 text-right">Duty Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{shift.driverName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{shift.driverPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {shift.city}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        shift.shiftType === "NIGHT_SAFE"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : shift.shiftType === "EVENING"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {shift.shiftType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {shift.slotTime}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {shift.tripsCompleted} rides
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    ₹{shift.minimumGuarantee}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        shift.status === "CHECKED_IN"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold"
                          : shift.status === "SCHEDULED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {shift.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleDuty(shift.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        shift.status === "CHECKED_IN"
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      {shift.status === "CHECKED_IN" ? "Clock Out" : "Check In"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
