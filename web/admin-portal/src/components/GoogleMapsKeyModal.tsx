"use client";

import React, { useState, useEffect } from "react";
import { Key, Check, Copy, X } from "lucide-react";

interface GoogleMapsKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
  currentKey: string;
}

export default function GoogleMapsKeyModal({
  isOpen,
  onClose,
  onKeySaved,
  currentKey,
}: GoogleMapsKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentKey || "");
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setApiKey(currentKey || "");
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("dt_gcp_maps_api_key", trimmed);
      } else {
        localStorage.removeItem("dt_gcp_maps_api_key");
      }
    }
    onKeySaved(trimmed);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleCopyEnvSnippet = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${apiKey || "YOUR_GOOGLE_CLOUD_API_KEY"}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Map Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Configure optional Maps API Key for high-definition mapping
            </p>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50 transition"
              />
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setApiKey("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Key is securely preserved in your local browser workspace.
            </p>
          </div>
        </div>

        {/* Environment Variable Snippet */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Or configure in .env.local:</span>
            <button
              onClick={handleCopyEnvSnippet}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Snippet"}</span>
            </button>
          </div>
          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto flex items-center justify-between">
            <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY={apiKey || "AIzaSy..."}</code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-white" /> : <Key className="w-4 h-4" />}
            <span>{saveSuccess ? "Saved Successfully!" : "Save & Activate Google Map"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
