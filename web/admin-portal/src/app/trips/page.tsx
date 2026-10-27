"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Phone,
  RefreshCw,
  ExternalLink,
  Shield,
  UserCheck,
  ChevronRight,
  X,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  getLiveBookings,
  getDrivers,
  updateBookingState,
  reassignBookingDriver,
  LiveBooking,
  Driver,
} from "@/lib/userStore";

export default function TripsDispatchPage() {
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [selectedTrip, setSelectedTrip] = useState<LiveBooking | null>(null);
  const [reassignModalTrip, setReassignModalTrip] = useState<LiveBooking | null>(null);
  const [targetDriverId, setTargetDriverId] = useState("");
  const [reassignReason, setReassignReason] = useState<string>("CUSTOMER_REQUEST");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setBookings(getLiveBookings());
    setDrivers(getDrivers().filter((d) => d.kycStatus === "APPROVED"));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStateChange = (bookingCode: string, newState: LiveBooking["state"]) => {
    updateBookingState(bookingCode, newState);
    loadData();
    if (selectedTrip && selectedTrip.bookingCode === bookingCode) {
      setSelectedTrip({ ...selectedTrip, state: newState });
    }
    showToast(`Trip ${bookingCode} status updated to ${newState}`);
  };

  const handleReassign = () => {
    if (!reassignModalTrip || !targetDriverId) return;
    const targetDriver = drivers.find((d) => d.id === targetDriverId);
    if (!targetDriver) return;

    reassignBookingDriver(reassignModalTrip.bookingCode, targetDriver.fullName, targetDriver.phone);
    loadData();
    if (selectedTrip && selectedTrip.bookingCode === reassignModalTrip.bookingCode) {
      setSelectedTrip({
        ...selectedTrip,
        driverName: targetDriver.fullName,
        driverPhone: targetDriver.phone,
      });
    }
    const reasonLabel =
      reassignReason === "CUSTOMER_REQUEST"
        ? "Customer Request"
        : reassignReason === "DRIVER_DELAYED"
        ? "Driver Delayed"
        : reassignReason === "DRIVER_UNREACHABLE"
        ? "Driver Unreachable"
        : "Operational Mismatch";

    showToast(`Chauffeur for ${reassignModalTrip.bookingCode} re-assigned to ${targetDriver.fullName} [${reasonLabel}]`);
    setReassignModalTrip(null);
    setTargetDriverId("");
    setCustomerNotes("");
    setReassignReason("CUSTOMER_REQUEST");
  };

  const filteredBookings = bookings.filter((trip) => {
    const matchesSearch =
      trip.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE"
        ? trip.state === "IN_PROGRESS" || trip.state === "DRIVER_ARRIVED" || trip.state === "ACCEPTED"
        : trip.state === statusFilter);

    const matchesService = serviceFilter === "ALL" || trip.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (state: LiveBooking["state"]) => {
    switch (state) {
      case "IN_PROGRESS":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold animate-pulse";
      case "DRIVER_ARRIVED":
        return "bg-amber-500/10 text-amber-700 border-amber-300 font-bold";
      case "ACCEPTED":
        return "bg-blue-500/10 text-blue-700 border-blue-300 font-semibold";
      case "SEARCHING":
        return "bg-purple-500/10 text-purple-700 border-purple-300 font-semibold";
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-700 border-rose-300 font-semibold";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Dispatch & Trips Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-300 uppercase tracking-wider">
              Real-time Fleet
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor on-demand chauffeur bookings, handover compliance, OTP handshakes, and re-assign active drivers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/live-map"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Live Radar</span>
          </Link>
          <Link
            href="/concierge"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Phone Booking</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Rides Now</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {bookings.filter((b) => b.state === "IN_PROGRESS" || b.state === "DRIVER_ARRIVED").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Chauffeur behind the wheel</div>
        </div>
        <div className="grid grid-cols-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispatched Today</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{bookings.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Vidisha & Bhopal hubs</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Trips</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {bookings.filter((b) => b.state === "COMPLETED").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">100% verified handover</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Fleet Value</div>
          <div className="text-2xl font-black text-amber-600 mt-1">₹10 Lakh</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Per-trip transit insurance</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Booking ID, Customer, Chauffeur, or Car Plate..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Service Package Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Service:</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Services</option>
              <option value="NIGHT_DROP">Night Safe Chauffeur</option>
              <option value="HOURLY">City Hourly Package</option>
              <option value="OUTSTATION">Outstation Roundtrip</option>
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs border-t border-slate-100">
          {[
            { id: "ALL", label: "All Bookings" },
            { id: "ACTIVE", label: "Active & En-Route" },
            { id: "IN_PROGRESS", label: "In Transit" },
            { id: "DRIVER_ARRIVED", label: "Driver Arrived" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Booking / Code</th>
                <th className="py-3 px-4">Client & Vehicle</th>
                <th className="py-3 px-4">Assigned Chauffeur</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Start OTP</th>
                <th className="py-3 px-4">Fare</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Car className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No reservations matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition group">
                    {/* Booking Code & Service */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-600">{trip.bookingCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans font-medium uppercase mt-0.5">
                        {trip.serviceType.replace("_", " ")}
                      </div>
                    </td>

                    {/* Customer & Car */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{trip.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                        <Car className="w-3 h-3 text-slate-400" />
                        <span>{trip.vehicleModel}</span>
                        <span className="bg-slate-100 px-1 py-0.2 rounded text-[10px] font-bold text-slate-600">
                          {trip.vehiclePlate}
                        </span>
                      </div>
                    </td>

                    {/* Chauffeur */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{trip.driverName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{trip.driverPhone}</div>
                      {(trip.state === "ACCEPTED" || trip.state === "SEARCHING" || trip.state === "IN_PROGRESS") && (
                        <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                          Commute ETA: ~20-25 mins
                        </div>
                      )}
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-slate-800 font-medium" title={trip.pickup}>
                        <span className="text-emerald-600 font-bold">From:</span> {trip.pickup}
                      </div>
                      <div className="truncate text-slate-500 text-[11px] mt-0.5" title={trip.dropoff}>
                        <span className="text-rose-500 font-bold">To:</span> {trip.dropoff}
                      </div>
                    </td>

                    {/* OTP */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        {trip.otp}
                      </span>
                    </td>

                    {/* Fare */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{trip.fare}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(trip.state)}`}>
                        {trip.state.replace("_", " ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      >
                        Inspect
                      </button>
                      {trip.state !== "COMPLETED" && trip.state !== "CANCELLED" && (
                        <button
                          onClick={() => setReassignModalTrip(trip)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                        >
                          Reassign
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Trip Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">
                  Reservation Details
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{selectedTrip.bookingCode}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getStatusBadge(selectedTrip.state)}`}>
                    {selectedTrip.state}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Customer</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedTrip.customerName}</span>
                <span className="text-slate-500 font-mono text-[11px]">{selectedTrip.customerPhone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Chauffeur</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedTrip.driverName}</span>
                <span className="text-slate-500 font-mono text-[11px]">{selectedTrip.driverPhone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Vehicle</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedTrip.vehicleModel}</span>
                <span className="text-amber-700 font-mono font-bold">{selectedTrip.vehiclePlate}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-amber-800 font-semibold block text-[10px] uppercase">Trip Start OTP</span>
                <span className="font-mono font-black text-lg text-amber-700 block mt-0.5">
                  {selectedTrip.otp}
                </span>
                <span className="text-[10px] text-amber-600">Provide if client is offline</span>
              </div>
            </div>

            {/* Route Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div>
                <span className="font-bold text-emerald-600 block text-[11px]">PICKUP LOCATION:</span>
                <p className="text-slate-700 font-medium mt-0.5">{selectedTrip.pickup}</p>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="font-bold text-rose-500 block text-[11px]">DROPOFF DESTINATION:</span>
                <p className="text-slate-700 font-medium mt-0.5">{selectedTrip.dropoff}</p>
              </div>
            </div>

            {/* State Management */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Operator Override Status:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleStateChange(selectedTrip.bookingCode, "DRIVER_ARRIVED")}
                  className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold transition"
                >
                  Mark Arrived
                </button>
                <button
                  onClick={() => handleStateChange(selectedTrip.bookingCode, "IN_PROGRESS")}
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition"
                >
                  Start Ride
                </button>
                <button
                  onClick={() => handleStateChange(selectedTrip.bookingCode, "COMPLETED")}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
                >
                  Force Complete
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleStateChange(selectedTrip.bookingCode, "CANCELLED")}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Driver Modal */}
      {reassignModalTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Reassign Chauffeur</h3>
                <p className="text-xs text-slate-500">Trip: {reassignModalTrip.bookingCode}</p>
              </div>
              <button
                onClick={() => setReassignModalTrip(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Current Chauffeur:</span>
                <span className="font-bold text-slate-900">{reassignModalTrip.driverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Customer Car:</span>
                <span className="font-bold text-amber-700">{reassignModalTrip.vehicleModel} ({reassignModalTrip.vehiclePlate})</span>
              </div>
            </div>

            {/* Reassignment Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Mandatory Reassignment Trigger:
              </label>
              <select
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="CUSTOMER_REQUEST">👤 Customer Request (Client phoned to change driver)</option>
                <option value="DRIVER_DELAYED">⏳ Driver Delayed / Idle (Stuck in traffic / not moving)</option>
                <option value="DRIVER_UNREACHABLE">📵 Driver Unreachable (Phone busy or switched off)</option>
                <option value="TRANSMISSION_MISMATCH">⚙️ Gearbox Mismatch (Client requires Automatic driver)</option>
                <option value="DRIVER_EMERGENCY">🚨 Driver Emergency / Vehicle breakdown</option>
              </select>
            </div>

            {/* Customer Call Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Client / Dispatch Log Notes (Optional):
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Customer requested senior chauffeur on Vidisha-Bhopal run"
                className="w-full px-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Select Replacement Chauffeur:
              </span>
              {drivers.map((drv) => (
                <label
                  key={drv.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    targetDriverId === drv.id
                      ? "border-amber-500 bg-amber-50/50 font-bold"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="reassignDriver"
                      checked={targetDriverId === drv.id}
                      onChange={() => setTargetDriverId(drv.id)}
                      className="text-amber-600"
                    />
                    <div>
                      <div className="text-slate-900 font-bold">{drv.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {drv.phone} • {drv.city} • {drv.transmissions.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-amber-600 font-bold">★ {drv.rating}</span>
                    <span className="block text-[10px] text-slate-400">{drv.totalTrips} rides</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setReassignModalTrip(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={!targetDriverId}
                onClick={handleReassign}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-50 transition shadow-sm"
              >
                Confirm Re-assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
