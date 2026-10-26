"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  Package,
  Wallet,
  X,
  Check,
  ShieldAlert,
  Phone,
} from "lucide-react";
import {
  getDisputes,
  getLostItems,
  resolveDisputeWithRefund,
  resolveDisputeWithCredit,
  resolveDisputeNoAction,
  escalateDispute,
  updateLostItemStatus,
  GrievanceTicket,
  LostItem,
  DisputeCategory,
  DISPUTE_CATEGORY_LABELS,
  RefundMethod,
} from "@/lib/disputeStore";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-rose-50 text-rose-800 border-rose-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-800 border-amber-200",
  RESOLVED_REFUND: "bg-emerald-50 text-emerald-800 border-emerald-200",
  RESOLVED_CREDIT: "bg-blue-50 text-blue-800 border-blue-200",
  RESOLVED_NO_ACTION: "bg-slate-50 text-slate-600 border-slate-200",
  ESCALATED: "bg-purple-50 text-purple-800 border-purple-200",
};

const STATUS_DOT: Record<string, string> = {
  OPEN: "bg-rose-500",
  UNDER_REVIEW: "bg-amber-500 animate-pulse",
  RESOLVED_REFUND: "bg-emerald-500",
  RESOLVED_CREDIT: "bg-blue-500",
  RESOLVED_NO_ACTION: "bg-slate-400",
  ESCALATED: "bg-purple-500",
};

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-800 border border-rose-200",
  MEDIUM: "bg-amber-100 text-amber-800 border border-amber-200",
  LOW: "bg-slate-100 text-slate-700 border border-slate-200",
};

const LOST_ITEM_STATUS_STYLE: Record<string, string> = {
  REPORTED: "bg-amber-50 text-amber-800 border-amber-200",
  DRIVER_CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  RETURNED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  NOT_FOUND: "bg-slate-50 text-slate-600 border-slate-200",
};

type ActiveTab = "TICKETS" | "LOST_FOUND";
type ResolveAction = "REFUND" | "CREDIT" | "NO_ACTION" | null;

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("TICKETS");
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(null);
  const [resolveAction, setResolveAction] = useState<ResolveAction>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("UPI");
  const [adminNotes, setAdminNotes] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setTickets(getDisputes());
    setLostItems(getLostItems());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRefundResolve = () => {
    if (!selectedTicket) return;
    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0) { showNotif("❌ Enter a valid refund amount."); return; }
    const updated = resolveDisputeWithRefund(selectedTicket.id, amt, refundMethod, adminNotes, "Admin Harsh");
    setTickets(updated);
    showNotif(`✅ Refund of ₹${amt} dispatched to ${selectedTicket.customerName} via ${refundMethod}.`);
    setSelectedTicket(null);
    setResolveAction(null);
  };

  const handleCreditResolve = () => {
    if (!selectedTicket) return;
    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0) { showNotif("❌ Enter a valid credit amount."); return; }
    const updated = resolveDisputeWithCredit(selectedTicket.id, amt, adminNotes, "Admin Harsh");
    setTickets(updated);
    showNotif(`✅ ₹${amt} Sathi wallet credit added for ${selectedTicket.customerName}.`);
    setSelectedTicket(null);
    setResolveAction(null);
  };

  const handleNoActionResolve = () => {
    if (!selectedTicket) return;
    if (!adminNotes.trim()) { showNotif("⚠️ Admin notes required for no-action resolution."); return; }
    const updated = resolveDisputeNoAction(selectedTicket.id, adminNotes, "Admin Harsh");
    setTickets(updated);
    showNotif("✅ Ticket resolved with no action. Customer notified.");
    setSelectedTicket(null);
    setResolveAction(null);
  };

  const handleEscalate = (ticketId: string) => {
    const updated = escalateDispute(ticketId);
    setTickets(updated);
    showNotif("⚠️ Ticket escalated to Senior Ops for review.");
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.customerName.toLowerCase().includes(q) || t.bookingCode.toLowerCase().includes(q) || t.driverName.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const reviewCount = tickets.filter((t) => t.status === "UNDER_REVIEW").length;
  const resolvedCount = tickets.filter((t) => t.status.startsWith("RESOLVED")).length;
  const lostActiveCount = lostItems.filter((i) => i.status !== "RETURNED" && i.status !== "NOT_FOUND").length;

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
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Dispute Resolution &amp; Grievance Centre
            </h1>
            <p className="text-xs text-slate-500">
              Customer complaints, refunds, fare adjustments, and lost &amp; found management.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Open Tickets</div>
          <div className="text-3xl font-extrabold text-rose-600">{openCount}</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting first response</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Under Review</div>
          <div className="text-3xl font-extrabold text-amber-600">{reviewCount}</div>
          <div className="text-xs text-slate-500 mt-1">Being investigated</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Resolved This Week</div>
          <div className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Closed successfully</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs bg-amber-50">
          <div className="text-[11px] font-bold uppercase text-amber-600 mb-1">Lost Items Active</div>
          <div className="text-3xl font-extrabold text-amber-700">{lostActiveCount}</div>
          <div className="text-xs text-amber-600 mt-1">Pending return</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["TICKETS", "LOST_FOUND"] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab === "TICKETS" ? `Grievance Tickets (${tickets.length})` : `Lost & Found (${lostItems.length})`}
          </button>
        ))}
      </div>

      {activeTab === "TICKETS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, booking, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED_REFUND">Refunded</option>
              <option value="RESOLVED_CREDIT">Credited</option>
              <option value="RESOLVED_NO_ACTION">No Action</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold">No matching tickets found.</div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => { setSelectedTicket(ticket); setResolveAction(null); setAdminNotes(ticket.adminNotes || ""); setRefundAmount(""); }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{ticket.id}</span>
                        <span className="font-mono text-[11px] text-slate-400">· {ticket.bookingCode}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_STYLE[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mb-0.5">
                        {DISPUTE_CATEGORY_LABELS[ticket.category as DisputeCategory]}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{ticket.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-500">
                        <span>👤 {ticket.customerName}</span>
                        <span>🚗 {ticket.driverName}</span>
                        <span>🛣️ {ticket.tripRoute}</span>
                        <span>₹ Fare: ₹{ticket.originalFare}</span>
                        <span>📅 {new Date(ticket.raisedAt).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[ticket.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[ticket.status]}`} />
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 mt-1" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "LOST_FOUND" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">Lost Item Tracker</span>
            <span className="ml-auto text-xs text-slate-400">{lostItems.length} total reports</span>
          </div>
          {lostItems.map((item) => (
            <div key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-slate-500">{item.id}</span>
                  <span className="font-mono text-[11px] text-slate-400">· {item.bookingCode}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{item.itemDescription}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-slate-500">
                  <span>👤 {item.customerName} ({item.customerPhone})</span>
                  <span>🚗 Driver: {item.driverName}</span>
                  <span>📅 {new Date(item.reportedAt).toLocaleDateString("en-IN")}</span>
                  {item.returnedAt && <span>✅ Returned: {new Date(item.returnedAt).toLocaleDateString("en-IN")}</span>}
                </div>
                {item.adminNotes && <p className="mt-1.5 text-[11px] text-slate-500 italic">{item.adminNotes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${LOST_ITEM_STATUS_STYLE[item.status]}`}>
                  {item.status.replace(/_/g, " ")}
                </span>
                {item.status !== "RETURNED" && item.status !== "NOT_FOUND" && (
                  <button
                    onClick={() => { const updated = updateLostItemStatus(item.id, "RETURNED"); setLostItems(updated); showNotif(`📦 Item marked returned for ${item.customerName}.`); }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
                  >
                    Mark Returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500">{selectedTicket.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_STYLE[selectedTicket.priority]}`}>{selectedTicket.priority}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLE[selectedTicket.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selectedTicket.status]}`} />
                    {selectedTicket.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {DISPUTE_CATEGORY_LABELS[selectedTicket.category as DisputeCategory]}
                </h3>
              </div>
              <button onClick={() => { setSelectedTicket(null); setResolveAction(null); }} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trip Summary */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 text-sm">
              <div><span className="text-slate-400 text-xs">Customer</span><div className="font-bold text-slate-900">{selectedTicket.customerName}</div><div className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{selectedTicket.customerPhone}</div></div>
              <div><span className="text-slate-400 text-xs">Chauffeur</span><div className="font-bold text-slate-900">{selectedTicket.driverName}</div><div className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{selectedTicket.driverPhone}</div></div>
              <div><span className="text-slate-400 text-xs">Vehicle</span><div className="font-semibold text-slate-800 text-sm">{selectedTicket.vehicleModel}</div><div className="text-xs font-mono text-slate-500">{selectedTicket.vehiclePlate}</div></div>
              <div><span className="text-slate-400 text-xs">Trip Route & Fare</span><div className="font-semibold text-slate-800 text-xs">{selectedTicket.tripRoute}</div><div className="font-extrabold text-emerald-700">₹{selectedTicket.originalFare}</div></div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Complaint</div>
              <p className="text-sm text-slate-700 bg-rose-50 rounded-xl p-3 border border-rose-100">{selectedTicket.description}</p>
            </div>

            {/* Resolution Panel */}
            {selectedTicket.status !== "RESOLVED_REFUND" && selectedTicket.status !== "RESOLVED_CREDIT" && selectedTicket.status !== "RESOLVED_NO_ACTION" ? (
              <>
                {!resolveAction ? (
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Admin Resolution Actions</div>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setResolveAction("REFUND")} className="p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold hover:bg-emerald-100 transition text-center">
                        <ArrowUpRight className="w-4 h-4 mx-auto mb-1" />1-Click Refund
                      </button>
                      <button onClick={() => setResolveAction("CREDIT")} className="p-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-800 text-sm font-bold hover:bg-blue-100 transition text-center">
                        <Wallet className="w-4 h-4 mx-auto mb-1" />Wallet Credit
                      </button>
                      <button onClick={() => setResolveAction("NO_ACTION")} className="p-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 text-sm font-bold hover:bg-slate-100 transition text-center">
                        <Check className="w-4 h-4 mx-auto mb-1" />No Action
                      </button>
                    </div>
                    {selectedTicket.status !== "ESCALATED" && (
                      <button onClick={() => handleEscalate(selectedTicket.id)} className="mt-3 w-full py-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-sm font-bold hover:bg-purple-100 transition flex items-center justify-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Escalate to Senior Ops
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => setResolveAction(null)} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Change action
                      </button>
                      <span className="text-xs font-bold text-slate-700">
                        → {resolveAction === "REFUND" ? "Issue Refund" : resolveAction === "CREDIT" ? "Add Wallet Credit" : "Close with No Action"}
                      </span>
                    </div>

                    {resolveAction !== "NO_ACTION" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-bold text-slate-600 block mb-1">Amount (₹)</label>
                            <input type="number" placeholder="e.g. 150" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50" />
                          </div>
                          {resolveAction === "REFUND" && (
                            <div className="flex-1">
                              <label className="text-xs font-bold text-slate-600 block mb-1">Refund To</label>
                              <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value as RefundMethod)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                                <option value="UPI">UPI (Instant)</option>
                                <option value="CARD">Card (3–5 days)</option>
                                <option value="WALLET_CREDIT">Wallet Credit</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Admin Notes (required for no-action)</label>
                      <textarea rows={2} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add resolution rationale, evidence, or driver communication..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 bg-slate-50 resize-none" />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button onClick={() => { if (resolveAction === "REFUND") handleRefundResolve(); else if (resolveAction === "CREDIT") handleCreditResolve(); else handleNoActionResolve(); }} className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs">
                        Confirm &amp; Resolve Ticket
                      </button>
                      <button onClick={() => setSelectedTicket(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Ticket Resolved by {selectedTicket.resolvedBy} on {selectedTicket.resolvedAt && new Date(selectedTicket.resolvedAt).toLocaleDateString("en-IN")}
                </div>
                {selectedTicket.refundAmount && <div className="text-sm text-emerald-700">Refund: ₹{selectedTicket.refundAmount} via {selectedTicket.refundMethod} · TXN: {selectedTicket.refundTransactionId}</div>}
                {selectedTicket.creditAmount && <div className="text-sm text-emerald-700">Wallet Credit: ₹{selectedTicket.creditAmount} added</div>}
                {selectedTicket.adminNotes && <div className="text-xs text-emerald-600 mt-1 italic">{selectedTicket.adminNotes}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
