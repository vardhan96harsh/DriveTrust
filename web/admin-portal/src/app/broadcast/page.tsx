"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Send,
  Users,
  Car,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap,
  CloudRain,
  Sparkles,
  Smartphone,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface BroadcastLog {
  id: string;
  title: string;
  message: string;
  audience: "ALL_DRIVERS" | "ALL_CUSTOMERS" | "ZONE_VIDISHA" | "ZONE_BHOPAL";
  category: "INCENTIVE" | "WEATHER" | "SAFETY" | "PROMO";
  sentAt: string;
  deliveredCount: number;
}

export default function BroadcastPage() {
  const [title, setTitle] = useState("⚡ Flash Surge Incentive: +₹150 on Airport Trips");
  const [message, setMessage] = useState(
    "High demand for Raja Bhoj Airport & Outstation bookings tonight. Earn an extra ₹150 incentive on every completed trip between 7 PM and 2 AM!"
  );
  const [audience, setAudience] = useState<"ALL_DRIVERS" | "ALL_CUSTOMERS" | "ZONE_VIDISHA" | "ZONE_BHOPAL">("ALL_DRIVERS");
  const [category, setCategory] = useState<"INCENTIVE" | "WEATHER" | "SAFETY" | "PROMO">("INCENTIVE");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [logs, setLogs] = useState<BroadcastLog[]>([
    {
      id: "bc-101",
      title: "⚡ Flash Surge Incentive: +₹150 on Airport Trips",
      message: "High demand for Raja Bhoj Airport & Outstation bookings tonight. Earn an extra ₹150 incentive on every completed trip.",
      audience: "ALL_DRIVERS",
      category: "INCENTIVE",
      sentAt: "15m ago",
      deliveredCount: 42,
    },
    {
      id: "bc-102",
      title: "🌧️ Heavy Rain Advisory (Vidisha-Sanchi Highway)",
      message: "Please maintain safe speeds below 60 km/h and verify wiper/light condition during 4-point handover.",
      audience: "ZONE_VIDISHA",
      category: "WEATHER",
      sentAt: "2h ago",
      deliveredCount: 28,
    },
    {
      id: "bc-103",
      title: "🛡️ ₹10 Lakh Transit Insurance Live",
      message: "Drive with 100% peace of mind. Every trip is protected by our ₹10,00,000 comprehensive transit insurance policy.",
      audience: "ALL_CUSTOMERS",
      category: "SAFETY",
      sentAt: "Yesterday",
      deliveredCount: 154,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: `bc-${Date.now().toString().slice(-4)}`,
        title,
        message,
        audience,
        category,
        sentAt: "Just now",
        deliveredCount: audience === "ALL_DRIVERS" ? 48 : audience === "ALL_CUSTOMERS" ? 162 : 31,
      };

      setLogs([newLog, ...logs]);
      setIsSending(false);
      showToast("Push notification dispatched via FCM & APNs gateways!");
      setTitle("");
      setMessage("");
    }, 800);
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Push Broadcast Dispatcher</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-800 border border-rose-300 uppercase tracking-wider">
              Fleet Comms
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch urgent operational push alerts, duty incentives, weather advisories, and service broadcasts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Radio className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-slate-900">Compose Push Broadcast</h2>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              {/* Audience Selector */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Target Audience:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "ALL_DRIVERS", label: "All Drivers", icon: Car },
                    { id: "ALL_CUSTOMERS", label: "All Clients", icon: Users },
                    { id: "ZONE_VIDISHA", label: "Vidisha (MP-40)", icon: Smartphone },
                    { id: "ZONE_BHOPAL", label: "Bhopal (MP-04)", icon: Smartphone },
                  ].map((aud) => {
                    const Icon = aud.icon;
                    return (
                      <button
                        type="button"
                        key={aud.id}
                        onClick={() => setAudience(aud.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                          audience === aud.id
                            ? "border-slate-900 bg-slate-900 text-white font-bold"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{aud.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">Broadcast Category:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "INCENTIVE", label: "Incentive", color: "text-amber-600" },
                    { id: "WEATHER", label: "Weather", color: "text-blue-600" },
                    { id: "SAFETY", label: "Safety Alert", color: "text-rose-600" },
                    { id: "PROMO", label: "Offer / Promo", color: "text-emerald-600" },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer font-bold ${
                        category === cat.id
                          ? "border-amber-500 bg-amber-50/50 text-slate-900"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className={cat.color}>•</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notification Headline:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash Surge: +₹150 Per Trip Now"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Message Body:</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type clear instructions for drivers or clients..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSending || !title.trim() || !message.trim()}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>{isSending ? "Dispatching to Gateways..." : "Send Live Push Broadcast"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Phone Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Device Lock Screen Preview
              </span>
              <Smartphone className="w-4 h-4 text-slate-400" />
            </div>

            {/* Simulated Notification Bubble */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center font-black text-slate-950 text-[10px]">
                    DT
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">DriveTrust</span>
                  <span className="text-[10px] text-slate-400">• now</span>
                </div>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">{title || "Notification Title"}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {message || "The notification body will appear here on customer & driver devices..."}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Target:</span>
                <span className="text-white font-mono font-semibold">{audience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Reach:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {audience === "ALL_DRIVERS" ? "48 Chauffeurs" : audience === "ALL_CUSTOMERS" ? "162 Clients" : "31 Users"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50/75 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Broadcast Dispatch History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Headline</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Delivered</th>
                <th className="py-3 px-4">Sent Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                    <div className="truncate">{log.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{log.message}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {log.audience.replace("_", " ")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                    {log.deliveredCount} devices
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {log.sentAt}
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
