"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Briefcase,
  FileText,
  Plus,
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  X,
  Check,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  getCorporateAccounts,
  getCorporateInvoices,
  addCorporateAccount,
  CorporateAccount,
  CorporateInvoice,
} from "@/lib/corporateStore";

type ActiveTab = "ACCOUNTS" | "INVOICES";

export default function CorporatePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ACCOUNTS");
  const [accounts, setAccounts] = useState<CorporateAccount[]>([]);
  const [invoices, setInvoices] = useState<CorporateInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<CorporateInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // New Client Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("Vidisha");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [creditLimit, setCreditLimit] = useState("100000");

  useEffect(() => {
    setAccounts(getCorporateAccounts());
    setInvoices(getCorporateInvoices());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateClient = () => {
    if (!companyName.trim() || !gstin.trim() || !contactName.trim() || !contactPhone.trim()) {
      showNotif("❌ Company name, GSTIN, and primary contact are required.");
      return;
    }
    const updated = addCorporateAccount({
      companyName,
      brandName: brandName || undefined,
      gstin: gstin.toUpperCase(),
      pan: pan ? pan.toUpperCase() : gstin.slice(2, 12).toUpperCase(),
      billingAddress,
      city,
      primaryContactName: contactName,
      primaryContactPhone: contactPhone,
      primaryContactEmail: contactEmail,
      monthlyCreditLimit: parseFloat(creditLimit) || 100000,
      billingCycle: "1ST_OF_MONTH",
      paymentTermsDays: 30,
      status: "ACTIVE",
      authorizedEmployeesCount: 10,
      contractStartDate: new Date().toISOString().split("T")[0],
      contractEndDate: "2027-12-31",
      sacCode: "9966",
    });
    setAccounts(updated);
    setShowAddModal(false);
    setCompanyName(""); setBrandName(""); setGstin(""); setPan(""); setBillingAddress(""); setContactName(""); setContactPhone(""); setContactEmail("");
    showNotif(`✅ Corporate account created for ${companyName}!`);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase();
    return !q || acc.companyName.toLowerCase().includes(q) || acc.gstin.toLowerCase().includes(q) || acc.city.toLowerCase().includes(q);
  });

  const totalCreditAllocated = accounts.reduce((a, acc) => a + acc.monthlyCreditLimit, 0);
  const totalBilledThisCycle = accounts.reduce((a, acc) => a + acc.currentCycleUsage, 0);

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
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              B2B Corporate Clients &amp; Retainer Desk
            </h1>
            <p className="text-xs text-slate-500">
              Manage luxury dealerships, corporate hotels, monthly chauffeur retainers, and GST SAC 9966 invoicing.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Corporate Client
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Active Corporate Accounts</div>
          <div className="text-3xl font-extrabold text-blue-600">{accounts.length}</div>
          <div className="text-xs text-slate-500 mt-1">Verified GSTIN entities</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Current Cycle Usage</div>
          <div className="text-3xl font-extrabold text-slate-900">₹{totalBilledThisCycle.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">October 2026 unbilled</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Total Credit Line</div>
          <div className="text-3xl font-extrabold text-slate-900">₹{(totalCreditAllocated / 100000).toFixed(1)}L</div>
          <div className="text-xs text-slate-500 mt-1">Approved monthly limit</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs bg-emerald-50">
          <div className="text-[11px] font-bold uppercase text-emerald-600 mb-1">GST Compliance</div>
          <div className="text-3xl font-extrabold text-emerald-700">100%</div>
          <div className="text-xs text-emerald-600 mt-1">SAC Code 9966 active</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["ACCOUNTS", "INVOICES"] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab === "ACCOUNTS" ? `Corporate Clients (${accounts.length})` : `Monthly Tax Invoices (${invoices.length})`}
          </button>
        ))}
      </div>

      {/* Accounts Tab */}
      {activeTab === "ACCOUNTS" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company name, GSTIN, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => {
                const usagePct = Math.round((acc.currentCycleUsage / acc.monthlyCreditLimit) * 100);
                return (
                  <div key={acc.id} className="p-5 hover:bg-slate-50 transition">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-[280px]">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-500">{acc.id}</span>
                          <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            GSTIN: {acc.gstin}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {acc.status}
                          </span>
                        </div>

                        <div className="text-base font-extrabold text-slate-900 mb-0.5">{acc.companyName}</div>
                        {acc.brandName && <div className="text-xs text-slate-500 mb-2">Operating as: <b>{acc.brandName}</b></div>}

                        <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2">
                          <span>👤 {acc.primaryContactName}</span>
                          <span>📞 {acc.primaryContactPhone}</span>
                          <span>✉️ {acc.primaryContactEmail}</span>
                          <span>📍 {acc.city}</span>
                          <span>👥 {acc.authorizedEmployeesCount} Authorized VIPs</span>
                        </div>
                      </div>

                      {/* Usage Meter */}
                      <div className="w-56 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 shrink-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 font-semibold">Credit Usage</span>
                          <span className="font-bold text-slate-900">{usagePct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${usagePct >= 80 ? "bg-rose-500" : usagePct >= 50 ? "bg-amber-500" : "bg-blue-600"}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="font-bold text-blue-700">₹{acc.currentCycleUsage.toLocaleString()}</span>
                          <span className="text-slate-400">/ ₹{acc.monthlyCreditLimit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "INVOICES" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Invoice No</th>
                <th className="py-3 px-4 text-left">Corporate Entity</th>
                <th className="py-3 px-4 text-left">Period</th>
                <th className="py-3 px-4 text-right">Trips</th>
                <th className="py-3 px-4 text-right">Base Amount</th>
                <th className="py-3 px-4 text-right">GST (5%)</th>
                <th className="py-3 px-4 text-right">Total Invoice</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNumber} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.companyName}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{inv.billingPeriod}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">{inv.totalTrips}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">₹{inv.baseAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500">₹{(inv.cgst + inv.sgst).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1.5 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Tax Invoice (SAC 9966)</span>
                <h3 className="text-lg font-black text-slate-900">{selectedInvoice.invoiceNumber}</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 text-sm mb-1">{selectedInvoice.companyName}</div>
                <div className="text-slate-500">Billing Period: <b>{selectedInvoice.billingPeriod}</b></div>
                <div className="text-slate-500">Service: <b>Rental of Transport Vehicles with Chauffeur (SAC 9966)</b></div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Trips Executed</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.totalTrips}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Taxable Value</span>
                  <span className="font-bold font-mono text-slate-900">₹{selectedInvoice.baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">CGST (2.5%)</span>
                  <span className="font-mono text-slate-700">₹{selectedInvoice.cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">SGST (2.5%)</span>
                  <span className="font-mono text-slate-700">₹{selectedInvoice.sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900">
                  <span>Grand Total (INR)</span>
                  <span className="text-emerald-700 font-mono">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print / Save Tax PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Register Corporate Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Company Registered Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sanchi Heritage Resort Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">GSTIN *</label>
                  <input
                    type="text"
                    placeholder="23AABCS1429F1Z4"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    placeholder="General Manager / Director"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 98260 00000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Billing Address &amp; State</label>
                <textarea
                  rows={2}
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Official registered billing address..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={handleCreateClient}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Register &amp; Approve Client
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
