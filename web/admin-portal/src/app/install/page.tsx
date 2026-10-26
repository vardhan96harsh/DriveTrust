"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Car,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Copy,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function InstallHubPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const localIp = "192.168.29.200";
  const customerUrl = `http://${localIp}:3000/book`;
  const driverUrl = `http://${localIp}:3000/driver`;
  const trackUrl = `http://${localIp}:3000/track`;

  const copyToClipboard = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-sans">
      {/* Toast Notification */}
      {copiedLink && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copiedLink} link copied to clipboard!</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Install on Your Mobile Device
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Test Customer &amp; Driver Apps on Mobile
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Scan the QR codes below with your phone camera or open the links to install both apps directly onto your home screen.
        </p>
      </div>

      {/* 2 App Install Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. CUSTOMER APP */}
        <div className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase px-2.5 py-1 rounded-lg">
                For Car Owners
              </span>
              <span className="text-xs text-slate-400 font-semibold">Web App (PWA)</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Sathi Customer</h3>
                  <p className="text-xs text-slate-500 font-semibold">Aapki Gaadi, Aapka Sathi</p>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    customerUrl
                  )}`}
                  alt="Customer App QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Scan with phone camera to open Sathi Customer App
              </p>
            </div>

            {/* Direct Link */}
            <div className="bg-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono text-slate-700">
              <span className="truncate mr-2">{customerUrl}</span>
              <button
                onClick={() => copyToClipboard(customerUrl, "Customer App")}
                className="shrink-0 p-1.5 hover:bg-white rounded-lg transition-all"
                title="Copy Link"
              >
                <Copy className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Features List */}
            <ul className="text-xs space-y-1.5 text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Multi-car garage (Fortuner, Creta, Mercedes)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Hourly packages &amp; City Point-to-Point
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                360° vehicle handover sign-off with Start OTP
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
            <a
              href={customerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-center text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Sathi Customer App
            </a>
          </div>
        </div>

        {/* 2. DRIVER PARTNER APP */}
        <div className="bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 text-white rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-black uppercase px-2.5 py-1 rounded-lg">
                For Chauffeurs
              </span>
              <span className="text-xs text-slate-400 font-semibold">Partner Cockpit</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Sathi Partner</h3>
                  <p className="text-xs text-slate-400 font-semibold">Chauffeur Duty &amp; Payouts</p>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    driverUrl
                  )}`}
                  alt="Driver App QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Scan with phone camera to open Sathi Partner App
              </p>
            </div>

            {/* Direct Link */}
            <div className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300 border border-slate-700">
              <span className="truncate mr-2">{driverUrl}</span>
              <button
                onClick={() => copyToClipboard(driverUrl, "Driver App")}
                className="shrink-0 p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                title="Copy Link"
              >
                <Copy className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Features List */}
            <ul className="text-xs space-y-1.5 text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Duty Toggle (Online/Offline) with ride audio alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                4-photo 360° vehicle scratch check before trip
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Live Speedometer &amp; Instant 1-Click UPI Payouts
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6 flex items-center gap-2">
            <a
              href={driverUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-center text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Sathi Partner App
            </a>
          </div>
        </div>
      </div>

      {/* How to "Add to Home Screen" Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600" />
          How to Install as Standalone Mobile Apps
        </h3>
        <p className="text-xs text-slate-600">
          Once you open the link in your phone browser, follow these simple steps to install the app on your home screen:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                1
              </span>
              On Android (Google Chrome)
            </div>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1">
              <li>Open the link in Chrome.</li>
              <li>Tap the <strong>three dots menu (⋮)</strong> at top-right.</li>
              <li>
                Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
              </li>
              <li>
                Tap <strong>&quot;Install&quot;</strong>. The app icon will appear on your phone home screen!
              </li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                2
              </span>
              On iPhone (Apple Safari)
            </div>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1">
              <li>Open the link in Safari.</li>
              <li>
                Tap the <strong>Share button</strong> (square with an upward arrow) at bottom.
              </li>
              <li>
                Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </li>
              <li>
                Tap <strong>&quot;Add&quot;</strong> at top-right. The app icon will appear on your iPhone!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
