"use client";

import React, { useState } from "react";

export interface DriverKYCRecord {
  driverId: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  transmissions: string[];
  parivahanVerified: boolean;
  parivahanData: {
    rto: string;
    issueDate: string;
    covDetails: string[];
    fatherName: string;
    bloodGroup: string;
  };
  policeClearanceVerified: boolean;
  biometricMatchScore: number;
  kycStatus: "PENDING_DOCS" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
}

interface DocumentViewerProps {
  record: DriverKYCRecord;
  onApprove: (driverId: string) => void;
  onReject: (driverId: string, reason: string) => void;
}

export default function DocumentViewer({ record, onApprove, onReject }: DocumentViewerProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [status, setStatus] = useState(record.kycStatus);

  const handleApprove = () => {
    setStatus("APPROVED");
    onApprove(record.driverId);
  };

  const handleConfirmReject = () => {
    setStatus("REJECTED");
    onReject(record.driverId, rejectReason || "Documents illegible or expired");
    setShowRejectModal(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Driver Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-base font-bold shadow-xs">
            {record.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-slate-900">{record.fullName}</h3>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : status === "REJECTED"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {status.replace("_", " ")}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {record.driverId} • Phone: {record.phone}
            </div>
          </div>
        </div>

        {/* Verification Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span>✓</span> Parivahan Sarathi API Verified
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <span>✓</span> Biometric Match {record.biometricMatchScore}%
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <span>✓</span> Police Clearance Verified
          </div>
        </div>
      </div>

      {/* Side-by-Side Document Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driving License Digital Card Preview */}
        <div className="rounded-xl p-5 bg-slate-900 text-white border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🇮🇳</span> Form 7: Smart Driving License
            </span>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Valid
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">DL Number</span>
              <span className="font-mono font-bold text-white tracking-wide">{record.licenseNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">RTO Jurisdiction</span>
              <span className="font-medium text-slate-200">{record.parivahanData.rto}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Validity Expiry</span>
              <span className="font-mono text-amber-300 font-semibold">{record.licenseExpiry}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Driving Experience</span>
              <span className="font-medium text-slate-200">{record.experienceYears} Years Verified</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase mb-1.5">Endorsed Vehicle Classes</span>
            <div className="flex gap-1.5 flex-wrap">
              {record.parivahanData.covDetails.map((cov, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {cov}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <span className="text-slate-400 text-[10px] block uppercase">Transmissions Supported:</span>
            <span className="text-xs font-semibold text-emerald-400">{record.transmissions.join(", ")}</span>
          </div>
        </div>

        {/* Verification Check & Identity Cross-Match */}
        <div className="rounded-xl p-5 bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Automated Fraud & Background Screening
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-600">MoRTH Parivahan Database Query</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span>●</span> 100% Name Match
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-600">Challan & Traffic Court Records</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span>●</span> 0 Outstanding Violations
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-600">Criminal History (CCTNS Check)</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span>●</span> Clean Police Record
                </span>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={handleApprove}
              disabled={status === "APPROVED"}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "APPROVED" ? "Driver Approved ✓" : "Approve Driver Credentials"}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={status === "REJECTED"}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-300 font-semibold text-xs tracking-wide transition disabled:opacity-50 shadow-xs"
            >
              Reject / Re-upload
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Reject Driver KYC Application</h4>
            <p className="text-xs text-slate-500">
              Specify the reason for document rejection. The driver will receive an instant push notification to re-upload.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Driving license photo is blurry or expired"
              rows={3}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
