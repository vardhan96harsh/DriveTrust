"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Smartphone,
  LayoutDashboard,
  Compass,
  ShieldCheck,
  CreditCard,
  Building2,
  Users,
  UserCheck,
  PhoneCall,
  Camera,
  Wallet,
  MessageSquare,
  Megaphone,
  Shield,
  BarChart2,
  AlertOctagon,
  Gauge,
  Briefcase,
  Download,
  Search,
  Command,
  X,
  Menu,
  ChevronRight,
  Plus,
  Car,
  LogOut,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { getAdminSession, logoutAdmin, AdminUser } from "@/lib/adminAuthStore";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  keywords?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Daily Operations & Trips",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        keywords: ["home", "kpi", "overview", "metrics", "stats", "executive dashboard"],
      },
      {
        href: "/live-map",
        label: "Live Map & Tracking",
        icon: <Compass className="w-4 h-4 text-emerald-600" />,
        keywords: ["map", "radar", "fleet", "gps", "drivers", "live fleet radar", "tracking"],
      },
      {
        href: "/concierge",
        label: "Book by Phone (Call Center)",
        icon: <PhoneCall className="w-4 h-4 text-blue-600" />,
        keywords: ["booking", "call", "offline", "phone", "create", "concierge", "phone concierge"],
      },
      {
        href: "/book",
        label: "Customer Booking Portal",
        icon: <Car className="w-4 h-4 text-slate-700" />,
        keywords: ["customer", "book", "garage", "packages", "ride", "user", "web app"],
      },
      {
        href: "/driver",
        label: "Driver Duty App",
        icon: <Smartphone className="w-4 h-4 text-slate-700" />,
        keywords: ["driver", "partner", "chauffeur", "cockpit", "duty", "wallet", "app"],
      },
      {
        href: "/install",
        label: "Download Apps (QR / APK)",
        icon: <Download className="w-4 h-4 text-slate-700" />,
        keywords: ["install", "mobile", "qr", "phone", "apk", "pwa", "customer", "driver", "apps"],
      },
    ],
  },
  {
    title: "Safety & Verification",
    items: [
      {
        href: "/emergency",
        label: "Emergency SOS Alerts (112)",
        icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
        badge: "LIVE 112",
        badgeColor: "bg-rose-600 text-white font-bold animate-pulse",
        keywords: ["emergency", "police", "alarm", "danger", "sos", "24/7 sos incident desk"],
      },
      {
        href: "/telematics",
        label: "Driver Safety & Speeding",
        icon: <Gauge className="w-4 h-4 text-indigo-600" />,
        keywords: ["driving", "speeding", "braking", "safety", "score", "telematics", "rash driving"],
      },
      {
        href: "/inspections",
        label: "Vehicle Photo Inspection",
        icon: <Camera className="w-4 h-4 text-amber-600" />,
        keywords: ["dent", "scratch", "photos", "odometer", "fuel", "vehicle 360 audits", "inspection"],
      },
      {
        href: "/kyc",
        label: "Driver License Check (KYC)",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        keywords: ["license", "aadhaar", "driver verification", "dl", "morth", "sarathi", "kyc"],
      },
      {
        href: "/regions",
        label: "Service Cities & Zones",
        icon: <Compass className="w-4 h-4 text-slate-700" />,
        keywords: ["zone", "region", "vidisha", "bhopal", "geofence", "kml", "polygon", "operating zones"],
      },
    ],
  },
  {
    title: "Drivers & Customers",
    items: [
      {
        href: "/drivers",
        label: "Drivers List",
        icon: <UserCheck className="w-4 h-4 text-slate-700" />,
        keywords: ["drivers", "chauffeurs", "fleet", "staff", "chauffeur roster"],
      },
      {
        href: "/customers",
        label: "Customers & Cars",
        icon: <Users className="w-4 h-4 text-slate-700" />,
        keywords: ["users", "passengers", "cars", "vehicles", "garage"],
      },
      {
        href: "/corporate",
        label: "Corporate & Hotel Clients (B2B)",
        icon: <Briefcase className="w-4 h-4 text-blue-600" />,
        keywords: ["hotel", "resort", "retainer", "monthly", "gstin", "b2b", "corporate"],
      },
    ],
  },
  {
    title: "Finance & Management",
    items: [
      {
        href: "/payouts",
        label: "Driver Payouts & Earnings",
        icon: <Wallet className="w-4 h-4 text-emerald-600" />,
        keywords: ["wallet", "nach", "bank", "imps", "commission", "driver settlements", "payouts"],
      },
      {
        href: "/disputes",
        label: "Complaints & Refunds",
        icon: <MessageSquare className="w-4 h-4 text-rose-500" />,
        keywords: ["refund", "complaint", "lost item", "ticket", "disputes", "grievances"],
      },
      {
        href: "/marketing",
        label: "Coupons & Promo Codes",
        icon: <Megaphone className="w-4 h-4 text-violet-500" />,
        keywords: ["coupon", "discount", "broadcast", "push", "marketing", "promos"],
      },
      {
        href: "/analytics",
        label: "Missed Rides & Area Demand",
        icon: <BarChart2 className="w-4 h-4 text-indigo-500" />,
        keywords: ["heatmap", "lost bookings", "unfulfilled", "recruitment", "zero-car drops", "demand"],
      },
      {
        href: "/pricing",
        label: "Fares & Rates (Pricing)",
        icon: <CreditCard className="w-4 h-4 text-slate-700" />,
        keywords: ["rates", "fares", "per km", "night charge", "pricing zone matrix", "tariffs"],
      },
      {
        href: "/reports",
        label: "Download Reports (Excel/CSV)",
        icon: <Download className="w-4 h-4 text-slate-700" />,
        keywords: ["download", "csv", "excel", "backup", "gst", "reports"],
      },
      {
        href: "/audit",
        label: "Admin Staff & Activity History",
        icon: <Shield className="w-4 h-4 text-slate-700" />,
        keywords: ["roles", "logs", "security", "permissions", "history", "rbac", "audit trail"],
      },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication check & session listener
  useEffect(() => {
    if (pathname === "/login") {
      setIsAuthReady(true);
      return;
    }

    const session = getAdminSession();
    if (!session) {
      router.push("/login");
    } else {
      setCurrentAdmin(session);
    }
    setIsAuthReady(true);

    const handleSessionChange = () => {
      const updated = getAdminSession();
      if (!updated && pathname !== "/login") {
        router.push("/login");
      } else {
        setCurrentAdmin(updated);
      }
    };
    window.addEventListener("admin_session_changed", handleSessionChange);
    return () => window.removeEventListener("admin_session_changed", handleSessionChange);
  }, [pathname, router]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCommandOpen(false);
  }, [pathname]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthReady || !currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
          <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Connecting to Fleet Operations Desk...</span>
        </div>
      </div>
    );
  }

  // Flatten items for Command Palette search
  const allNavItems = NAV_SECTIONS.flatMap((s) => s.items);
  const filteredCommandItems = allNavItems.filter((item) => {
    const q = commandQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Persistent Executive Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-2xs">
        {/* Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-9 h-9 shadow-xs group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Sathi
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-900 text-white tracking-wider uppercase">
                  OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Aapki Gaadi, Aapka Sathi • MP Hubs
              </p>
            </div>
          </Link>
        </div>

        {/* Global Command Palette / Search Trigger */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 text-xs text-slate-500 transition group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition" />
              <span>Search modules, reservations, drivers...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-200 shadow-2xs">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Action Shortcuts & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* New Reservation Action */}
          <Link
            href="/concierge"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </Link>

          {/* Emergency SOS Quick Link */}
          <Link
            href="/emergency"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
            title="24/7 SOS Emergency Desk"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>SOS Desk</span>
          </Link>

          {/* Admin Profile & Sign Out */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs ring-2 ring-slate-100">
              {currentAdmin?.avatarInitials || "HQ"}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentAdmin?.name.split(" ")[0] || "Admin"}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {currentAdmin?.roleLabel || "Super Admin"}
              </div>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                router.push("/login");
              }}
              title="Sign Out of Terminal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <aside className="w-64 bg-white/95 border-r border-slate-200/80 p-3.5 hidden lg:flex flex-col gap-6 overflow-y-auto select-none shrink-0 shadow-2xs">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">
                {section.title}
              </div>
              <nav className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                        isActive
                          ? "bg-slate-900 text-white font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <span className={isActive ? "text-white" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Operational Footer Card */}
          <div className="mt-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="font-semibold text-slate-800 text-[11px] mb-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Chauffeur Operations Live</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Vidisha &amp; Bhopal Hubs Active</div>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full p-4 overflow-y-auto flex flex-col gap-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BrandLogo className="w-7 h-7" />
                  <span className="font-extrabold text-slate-900">Navigation</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {NAV_SECTIONS.map((section, idx) => (
                <div key={idx}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 font-mono">
                    {section.title}
                  </div>
                  <nav className="flex flex-col gap-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                            isActive
                              ? "bg-slate-900 text-white font-semibold"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Global Command Palette Modal (Cmd+K) */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Jump to page, action, or tool..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsCommandOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {filteredCommandItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching tools or pages found for &quot;{commandQuery}&quot;.
                </div>
              ) : (
                filteredCommandItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsCommandOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-700 transition">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {item.label}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{item.href}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="font-mono font-bold bg-white px-1 py-0.5 rounded border border-slate-200">ESC</kbd> to exit</span>
              <span>18 Operations Modules Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
