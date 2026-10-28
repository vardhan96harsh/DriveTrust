"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Car,
  Star,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
  Check,
} from "lucide-react";
import { getDrivers, Driver } from "@/lib/userStore";

export default function DriverProfilePage() {
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const drivers = getDrivers();
    if (drivers.length > 0) {
      setDriver(drivers[0]); // Rajesh Sharma default
    }
  }, []);

  if (!driver) {
    return (
      <div className="min-h-screen bg-[#070A11] text-white flex items-center justify-center p-4">
        <div className="text-xs text-slate-400">Loading chauffeur digital ID...</div>
      </div>
    );
  }

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
            <span>Chauffeur Cockpit</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Digital ID Card</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {/* Obsidian Metallic Digital ID Card */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#131B2E] via-[#0E1524] to-[#0A0E17] border border-slate-700/80 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header row */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Commercial Chauffeur Credential
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ID: #{driver.id.toUpperCase()}</span>
          </div>

          {/* Avatar and Primary Identity */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-emerald-500/50 flex items-center justify-center font-black text-white text-xl shadow-lg">
              {driver.fullName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-white tracking-tight">{driver.fullName}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  MoRTH
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="flex items-center text-amber-400 font-bold gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {driver.rating}
                </span>
                <span>•</span>
                <span>{driver.totalTrips} Completed Trips</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {driver.city} Hub ({driver.rto})
              </p>
            </div>
          </div>

          {/* Sarathi Verification Pill */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MoRTH Sarathi Registry: Verified</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">DigiLocker Linked</span>
          </div>
        </div>

        {/* Credentials & Driving License Details */}
        <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
            Official Driving License Credentials
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#070A11] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">DL Number</span>
              <span className="font-mono font-bold text-white text-xs">{driver.licenseNumber}</span>
            </div>
            <div className="p-3 bg-[#070A11] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">RTO Authority</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">{driver.rto} (Vidisha)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#070A11] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">DL Expiry</span>
              <span className="font-mono font-bold text-white text-xs">{driver.licenseExpiry}</span>
            </div>
            <div className="p-3 bg-[#070A11] rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Experience</span>
              <span className="font-mono font-bold text-white text-xs">{driver.experienceYears} Years</span>
            </div>
          </div>

          {/* Qualified Transmissions */}
          <div className="p-3 bg-[#070A11] rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">
              Authorized Vehicle Transmissions
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {driver.transmissions.map((t) => (
                <span
                  key={t}
                  className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded"
                >
                  ✓ {t} Qualified
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Authorized for customer SUVs (Fortuner 4x4 Manual) and luxury automatics.
            </p>
          </div>
        </div>

        {/* Settlement & Banking */}
        <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
            Settlement Wallet &amp; Payout VPA
          </span>

          <div className="flex items-center justify-between p-3 bg-[#070A11] rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">IMPS Settlement UPI</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">{driver.upiId}</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300">
            80% chauffeur share is credited directly to this UPI VPA instantly upon customer ride conclusion.
          </div>
        </div>

        {/* Regional Hub Manager Support */}
        <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-800 pb-1">
            Regional Operations Support
          </span>
          <div className="flex items-center justify-between text-slate-300">
            <span>Operating Hub Lead:</span>
            <span className="font-bold text-white">Ankit Sharma (Vidisha MP-40)</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Hub Contact:</span>
            <span className="font-mono text-emerald-400">+91 94251 22001</span>
          </div>
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Operational Email:</span>
            <span className="font-mono text-slate-300">ankit.mp40@sathi.in</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href="/driver"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5"
          >
            <span>Enter Chauffeur Duty Cockpit</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/driver/register"
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Register Another Driver Partner ↗</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
