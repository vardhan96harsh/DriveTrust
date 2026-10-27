"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  AlertCircle,
  Building2,
  Wallet,
  Check,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

interface DriverPayoutRecord {
  id: string;
  driverId: string;
  driverName: string;
  phone: string;
  rto: string;
  bankAccount: string;
  ifsc: string;
  upiId: string;
  panNumber: string;
  totalTrips: number;
  grossFares: number;
  platformCommission: number; // 15%
  tdsDeduction: number; // 1%
  netPayout: number;
  payoutStatus: "PENDING_APPROVAL" | "PROCESSED" | "ON_HOLD";
  cyclePeriod: string;
}

const INITIAL_PAYOUTS: DriverPayoutRecord[] = [
  {
    id: "PAY-2026-W42-01",
    driverId: "drv-001",
    driverName: "Rajesh Sharma",
    phone: "+91 98260 12345",
    rto: "MP-40 (Vidisha)",
    bankAccount: "••••••••4892 (SBI Vidisha)",
    ifsc: "SBIN0001284",
    upiId: "rajesh.sharma@okaxis",
    panNumber: "ABCPS1289K",
    totalTrips: 14,
    grossFares: 12450,
    platformCommission: 1867.5,
    tdsDeduction: 124.5,
    netPayout: 10458.0,
    payoutStatus: "PENDING_APPROVAL",
    cyclePeriod: "18 Oct - 24 Oct 2026",
  },
  {
    id: "PAY-2026-W42-02",
    driverId: "drv-002",
    driverName: "Mukesh Patel",
    phone: "+91 98261 23456",
    rto: "MP-40 (Vidisha)",
    bankAccount: "••••••••7120 (HDFC Bank)",
    ifsc: "HDFC0002190",
    upiId: "mukesh.vidisha@okhdfcbank",
    panNumber: "BLMPP4491E",
    totalTrips: 18,
    grossFares: 16800,
    platformCommission: 2520.0,
    tdsDeduction: 168.0,
    netPayout: 14112.0,
    payoutStatus: "PENDING_APPROVAL",
    cyclePeriod: "18 Oct - 24 Oct 2026",
  },
  {
    id: "PAY-2026-W42-03",
    driverId: "drv-003",
    driverName: "Dharmendra Lodhi",
    phone: "+91 98262 34567",
    rto: "MP-04 (Bhopal)",
    bankAccount: "••••••••9931 (Bank of Baroda)",
    ifsc: "BARB0BHOPAL",
    upiId: "lodhi.dharmendra@paytm",
    panNumber: "CLDPL9921B",
    totalTrips: 22,
    grossFares: 21200,
    platformCommission: 3180.0,
    tdsDeduction: 212.0,
    netPayout: 17808.0,
    payoutStatus: "PENDING_APPROVAL",
    cyclePeriod: "18 Oct - 24 Oct 2026",
  },
  {
    id: "PAY-2026-W42-04",
    driverId: "drv-004",
    driverName: "Sanjay Ahirwar",
    phone: "+91 98263 45678",
    rto: "MP-04 (Bhopal)",
    bankAccount: "••••••••1104 (PNB Vidisha)",
    ifsc: "PUNB0182900",
    upiId: "sanjay.ahirwar@upi",
    panNumber: "ASDAR5501H",
    totalTrips: 11,
    grossFares: 9600,
    platformCommission: 1440.0,
    tdsDeduction: 96.0,
    netPayout: 8064.0,
    payoutStatus: "PROCESSED",
    cyclePeriod: "11 Oct - 17 Oct 2026",
  },
  {
    id: "PAY-2026-W42-05",
    driverId: "drv-005",
    driverName: "Imran Qureshi",
    phone: "+91 98264 56789",
    rto: "MP-04 (Bhopal)",
    bankAccount: "••••••••3318 (Axis Bank Bhopal)",
    ifsc: "UTIB0001092",
    upiId: "imran.qureshi@icici",
    panNumber: "IMRPQ1029R",
    totalTrips: 16,
    grossFares: 14500,
    platformCommission: 2175.0,
    tdsDeduction: 145.0,
    netPayout: 12180.0,
    payoutStatus: "PROCESSED",
    cyclePeriod: "11 Oct - 17 Oct 2026",
  },
];

export default function PayoutsSettlementPage() {
  const [payouts, setPayouts] = useState<DriverPayoutRecord[]>(INITIAL_PAYOUTS);
  const [activeTab, setActiveTab] = useState<"PENDING" | "PROCESSED" | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingList = payouts.filter((p) => p.payoutStatus === "PENDING_APPROVAL");
  const totalPendingPayout = pendingList.reduce((acc, p) => acc + p.netPayout, 0);
  const totalCommissionEarned = payouts.reduce((acc, p) => acc + p.platformCommission, 0);

  const handleApprovePayout = (id: string, name: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, payoutStatus: "PROCESSED" } : p))
    );
    showToast(`✓ UPI Payout for ${name} APPROVED! Dispatched via ICICI Corporate Banking API.`);
  };

  const handleBatchProcessAll = () => {
    setPayouts((prev) =>
      prev.map((p) => (p.payoutStatus === "PENDING_APPROVAL" ? { ...p, payoutStatus: "PROCESSED" } : p))
    );
    showToast(`✓ ALL ${pendingList.length} pending weekly driver payouts PROCESSED successfully! Total: ₹${totalPendingPayout.toLocaleString("en-IN")}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredPayouts = payouts.filter((p) => {
    if (activeTab === "PENDING") return p.payoutStatus === "PENDING_APPROVAL";
    if (activeTab === "PROCESSED") return p.payoutStatus === "PROCESSED";
    return true;
  }).filter((p) =>
    p.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Chauffeur Payouts &amp; Commission Settlement
              </h1>
              <p className="text-xs text-slate-500">
                Weekly automated IMPS/UPI bank transfers, 15% platform commission deduction, and TDS compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const headers = "Driver,RTO,Bank Account,Trips,Gross (INR),Commission (INR),TDS (INR),Net Payout (INR),UPI ID\n";
              const rows = payouts
                .map(
                  (p) =>
                    `"${p.driverName.replace(/"/g, '""')}","${p.rto}","${p.bankAccount.replace(/"/g, '""')}",${p.totalTrips},${p.grossFares},${p.platformCommission},${p.tdsDeduction},${p.netPayout},"${p.upiId}"`
                )
                .join("\n");
              const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `drivetrust-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Bank NACH/CSV</span>
          </button>

          {pendingList.length > 0 && (
            <button
              onClick={handleBatchProcessAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-100" />
              <span>Approve All ({pendingList.length}) Pending (₹{totalPendingPayout.toLocaleString("en-IN")})</span>
            </button>
          )}
        </div>
      </div>

      {/* Payout Calculation & Settlement Formula Explainer */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-950 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <span className="w-5 h-5 rounded-md bg-emerald-200/80 flex items-center justify-center text-emerald-800 text-[11px] font-black">₹</span>
            <span>How Chauffeur Payouts Are Calculated (सरल पेमेंट नियम)</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            AUTOMATED UPI / IMPS SETTLEMENT
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-[11px] leading-relaxed">
          <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200">
            <div className="font-bold text-slate-900 mb-0.5">1. Gross Fare (100%)</div>
            <p className="text-slate-600">Total tariff charged to customer based on hours and kilometers driven.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200">
            <div className="font-bold text-amber-900 mb-0.5">2. Less Commission (-15%)</div>
            <p className="text-slate-600">DriveTrust platform fee covers GPS tracking, support, and ₹10L transit insurance.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200">
            <div className="font-bold text-rose-900 mb-0.5">3. Less Tax TDS (-1%)</div>
            <p className="text-slate-600">Statutory Section 194O TDS deposited against driver&apos;s PAN card with Govt of India.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white border border-emerald-700 shadow-xs">
            <div className="font-bold text-white mb-0.5">4. Net Chauffeur Pay (84%)</div>
            <p className="text-emerald-100">Directly transferred to driver&apos;s UPI ID or Bank Account via ICICI Corporate API.</p>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Pending Settlements
          </span>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalPendingPayout.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            {pendingList.length} Chauffeurs Awaiting Transfer
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            DriveTrust Platform Take Rate (15%)
          </span>
          <div className="text-2xl font-black text-emerald-700">
            ₹{totalCommissionEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Retained Commission Net
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Payout SLA Latency
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            &lt; 3 Secs
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Instant NPCI UPI Rails
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Section 194C TDS
          </span>
          <div className="text-2xl font-black text-slate-900">
            1.00%
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Income Tax e-Filing Compliant
          </span>
        </div>
      </div>

      {/* Settlement Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "PENDING"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending Approval ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab("PROCESSED")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "PROCESSED"
                  ? "bg-white text-emerald-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Processed Batches ({payouts.filter((p) => p.payoutStatus === "PROCESSED").length})
            </button>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "ALL"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Records ({payouts.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver, UPI, or RTO..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Chauffeur &amp; Region</th>
                <th className="py-3 px-4">Bank &amp; UPI VPA</th>
                <th className="py-3 px-4">Duty Count</th>
                <th className="py-3 px-4">Gross Customer Fares</th>
                <th className="py-3 px-4">15% Commission</th>
                <th className="py-3 px-4">Net Driver Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPayouts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{row.driverName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.phone} • {row.rto}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 font-bold text-[11px]">{row.upiId}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{row.bankAccount} ({row.ifsc})</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {row.totalTrips} Trips
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-900 font-bold">
                    ₹{row.grossFares.toLocaleString("en-IN")}.00
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-600 font-semibold">
                    -₹{row.platformCommission.toLocaleString("en-IN")}.00
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-700 text-sm">
                    ₹{row.netPayout.toLocaleString("en-IN")}.00
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.payoutStatus === "PROCESSED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.payoutStatus === "PROCESSED" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {row.payoutStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {row.payoutStatus === "PENDING_APPROVAL" ? (
                      <button
                        onClick={() => handleApprovePayout(row.id, row.driverName)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                      >
                        Approve Transfer
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        Dispatched ✓
                      </span>
                    )}
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
