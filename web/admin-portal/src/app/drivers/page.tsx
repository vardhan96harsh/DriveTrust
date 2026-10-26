"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Phone,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  Trash2,
  Edit3,
  Ban,
  Check,
  X,
  Smartphone,
  Star,
  MapPin,
  Wallet,
  Car,
  Award,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  getDrivers,
  saveDriver,
  updateDriverProfile,
  deleteDriver,
  blockDriver,
  unblockDriver,
  verifyDriverData,
  updateDriverKYCStatus,
  toggleDriverOnline,
  setActiveDriverId,
  getActiveDriver,
  Driver,
  DEFAULT_DRIVERS,
} from "@/lib/userStore";

export default function ChauffeursManagementPage() {
  const [drivers, setDrivers] = useState<Driver[]>(DEFAULT_DRIVERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "REVIEW" | "BLOCKED" | "ONLINE">("ALL");
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [blockingDriver, setBlockingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [blockReason, setBlockReason] = useState("Administrative review pending");

  // Onboarding Form States
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+91 ");
  const [newCity, setNewCity] = useState("Vidisha");
  const [newDL, setNewDL] = useState("MP-40-2022-0048291");
  const [newRTO, setNewRTO] = useState("MP-40 (Vidisha)");
  const [newExp, setNewExp] = useState(5);
  const [newExpiry, setNewExpiry] = useState("2038-04-20");
  const [newUPI, setNewUPI] = useState("");
  const [newTransmissions, setNewTransmissions] = useState<("AUTOMATIC" | "MANUAL" | "LUXURY")[]>([
    "AUTOMATIC",
    "MANUAL",
  ]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const refresh = () => {
    setDrivers(getDrivers());
  };

  useEffect(() => {
    refresh();
  }, []);

  // Filtered chauffeurs
  const filteredDrivers = drivers.filter((drv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      drv.fullName.toLowerCase().includes(q) ||
      drv.phone.toLowerCase().includes(q) ||
      drv.licenseNumber.toLowerCase().includes(q) ||
      drv.city.toLowerCase().includes(q) ||
      drv.rto.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "BLOCKED"
        ? drv.isBlocked
        : statusFilter === "ONLINE"
        ? drv.isOnline && !drv.isBlocked
        : statusFilter === "APPROVED"
        ? drv.kycStatus === "APPROVED" && !drv.isBlocked
        : drv.kycStatus !== "APPROVED" && !drv.isBlocked;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = drivers.length;
  const onlineCount = drivers.filter((d) => d.isOnline && !d.isBlocked).length;
  const approvedCount = drivers.filter((d) => d.kycStatus === "APPROVED" && !d.isBlocked).length;
  const blockedCount = drivers.filter((d) => d.isBlocked).length;

  // Handlers
  const handleOnboardDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newDL.trim()) {
      alert("Name, Phone, and Commercial Driving License are required.");
      return;
    }

    const created = saveDriver({
      fullName: newName.trim(),
      phone: newPhone.trim(),
      city: newCity.trim() || "Vidisha",
      licenseNumber: newDL.trim().toUpperCase(),
      licenseExpiry: newExpiry || "2038-12-31",
      rto: newRTO.trim() || "MP-40 (Vidisha)",
      experienceYears: newExp || 4,
      transmissions: newTransmissions.length > 0 ? newTransmissions : ["AUTOMATIC", "MANUAL"],
      aadhaarNumber: "XXXX-XXXX-9921",
      upiId: newUPI.trim() || `${newName.toLowerCase().replace(/\s+/g, "")}@upi`,
      kycStatus: "APPROVED",
      policeVerificationStatus: "CLEARED",
      isDlVerified: true,
    });

    refresh();
    setShowOnboardModal(false);
    notify(`Chauffeur "${created.fullName}" onboarded and verified.`);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;

    updateDriverProfile(editingDriver.id, {
      fullName: editingDriver.fullName,
      phone: editingDriver.phone,
      city: editingDriver.city,
      experienceYears: editingDriver.experienceYears,
      upiId: editingDriver.upiId,
      transmissions: editingDriver.transmissions,
    });

    refresh();
    setEditingDriver(null);
    notify(`Updated profile for ${editingDriver.fullName}`);
  };

  const handleToggleOnline = (id: string, name: string) => {
    const newState = toggleDriverOnline(id);
    refresh();
    notify(`Chauffeur ${name} is now ${newState ? "ONLINE (On Duty)" : "OFFLINE"}`);
  };

  const handleToggleBlock = () => {
    if (!blockingDriver) return;

    if (blockingDriver.isBlocked) {
      unblockDriver(blockingDriver.id);
      notify(`Unblocked chauffeur: ${blockingDriver.fullName}`);
    } else {
      blockDriver(blockingDriver.id, blockReason);
      notify(`Suspended chauffeur: ${blockingDriver.fullName}`);
    }

    refresh();
    setBlockingDriver(null);
  };

  const handleDeleteDriver = () => {
    if (!deletingDriver) return;
    deleteDriver(deletingDriver.id);
    refresh();
    setDeletingDriver(null);
    notify(`Deleted chauffeur: ${deletingDriver.fullName}`);
  };

  const handleSetSimulatorDriver = (drv: Driver) => {
    setActiveDriverId(drv.id);
    notify(`Switched active simulator chauffeur to ${drv.fullName}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-slate-100" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Chauffeurs &amp; Fleet Management
              </h1>
              <p className="text-xs text-slate-500">
                Commercial driver partners, Sarathi DL verification, live dispatch duty status, and disciplinary controls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/customers"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>Go to Customers Directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={() => setShowOnboardModal(true)}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Chauffeur</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - Minimalist, Professional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Total Chauffeurs
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Enrolled partners</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online on Duty</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{onlineCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Ready for dispatches</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>KYC Verified</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{approvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">MoRTH &amp; Police Cleared</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Suspended</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{blockedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Access disabled</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chauffeur, DL, RTO, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Filter:</span>
          {(["ALL", "ONLINE", "APPROVED", "REVIEW", "BLOCKED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                statusFilter === filter
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter === "ALL"
                ? `All (${totalCount})`
                : filter === "ONLINE"
                ? `Online (${onlineCount})`
                : filter === "APPROVED"
                ? `Approved (${approvedCount})`
                : filter === "REVIEW"
                ? "Under Review"
                : `Suspended (${blockedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Chauffeurs List */}
      <div className="space-y-3.5">
        {filteredDrivers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No chauffeurs found</p>
            <p className="mt-1">Try adjusting your search query or clear filters.</p>
          </div>
        ) : (
          filteredDrivers.map((drv) => (
            <div
              key={drv.id}
              className={`bg-white rounded-xl p-5 border transition-all shadow-xs ${
                drv.isBlocked ? "border-rose-200 bg-rose-50/15" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Chauffeur Identity */}
                <div className="space-y-1.5 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{drv.fullName}</span>

                    {/* Online Toggle Pill */}
                    <button
                      onClick={() => handleToggleOnline(drv.id, drv.fullName)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition flex items-center gap-1 ${
                        drv.isOnline
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                      title="Click to toggle duty status"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${drv.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                      <span>{drv.isOnline ? "ONLINE" : "OFFLINE"}</span>
                    </button>

                    {drv.isBlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        SUSPENDED
                      </span>
                    ) : drv.kycStatus === "APPROVED" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>KYC Verified</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Under Review
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{drv.phone}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{drv.city}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{drv.rating} ({drv.totalTrips || 120} trips)</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    UPI Payout: <span className="font-mono text-slate-700">{drv.upiId || "Not configured"}</span> • Wallet: <span className="font-semibold text-slate-800">₹{drv.walletBalance || 0}</span>
                  </div>

                  {drv.isBlocked && drv.blockReason && (
                    <div className="text-[11px] text-rose-600 font-medium">
                      Suspension reason: {drv.blockReason}
                    </div>
                  )}
                </div>

                {/* Middle: Commercial License & Skills */}
                <div className="flex-1 bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Commercial DL</span>
                      <div className="font-mono font-bold text-slate-800">{drv.licenseNumber}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Issuing RTO</span>
                      <div className="text-slate-700 font-medium">{drv.rto}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Experience</span>
                      <div className="text-slate-700 font-semibold">{drv.experienceYears} Years</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Vehicle Transmission Clearance:</span>
                    {drv.transmissions.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-700 border border-slate-200 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingDriver(drv)}
                      className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        const newStatus = drv.kycStatus === "APPROVED" ? "UNDER_REVIEW" : "APPROVED";
                        updateDriverKYCStatus(drv.id, newStatus);
                        refresh();
                        notify(`KYC status for ${drv.fullName} set to ${newStatus}`);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition ${
                        drv.kycStatus === "APPROVED"
                          ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {drv.kycStatus === "APPROVED" ? "Review KYC" : "Approve KYC"}
                    </button>

                    <button
                      onClick={() => setBlockingDriver(drv)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition ${
                        drv.isBlocked
                          ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                          : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      {drv.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => setDeletingDriver(drv)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Chauffeur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSetSimulatorDriver(drv)}
                    className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium mt-1"
                  >
                    <Smartphone className="w-3 h-3 text-slate-400" />
                    <span>Set in Simulator</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: ONBOARD CHAUFFEUR */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Onboard Professional Chauffeur</h3>
              <button onClick={() => setShowOnboardModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOnboardDriver} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Chauffeur Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 99801 84920"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Commercial License (DL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="MP-40-2022-0048291"
                    value={newDL}
                    onChange={(e) => setNewDL(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Issuing RTO</label>
                  <input
                    type="text"
                    value={newRTO}
                    onChange={(e) => setNewRTO(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City Hub</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={newExp}
                    onChange={(e) => setNewExp(parseInt(e.target.value) || 3)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">DL Expiry</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">UPI Payout ID (Instant Bank Settlement)</label>
                <input
                  type="text"
                  placeholder="chauffeur@okhdfcbank"
                  value={newUPI}
                  onChange={(e) => setNewUPI(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>

              {/* Transmission Clearances */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Approved Transmission Types</label>
                <div className="flex items-center gap-4">
                  {(["AUTOMATIC", "MANUAL", "LUXURY"] as const).map((trans) => (
                    <label key={trans} className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={newTransmissions.includes(trans)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTransmissions([...newTransmissions, trans]);
                          } else {
                            setNewTransmissions(newTransmissions.filter((t) => t !== trans));
                          }
                        }}
                        className="rounded border-slate-300 text-slate-900"
                      />
                      <span>{trans}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Onboard &amp; Verify Chauffeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CHAUFFEUR PROFILE */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Edit Chauffeur Profile</h3>
              <button onClick={() => setEditingDriver(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editingDriver.fullName}
                  onChange={(e) => setEditingDriver({ ...editingDriver, fullName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editingDriver.phone}
                    onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City Hub</label>
                  <input
                    type="text"
                    value={editingDriver.city}
                    onChange={(e) => setEditingDriver({ ...editingDriver, city: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingDriver.experienceYears}
                    onChange={(e) =>
                      setEditingDriver({ ...editingDriver, experienceYears: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">UPI Payout Address</label>
                  <input
                    type="text"
                    value={editingDriver.upiId || ""}
                    onChange={(e) => setEditingDriver({ ...editingDriver, upiId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BLOCK / UNBLOCK MODAL */}
      {blockingDriver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${blockingDriver.isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {blockingDriver.isBlocked ? "Unblock Chauffeur Partner" : "Suspend Chauffeur Account"}
                </h3>
                <p className="text-xs text-slate-500">{blockingDriver.fullName} ({blockingDriver.licenseNumber})</p>
              </div>
            </div>

            {!blockingDriver.isBlocked && (
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700">Reason for Suspension</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Customer complaint under investigation">Customer complaint under investigation</option>
                  <option value="Failed telematics / harsh braking audit">Failed telematics / harsh braking audit</option>
                  <option value="License renewal required">License renewal required</option>
                  <option value="Administrative review pending">Administrative review pending</option>
                </select>
              </div>
            )}

            <p className="text-xs text-slate-600">
              {blockingDriver.isBlocked
                ? "Unblocking will immediately allow this chauffeur to receive customer trip dispatches."
                : "Suspension will immediately take this chauffeur offline and block them from receiving trips."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBlockingDriver(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleBlock}
                className={`px-4 py-2 rounded-lg font-bold text-xs ${
                  blockingDriver.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
              >
                {blockingDriver.isBlocked ? "Confirm Unblock" : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CHAUFFEUR */}
      {deletingDriver && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Delete Chauffeur?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete <b>{deletingDriver.fullName}</b>? All license credentials and trip records will be removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setDeletingDriver(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDriver}
                className="px-3.5 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
