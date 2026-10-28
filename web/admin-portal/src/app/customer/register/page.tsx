"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Car,
  Key,
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Mail,
  AlertTriangle,
  Smartphone,
  Navigation,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  saveCustomer,
  generateUniqueCustomerPin,
  getCustomers,
  setActiveCustomerId,
} from "@/lib/userStore";

export default function CustomerRegisterPage() {
  const router = useRouter();

  // Personal Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Vidisha");
  const [address, setAddress] = useState("");

  // Primary Vehicle Info
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const [transmission, setTransmission] = useState<"MANUAL" | "AUTOMATIC" | "LUXURY">("MANUAL");
  const [carColor, setCarColor] = useState("");

  // Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 ");

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocatedPin, setAllocatedPin] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("Please fill in your name, contact phone, and home address.");
      return;
    }
    if (!carBrand.trim() || !carModel.trim() || !carPlate.trim()) {
      setErrorMsg("Please provide your car brand, model, and number plate.");
      return;
    }

    setIsSubmitting(true);

    try {
      const existing = getCustomers();
      const newPin = generateUniqueCustomerPin(existing);

      const customerId = `cust-${Date.now().toString().slice(-4)}`;
      const saved = saveCustomer({
        id: customerId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        city: city.trim(),
        address: address.trim(),
        emergencyContact: emergencyContact.trim() || "Family Contact",
        emergencyPhone: emergencyPhone.trim() || phone.trim(),
        permanentPin: newPin,
        verificationStatus: "VERIFIED",
        phoneVerified: true,
        aadhaarVerified: true,
        vehicles: [
          {
            id: `veh-${Date.now().toString().slice(-4)}`,
            brand: carBrand.trim(),
            model: carModel.trim(),
            plate: carPlate.trim().toUpperCase(),
            transmission,
            color: carColor.trim() || "White",
            year: new Date().getFullYear(),
          },
        ],
      });

      setActiveCustomerId(saved.id);
      setAllocatedPin(newPin);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to register customer account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <div>
              <div className="font-black text-slate-900 text-base leading-tight">Sathi Chauffeur</div>
              <div className="text-[10px] text-slate-500 font-semibold">Vehicle Owner Onboarding</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <Link href="/book" className="font-bold text-blue-600 hover:text-blue-700">
              Skip to Book ➔
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8">
        {/* SUCCESS CELEBRATION CARD */}
        {allocatedPin ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">Registration Complete</span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Welcome to Sathi, {fullName}!</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your personal vehicle has been registered to your Sathi garage. You can now request verified chauffeurs in Vidisha (MP-40) and Bhopal (MP-04).
              </p>
            </div>

            {/* Permanent PIN Spotlight */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 border border-slate-800 shadow-inner max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <Key className="w-4 h-4 text-amber-400" /> Your Permanent Sathi PIN
              </div>
              <div className="text-4xl font-mono font-black tracking-widest text-amber-400 my-2">
                {allocatedPin}
              </div>
              <p className="text-[11px] text-slate-300">
                Memorize this 4-digit code. Hand it to your chauffeur to start every trip safely.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/book"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Book First Chauffeur
              </Link>
              <Link
                href="/customer"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> View Sathi Pass &amp; Garage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Personal Chauffeur Service</span>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">Register Your Car &amp; Account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enjoy professional chauffeur service for your own car. We ensure verified drivers with matching transmission experience (Manual, Automatic, or Luxury).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: OWNER IDENTITY */}
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-blue-600" /> 1. Vehicle Owner Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Harshvardhan Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Phone (OTP) *</label>
                    <input
                      type="tel"
                      placeholder="+91 98450 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Operating City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 bg-white"
                    >
                      <option value="Vidisha">Vidisha (MP-40 District Hub)</option>
                      <option value="Bhopal">Bhopal (MP-04 Capital Hub)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. harsh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Home / Pickup Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Lines, Station Road, Vidisha"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* STEP 2: PRIMARY VEHICLE */}
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Car className="w-4 h-4 text-blue-600" /> 2. Primary Car in Garage
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Make / Brand *</label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota, Honda, Hyundai"
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Model Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Fortuner, City, Creta"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Registration Plate (RTO) *</label>
                    <input
                      type="text"
                      placeholder="MP-40-CA-4921"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Transmission *</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as any)}
                      className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 bg-white"
                    >
                      <option value="MANUAL">MANUAL (Standard)</option>
                      <option value="AUTOMATIC">AUTOMATIC (CVT / Torque)</option>
                      <option value="LUXURY">LUXURY (BMW / Audi / Benz)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Car Color</label>
                    <input
                      type="text"
                      placeholder="e.g. White"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: FAMILY SOS CONTACT */}
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3. Trusted Family Safety Contact
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Family Member / Spouse"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Emergency Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 94251 09876"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Sathi Pass...</span>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Get Permanent Sathi PIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
