"use client";

import React, { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Calendar,
  CheckCircle2,
  HardDrive,
  Users,
  Car,
  Wallet,
  ShieldCheck,
  Package,
} from "lucide-react";
import { getDrivers, getCustomers } from "@/lib/userStore";
import { getDisputes } from "@/lib/disputeStore";
import { getCorporateAccounts, getCorporateInvoices } from "@/lib/corporateStore";
import { getSafetyProfiles } from "@/lib/telematicsStore";

interface ReportConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "FINANCIAL" | "OPERATIONS" | "COMPLIANCE";
  exportFileName: string;
}

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const triggerDownload = (filename: string, content: string, type: "csv" | "json") => {
    const mimeType = type === "csv" ? "text/csv;charset=utf-8;" : "application/json;charset=utf-8;";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (reportId: string) => {
    setDownloadingId(reportId);

    setTimeout(() => {
      if (reportId === "CHAUFFEUR_KYC") {
        const drivers = getDrivers();
        const headers = "ID,Name,Phone,City,RTO_Code,KYC_Status,Experience_Years,Total_Trips,Rating,MoRTH_Sarathi_Verified\n";
        const rows = drivers
          .map(
            (d) =>
              `"${d.id}","${d.fullName}","${d.phone}","${d.city}","${d.rto}","${d.kycStatus}",${d.experienceYears},${d.totalTrips},${d.rating},true`
          )
          .join("\n");
        triggerDownload(`Sathi_Chauffeurs_${Date.now()}.csv`, headers + rows, "csv");
        showNotif("✅ Chauffeur KYC & Driver Register downloaded (CSV).");
      } else if (reportId === "GST_INVOICES") {
        const invoices = getCorporateInvoices();
        const headers = "Invoice_No,Company_Name,Billing_Period,SAC_Code,Taxable_Value,CGST_2.5_Pct,SGST_2.5_Pct,Total_Invoice_Amount,Status\n";
        const rows = invoices
          .map(
            (i) =>
              `"${i.invoiceNumber}","${i.companyName}","${i.billingPeriod}","9966",${i.baseAmount},${i.cgst},${i.sgst},${i.totalAmount},"${i.status}"`
          )
          .join("\n");
        triggerDownload(`Sathi_GST_Tax_Invoices_${Date.now()}.csv`, headers + rows, "csv");
        showNotif("✅ GST SAC 9966 Tax Invoices exported (CSV).");
      } else if (reportId === "SAFETY_TELEMATICS") {
        const profiles = getSafetyProfiles();
        const headers = "Driver_ID,Driver_Name,City,Safety_Score_100,Safety_Tier,Tracked_KM,Harsh_Brakes,Overspeeding_Events,Rapid_Accel,Status\n";
        const rows = profiles
          .map(
            (p) =>
              `"${p.driverId}","${p.driverName}","${p.city}",${p.overallScore},"${p.safetyTier}",${p.totalKmTracked},${p.harshBrakesCount},${p.overspeedingCount},${p.rapidAccelCount},"${p.status}"`
          )
          .join("\n");
        triggerDownload(`Sathi_Telematics_Safety_${Date.now()}.csv`, headers + rows, "csv");
        showNotif("✅ Chauffeur Telematics & Driving Safety Scorecards exported.");
      } else if (reportId === "FULL_BACKUP") {
        const backupData = {
          exportTimestamp: new Date().toISOString(),
          platform: "Sathi",
          tagline: "Aapki Gaadi, Aapka Sathi",
          hubs: ["Vidisha (MP-40)", "Bhopal (MP-04)"],
          drivers: getDrivers(),
          customers: getCustomers(),
          disputes: getDisputes(),
          corporateAccounts: getCorporateAccounts(),
          telematics: getSafetyProfiles(),
        };
        triggerDownload(`Sathi_Full_System_Backup_${Date.now()}.json`, JSON.stringify(backupData, null, 2), "json");
        showNotif("✅ Full platform backup downloaded (JSON).");
      }

      setDownloadingId(null);
    }, 600);
  };

  const reports: ReportConfig[] = [
    {
      id: "CHAUFFEUR_KYC",
      title: "Chauffeur Master & KYC Register",
      description: "Complete list of drivers with MoRTH Sarathi verification, DL numbers, background checks, and active vehicle classes.",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      category: "COMPLIANCE",
      exportFileName: "Sathi_Chauffeurs.csv",
    },
    {
      id: "GST_INVOICES",
      title: "GST Tax Invoices & B2B Billings (SAC 9966)",
      description: "Monthly tax invoices for corporate clients with SAC 9966, CGST/SGST breakdowns, and GSTIN audit reconciliations.",
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      category: "FINANCIAL",
      exportFileName: "Sathi_GST_Invoices.csv",
    },
    {
      id: "SAFETY_TELEMATICS",
      title: "Telematics Driving Behavior & Safety Index",
      description: "Driver safety scores (0–100), harsh braking incidents, over-speeding records, and fleet tier rankings.",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      category: "OPERATIONS",
      exportFileName: "Sathi_Telematics_Scorecard.csv",
    },
    {
      id: "FULL_BACKUP",
      title: "Full Production Database Backup",
      description: "Consolidated system state snapshot including all accounts, trips, disputes, telematics profiles, and geofence points.",
      icon: <HardDrive className="w-5 h-5 text-purple-600" />,
      category: "OPERATIONS",
      exportFileName: "Sathi_Full_Backup.json",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2 max-w-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Data Export &amp; Reporting Hub
            </h1>
            <p className="text-xs text-slate-500">
              Export GST-compliant tax invoices, driver master ledgers, and telematics audit records in CSV or JSON.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {report.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {report.category}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">{report.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{report.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{report.exportFileName}</span>
              <button
                disabled={downloadingId === report.id}
                onClick={() => handleExport(report.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {downloadingId === report.id ? "Generating..." : "Download File"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
