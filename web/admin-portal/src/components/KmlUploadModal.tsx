"use client";

import React, { useState } from "react";
import { Upload, FileText, Check, AlertCircle, X, MapPin, Layers, Globe, Sparkles } from "lucide-react";
import { parseKMLString, ParsedKMLRegion } from "@/lib/kmlParser";
import { addRegion } from "@/lib/regionStore";

interface KmlUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegionLoaded: (region: ParsedKMLRegion) => void;
}

export default function KmlUploadModal({
  isOpen,
  onClose,
  onRegionLoaded,
}: KmlUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [rawKmlText, setRawKmlText] = useState<string>("");
  const [parsedPreview, setParsedPreview] = useState<ParsedKMLRegion | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  if (!isOpen) return null;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const region = parseKMLString(text, file.name.replace(/\.[^/.]+$/, ""));
        if (region.polygonCoords.length === 0 && region.placemarks.length === 0) {
          setErrorMsg("Could not find any Polygon, LineString, or Point coordinates in this KML file.");
          setParsedPreview(null);
        } else {
          setParsedPreview(region);
        }
      } catch (err: any) {
        setErrorMsg(`Failed to parse KML: ${err.message || "Invalid XML format"}`);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the selected file.");
    };
    reader.readAsText(file);
  };

  // Handle paste parse
  const handleParseText = () => {
    setErrorMsg("");
    if (!rawKmlText.trim()) {
      setErrorMsg("Please paste your KML XML content first.");
      return;
    }
    try {
      const region = parseKMLString(rawKmlText, "Custom Pasted KML");
      if (region.polygonCoords.length === 0 && region.placemarks.length === 0) {
        setErrorMsg("No coordinates found. Verify that your KML contains <Polygon> or <coordinates> tags.");
        setParsedPreview(null);
      } else {
        setParsedPreview(region);
      }
    } catch (err: any) {
      setErrorMsg(`Failed to parse KML: ${err.message || "Invalid format"}`);
    }
  };

  // Confirm and apply region
  const handleApplyRegion = () => {
    if (!parsedPreview) return;
    if (typeof window !== "undefined") {
      try {
        const centerLat = parsedPreview.center?.[0] ?? 23.5251;
        const centerLng = parsedPreview.center?.[1] ?? 77.8081;
        addRegion({
          name: parsedPreview.name || "Custom KML Geofence",
          rtoCode: "MP-CUSTOM",
          state: "Madhya Pradesh",
          center: [centerLat, centerLng],
          zoom: parsedPreview.zoom || 13,
          areaKm2: parsedPreview.areaKm2 || 28.0,
          polygonCoords: parsedPreview.polygonCoords,
          googlePolygonCoords: parsedPreview.googlePolygonCoords,
          isActive: true,
        });
      } catch (e) {
        // storage overflow fallback
      }
    }
    onRegionLoaded(parsedPreview);
    onClose();
  };

  // Sample KML generator (Vidisha District Urban Service Geofence)
  const handleLoadSampleVidisha = () => {
    const sample = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Vidisha Urban Service Zone (MP-40)</name>
    <description>Official Sathi Priority Chauffeur Operating Perimeter for Vidisha District</description>
    <Placemark>
      <name>Vidisha City Geofence Boundary</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              77.7950,23.5180,0
              77.8350,23.5180,0
              77.8420,23.5420,0
              77.8180,23.5550,0
              77.7880,23.5350,0
              77.7950,23.5180,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
    setRawKmlText(sample);
    const region = parseKMLString(sample, "Vidisha Urban Service Zone (MP-40)");
    setParsedPreview(region);
    setActiveTab("paste");
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Import KML Map Region &amp; Boundary
            </h2>
            <p className="text-xs text-slate-500">
              Upload your .kml file to render custom geofences and operational zones on Google Maps
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "file"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Select .KML File</span>
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "paste"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste KML XML Code</span>
          </button>
        </div>

        {/* Tab 1: File Upload */}
        {activeTab === "file" && (
          <div className="space-y-4 mb-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                {fileName ? fileName : "Click to browse or drop your .kml file here"}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Standard Google Earth / GIS KML or XML files supported
              </span>
              <input
                type="file"
                accept=".kml,.xml,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Tab 2: Paste Raw KML */}
        {activeTab === "paste" && (
          <div className="space-y-3 mb-4">
            <textarea
              rows={6}
              value={rawKmlText}
              onChange={(e) => setRawKmlText(e.target.value)}
              placeholder="<kml xmlns='http://www.opengis.net/kml/2.2'>&#10;  <Document>&#10;    <Placemark>&#10;      <Polygon>..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50 leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleLoadSampleVidisha}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Vidisha Geofence</span>
              </button>
              <button
                type="button"
                onClick={handleParseText}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
              >
                Parse KML Text
              </button>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview Card */}
        {parsedPreview && (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-2 mb-4">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-emerald-800 text-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{parsedPreview.name}</span>
              </span>
              <span className="bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-mono text-[10px]">
                {parsedPreview.polygonCoords.length} Coordinates Found
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-800 font-mono">
              <div>
                Center: <b>{parsedPreview.center[0].toFixed(4)}° N, {parsedPreview.center[1].toFixed(4)}° E</b>
              </div>
              <div>
                Auto Zoom: <b>Level {parsedPreview.zoom}</b>
              </div>
            </div>

            <div className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200">
              Features: {parsedPreview.placemarks.length} Placemarks ready for Google Maps rendering.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyRegion}
            disabled={!parsedPreview}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>Apply KML Region to Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
}
