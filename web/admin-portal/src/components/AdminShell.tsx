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
  Radio,
  Clock,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Info,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { getAdminSession, logoutAdmin, AdminUser } from "@/lib/adminAuthStore";

interface NavItem {
  href: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  keywords?: string[];
}

interface NavSection {
  title: string;
  isCollapsible?: boolean;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "⭐ Launch Operations (Vidisha Hub)",
    items: [
      {
        href: "/",
        label: "Dashboard",
        sublabel: "Launch metrics & live fleet",
        icon: <LayoutDashboard className="w-4 h-4 text-blue-600" />,
        keywords: ["home", "kpi", "overview", "metrics", "stats", "executive dashboard"],
      },
      {
        href: "/trips",
        label: "Live Dispatch & Trips",
        sublabel: "Active rides, OTPs & reassign",
        icon: <Car className="w-4 h-4 text-amber-500" />,
        badge: "DISPATCH",
        badgeColor: "bg-amber-500/10 text-amber-700 border border-amber-300 font-semibold",
        keywords: ["trips", "dispatch", "active", "bookings", "rides", "reassign", "otp", "console"],
      },
      {
        href: "/drivers",
        label: "Chauffeur Roster",
        sublabel: "Approved drivers & duty",
        icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
        keywords: ["drivers", "chauffeurs", "fleet", "staff", "chauffeur roster"],
      },
      {
        href: "/kyc",
        label: "MoRTH Sarathi License KYC",
        sublabel: "Driver verification vault",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        badge: "VERIFY",
        badgeColor: "bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-semibold",
        keywords: ["license", "aadhaar", "driver verification", "dl", "morth", "sarathi", "kyc"],
      },
      {
        href: "/customers",
        label: "Customers & Garages",
        sublabel: "Client accounts & cars",
        icon: <Users className="w-4 h-4 text-slate-700" />,
        keywords: ["users", "passengers", "cars", "vehicles", "garage"],
      },
      {
        href: "/pricing",
        label: "Fares & Pricing Matrix",
        sublabel: "Vidisha rate matrix & tariffs",
        icon: <CreditCard className="w-4 h-4 text-slate-700" />,
        keywords: ["rates", "fares", "per km", "night charge", "pricing zone matrix", "tariffs"],
      },
      {
        href: "/regions",
        label: "Vidisha Launch Geofence",
        sublabel: "MP-40 boundary enforcement",
        icon: <Compass className="w-4 h-4 text-blue-600" />,
        badge: "MP-40",
        badgeColor: "bg-blue-500/10 text-blue-700 border border-blue-300 font-bold",
        keywords: ["zone", "region", "vidisha", "bhopal", "geofence", "kml", "polygon", "operating zones"],
      },
      {
        href: "/emergency",
        label: "Police 112 SOS Desk",
        sublabel: "National Police ERSS link",
        icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
        badge: "LIVE 112",
        badgeColor: "bg-rose-600 text-white font-bold animate-pulse",
        keywords: ["emergency", "police", "alarm", "danger", "sos", "24/7 sos incident desk"],
      },
    ],
  },
  {
    title: "📱 Client & Driver Live Apps",
    items: [
      {
        href: "/book",
        label: "Customer Booking Portal",
        sublabel: "Passenger ride booking app",
        icon: <Car className="w-4 h-4 text-blue-600" />,
        keywords: ["customer", "book", "garage", "packages", "ride", "user", "web app"],
      },
      {
        href: "/customer",
        label: "Customer Sathi Pass",
        sublabel: "Client garage & permanent PIN",
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        keywords: ["customer", "garage", "pin", "pass", "profile"],
      },
      {
        href: "/driver",
        label: "Driver Duty Cockpit",
        sublabel: "Live chauffeur radar & meter",
        icon: <Smartphone className="w-4 h-4 text-emerald-600" />,
        keywords: ["driver", "partner", "chauffeur", "cockpit", "duty", "wallet", "app"],
      },
      {
        href: "/driver/profile",
        label: "Driver Digital ID",
        sublabel: "MoRTH Sarathi badge card",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        keywords: ["driver", "id", "morth", "badge", "license", "credentials"],
      },
    ],
  },
  {
    title: "📂 Advanced Operations (Future Rollout)",
    isCollapsible: true,
    items: [
      {
        href: "/live-map",
        label: "Live GPS Map Radar",
        sublabel: "Real-time street map tracking",
        icon: <Compass className="w-4 h-4 text-emerald-600" />,
        keywords: ["map", "radar", "fleet", "gps", "drivers", "live fleet radar", "tracking"],
      },
      {
        href: "/concierge",
        label: "Phone Concierge (Call Center)",
        sublabel: "Offline phone bookings",
        icon: <PhoneCall className="w-4 h-4 text-blue-600" />,
        keywords: ["booking", "call", "offline", "phone", "create", "concierge", "phone concierge"],
      },
      {
        href: "/telematics",
        label: "Driver Telematics & G-Sensor",
        sublabel: "Harsh braking & speeding score",
        icon: <Gauge className="w-4 h-4 text-indigo-600" />,
        keywords: ["driving", "speeding", "braking", "safety", "score", "telematics", "rash driving"],
      },
      {
        href: "/inspections",
        label: "360° Photo Inspections",
        sublabel: "Pre-trip vehicle condition audit",
        icon: <Camera className="w-4 h-4 text-amber-600" />,
        keywords: ["dent", "scratch", "photos", "odometer", "fuel", "vehicle 360 audits", "inspection"],
      },
      {
        href: "/fleet",
        label: "Client Fleet & ₹10L Cover",
        sublabel: "Transit insurance policy registry",
        icon: <ShieldAlert className="w-4 h-4 text-emerald-600" />,
        keywords: ["fleet", "vehicles", "cars", "insurance", "transmission", "automatic", "manual"],
      },
      {
        href: "/corporate",
        label: "Corporate & Hotel Retainers",
        sublabel: "B2B client contracts & GST billing",
        icon: <Briefcase className="w-4 h-4 text-blue-600" />,
        keywords: ["hotel", "resort", "retainer", "monthly", "gstin", "b2b", "corporate"],
      },
      {
        href: "/payouts",
        label: "Driver Payouts (IMPS)",
        sublabel: "Bank settlements & net revenue",
        icon: <Wallet className="w-4 h-4 text-emerald-600" />,
        keywords: ["wallet", "nach", "bank", "imps", "commission", "driver settlements", "payouts"],
      },
      {
        href: "/disputes",
        label: "Complaints & Lost Items",
        sublabel: "Ticket resolutions & refunds",
        icon: <MessageSquare className="w-4 h-4 text-rose-500" />,
        keywords: ["refund", "complaint", "lost item", "ticket", "disputes", "grievances"],
      },
      {
        href: "/marketing",
        label: "Coupons & Promos",
        sublabel: "Discounts & promotional codes",
        icon: <Megaphone className="w-4 h-4 text-violet-500" />,
        keywords: ["coupon", "discount", "broadcast", "push", "marketing", "promos"],
      },
      {
        href: "/broadcast",
        label: "Fleet Push Broadcast",
        sublabel: "Weather & incentive announcements",
        icon: <Radio className="w-4 h-4 text-rose-500" />,
        keywords: ["broadcast", "alert", "announcement", "push notification", "incentive", "weather"],
      },
      {
        href: "/analytics",
        label: "Demand & Zero-Car Drops",
        sublabel: "Unmet customer demand heatmap",
        icon: <BarChart2 className="w-4 h-4 text-indigo-500" />,
        keywords: ["heatmap", "lost bookings", "unfulfilled", "recruitment", "zero-car drops", "demand"],
      },
      {
        href: "/reports",
        label: "Download Excel/CSV Reports",
        sublabel: "Audit ledger data exports",
        icon: <Download className="w-4 h-4 text-slate-700" />,
        keywords: ["download", "csv", "excel", "backup", "gst", "reports"],
      },
      {
        href: "/audit",
        label: "Staff RBAC & Audit Trail",
        sublabel: "Admin action security history",
        icon: <Shield className="w-4 h-4 text-slate-700" />,
        keywords: ["roles", "logs", "security", "permissions", "history", "rbac", "audit trail"],
      },
      {
        href: "/simulator",
        label: "End-to-End Sandbox Simulator",
        sublabel: "Test trips, SOS & dispatch",
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        keywords: ["simulator", "testing", "sandbox", "test trip"],
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
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCurrentPathInAdvanced = NAV_SECTIONS.find((s) => s.isCollapsible)?.items.some((i) => i.href === pathname);
  const [showAdvancedOps, setShowAdvancedOps] = useState(false);

  useEffect(() => {
    if (isCurrentPathInAdvanced) {
      setShowAdvancedOps(true);
    }
  }, [isCurrentPathInAdvanced]);

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
      setIsAuthReady(true);
    }
  }, [pathname, router]);

  // Global Keyboard shortcut: Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false);
        setIsGuideOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isAuthReady && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <BrandLogo className="w-12 h-12 animate-pulse" />
          <div className="text-xs font-mono text-slate-400">Authenticating DriveTrust Terminal...</div>
        </div>
      </div>
    );
  }

  // Filter items for the command palette
  const allNavItems = NAV_SECTIONS.flatMap((sec) => sec.items);
  const filteredCommandItems = allNavItems.filter((item) => {
    if (!commandQuery.trim()) return true;
    const query = commandQuery.toLowerCase();
    const labelMatch = item.label.toLowerCase().includes(query);
    const sublabelMatch = item.sublabel?.toLowerCase().includes(query);
    const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(query));
    return labelMatch || sublabelMatch || keywordMatch;
  });

  if (pathname === "/login") {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Application Bar */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-2xs select-none">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-9 h-9 shadow-xs group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  DriveTrust
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-900 text-white tracking-wider uppercase">
                  OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Aapki Gaadi, Aapka Chauffeur • MP-40 / MP-04 Hubs
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
          {/* Phase 1 Launch City Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-blue-950 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Launch Hub: <strong>Vidisha (MP-40)</strong></span>
          </div>

          {/* Platform Guide Trigger */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold transition cursor-pointer shadow-2xs"
            title="How DriveTrust Works (Platform Guide)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Platform Guide</span>
          </button>

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
        <aside className="w-64 bg-white/95 border-r border-slate-200/80 p-3.5 hidden lg:flex flex-col gap-5 overflow-y-auto select-none shrink-0 shadow-2xs">
          {NAV_SECTIONS.map((section, idx) => {
            const isCollapsible = section.isCollapsible;
            const isOpen = !isCollapsible || showAdvancedOps;

            return (
              <div key={idx} className={isCollapsible ? "pt-2 border-t border-slate-100" : ""}>
                {isCollapsible ? (
                  <button
                    onClick={() => setShowAdvancedOps(!showAdvancedOps)}
                    className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 px-3 py-1 mb-1 font-mono rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>{section.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {showAdvancedOps ? "− Hide" : `+ Show (${section.items.length})`}
                    </span>
                  </button>
                ) : (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">
                    {section.title}
                  </div>
                )}

                {isOpen && (
                  <nav className="flex flex-col gap-1">
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
                          <div className="truncate flex-1">
                            <div className="truncate font-semibold">{item.label}</div>
                            {item.sublabel && (
                              <div className={`text-[10px] truncate ${isActive ? "text-slate-300" : "text-slate-400 font-normal"}`}>
                                {item.sublabel}
                              </div>
                            )}
                          </div>
                          {item.badge && (
                            <span
                              className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 ${
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
                )}
              </div>
            );
          })}

          {/* Operational Footer Card */}
          <div className="mt-auto p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
            <div className="font-semibold text-blue-900 text-[11px] mb-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Launch Phase 1: Vidisha (MP-40)</span>
            </div>
            <p className="text-[11px] text-blue-700/80 leading-relaxed">
              Platform actively configured for single-city launch. 112 Police ERSS link live.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl p-4 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BrandLogo className="w-8 h-8" />
                  <span className="font-bold text-slate-900 text-sm">DriveTrust Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {NAV_SECTIONS.map((section, idx) => {
                const isCollapsible = section.isCollapsible;
                const isOpen = !isCollapsible || showAdvancedOps;

                return (
                  <div key={idx} className={isCollapsible ? "pt-2 border-t border-slate-100" : ""}>
                    {isCollapsible ? (
                      <button
                        onClick={() => setShowAdvancedOps(!showAdvancedOps)}
                        className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 px-2 py-1 mb-1 font-mono rounded-lg hover:bg-slate-50"
                      >
                        <span>{section.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {showAdvancedOps ? "− Hide" : `+ Show (${section.items.length})`}
                        </span>
                      </button>
                    ) : (
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 font-mono">
                        {section.title}
                      </div>
                    )}

                    {isOpen && (
                      <nav className="flex flex-col gap-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2.5 ${
                                isActive
                                  ? "bg-slate-900 text-white font-semibold"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {item.icon}
                              <div className="truncate flex-1">
                                <div>{item.label}</div>
                                {item.sublabel && (
                                  <div className={`text-[10px] ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                                    {item.sublabel}
                                  </div>
                                )}
                              </div>
                              {item.badge && (
                                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </nav>
                    )}
                  </div>
                );
              })}
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Jump to page, action, or tool..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                onClick={() => setIsCommandOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                        {item.sublabel && (
                          <div className="text-[10px] text-slate-400">{item.sublabel}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </Link>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="font-mono font-bold bg-white px-1 py-0.5 rounded border border-slate-200">ESC</kbd> to exit</span>
              <span>18 Operations Modules Available</span>
            </div>
          </div>
        </div>
      )}

      {/* Platform Master Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-300 flex items-center justify-center text-amber-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    DriveTrust Platform Master Guide
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Easy reference guide for operators & admin staff (सरल गाइड)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7-Step Trip Lifecycle */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                <h4 className="text-sm font-bold text-slate-900">How a Chauffeur Trip Works (Start to Finish)</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 1:</span> Booking Created
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Customer books via App or Call Center (<strong>/concierge</strong>). System matches the nearest online verified driver.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 2:</span> Chauffeur Commute (~20-25m)
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Driver travels to the client&apos;s garage. Customer tracking screen shows realistic <strong>~20-25 mins arrival timer</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 3:</span> 4-Point Handover Audit
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Chauffeur inspects odometer, fuel, scratches, and valuables before driving to protect the client and driver (<strong>/inspections</strong>).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 4:</span> Start OTP Handshake
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Customer shares 4-digit secret OTP. Driver enters it in the app to officially begin the ride (also visible in <strong>/trips</strong>).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 5:</span> Transit with ₹10L Insurance
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Trip is protected by ₹10,00,000 comprehensive transit insurance policy and real-time Police 112 SOS monitor (<strong>/emergency</strong>).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-amber-600">Step 6:</span> End of Trip & Settlement
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Client pays via DT Wallet, UPI, or Cash. Platform retains 20% commission; 80% goes to driver payout ledger (<strong>/payouts</strong>).
                  </p>
                </div>
              </div>
            </div>

            {/* Operator Quick Rules */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                <h4 className="text-sm font-bold text-slate-900">Operator Rules & Common Actions</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <span>🔁 When to Re-assign a Chauffeur:</span>
                  </div>
                  <p className="text-amber-950/80 text-[11px] leading-relaxed">
                    Open <strong>/trips</strong> and click &quot;Reassign&quot; strictly if: (1) The customer calls requesting a different driver, or (2) The driver is delayed &gt;10 mins, or (3) The client car is Automatic and the driver can only drive Manual.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1">
                    <span>🚨 When SOS (112) is Triggered:</span>
                  </div>
                  <p className="text-rose-950/80 text-[11px] leading-relaxed">
                    Open <strong>/emergency</strong> immediately. View the live GPS coordinates and vehicle plate. Confirm emergency status and coordinate with Police ERSS 112 control room.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <span>🛡️ How Driver Verification Works:</span>
                  </div>
                  <p className="text-emerald-950/80 text-[11px] leading-relaxed">
                    Open <strong>/kyc</strong>. Check the driver&apos;s Commercial Driving License (DL) against MoRTH Sarathi portal and confirm police background check clearance before clicking &quot;Approve&quot;.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                DriveTrust Command Center • All systems operational
              </span>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Got It, Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
