"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Car,
  Key,
  Upload,
  ArrowRight,
  Check,
  ChevronLeft,
  BadgeIndianRupee,
  Clock,
  Sparkles,
} from "lucide-react";
import { saveDriver } from "@/lib/userStore";

export default function DriverRegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Vidisha");
  const [rto, setRto] = useState("MP-40");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("2032-05-18");
  const [experienceYears, setExperienceYears] = useState(5);
  const [transmissions, setTransmissions] = useState<("MANUAL" | "AUTOMATIC" | "LUXURY")[]>([
    "MANUAL",
    "AUTOMATIC",
  ]);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState("");

  const handleToggleTransmission = (type: "MANUAL" | "AUTOMATIC" | "LUXURY") => {
    if (transmissions.includes(type)) {
      if (transmissions.length > 1) {
        setTransmissions(transmissions.filter((t) => t !== type));
      }
    } else {
      setTransmissions([...transmissions, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !licenseNumber || !aadhaarNumber || !upiId) {
      alert("Please fill all required commercial chauffeur details.");
      return;
    }

    const created = saveDriver({
      fullName,
      phone,
      city,
      rto,
      licenseNumber,
      licenseExpiry,
      experienceYears: Number(experienceYears),
      transmissions,
      aadhaarNumber,
      upiId,
      kycStatus: "UNDER_REVIEW", // Initial status awaiting Super Admin verification
    });

    setRegisteredId(created.id);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans pb-16">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/driver"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <span>Driver Cockpit</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>MoRTH Onboarding</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {/* Title Header */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            Partner Recruitment • Vidisha &amp; Bhopal Hubs
          </span>
          <h1 className="text-xl font-black text-white mt-0.5">Commercial Chauffeur Self-Registration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Drive high-value customer vehicles (Fortuner, BMW, Sedans). 80% guaranteed net payout with instant IMPS transfers.
          </p>
        </div>

        {/* Confirmation Screen after Submission */}
        {isSubmitted ? (
          <div className="bg-gradient-to-b from-[#111A29] to-[#0A0E17] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">Application Successfully Submitted!</h2>
              <p className="text-xs text-slate-300">
                Chauffeur Profile ID: <strong className="font-mono text-emerald-400">{registeredId}</strong>
              </p>
            </div>

            {/* Status Alert Box */}
            <div className="p-4 rounded-2xl bg-[#070A11] border border-amber-500/30 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>KYC Status: UNDER REVIEW</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                To ensure passenger safety, your Driving License (<strong className="text-white font-mono">{licenseNumber}</strong>) and Police Verification are being audited by <strong>Super Admin Harsh</strong> against the MoRTH Sarathi National Register.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Estimated Verification Time:</span>
                <span className="text-emerald-400 font-semibold font-mono">~15 Minutes</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/driver"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Go to Chauffeur Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kyc"
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>View in Admin KYC Vault ↗</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-4 text-xs">
            {/* Section 1: Personal Details */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
                1. Personal &amp; Operating Hub
              </span>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Legal Name (as per DL): *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mahesh Verma"
                  className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mobile (WhatsApp): *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94251 00000"
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Aadhaar (Last 4 Digits): *</label>
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 9912"
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Operating City: *</label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setRto(e.target.value === "Vidisha" ? "MP-40" : "MP-04");
                    }}
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Vidisha">Vidisha Hub</option>
                    <option value="Bhopal">Bhopal Hub</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">RTO Jurisdiction: *</label>
                  <input
                    type="text"
                    readOnly
                    value={rto}
                    className="w-full bg-[#070A11] border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Commercial DL Credentials */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
                2. Driving License &amp; Vehicle Transmission Endorsements
              </span>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Commercial DL Number: *</label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MP-40-2022-0091823"
                  className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">DL Expiry Date: *</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-emerald-500 outline-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Driving Experience: *</label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value={3}>3+ Years</option>
                    <option value={5}>5+ Years</option>
                    <option value={8}>8+ Years</option>
                    <option value={10}>10+ Years Elite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Qualified Vehicle Transmissions: * (Tap to select)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleTransmission("MANUAL")}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                      transmissions.includes("MANUAL")
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-[#070A11] border-slate-800 text-slate-500"
                    }`}
                  >
                    Manual Gear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTransmission("AUTOMATIC")}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                      transmissions.includes("AUTOMATIC")
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-[#070A11] border-slate-800 text-slate-500"
                    }`}
                  >
                    Automatic
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTransmission("LUXURY")}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition ${
                      transmissions.includes("LUXURY")
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-[#070A11] border-slate-800 text-slate-500"
                    }`}
                  >
                    Luxury VIP
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Manual certification permits driving both Manual SUVs (Fortuner) and Automatics.
                </p>
              </div>
            </div>

            {/* Section 3: Payout UPI ID */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
                3. Settlement Wallet Payout Details
              </span>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  UPI VPA / Bank ID (Instant IMPS): *
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mahesh.verma@okaxis"
                  className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  ✓ 80% Chauffeur split credited instantly upon ride completion.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit for MoRTH Sarathi Verification</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
