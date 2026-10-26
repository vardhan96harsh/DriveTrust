"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  User,
  Star,
  MapPin,
  ChevronRight,
  Key,
  X,
  Check,
  Zap,
  Navigation,
  FileText,
  BadgeIndianRupee,
  Volume2,
  Camera,
  Compass,
  Power,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Smartphone,
  Info,
  DollarSign,
  Download,
  Gauge,
  Wallet,
  Activity,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  CustomerTrip,
  getCustomerTrips,
  acceptTripAsDriver,
  markDriverArrivedAtPickup,
  startTripWithOtp,
  completeTripAsDriver,
  saveCustomerTrip,
} from "@/lib/customerBookingStore";

export default function DriverPartnerCockpitPage() {
  // Duty Status
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<"DUTY" | "WALLET" | "SCORECARD">("DUTY");

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState<CustomerTrip | null>(null);
  const [incomingTrip, setIncomingTrip] = useState<CustomerTrip | null>(null);
  const [incomingCountdown, setIncomingCountdown] = useState<number>(30);

  // Vehicle Inspection Form
  const [insPhotos, setInsPhotos] = useState<{
    front: boolean;
    rear: boolean;
    left: boolean;
    right: boolean;
  }>({
    front: true,
    rear: true,
    left: false,
    right: false,
  });
  const [startOdo, setStartOdo] = useState<number>(42150);
  const [fuelPct, setFuelPct] = useState<number>(75);
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string | null>(null);

  // End Trip Form
  const [endOdo, setEndOdo] = useState<number>(42168);

  // Live Telematics Simulation
  const [currentSpeed, setCurrentSpeed] = useState<number>(38);
  const [safetyRating] = useState<number>(98);

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number>(3450);
  const [payoutRequested, setPayoutRequested] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      showToast("To install on mobile: Tap browser menu (⋮) -> 'Add to Home screen'");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check for trips from storage or custom event
  const refreshTrips = () => {
    const all = getCustomerTrips();
    const matching = all.find((t) => t.status === "MATCHING");
    const active = all.find(
      (t) =>
        t.status === "DRIVER_ASSIGNED" ||
        t.status === "DRIVER_ARRIVED" ||
        t.status === "HANDOVER_PENDING" ||
        t.status === "TRIP_ACTIVE"
    );

    if (active) {
      setActiveTrip(active);
      setIncomingTrip(null);
    } else if (matching) {
      setIncomingTrip(matching);
      setActiveTrip(null);
    } else {
      setIncomingTrip(null);
      if (activeTrip?.status !== "COMPLETED") {
        setActiveTrip(null);
      }
    }
  };

  useEffect(() => {
    refreshTrips();

    const handleUpdate = () => refreshTrips();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dt_trip_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dt_trip_updated", handleUpdate);
    };
  }, []);

  // Countdown timer for incoming trip alert
  useEffect(() => {
    if (!incomingTrip) return;
    const interval = setInterval(() => {
      setIncomingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIncomingTrip(null);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingTrip]);

  // Simulated Speedometer fluctuations during active ride
  useEffect(() => {
    if (activeTrip?.status !== "TRIP_ACTIVE") return;
    const interval = setInterval(() => {
      setCurrentSpeed(35 + Math.floor(Math.random() * 14));
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTrip?.status]);

  // Driver Actions
  const handleAcceptRide = () => {
    if (!incomingTrip) return;
    const updated = acceptTripAsDriver(incomingTrip.bookingId);
    if (updated) {
      setActiveTrip(updated);
      setIncomingTrip(null);
      showToast("Chauffeur reservation accepted. Proceed to pickup.");
    }
  };

  const handleDeclineRide = () => {
    setIncomingTrip(null);
    showToast("Request dismissed. Radar continuing search.");
  };

  const handleMarkArrived = () => {
    if (!activeTrip) return;
    const updated = markDriverArrivedAtPickup(activeTrip.bookingId);
    if (updated) {
      setActiveTrip(updated);
      showToast("Status: Arrived at customer vehicle. Conduct 360° audit.");
    }
  };

  const handleStartTrip = () => {
    if (!activeTrip) return;
    setOtpError(null);
    const result = startTripWithOtp(
      activeTrip.bookingId,
      enteredOtp,
      startOdo,
      fuelPct,
      {
        front: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400",
        rear: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
        left: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
        right: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400",
      }
    );

    if (!result.success) {
      setOtpError(result.error || "Incorrect OTP");
      return;
    }

    if (result.trip) {
      setActiveTrip(result.trip);
      showToast("OTP Verified. Pre-trip condition logged. Chauffeur duty started.");
    }
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;
    const updated = completeTripAsDriver(activeTrip.bookingId, endOdo);
    if (updated) {
      setActiveTrip(updated);
      const earned = Math.round(updated.fareEstimated * 0.8);
      setWalletBalance((prev) => prev + earned);
      showToast(`Trip finalized. ₹${earned} credited to your settlement wallet.`);
    }
  };

  const handleResetForNextRide = () => {
    setActiveTrip(null);
    setEnteredOtp("");
    showToast("Chauffeur standing by. Searching next assignment...");
  };

  const handleInstantPayout = () => {
    if (walletBalance <= 0) return;
    setPayoutRequested(true);
    setTimeout(() => {
      setWalletBalance(0);
      setPayoutRequested(false);
      showToast("Payout of ₹3,450 processed via IMPS to rajesh.sharma@okaxis.");
    }, 1500);
  };

  const handleSimulateIncoming = () => {
    const mockTrip: CustomerTrip = {
      bookingId: `BK-EXEC-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceMode: "CITY_POINT",
      customerName: "Harshvardhan",
      customerPhone: "+91 98450 12345",
      vehicle: {
        id: "veh-fortuner",
        brand: "Toyota",
        model: "Fortuner 4x4",
        plate: "MP-40-CA-4921",
        transmission: "MANUAL",
        color: "Pearl White",
        year: 2023,
      },
      pickupAddress: "Vidisha Railway Station, Station Rd",
      dropoffAddress: "Collectorate Civil Lines, Vidisha",
      scheduledTime: "NOW",
      isScheduled: false,
      driverProtectionInsurance: true,
      fareEstimated: 350,
      otp: "4892",
      handoverAccepted: false,
      status: "MATCHING",
      createdAt: new Date().toISOString(),
      trackingToken: "track-exec",
    };
    saveCustomerTrip(mockTrip);
    setIncomingTrip(mockTrip);
    setIncomingCountdown(30);
    showToast("Incoming chauffeur request broadcast received!");
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans pb-20 selection:bg-emerald-500/30 selection:text-white">
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="bg-slate-900/90 border-b border-emerald-500/30 px-4 py-2.5 text-xs flex items-center justify-between shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Download className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-300">
              Install <strong className="text-white">Sathi Partner</strong> app on home screen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerInstall}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] shadow-sm transition cursor-pointer"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-medium border border-slate-700/80 text-xs backdrop-blur-md animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Luxury Chauffeur App Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Driver Avatar & Verified Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                RS
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0B0F19] ${
                  isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "bg-slate-600"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm tracking-tight">
                  Rajesh Sharma
                </span>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  MoRTH
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center text-amber-400 font-bold gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.95
                </span>
                <span>•</span>
                <span>Vidisha Hub MP-40</span>
              </div>
            </div>
          </div>

          {/* Luxury Tactile Duty Switch */}
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(isOnline ? "Chauffeur status: OFFLINE" : "Chauffeur status: ONLINE • Ready for duty");
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isOnline
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25"
                : "bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" : "bg-slate-500"
              }`}
            />
            <span>{isOnline ? "ON DUTY" : "OFF DUTY"}</span>
          </button>
        </div>

        {/* Segmented Luxury Tab Selector */}
        <div className="max-w-md mx-auto grid grid-cols-3 gap-1.5 mt-3 p-1 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("DUTY")}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "DUTY"
                ? "bg-slate-800 text-white shadow-xs font-bold border border-slate-700/80"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cockpit
          </button>
          <button
            onClick={() => setActiveTab("WALLET")}
            className={`py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "WALLET"
                ? "bg-slate-800 text-white shadow-xs font-bold border border-slate-700/80"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="font-mono text-emerald-400 font-bold">₹{walletBalance}</span>
            <span className="text-[10px] text-slate-400">Wallet</span>
          </button>
          <button
            onClick={() => setActiveTab("SCORECARD")}
            className={`py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === "SCORECARD"
                ? "bg-slate-800 text-white shadow-xs font-bold border border-slate-700/80"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="font-mono font-bold">{safetyRating}</span>
            <span className="text-[10px] text-slate-400">Safety</span>
          </button>
        </div>
      </header>

      {/* Main Chauffeur Application Body */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {/* ================= WALLET TAB ================= */}
        {activeTab === "WALLET" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Obsidian Metallic Card Visual */}
            <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#131B2E] via-[#0E1524] to-[#0A0E17] border border-slate-700/80 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                <span className="uppercase tracking-wider">Chauffeur Settlement Ledger</span>
                <span className="text-emerald-400 font-bold">IMPS Direct</span>
              </div>

              <div className="text-3xl font-extrabold text-white tracking-tight font-mono flex items-baseline gap-1">
                <span className="text-emerald-400 text-2xl font-sans">₹</span>
                <span>{walletBalance.toLocaleString("en-IN")}</span>
                <span className="text-xs font-medium text-slate-400 ml-2 font-sans">Available for Transfer</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Registered UPI:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  rajesh.sharma@okaxis
                </span>
              </div>

              <button
                disabled={walletBalance <= 0 || payoutRequested}
                onClick={handleInstantPayout}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <BadgeIndianRupee className="w-4 h-4 stroke-[2.5]" />
                {payoutRequested ? "Transferring via Bank IMPS..." : "Instant 1-Click UPI Transfer"}
              </button>
            </div>

            {/* Weekly Earnings History */}
            <div className="bg-[#0B0F19] border border-slate-800/90 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/70">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Recent Duty Settlements
                </h3>
                <span className="text-[11px] text-slate-500">100% On-Time</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white">Fortuner 4x4 • Station to Civil Lines</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Today, 04:30 PM • 18 km</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">+₹224</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white">Creta Automatic • 4 Hr Package</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Yesterday, 11:15 AM • 34 km</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">+₹480</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white">Innova Crysta • Outstation Sanchi</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">22 Oct • 68 km</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">+₹1,150</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCORECARD TAB ================= */}
        {activeTab === "SCORECARD" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F1B1F] via-[#0B1519] to-[#0A0E17] border border-emerald-500/30 text-center shadow-xl">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold font-mono">
                Chauffeur Safety Telematics
              </span>
              <div className="text-5xl font-black text-white mt-2 flex items-center justify-center gap-1 font-mono">
                <span className="text-emerald-400">{safetyRating}</span>
                <span className="text-xl text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tier 1 Elite Chauffeur • ₹50/trip Bonus Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-3.5">
                <span className="text-slate-400 block mb-1 font-medium">Smooth Braking</span>
                <span className="text-xl font-bold text-white font-mono">99%</span>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">0 Harsh Decelerations</p>
              </div>
              <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-3.5">
                <span className="text-slate-400 block mb-1 font-medium">Speed Compliance</span>
                <span className="text-xl font-bold text-white font-mono">100%</span>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Within Urban Speed Caps</p>
              </div>
              <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-3.5">
                <span className="text-slate-400 block mb-1 font-medium">Passenger Rating</span>
                <span className="text-xl font-bold text-amber-400 font-mono">4.95 ★</span>
                <p className="text-[10px] text-slate-400 mt-0.5">342 verified reviews</p>
              </div>
              <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-3.5">
                <span className="text-slate-400 block mb-1 font-medium">Zero-Car Drop</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">100%</span>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Perfect return audit</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= DUTY COCKPIT TAB ================= */}
        {activeTab === "DUTY" && (
          <>
            {/* OFFLINE STATE */}
            {!isOnline && (
              <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Power className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Chauffeur Cockpit Offline</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Switch Online to start receiving high-value chauffeur assignments in Vidisha &amp; Bhopal hubs.
                  </p>
                </div>
                <button
                  onClick={() => setIsOnline(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Go Online Now
                </button>
              </div>
            )}

            {/* ONLINE & SEARCHING (RADAR ACTIVE) */}
            {isOnline && !incomingTrip && !activeTrip && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden shadow-xl">
                  {/* Concentric Animated Radar Ring */}
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping duration-1000" />
                    <span className="absolute inset-2 rounded-full bg-emerald-500/20 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl">
                      <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "10s" }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">Chauffeur Radar Active</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Standing by in high-demand zone: Vidisha Railway Station, Civil Lines, Collectorate.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-slate-400 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      GPS Telemetry Live
                    </span>
                    <span>•</span>
                    <span>Surge: 1.0x Normal</span>
                  </div>
                </div>

                {/* Subtle Testing Trigger (Unobtrusive & Clean) */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 font-medium">Test Booking Alert</span>
                  </div>
                  <button
                    onClick={handleSimulateIncoming}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold transition cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Simulate Request</span>
                  </button>
                </div>
              </div>
            )}

            {/* INCOMING RIDE POPUP / ALERT */}
            {isOnline && incomingTrip && !activeTrip && (
              <div className="bg-gradient-to-b from-[#111A29] to-[#0A0E17] border-2 border-emerald-500/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Incoming Chauffeur Assignment
                    </span>
                  </div>
                  <span className="bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {incomingCountdown}s
                  </span>
                </div>

                {/* Fare & Vehicle Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-baseline gap-1 font-mono">
                      <span className="text-emerald-400 font-sans text-xl">₹</span>
                      <span>{Math.round(incomingTrip.fareEstimated * 0.8)}</span>
                      <span className="text-[11px] font-normal text-slate-400 ml-1 font-sans">
                        (Net Chauffeur Share)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 font-bold mt-1">
                      {incomingTrip.vehicle.brand} {incomingTrip.vehicle.model}
                    </p>
                    <span className="inline-block mt-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      {incomingTrip.vehicle.transmission} TRANSMISSION
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Passenger</span>
                    <p className="font-bold text-white text-sm">{incomingTrip.customerName}</p>
                    <span className="text-[11px] text-slate-400 font-mono">{incomingTrip.vehicle.plate}</span>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-[#070A11] rounded-2xl p-3.5 border border-slate-800/90 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Pickup Vehicle</span>
                      <p className="font-semibold text-white">{incomingTrip.pickupAddress}</p>
                      <span className="text-[11px] text-emerald-400 font-mono">1.2 km away • ~4 mins walk</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Dropoff Destination</span>
                      <p className="font-semibold text-white">{incomingTrip.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Accept / Decline Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleDeclineRide}
                    className="py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptRide}
                    className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Accept Assignment</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE TRIP: STEP 1 - EN ROUTE TO CUSTOMER */}
            {isOnline && activeTrip && activeTrip.status === "DRIVER_ASSIGNED" && (
              <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                      En Route to Vehicle
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Booking #{activeTrip.bookingId.slice(-6)}
                  </span>
                </div>

                {/* Customer & Vehicle Card */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Customer Car</span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {activeTrip.vehicle.brand} {activeTrip.vehicle.model}
                    </h4>
                    <p className="text-xs font-mono text-emerald-400 font-semibold">
                      {activeTrip.vehicle.plate} • {activeTrip.vehicle.transmission}
                    </p>
                  </div>
                  <a
                    href={`tel:${activeTrip.customerPhone}`}
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 flex items-center justify-center transition shadow cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Pickup Address */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block mb-0.5">
                    Vehicle Pickup Location:
                  </span>
                  <p className="text-white font-medium">{activeTrip.pickupAddress}</p>
                </div>

                {/* External Navigation Shortcut */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeTrip.pickupAddress
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Navigate in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {/* Arrived Action */}
                <button
                  onClick={handleMarkArrived}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>I Have Arrived at Customer Vehicle</span>
                </button>
              </div>
            )}

            {/* ACTIVE TRIP: STEP 2 - VEHICLE CONDITION AUDIT & OTP START */}
            {isOnline &&
              activeTrip &&
              (activeTrip.status === "DRIVER_ARRIVED" || activeTrip.status === "HANDOVER_PENDING") && (
                <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                        Pre-Trip 360° Inspection
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Customer Handover</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Document 4 exterior angles of customer vehicle to eliminate scratch &amp; dent liability:
                  </p>

                  {/* 4 Photos Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(["front", "rear", "left", "right"] as const).map((angle) => (
                      <button
                        key={angle}
                        onClick={() =>
                          setInsPhotos((prev) => ({ ...prev, [angle]: !prev[angle] }))
                        }
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          insPhotos[angle]
                            ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                            : "bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                        <span className="capitalize font-semibold">{angle} View</span>
                        <span className="text-[10px] font-bold">
                          {insPhotos[angle] ? "✓ Captured" : "+ Tap to Capture"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Initial Odometer & Fuel */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold text-[11px]">
                        Start Odometer (km)
                      </label>
                      <input
                        type="number"
                        value={startOdo}
                        onChange={(e) => setStartOdo(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold text-[11px]">
                        Fuel Gauge ({fuelPct}%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={fuelPct}
                        onChange={(e) => setFuelPct(Number(e.target.value))}
                        className="w-full accent-emerald-500 mt-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Customer Permanent Sathi PIN Verification & Vehicle Confirmation */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                    {/* Vehicle & Customer Identity Confirmation (Option C Protection) */}
                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                          Assigned Vehicle &amp; Customer:
                        </span>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {activeTrip.vehicle.brand} {activeTrip.vehicle.model} • <span className="text-emerald-400 font-mono">{activeTrip.vehicle.plate}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Customer: <span className="text-slate-200 font-semibold">{activeTrip.customerName}</span>
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        MATCH CAR
                      </span>
                    </div>

                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        Enter Customer&apos;s Permanent Sathi PIN
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        (Customer PIN: {activeTrip.otp})
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 4892"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full bg-[#070A11] border border-slate-800 rounded-xl px-4 py-2.5 text-center text-xl tracking-[0.5em] font-mono text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                    />
                    {otpError && (
                      <p className="text-xs text-rose-400 font-semibold">{otpError}</p>
                    )}
                  </div>

                  {/* Start Trip CTA */}
                  <button
                    onClick={handleStartTrip}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Verify OTP &amp; Begin Chauffeur Duty</span>
                  </button>
                </div>
              )}

            {/* ACTIVE TRIP: STEP 3 - DRIVING CUSTOMER'S CAR */}
            {isOnline && activeTrip && activeTrip.status === "TRIP_ACTIVE" && (
              <div className="bg-[#0B0F19] border border-slate-800/90 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                      Trip In Progress
                    </span>
                  </div>
                  <span className="bg-emerald-500/15 text-emerald-300 font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    Telematics Monitored
                  </span>
                </div>

                {/* Speedometer & Live Telematics Display */}
                <div className="bg-[#070A11] rounded-2xl p-5 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                    Current Speed
                  </span>
                  <div className="text-5xl font-black text-white mt-1 font-mono tracking-tight">
                    {currentSpeed} <span className="text-sm font-normal text-slate-400">km/h</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Smooth Telematics • Safe Driving Certified</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block mb-0.5">
                    Dropoff Destination:
                  </span>
                  <p className="text-white font-medium">{activeTrip.dropoffAddress}</p>
                </div>

                {/* Emergency Hotline Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href="tel:112"
                    className="flex-1 py-2.5 bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 text-rose-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Emergency 112</span>
                  </a>
                  <a
                    href="tel:1800123456"
                    className="flex-1 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24/7 Concierge</span>
                  </a>
                </div>

                {/* Final Odometer & Settle */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-slate-400 font-semibold">Final Odometer (km):</label>
                    <input
                      type="number"
                      value={endOdo}
                      onChange={(e) => setEndOdo(Number(e.target.value))}
                      className="w-28 bg-[#070A11] border border-slate-800 rounded-lg px-2.5 py-1 text-right text-white font-mono text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleEndTrip}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Reached Destination • End Trip</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE TRIP: STEP 4 - COMPLETED & FARE SUMMARY */}
            {isOnline && activeTrip && activeTrip.status === "COMPLETED" && (
              <div className="bg-[#0B0F19] border border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-base font-bold text-white">Chauffeur Duty Completed!</h3>
                  <p className="text-xs text-slate-400">
                    Vehicle successfully handed back to {activeTrip.customerName}.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-[#070A11] rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Trip Distance</span>
                    <span className="font-mono text-white font-semibold">18 km</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Trip Duration</span>
                    <span className="font-mono text-white font-semibold">42 mins</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Customer Fare</span>
                    <span className="font-mono text-white font-semibold">
                      ₹{activeTrip.fareEstimated}.00
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-emerald-400">Net Chauffeur Share (80%)</span>
                    <span className="text-emerald-400 text-base font-mono">
                      +₹{Math.round(activeTrip.fareEstimated * 0.8)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Settlement verified online. Earnings credited directly to your Chauffeur Wallet.
                  </span>
                </div>

                <button
                  onClick={handleResetForNextRide}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Return to Cockpit for Next Trip
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0B0F19]/95 border-t border-slate-800/90 py-2.5 px-4 z-40 backdrop-blur-md">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs">
          <Link
            href="/book"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
          >
            <Car className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer App</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/live-map"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>Fleet Radar</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
          >
            <span>Admin Tower</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
