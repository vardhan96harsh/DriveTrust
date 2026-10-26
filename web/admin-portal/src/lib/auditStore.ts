"use client";

export type AdminRole =
  | "SUPER_ADMIN"
  | "CITY_OPS_MANAGER"
  | "SUPPORT_AGENT";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  city: string;
  lastActive: string;
  isActive: boolean;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  severity: "INFO" | "WARN" | "CRITICAL";
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    "pricing.write",
    "commission.write",
    "banking.write",
    "drivers.write",
    "customers.write",
    "kyc.approve",
    "geofence.write",
    "payouts.approve",
    "disputes.resolve",
    "promotions.write",
    "rbac.write",
    "audit.read",
    "analytics.read",
    "broadcast.send",
  ],
  CITY_OPS_MANAGER: [
    "drivers.write",
    "customers.read",
    "kyc.approve",
    "geofence.write",
    "payouts.approve",
    "disputes.review",
    "promotions.read",
    "analytics.read",
    "broadcast.send",
  ],
  SUPPORT_AGENT: [
    "customers.read",
    "drivers.read",
    "disputes.resolve",
    "disputes.review",
    "trips.reassign",
  ],
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  CITY_OPS_MANAGER: "City Ops Manager",
  SUPPORT_AGENT: "Support Agent",
};

const AUDIT_STORE_KEY = "dt_audit_logs_v2";
const ADMIN_USERS_KEY = "dt_admin_users_v1";

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "adm-001",
    name: "Harsh (HQ)",
    email: "harsh@sathi.in",
    role: "SUPER_ADMIN",
    city: "All Hubs",
    lastActive: new Date().toISOString(),
    isActive: true,
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
  },
  {
    id: "adm-002",
    name: "Ankit Shrivastava",
    email: "ankit.mp40@sathi.in",
    role: "CITY_OPS_MANAGER",
    city: "Vidisha (MP-40)",
    lastActive: "2026-10-24T14:22:00",
    isActive: true,
    permissions: ROLE_PERMISSIONS.CITY_OPS_MANAGER,
  },
  {
    id: "adm-003",
    name: "Sunita Yadav",
    email: "sunita.support@sathi.in",
    role: "SUPPORT_AGENT",
    city: "Bhopal (MP-04)",
    lastActive: "2026-10-24T16:05:00",
    isActive: true,
    permissions: ROLE_PERMISSIONS.SUPPORT_AGENT,
  },
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-10-24T14:22:01",
    adminName: "Harsh (HQ)",
    adminRole: "SUPER_ADMIN",
    action: "KYC_APPROVED",
    entity: "Driver",
    entityId: "drv-01 (Rajesh Sharma · MP-40)",
    details: "KYC status set to APPROVED. MoRTH Sarathi verified. Chauffeur enabled for instant dispatch.",
    ipAddress: "49.248.101.22",
    severity: "INFO",
  },
  {
    id: "LOG-002",
    timestamp: "2026-10-24T12:50:10",
    adminName: "Ankit Shrivastava",
    adminRole: "CITY_OPS_MANAGER",
    action: "PAYOUT_APPROVED",
    entity: "Payout Batch",
    entityId: "PAY-2026-W42-01",
    details: "₹10,458 weekly settlement approved. Dispatched via IMPS to SBI Vidisha (••••4892).",
    ipAddress: "223.189.44.81",
    severity: "INFO",
  },
  {
    id: "LOG-003",
    timestamp: "2026-10-24T10:15:33",
    adminName: "Sunita Yadav",
    adminRole: "SUPPORT_AGENT",
    action: "DISPUTE_RESOLVED",
    entity: "Ticket",
    entityId: "TKT-2026-002",
    details: "Refund of ₹150 issued to Priya Sharma via UPI (TXN: UPI-TXN-8821001). Overcharge confirmed by GPS route log.",
    ipAddress: "103.22.81.90",
    severity: "INFO",
  },
  {
    id: "LOG-004",
    timestamp: "2026-10-23T18:45:00",
    adminName: "Harsh (HQ)",
    adminRole: "SUPER_ADMIN",
    action: "PRICING_UPDATED",
    entity: "Pricing Zone",
    entityId: "zone-vidisha (MP-40 Vidisha)",
    details: "Night Drop base fare increased from ₹200 to ₹220. Per-KM rate unchanged at ₹16.",
    ipAddress: "49.248.101.22",
    severity: "WARN",
  },
  {
    id: "LOG-005",
    timestamp: "2026-10-23T09:00:00",
    adminName: "Harsh (HQ)",
    adminRole: "SUPER_ADMIN",
    action: "PROMO_CREATED",
    entity: "Promo Code",
    entityId: "SANCHI50",
    details: "Flat ₹50 promo created for Vidisha tourist route. Valid Oct–Dec 2026. Limit: 500 uses.",
    ipAddress: "49.248.101.22",
    severity: "INFO",
  },
  {
    id: "LOG-006",
    timestamp: "2026-10-22T20:30:12",
    adminName: "Ankit Shrivastava",
    adminRole: "CITY_OPS_MANAGER",
    action: "DRIVER_BLOCKED",
    entity: "Driver",
    entityId: "drv-04 (Sunil Yadav · MP-40)",
    details: "Driver blocked pending telematics investigation. Rash driving complaint (TKT-2026-003). Speed >90 km/h inside city limit.",
    ipAddress: "223.189.44.81",
    severity: "CRITICAL",
  },
  {
    id: "LOG-007",
    timestamp: "2026-10-21T11:30:00",
    adminName: "Sunita Yadav",
    adminRole: "SUPPORT_AGENT",
    action: "BROADCAST_SENT",
    entity: "Push Broadcast",
    entityId: "bc-001",
    details: "Surge incentive broadcast sent to 6 online Vidisha drivers. ₹100/trip extra incentive for 2hrs.",
    ipAddress: "103.22.81.90",
    severity: "INFO",
  },
];

function readLogsFromStore(): AuditLog[] {
  if (typeof window === "undefined") return DEFAULT_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_AUDIT_LOGS;
  } catch {
    return DEFAULT_AUDIT_LOGS;
  }
}

function writeLogsToStore(logs: AuditLog[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUDIT_STORE_KEY, JSON.stringify(logs));
}

function readAdminUsersFromStore(): AdminUser[] {
  if (typeof window === "undefined") return DEFAULT_ADMIN_USERS;
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ADMIN_USERS;
  } catch {
    return DEFAULT_ADMIN_USERS;
  }
}

function writeAdminUsersToStore(users: AdminUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
}

export function getAuditLogs(): AuditLog[] {
  return readLogsFromStore().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function appendAuditLog(log: Omit<AuditLog, "id" | "timestamp">): void {
  const logs = readLogsFromStore();
  const newLog: AuditLog = {
    ...log,
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  writeLogsToStore([newLog, ...logs]);
}

export function getAdminUsers(): AdminUser[] {
  return readAdminUsersFromStore();
}

export function addAdminUser(user: Omit<AdminUser, "id" | "lastActive">): AdminUser[] {
  const users = readAdminUsersFromStore();
  const newUser: AdminUser = {
    ...user,
    id: `adm-${Date.now()}`,
    lastActive: new Date().toISOString(),
    permissions: ROLE_PERMISSIONS[user.role],
  };
  const updated = [...users, newUser];
  writeAdminUsersToStore(updated);
  return updated;
}

export function toggleAdminUserStatus(userId: string): AdminUser[] {
  const users = readAdminUsersFromStore();
  const updated = users.map((u) =>
    u.id === userId ? { ...u, isActive: !u.isActive } : u
  );
  writeAdminUsersToStore(updated);
  return updated;
}

export function hasPermission(role: AdminRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
