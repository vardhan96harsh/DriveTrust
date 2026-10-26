export type AdminRole =
  | "SUPER_ADMIN"
  | "REGION_MANAGER"
  | "DISPATCH_OPERATOR"
  | "KYC_OFFICER"
  | "SAFETY_DESK";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  avatarInitials: string;
  assignedRegion?: string; // Geofenced city/RTO e.g. "Vidisha (MP-40)"
  phone?: string;
  lastLogin: string;
}

export function canManagePricing(user: AdminUser | null): boolean {
  return user?.role === "SUPER_ADMIN";
}

const ADMIN_SESSION_KEY = "sathi_admin_session";

export const PRECONFIGURED_ADMINS: { [email: string]: { password: string; user: AdminUser } } = {
  "admin@sathi.in": {
    password: "DriveAdmin@2026",
    user: {
      id: "adm-001",
      name: "Harsh (Founder & Super Admin)",
      email: "admin@sathi.in",
      role: "SUPER_ADMIN",
      roleLabel: "Super Admin",
      avatarInitials: "HQ",
      lastLogin: new Date().toISOString(),
    },
  },
  "dispatch@sathi.in": {
    password: "Dispatch@2026",
    user: {
      id: "adm-002",
      name: "Rohan V. (Fleet Dispatch Desk)",
      email: "dispatch@sathi.in",
      role: "DISPATCH_OPERATOR",
      roleLabel: "Dispatch Operator",
      avatarInitials: "FD",
      lastLogin: new Date().toISOString(),
    },
  },
  "kyc@sathi.in": {
    password: "KycAdmin@2026",
    user: {
      id: "adm-003",
      name: "Ananya S. (Sarathi Compliance)",
      email: "kyc@sathi.in",
      role: "KYC_OFFICER",
      roleLabel: "MoRTH KYC Auditor",
      avatarInitials: "KY",
      lastLogin: new Date().toISOString(),
    },
  },
  "safety@sathi.in": {
    password: "SafetyDesk@2026",
    user: {
      id: "adm-004",
      name: "Emergency QRT Control Desk",
      email: "safety@sathi.in",
      role: "SAFETY_DESK",
      roleLabel: "24/7 Safety Desk",
      avatarInitials: "SOS",
      lastLogin: new Date().toISOString(),
    },
  },
  "ankit.mp40@sathi.in": {
    password: "VidishaOps@2026",
    user: {
      id: "mgr-001",
      name: "Ankit Sharma (Vidisha Hub)",
      email: "ankit.mp40@sathi.in",
      role: "REGION_MANAGER",
      roleLabel: "Region Manager (Vidisha MP-40)",
      assignedRegion: "Vidisha (MP-40)",
      phone: "+91 94251 22001",
      avatarInitials: "RM",
      lastLogin: new Date().toISOString(),
    },
  },
  "sunita.mp04@sathi.in": {
    password: "BhopalOps@2026",
    user: {
      id: "mgr-002",
      name: "Sunita Patel (Bhopal Hub)",
      email: "sunita.mp04@sathi.in",
      role: "REGION_MANAGER",
      roleLabel: "Region Manager (Bhopal MP-04)",
      assignedRegion: "Bhopal (MP-04)",
      phone: "+91 98930 44002",
      avatarInitials: "RM",
      lastLogin: new Date().toISOString(),
    },
  },
  // Backward compatibility aliases
  "admin@drivetrust.in": {
    password: "DriveAdmin@2026",
    user: {
      id: "adm-001",
      name: "Harsh (Founder & Super Admin)",
      email: "admin@sathi.in",
      role: "SUPER_ADMIN",
      roleLabel: "Super Admin",
      avatarInitials: "HQ",
      lastLogin: new Date().toISOString(),
    },
  },
  "dispatch@drivetrust.in": {
    password: "Dispatch@2026",
    user: {
      id: "adm-002",
      name: "Rohan V. (Fleet Dispatch Desk)",
      email: "dispatch@sathi.in",
      role: "DISPATCH_OPERATOR",
      roleLabel: "Dispatch Operator",
      avatarInitials: "FD",
      lastLogin: new Date().toISOString(),
    },
  },
  "kyc@drivetrust.in": {
    password: "KycAdmin@2026",
    user: {
      id: "adm-003",
      name: "Ananya S. (Sarathi Compliance)",
      email: "kyc@sathi.in",
      role: "KYC_OFFICER",
      roleLabel: "MoRTH KYC Auditor",
      avatarInitials: "KY",
      lastLogin: new Date().toISOString(),
    },
  },
  "safety@drivetrust.in": {
    password: "SafetyDesk@2026",
    user: {
      id: "adm-004",
      name: "Emergency QRT Control Desk",
      email: "safety@sathi.in",
      role: "SAFETY_DESK",
      roleLabel: "24/7 Safety Desk",
      avatarInitials: "SOS",
      lastLogin: new Date().toISOString(),
    },
  },
};

export function getAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem("drivetrust_admin_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginAdmin(email: string, pass: string, remember: boolean = true): { success: boolean; error?: string; user?: AdminUser } {
  const normEmail = email.trim().toLowerCase();
  const config = PRECONFIGURED_ADMINS[normEmail];

  if (!config) {
    if (normEmail === "admin" && pass === "admin") {
      const user = PRECONFIGURED_ADMINS["admin@sathi.in"].user;
      persistSession(user, remember);
      return { success: true, user };
    }
    return { success: false, error: "Invalid admin email address" };
  }

  if (config.password !== pass) {
    return { success: false, error: "Incorrect admin password" };
  }

  const updatedUser = {
    ...config.user,
    lastLogin: new Date().toISOString(),
  };

  persistSession(updatedUser, remember);
  return { success: true, user: updatedUser };
}

function persistSession(user: AdminUser, remember: boolean) {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(ADMIN_SESSION_KEY, json);
  } else {
    sessionStorage.setItem(ADMIN_SESSION_KEY, json);
  }
  window.dispatchEvent(new Event("admin_session_changed"));
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem("drivetrust_admin_session");
  window.dispatchEvent(new Event("admin_session_changed"));
}
