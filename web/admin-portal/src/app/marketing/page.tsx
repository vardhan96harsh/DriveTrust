"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Tag,
  Radio,
  Trash2,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Send,
  Users,
  Car,
  MapPin,
  Percent,
  BadgeIndianRupee,
  ChevronRight,
  Zap,
  Clock,
} from "lucide-react";
import {
  getPromoCodes,
  addPromoCode,
  togglePromoCode,
  deletePromoCode,
  getBroadcasts,
  sendBroadcast,
  PromoCode,
  PushBroadcast,
} from "@/lib/marketingStore";

type ActiveTab = "PROMO_CODES" | "BROADCASTS";

const AUDIENCE_LABELS: Record<PushBroadcast["targetAudience"], string> = {
  ALL_DRIVERS: "All Registered Drivers (18)",
  ONLINE_DRIVERS: "Currently Online Drivers (7)",
  VIDISHA_DRIVERS: "Vidisha Hub Drivers (9)",
  BHOPAL_DRIVERS: "Bhopal Hub Drivers (9)",
  ALL_CUSTOMERS: "All Registered Customers (142)",
};

const AUDIENCE_ICON: Record<PushBroadcast["targetAudience"], React.ReactNode> = {
  ALL_DRIVERS: <Car className="w-3.5 h-3.5" />,
  ONLINE_DRIVERS: <Zap className="w-3.5 h-3.5 text-emerald-600" />,
  VIDISHA_DRIVERS: <MapPin className="w-3.5 h-3.5 text-blue-600" />,
  BHOPAL_DRIVERS: <MapPin className="w-3.5 h-3.5 text-purple-600" />,
  ALL_CUSTOMERS: <Users className="w-3.5 h-3.5 text-slate-600" />,
};

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("PROMO_CODES");
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [broadcasts, setBroadcasts] = useState<PushBroadcast[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Create promo modal state
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<"FLAT" | "PERCENT">("FLAT");
  const [newDiscountValue, setNewDiscountValue] = useState("");
  const [newMaxDiscount, setNewMaxDiscount] = useState("");
  const [newMinFare, setNewMinFare] = useState("");
  const [newValidFrom, setNewValidFrom] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [newUsageLimit, setNewUsageLimit] = useState("");
  const [newTargetCity, setNewTargetCity] = useState("");

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [bcTitle, setBcTitle] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcAudience, setBcAudience] = useState<PushBroadcast["targetAudience"]>("VIDISHA_DRIVERS");
  const [bcIncentive, setBcIncentive] = useState("");
  const [bcValidMins, setBcValidMins] = useState("");

  useEffect(() => {
    setPromoCodes(getPromoCodes());
    setBroadcasts(getBroadcasts());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreatePromo = () => {
    if (!newCode.trim() || !newDiscountValue || !newMinFare || !newValidFrom || !newValidUntil || !newUsageLimit) {
      showNotif("❌ All required fields must be filled.");
      return;
    }
    const updated = addPromoCode({
      code: newCode.toUpperCase().trim().replace(/\s/g, ""),
      description: newDescription,
      discountType: newDiscountType,
      discountValue: parseFloat(newDiscountValue),
      maxDiscount: newMaxDiscount ? parseFloat(newMaxDiscount) : undefined,
      minFare: parseFloat(newMinFare),
      validFrom: newValidFrom,
      validUntil: newValidUntil,
      usageLimit: parseInt(newUsageLimit),
      isActive: true,
      targetCity: newTargetCity || undefined,
      createdBy: "Admin Harsh",
    });
    setPromoCodes(updated);
    setShowCreatePromo(false);
    setNewCode(""); setNewDescription(""); setNewDiscountValue(""); setNewMaxDiscount(""); setNewMinFare(""); setNewValidFrom(""); setNewValidUntil(""); setNewUsageLimit(""); setNewTargetCity("");
    showNotif(`✅ Promo code "${newCode.toUpperCase()}" created and activated!`);
  };

  const handleTogglePromo = (promoId: string, code: string, currentState: boolean) => {
    const updated = togglePromoCode(promoId);
    setPromoCodes(updated);
    showNotif(`${currentState ? "⏸️ Paused" : "▶️ Activated"} promo code ${code}.`);
  };

  const handleDeletePromo = (promoId: string, code: string) => {
    const updated = deletePromoCode(promoId);
    setPromoCodes(updated);
    showNotif(`🗑️ Promo code ${code} deleted.`);
  };

  const handleSendBroadcast = () => {
    if (!bcTitle.trim() || !bcMessage.trim()) {
      showNotif("❌ Title and message are required.");
      return;
    }
    const updated = sendBroadcast({
      title: bcTitle,
      message: bcMessage,
      targetAudience: bcAudience,
      incentiveAmount: bcIncentive ? parseFloat(bcIncentive) : undefined,
      validForMinutes: bcValidMins ? parseInt(bcValidMins) : undefined,
    });
    setBroadcasts(updated);
    setShowBroadcastModal(false);
    setBcTitle(""); setBcMessage(""); setBcIncentive(""); setBcValidMins("");
    showNotif(`📡 Broadcast sent to ${AUDIENCE_LABELS[bcAudience].split("(")[0].trim()}!`);
  };

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
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Marketing &amp; Communication Engine
            </h1>
            <p className="text-xs text-slate-500">
              GST-compliant promo codes, driver incentive broadcasts, and geo-targeted push alerts.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "PROMO_CODES" ? (
            <button onClick={() => setShowCreatePromo(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition shadow-xs">
              <Plus className="w-4 h-4" /> New Promo Code
            </button>
          ) : (
            <button onClick={() => setShowBroadcastModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs">
              <Radio className="w-4 h-4" /> Send Broadcast
            </button>
          )}
        </div>
      </div>

      {/* Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Active Promo Codes</div>
          <div className="text-3xl font-extrabold text-violet-600">{promoCodes.filter((p) => p.isActive).length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Total Code Uses</div>
          <div className="text-3xl font-extrabold text-slate-900">{promoCodes.reduce((a, p) => a + p.usedCount, 0)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Broadcasts Sent</div>
          <div className="text-3xl font-extrabold text-slate-900">{broadcasts.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs bg-emerald-50">
          <div className="text-[11px] font-bold uppercase text-emerald-600 mb-1">Last Broadcast Reach</div>
          <div className="text-3xl font-extrabold text-emerald-700">{broadcasts[0]?.recipientCount ?? 0}</div>
          <div className="text-xs text-emerald-600 mt-0.5 truncate">{broadcasts[0]?.targetAudience.replace(/_/g, " ") ?? "—"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["PROMO_CODES", "BROADCASTS"] as ActiveTab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
            {tab === "PROMO_CODES" ? `Promo Codes (${promoCodes.length})` : `Broadcast History (${broadcasts.length})`}
          </button>
        ))}
      </div>

      {/* Promo Codes Table */}
      {activeTab === "PROMO_CODES" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Discount</th>
                  <th className="py-3 px-4 text-left">Min Fare</th>
                  <th className="py-3 px-4 text-left">Validity</th>
                  <th className="py-3 px-4 text-left">Usage</th>
                  <th className="py-3 px-4 text-left">City</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promoCodes.map((promo) => {
                  const usagePct = Math.round((promo.usedCount / promo.usageLimit) * 100);
                  return (
                    <tr key={promo.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                            <Tag className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 font-mono tracking-widest">{promo.code}</div>
                            <div className="text-[11px] text-slate-400">{promo.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {promo.discountType === "FLAT" ? `₹${promo.discountValue}` : `${promo.discountValue}%`}
                        </div>
                        {promo.maxDiscount && <div className="text-[11px] text-slate-400">Max ₹{promo.maxDiscount}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">₹{promo.minFare}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-600 font-semibold">{promo.validFrom}</div>
                        <div className="text-[11px] text-slate-400">→ {promo.validUntil}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">{promo.usedCount}/{promo.usageLimit}</div>
                        <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1">
                          <div className={`h-1.5 rounded-full ${usagePct >= 90 ? "bg-rose-500" : usagePct >= 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${usagePct}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{promo.targetCity || "All Cities"}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${promo.isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {promo.isActive ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleTogglePromo(promo.id, promo.code, promo.isActive)} className={`p-1.5 rounded-lg border transition ${promo.isActive ? "border-slate-200 text-slate-500 hover:bg-slate-100" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`} title={promo.isActive ? "Pause" : "Activate"}>
                            {promo.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDeletePromo(promo.id, promo.code)} className="p-1.5 rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 hover:text-rose-700 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcasts */}
      {activeTab === "BROADCASTS" && (
        <div className="space-y-3">
          {broadcasts.map((bc) => (
            <div key={bc.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{bc.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    {AUDIENCE_ICON[bc.targetAudience]} {bc.targetAudience.replace(/_/g, " ")}
                  </span>
                  {bc.incentiveAmount && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      +₹{bc.incentiveAmount} Incentive
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-2">{bc.message}</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
                  <span>📤 Sent by {bc.sentBy}</span>
                  <span>📅 {new Date(bc.sentAt).toLocaleString("en-IN")}</span>
                  <span>👥 {bc.recipientCount} recipients</span>
                  {bc.validForMinutes && <span><Clock className="w-3 h-3 inline mr-0.5" />{bc.validForMinutes} min validity</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Promo Modal */}
      {showCreatePromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Tag className="w-5 h-5 text-violet-600" /> Create Promo Code</h3>
              <button onClick={() => setShowCreatePromo(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Promo Code *</label>
                  <input type="text" placeholder="e.g. SANCHI50" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 font-mono font-bold tracking-widest" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Target City (optional)</label>
                  <select value={newTargetCity} onChange={(e) => setNewTargetCity(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                    <option value="">All Cities</option>
                    <option value="Vidisha">Vidisha (MP-40)</option>
                    <option value="Bhopal">Bhopal (MP-04)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                <input type="text" placeholder="Short description for admin reference" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Discount Type *</label>
                  <select value={newDiscountType} onChange={(e) => setNewDiscountType(e.target.value as "FLAT" | "PERCENT")} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                    <option value="FLAT">Flat ₹</option>
                    <option value="PERCENT">Percent %</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">{newDiscountType === "FLAT" ? "Amount (₹) *" : "Percent (%) *"}</label>
                  <input type="number" placeholder={newDiscountType === "FLAT" ? "50" : "15"} value={newDiscountValue} onChange={(e) => setNewDiscountValue(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50" />
                </div>
                {newDiscountType === "PERCENT" && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Max Discount (₹)</label>
                    <input type="number" placeholder="150" value={newMaxDiscount} onChange={(e) => setNewMaxDiscount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Min Fare (₹) *</label>
                  <input type="number" placeholder="300" value={newMinFare} onChange={(e) => setNewMinFare(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Valid From *</label>
                  <input type="date" value={newValidFrom} onChange={(e) => setNewValidFrom(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Valid Until *</label>
                  <input type="date" value={newValidUntil} onChange={(e) => setNewValidUntil(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Usage Limit *</label>
                  <input type="number" placeholder="500" value={newUsageLimit} onChange={(e) => setNewUsageLimit(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button onClick={handleCreatePromo} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Create &amp; Activate Code
                </button>
                <button onClick={() => setShowCreatePromo(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Radio className="w-5 h-5 text-slate-700" /> Send Push Broadcast</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Target Audience *</label>
                <select value={bcAudience} onChange={(e) => setBcAudience(e.target.value as PushBroadcast["targetAudience"])} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                  {Object.entries(AUDIENCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Broadcast Title *</label>
                <input type="text" placeholder="e.g. High Demand Alert — Railway Station" value={bcTitle} onChange={(e) => setBcTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Message Body *</label>
                <textarea rows={3} value={bcMessage} onChange={(e) => setBcMessage(e.target.value)} placeholder="Push notification message shown to recipients..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Driver Incentive (₹)</label>
                  <input type="number" placeholder="e.g. 100" value={bcIncentive} onChange={(e) => setBcIncentive(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Valid For (minutes)</label>
                  <input type="number" placeholder="e.g. 120" value={bcValidMins} onChange={(e) => setBcValidMins(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button onClick={handleSendBroadcast} className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send to {AUDIENCE_LABELS[bcAudience].split("(")[1]?.replace(")", "") ?? "—"} Recipients
                </button>
                <button onClick={() => setShowBroadcastModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
