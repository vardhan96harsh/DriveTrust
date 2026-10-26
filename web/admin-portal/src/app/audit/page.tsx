"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Check,
  Lock,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  getAuditLogs,
  getAdminUsers,
  addAdminUser,
  toggleAdminUserStatus,
  AuditLog,
  AdminUser,
  AdminRole,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
} from "@/lib/auditStore";

type ActiveTab = "TEAM" | "AUDIT_TRAIL";

const SEVERITY_STYLE: Record<AuditLog["severity"], string> = {
  INFO: "bg-slate-100 text-slate-700 border-slate-200",
  WARN: "bg-amber-50 text-amber-800 border-amber-200",
  CRITICAL: "bg-rose-50 text-rose-800 border-rose-200",
};

const SEVERITY_DOT: Record<AuditLog["severity"], string> = {
  INFO: "bg-slate-400",
  WARN: "bg-amber-500",
  CRITICAL: "bg-rose-500 animate-pulse",
};

const ROLE_STYLE: Record<AdminRole, string> = {
  SUPER_ADMIN: "bg-slate-900 text-white border-slate-700",
  CITY_OPS_MANAGER: "bg-blue-100 text-blue-900 border-blue-200",
  SUPPORT_AGENT: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("TEAM");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [notification, setNotification] = useState<string | null>(null);

  // Add user modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("SUPPORT_AGENT");
  const [newCity, setNewCity] = useState("Vidisha (MP-40)");

  useEffect(() => {
    setAuditLogs(getAuditLogs());
    setAdminUsers(getAdminUsers());
  }, []);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) {
      showNotif("❌ Name and email are required.");
      return;
    }
    const updated = addAdminUser({ name: newName, email: newEmail, role: newRole, city: newCity, isActive: true, permissions: ROLE_PERMISSIONS[newRole] });
    setAdminUsers(updated);
    setShowAddUser(false);
    setNewName(""); setNewEmail("");
    showNotif(`✅ Admin user "${newName}" added as ${ROLE_LABELS[newRole]}.`);
  };

  const handleToggleUser = (userId: string, name: string, currentState: boolean) => {
    const updated = toggleAdminUserStatus(userId);
    setAdminUsers(updated);
    showNotif(`${currentState ? "⏸️ Deactivated" : "✅ Activated"} admin account for ${name}.`);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || log.adminName.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.entity.toLowerCase().includes(q) || log.entityId.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    const matchSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const criticalCount = auditLogs.filter((l) => l.severity === "CRITICAL").length;
  const warnCount = auditLogs.filter((l) => l.severity === "WARN").length;
  const activeAdmins = adminUsers.filter((u) => u.isActive).length;

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
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              RBAC Access Control &amp; Audit Trail
            </h1>
            <p className="text-xs text-slate-500">
              Role-based admin team management and tamper-proof chronological action log.
            </p>
          </div>
        </div>
        {activeTab === "TEAM" && (
          <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs">
            <Plus className="w-4 h-4" /> Add Admin
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Active Admins</div>
          <div className="text-3xl font-extrabold text-slate-900">{activeAdmins}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Total Log Events</div>
          <div className="text-3xl font-extrabold text-slate-900">{auditLogs.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs bg-amber-50">
          <div className="text-[11px] font-bold uppercase text-amber-600 mb-1">Warnings</div>
          <div className="text-3xl font-extrabold text-amber-700">{warnCount}</div>
          <div className="text-xs text-amber-500 mt-0.5">Pricing / config changes</div>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs bg-rose-50">
          <div className="text-[11px] font-bold uppercase text-rose-600 mb-1">Critical Events</div>
          <div className="text-3xl font-extrabold text-rose-700">{criticalCount}</div>
          <div className="text-xs text-rose-500 mt-0.5">Blocks, fraud flags, escalations</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["TEAM", "AUDIT_TRAIL"] as ActiveTab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
            {tab === "TEAM" ? `Admin Team (${adminUsers.length})` : `Audit Trail (${auditLogs.length})`}
          </button>
        ))}
      </div>

      {/* Team Panel */}
      {activeTab === "TEAM" && (
        <div className="space-y-4">
          {/* Role Legend */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Role Permission Matrix</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(ROLE_LABELS) as [AdminRole, string][]).map(([role, label]) => (
                <div key={role} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_STYLE[role]}`}>{label}</span>
                  <ul className="mt-2 space-y-0.5">
                    {ROLE_PERMISSIONS[role].slice(0, 5).map((perm) => (
                      <li key={perm} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        {perm}
                      </li>
                    ))}
                    {ROLE_PERMISSIONS[role].length > 5 && (
                      <li className="text-[11px] text-slate-400 pl-4">+{ROLE_PERMISSIONS[role].length - 5} more…</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Admin</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">City</th>
                  <th className="py-3 px-4 text-left">Last Active</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_STYLE[user.role]}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{user.city}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono">{new Date(user.lastActive).toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${user.isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {user.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {user.id !== "adm-001" && (
                        <button onClick={() => handleToggleUser(user.id, user.name, user.isActive)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${user.isActive ? "border-slate-200 text-slate-600 hover:bg-slate-100" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
                          {user.isActive ? "Deactivate" : "Reactivate"}
                        </button>
                      )}
                      {user.id === "adm-001" && (
                        <span className="text-[11px] font-mono text-slate-300 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Trail */}
      {activeTab === "AUDIT_TRAIL" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by admin, action, entity..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50" />
            </div>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none">
              <option value="ALL">All Severity</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="divide-y divide-slate-100 font-mono text-[12px]">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[log.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleString("en-IN")}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${SEVERITY_STYLE[log.severity]}`}>{log.severity}</span>
                    <span className="font-bold text-slate-900 tracking-wide">{log.action}</span>
                    <span className="text-slate-400">→ {log.entity}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{log.entityId}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{log.details}</div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    <span>👤 {log.adminName}</span>
                    <span className={`px-1.5 py-0 rounded border text-[9px] font-bold ${ROLE_STYLE[log.adminRole]}`}>{ROLE_LABELS[log.adminRole]}</span>
                    {log.ipAddress && <span>🌐 {log.ipAddress}</span>}
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-sans">No matching log entries found.</div>
            )}
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Users className="w-5 h-5 text-slate-700" /> Add Admin User</h3>
              <button onClick={() => setShowAddUser(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                <input type="text" placeholder="Admin name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Email Address *</label>
                <input type="email" placeholder="admin@sathi.in" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Role *</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value as AdminRole)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                    <option value="SUPPORT_AGENT">Support Agent</option>
                    <option value="CITY_OPS_MANAGER">City Ops Manager</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Hub City *</label>
                  <select value={newCity} onChange={(e) => setNewCity(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-semibold">
                    <option value="Vidisha (MP-40)">Vidisha (MP-40)</option>
                    <option value="Bhopal (MP-04)">Bhopal (MP-04)</option>
                    <option value="All Hubs">All Hubs</option>
                  </select>
                </div>
              </div>
              {/* Permission Preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Permissions for {ROLE_LABELS[newRole]}</div>
                <div className="flex flex-wrap gap-1">
                  {ROLE_PERMISSIONS[newRole].map((p) => (
                    <span key={p} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-mono">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button onClick={handleAddUser} className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Create Admin Account
                </button>
                <button onClick={() => setShowAddUser(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
