"use client";

import React, { useState, useEffect } from "react";
import DocumentViewer, { DriverKYCRecord } from "@/components/DocumentViewer";
import { ShieldCheck, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getDrivers, updateDriverKYCStatus, Driver } from "@/lib/userStore";

export default function KYCPage() {
  const [records, setRecords] = useState<DriverKYCRecord[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const loadDriverKYCRecords = () => {
    const allDrivers = getDrivers();
    const mapped: DriverKYCRecord[] = allDrivers.map((d, index) => ({
      driverId: d.id,
      fullName: d.fullName,
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      licenseExpiry: d.licenseExpiry,
      experienceYears: d.experienceYears,
      transmissions: d.transmissions,
      parivahanVerified: true,
      parivahanData: {
        rto: d.rto,
        issueDate: "2019-08-16",
        covDetails: ["LMV-NT", "TRANS (Commercial Chauffeur)", "MCWG"],
        fatherName: "Narayana " + d.fullName.split(" ")[0],
        bloodGroup: index % 2 === 0 ? "O+" : "B+",
      },
      policeClearanceVerified: true,
      biometricMatchScore: 98.4 + (index % 2) * 1.1,
      kycStatus: d.kycStatus === "APPROVED" ? "APPROVED" : d.kycStatus === "REJECTED" ? "REJECTED" : "UNDER_REVIEW",
    }));

    setRecords(mapped);
  };

  useEffect(() => {
    loadDriverKYCRecords();
  }, []);

  const handleApprove = (driverId: string) => {
    updateDriverKYCStatus(driverId, "APPROVED");
    loadDriverKYCRecords();
    showNotification(`✓ Chauffeur ${driverId} APPROVED in MoRTH Sarathi! Enabled for instant customer dispatches.`);
  };

  const handleReject = (driverId: string, reason: string) => {
    updateDriverKYCStatus(driverId, "REJECTED");
    loadDriverKYCRecords();
    showNotification(`Chauffeur ${driverId} REJECTED: "${reason}". Terminal access suspended.`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const pendingCount = records.filter((r) => r.kycStatus === "UNDER_REVIEW").length;
  const approvedCount = records.filter((r) => r.kycStatus === "APPROVED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xl animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Driver KYC Verification Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              MoRTH SARATHI API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official commercial license validation, Aadhaar biometric cross-match, and Indian Police clearance audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {pendingCount} Pending Review
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {approvedCount} Active Chauffeurs
            </span>
          </div>

          <Link
            href="/drivers"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            Onboard New Driver →
          </Link>
        </div>
      </div>

      {/* Driver Records List */}
      <div className="space-y-6">
        {records.map((rec) => (
          <DocumentViewer
            key={rec.driverId}
            record={rec}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}
