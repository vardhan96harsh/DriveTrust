"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Car,
  Key,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  FileText,
  BadgeIndianRupee,
  Navigation,
  Sparkles,
  PhoneCall,
  X,
  Check,
  Smartphone,
  Lock,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  Customer,
  CustomerVehicle,
  getActiveCustomer,
  getCustomers,
  setActiveCustomerId,
  addVehicleToCustomer,
  deleteCustomerVehicle,
  updateCustomerProfile,
  generateUniqueCustomerPin,
  isPinTaken,
} from "@/lib/userStore";
import {
  getCustomerTrips,
  CustomerTrip,
} from "@/lib/customerBookingStore";

export default function CustomerDashboardPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [trips, setTrips] = useState<CustomerTrip[]>([]);
  const [copiedPin, setCopiedPin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Vehicle Modal
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newTransmission, setNewTransmission] = useState<"MANUAL" | "AUTOMATIC" | "LUXURY">("MANUAL");
  const [newColor, setNewColor] = useState("");

  // Edit PIN Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [customPin, setCustomPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener("storage", handleSync);
    window.addEventListener("dt_trip_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("dt_trip_updated", handleSync);
    };
  }, []);

  const loadData = () => {
    const list = getCustomers();
    setAllCustomers(list);
    const active = getActiveCustomer();
    setCustomer(active || list[0] || null);

    const allTrips = getCustomerTrips();
    setTrips(allTrips);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwitchAccount = (id: string) => {
    setActiveCustomerId(id);
    const found = allCustomers.find((c) => c.id === id);
    if (found) {
      setCustomer(found);
      showToast(`Switched account to ${found.fullName}`);
    }
  };

  const handleCopyPin = () => {
    if (!customer?.permanentPin) return;
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(customer.permanentPin);
      setCopiedPin(true);
      showToast("Permanent Sathi PIN copied to clipboard!");
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleRegeneratePin = () => {
    if (!customer) return;
    const newPin = generateUniqueCustomerPin(allCustomers);
    const updated = updateCustomerProfile(customer.id, { permanentPin: newPin });
    if (updated) {
      setCustomer(updated);
      showToast(`✨ Generated new permanent PIN: ${newPin}`);
    }
  };

  const handleSaveCustomPin = () => {
    if (!customer) return;
    if (!/^\d{4}$/.test(customPin)) {
      setPinError("PIN must be exactly 4 digits");
      return;
    }
    if (isPinTaken(customPin, customer.id)) {
      setPinError("This PIN is already registered. Please choose another 4-digit code.");
      return;
    }
    const updated = updateCustomerProfile(customer.id, { permanentPin: customPin });
    if (updated) {
      setCustomer(updated);
      setShowPinModal(false);
      setPinError("");
      setCustomPin("");
      showToast(`🔒 Permanent PIN updated to ${customPin}`);
    }
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !newBrand.trim() || !newModel.trim() || !newPlate.trim()) {
      showToast("Please fill in car Brand, Model, and Number Plate.");
      return;
    }
    const updated = addVehicleToCustomer(customer.id, {
      brand: newBrand.trim(),
      model: newModel.trim(),
      plate: newPlate.trim().toUpperCase(),
      transmission: newTransmission,
      color: newColor.trim() || "Standard",
      year: new Date().getFullYear(),
    });
    if (updated) {
      setCustomer(updated);
      setShowAddVehicleModal(false);
      setNewBrand("");
      setNewModel("");
      setNewPlate("");
      setNewColor("");
      showToast(`🚘 ${newBrand} ${newModel} added to your garage!`);
    }
  };

  const handleDeleteVehicle = (vehicleId: string, carName: string) => {
    if (!customer) return;
    if (customer.vehicles.length <= 1) {
      showToast("You must keep at least one registered vehicle in your garage.");
      return;
    }
    if (confirm(`Remove ${carName} from your garage?`)) {
      const updated = deleteCustomerVehicle(customer.id, vehicleId);
      if (updated) {
        setCustomer(updated);
        showToast(`${carName} removed from garage.`);
      }
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <BrandLogo className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900">No Customer Account Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Create a customer account to register your personal cars and receive verified chauffeurs.</p>
          <Link
            href="/customer/register"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow inline-block"
          >
            Register Sathi Customer Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <div>
              <div className="font-black text-slate-900 text-base leading-tight">Sathi Chauffeur</div>
              <div className="text-[10px] text-slate-500 font-semibold">Customer Sathi Pass &amp; Garage</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Book Chauffeur
            </Link>
            <Link
              href="/driver"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hidden sm:flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              Driver App ↗
            </Link>
            <Link
              href="/customers"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hidden sm:inline-block"
            >
              Admin ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Account Switcher Bar (if multi-customer exists) */}
        {allCustomers.length > 1 && (
          <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-blue-600" />
              <span>Active Account: <strong>{customer.fullName}</strong> ({customer.city})</span>
            </div>
            <select
              value={customer.id}
              onChange={(e) => handleSwitchAccount(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-lg px-2.5 py-1 outline-hidden"
            >
              {allCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.city}) — PIN: {c.permanentPin}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* HERO: SATHI PASS & PERMANENT PIN CARD */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-4 top-4 opacity-10">
            <BrandLogo className="w-32 h-32 text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Sathi Pass · Verified Vehicle Owner
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  {customer.city === "Vidisha" ? "MP-40 Vidisha Hub" : "MP-04 Bhopal Hub"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{customer.fullName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> {customer.address}
                </span>
                {customer.aadhaarVerified && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar Verified
                  </span>
                )}
              </div>
            </div>

            {/* Permanent PIN Box */}
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-inner flex flex-col items-center sm:items-end text-center sm:text-right shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Permanent Sathi PIN
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-amber-400">
                {customer.permanentPin}
              </div>
              <p className="text-[10px] text-slate-400 max-w-[200px] mt-1 leading-snug">
                Give this 4-digit PIN to your chauffeur to start your trip.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleCopyPin}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition"
                >
                  {copiedPin ? "✓ Copied" : "Copy"}
                </button>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Change
                </button>
                <button
                  onClick={handleRegeneratePin}
                  title="Generate a fresh collision-free PIN"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition border border-slate-700"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/book"
            className="bg-white rounded-2xl p-4 border border-blue-200 hover:border-blue-400 shadow-sm transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">Book Chauffeur</div>
                <div className="text-[11px] text-slate-500">Hourly, City, or Outstation</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/track"
            className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 shadow-sm transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">Live Radar Tracking</div>
                <div className="text-[11px] text-slate-500">Track active ride GPS link</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/customer/register"
            className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-purple-300 shadow-sm transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition">New Sathi Account</div>
                <div className="text-[11px] text-slate-500">Register new customer profile</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* SECTION 1: MY GARAGE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" /> My Registered Garage
              </h2>
              <p className="text-xs text-slate-500">
                Vehicles verified for chauffeur dispatch. Only chauffeurs certified in the matched transmission are dispatched.
              </p>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customer.vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 relative group hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-black text-sm shadow-xs">
                      🚗
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 inline-block mt-0.5">
                        {v.plate}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteVehicle(v.id, `${v.brand} ${v.model}`)}
                    className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Transmission:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        v.transmission === "AUTOMATIC"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : v.transmission === "LUXURY"
                          ? "bg-purple-50 text-purple-800 border border-purple-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {v.transmission}
                    </span>
                  </div>
                  {v.color && (
                    <span className="text-[11px] text-slate-500">{v.color}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TRUSTED FAMILY & EMERGENCY CONTACTS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Family Safety &amp; Emergency Hub
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            During any trip, your live GPS link and vehicle inspection reports are automatically shared with this contact.
          </p>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-slate-900 text-sm">
                  {customer.emergencyContact || "Family SOS Contact"}
                </div>
                <div className="text-xs font-bold text-emerald-800 font-mono">
                  {customer.emergencyPhone || "+91 94251 09876"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${customer.emergencyPhone || "+919425109876"}`}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call Contact
              </a>
              <Link
                href="/track"
                className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" /> Share Live Radar
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3: TRIP HISTORY & INVOICES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Recent Chauffeur Bookings
              </h2>
              <p className="text-xs text-slate-500">History of dispatched chauffeurs, odometer handover logs, and receipts.</p>
            </div>
            <Link
              href="/book"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Book New Trip ➔
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No bookings found yet. Your trips will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((t) => (
                <div
                  key={t.bookingId}
                  className="rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{t.bookingId}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : t.status === "TRIP_ACTIVE"
                            ? "bg-blue-50 text-blue-800 border border-blue-200 animate-pulse"
                            : t.status === "CANCELLED"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{t.zoneName || "Vidisha Hub"}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t.pickupAddress}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span>{t.dropoffAddress}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Car: <strong>{t.vehicle.brand} {t.vehicle.model}</strong> ({t.vehicle.plate})</span>
                      {t.assignedDriver && (
                        <span>Chauffeur: <strong>{t.assignedDriver.name}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-semibold">Total Fare</div>
                      <div className="font-black text-slate-900 text-sm">₹{t.fareEstimated}</div>
                    </div>

                    {t.trackingToken && (
                      <Link
                        href={`/track?id=${t.trackingToken}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Track
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD VEHICLE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" /> Register Vehicle to Garage
              </h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fortuner 4x4"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Number Plate (RTO)</label>
                <input
                  type="text"
                  placeholder="e.g. MP-40-CA-4921"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Transmission</label>
                  <select
                    value={newTransmission}
                    onChange={(e) => setNewTransmission(e.target.value as any)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 bg-white"
                  >
                    <option value="MANUAL">MANUAL</option>
                    <option value="AUTOMATIC">AUTOMATIC</option>
                    <option value="LUXURY">LUXURY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Color (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. White"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                >
                  Save Car to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM PIN */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" /> Set Permanent Sathi PIN
              </h3>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinError("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your preferred 4-digit code. Sathi guarantees this PIN will never collide with any other passenger in Madhya Pradesh.
            </p>

            <div className="mb-4">
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 4892"
                value={customPin}
                onChange={(e) => {
                  setCustomPin(e.target.value.replace(/\D/g, ""));
                  setPinError("");
                }}
                className="w-full text-center text-3xl font-mono font-black tracking-widest py-3 border border-slate-300 rounded-2xl outline-hidden focus:border-amber-500 text-slate-900"
                autoFocus
              />
              {pinError && (
                <div className="text-[11px] text-rose-600 font-bold mt-1.5 text-center">
                  {pinError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinError("");
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomPin}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black shadow transition"
              >
                Save Sathi PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM PERSISTENT BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 py-2.5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around text-center text-[10px] font-bold">
          <Link href="/book" className="text-slate-500 hover:text-blue-600 flex flex-col items-center gap-1">
            <Navigation className="w-4 h-4" />
            <span>Book Ride</span>
          </Link>
          <Link href="/customer" className="text-blue-600 flex flex-col items-center gap-1">
            <Key className="w-4 h-4 text-amber-500" />
            <span>Sathi Pass</span>
          </Link>
          <Link href="/customer/register" className="text-slate-500 hover:text-blue-600 flex flex-col items-center gap-1">
            <User className="w-4 h-4" />
            <span>New Profile</span>
          </Link>
          <Link href="/track" className="text-slate-500 hover:text-emerald-600 flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Live Radar</span>
          </Link>
          <Link href="/driver" className="text-emerald-800 hover:text-emerald-950 flex flex-col items-center gap-1">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Driver App ↗</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
