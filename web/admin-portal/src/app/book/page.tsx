"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Clock,
  Shield,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Phone,
  User,
  Plus,
  Share2,
  Star,
  MapPin,
  ChevronRight,
  Info,
  Key,
  X,
  Check,
  Zap,
  Navigation,
  FileText,
  BadgeIndianRupee,
  Heart,
  Volume2,
  Smartphone,
  Download,
  ExternalLink,
  Radio,
} from "lucide-react";
import {
  ServiceMode,
  HourlyPackage,
  HOURLY_PACKAGES,
  CustomerTrip,
  getCustomerGarage,
  addVehicleToGarage,
  saveCustomerTrip,
  confirmCustomerHandover,
  acceptTripAsDriver,
  DEFAULT_ACTIVE_TRIP,
} from "@/lib/customerBookingStore";
import { CustomerVehicle, getActiveCustomer } from "@/lib/userStore";
import {
  validateBookingLocation,
  BookingValidationResult,
  getRegions,
  Region,
} from "@/lib/regionStore";
import BrandLogo from "@/components/BrandLogo";

const PRESET_LANDMARKS = [
  { name: "Vidisha Railway Station, Station Rd", coords: [23.5262, 77.8211] as [number, number], rto: "MP-40" },
  { name: "Collectorate Civil Lines, Vidisha", coords: [23.5350, 77.8115] as [number, number], rto: "MP-40" },
  { name: "Sanchi Stupa Heritage Gate (SH-19)", coords: [23.4793, 77.7397] as [number, number], rto: "MP-40" },
  { name: "DB City Mall / MP Nagar Zone-1, Bhopal", coords: [23.2332, 77.4334] as [number, number], rto: "MP-04" },
  { name: "Raja Bhoj International Airport, Bhopal", coords: [23.2875, 77.3378] as [number, number], rto: "MP-04" },
  { name: "Rani Kamlapati Station & Arera Colony, Bhopal", coords: [23.2167, 77.4398] as [number, number], rto: "MP-04" },
];

export default function CustomerBookingPage() {
  // Booking Form State
  const [serviceMode, setServiceMode] = useState<ServiceMode>("CITY_POINT");
  const [selectedPackage, setSelectedPackage] = useState<HourlyPackage>(HOURLY_PACKAGES[0]);
  const [garage, setGarage] = useState<CustomerVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<CustomerVehicle | null>(null);

  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");

  // Locations & Coordinates
  const [pickupLocation, setPickupLocation] = useState("Vidisha Railway Station, Station Rd");
  const [pickupCoords, setPickupCoords] = useState<[number, number]>([23.5262, 77.8211]);
  const [dropoffLocation, setDropoffLocation] = useState("Collectorate Civil Lines, Vidisha");
  const [dropoffCoords, setDropoffCoords] = useState<[number, number]>([23.5350, 77.8115]);
  const [regionValidation, setRegionValidation] = useState<BookingValidationResult | null>(null);
  const [matchingCountdown, setMatchingCountdown] = useState<number>(30);

  // Protection Add-on
  const [insuranceProtection, setInsuranceProtection] = useState(true);

  // Vehicle Modal
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newTransmission, setNewTransmission] = useState<"MANUAL" | "AUTOMATIC" | "LUXURY">("MANUAL");

  // Booking Flow Steps
  const [currentStep, setCurrentStep] = useState<
    "FORM" | "CONFIRMING" | "MATCHED" | "HANDOVER" | "ACTIVE_RIDE" | "COMPLETED"
  >("FORM");
  const [activeTrip, setActiveTrip] = useState<CustomerTrip | null>(null);

  // Handover confirmation
  const [handoverOdometer, setHandoverOdometer] = useState(42150);
  const [handoverFuel, setHandoverFuel] = useState(75);
  const [handoverAgreed, setHandoverAgreed] = useState(false);

  // Tip & Rating
  const [selectedTip, setSelectedTip] = useState<number | null>(50);
  const [customerRating, setCustomerRating] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(["Smooth Braking", "Polite"]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);

  useEffect(() => {
    const pwaHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", pwaHandler);
    return () => window.removeEventListener("beforeinstallprompt", pwaHandler);
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

  useEffect(() => {
    const vList = getCustomerGarage();
    setGarage(vList);
    if (vList.length > 0) setSelectedVehicle(vList[0]);

    const syncTrip = () => {
      try {
        const raw = localStorage.getItem("dt_customer_trips_v1");
        if (raw) {
          const list: CustomerTrip[] = JSON.parse(raw);
          if (list.length > 0) {
            const latest = list[0];
            setActiveTrip(latest);
            if (latest.status === "MATCHING") {
              setCurrentStep("CONFIRMING");
            } else if (latest.status === "DRIVER_ASSIGNED") {
              setCurrentStep("MATCHED");
            } else if (latest.status === "DRIVER_ARRIVED" || latest.status === "HANDOVER_PENDING") {
              setCurrentStep("HANDOVER");
            } else if (latest.status === "TRIP_ACTIVE") {
              setCurrentStep("ACTIVE_RIDE");
            } else if (latest.status === "COMPLETED") {
              setCurrentStep("COMPLETED");
            }
          }
        }
      } catch {}
    };

    window.addEventListener("storage", syncTrip);
    window.addEventListener("dt_trip_updated", syncTrip);
    return () => {
      window.removeEventListener("storage", syncTrip);
      window.removeEventListener("dt_trip_updated", syncTrip);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pricing calculation
  const calculateFare = () => {
    if (serviceMode === "HOURLY_RENTAL") {
      const base = selectedPackage.baseFare;
      const ins = insuranceProtection ? 29 : 0;
      const gst = Math.round(base * 0.05);
      return { base, ins, gst, total: base + ins + gst };
    }
    if (serviceMode === "OUTSTATION") {
      const base = 1200;
      const nightAllowance = 300;
      const ins = insuranceProtection ? 49 : 0;
      const gst = Math.round(base * 0.05);
      return { base, ins, gst, total: base + nightAllowance + ins + gst, nightAllowance };
    }
    // City ride
    const base = 220;
    const kmFare = 50;
    const ins = insuranceProtection ? 29 : 0;
    const gst = Math.round((base + kmFare) * 0.05);
    return { base: base + kmFare, ins, gst, total: base + kmFare + ins + gst };
  };

  const fareDetails = calculateFare();

  const handleAddNewVehicle = () => {
    if (!newBrand.trim() || !newModel.trim() || !newPlate.trim()) {
      showToast("❌ Enter Brand, Model, and Number Plate.");
      return;
    }
    const updated = addVehicleToGarage({
      brand: newBrand,
      model: newModel,
      plate: newPlate.toUpperCase(),
      transmission: newTransmission,
      year: 2024,
    });
    setGarage(updated);
    setSelectedVehicle(updated[updated.length - 1]);
    setShowAddVehicleModal(false);
    setNewBrand(""); setNewModel(""); setNewPlate("");
    showToast(`✅ ${newBrand} ${newModel} added to your personal garage!`);
  };

  // Geofence check
  useEffect(() => {
    const res = validateBookingLocation(pickupCoords[0], pickupCoords[1]);
    setRegionValidation(res);
  }, [pickupCoords]);

  // Matching 30s countdown
  useEffect(() => {
    if (currentStep !== "CONFIRMING") {
      setMatchingCountdown(30);
      return;
    }
    const timer = setInterval(() => {
      setMatchingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const handleSelectPresetLocation = (preset: typeof PRESET_LANDMARKS[0]) => {
    setPickupLocation(preset.name);
    setPickupCoords(preset.coords);
    showToast(`📍 Selected ${preset.name} (${preset.rto})`);
  };

  const handleConfirmBooking = () => {
    if (!selectedVehicle) {
      showToast("❌ Please select a vehicle from your garage.");
      return;
    }

    // Strict Geofence & Zone Status Validation
    const validation = validateBookingLocation(pickupCoords[0], pickupCoords[1]);
    if (!validation.isAllowed) {
      showToast(`⛔ ${validation.message}`);
      return;
    }

    const activeCust = getActiveCustomer();
    const rto = validation.matchedRegion?.rtoCode?.replace(/[^A-Za-z0-9]/g, "") || "MP40";
    const bookingCode = `BK-${rto}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip: CustomerTrip = {
      bookingId: bookingCode,
      serviceMode,
      selectedPackage: serviceMode === "HOURLY_RENTAL" ? selectedPackage : undefined,
      customerName: activeCust?.fullName || "Harshvardhan",
      customerPhone: activeCust?.phone || "+91 98450 12345",
      vehicle: selectedVehicle,
      pickupAddress: pickupLocation,
      dropoffAddress: dropoffLocation,
      pickupCoords,
      dropoffCoords,
      zoneId: validation.matchedRegion?.id,
      zoneName: validation.matchedRegion?.name,
      rtoCode: validation.matchedRegion?.rtoCode,
      scheduledTime: isScheduled && scheduleDateTime ? scheduleDateTime : "NOW",
      isScheduled,
      driverProtectionInsurance: insuranceProtection,
      fareEstimated: fareDetails.total,
      otp: activeCust?.permanentPin || "4892",
      handoverAccepted: false,
      status: "MATCHING", // Dispatched to drivers in this operating zone!
      createdAt: new Date().toISOString(),
      trackingToken: `track-${bookingCode.toLowerCase()}`,
    };

    saveCustomerTrip(newTrip);
    setActiveTrip(newTrip);
    setCurrentStep("CONFIRMING");
    showToast(`📡 Ride request broadcast to active chauffeurs in ${validation.matchedRegion?.name}!`);
  };

  const handleSimulateDriverAccept = () => {
    if (!activeTrip) return;
    const assigned = acceptTripAsDriver(activeTrip.bookingId, {
      id: "drv-01",
      name: "Rajesh Sharma",
      phone: "+91 98261 44001",
      rating: 4.95,
      totalTrips: 342,
      rtoCode: activeTrip.rtoCode || "MP-40 (Vidisha)",
      sarathiVerified: true,
    });
    if (assigned) {
      setActiveTrip(assigned);
      setCurrentStep("MATCHED");
      showToast("🎉 Chauffeur Rajesh Sharma accepted your ride!");
    }
  };

  const handleCancelMatching = () => {
    if (!activeTrip) return;
    saveCustomerTrip({
      ...activeTrip,
      status: "CANCELLED",
    });
    setActiveTrip(null);
    setCurrentStep("FORM");
    showToast("Request cancelled.");
  };

  const handleAcceptHandover = () => {
    if (!activeTrip) return;
    if (!handoverAgreed) {
      showToast("⚠️ Please confirm vehicle condition acknowledgment checkbox.");
      return;
    }
    const updated = confirmCustomerHandover(activeTrip.bookingId, handoverOdometer, handoverFuel);
    if (updated) {
      setActiveTrip(updated);
      setCurrentStep("ACTIVE_RIDE");
      showToast("🚗 Keys handed over! Trip is now in progress.");
    }
  };

  const handleCompleteRide = () => {
    setCurrentStep("COMPLETED");
  };

  const shareOnWhatsApp = () => {
    if (!activeTrip) return;
    const text = encodeURIComponent(
      `🚗 Tracking my Sathi Chauffeur ride!\n\n` +
      `Car: ${activeTrip.vehicle.brand} ${activeTrip.vehicle.model} (${activeTrip.vehicle.plate})\n` +
      `Chauffeur: ${activeTrip.assignedDriver?.name} (${activeTrip.assignedDriver?.rtoCode})\n` +
      `Track my live car location: http://localhost:3000/track?id=${activeTrip.trackingToken}\n\n` +
      `Security: Verified on MoRTH Sarathi National Register.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 sm:px-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in slide-in-from-top-2 max-w-sm">
          {toastMessage}
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-xs flex items-center justify-between rounded-2xl mb-4 shadow-md">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 shrink-0" />
            <span>Install <strong>Sathi Customer</strong> app on your phone</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerInstall}
              className="bg-white text-slate-900 font-bold px-2.5 py-1 rounded-lg text-[11px] shadow hover:bg-slate-100 transition-all"
            >
              Install App
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="opacity-75 hover:opacity-100 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Customer Branding Header */}
      <div className="flex items-center justify-between py-4 border-b border-slate-200 mb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo className="w-8 h-8" />
          <div>
            <div className="font-black text-slate-900 text-base leading-tight">Sathi</div>
            <div className="text-[10px] text-slate-500 font-semibold">Aapki Gaadi, Aapka Sathi · Vidisha &amp; Bhopal</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/customer"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 flex items-center gap-1.5 shadow-xs"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>Sathi Pass</span>
          </Link>
          <Link
            href="/customer/register"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hidden sm:flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Register</span>
          </Link>
          <Link
            href="/driver"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 flex items-center gap-1.5 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            Driver App ↗
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hidden sm:inline-block"
          >
            Admin ↗
          </Link>
        </div>
      </div>

      {/* STEP 1: BOOKING CONFIGURATION */}
      {currentStep === "FORM" && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">Verified Chauffeur for Your Car</span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">Where would you like to travel?</h1>
          </div>

          {/* Service Mode Selector */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setServiceMode("CITY_POINT")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                serviceMode === "CITY_POINT"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              City Ride
            </button>
            <button
              onClick={() => setServiceMode("HOURLY_RENTAL")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                serviceMode === "HOURLY_RENTAL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Hourly Packages
            </button>
            <button
              onClick={() => setServiceMode("OUTSTATION")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                serviceMode === "OUTSTATION"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Outstation
            </button>
          </div>

          {/* Hourly Packages Selector (if hourly mode) */}
          {serviceMode === "HOURLY_RENTAL" && (
            <div className="space-y-2.5 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <div className="text-xs font-bold text-blue-900 mb-2">Select Rental Duration Package:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {HOURLY_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-xl border cursor-pointer transition relative ${
                      selectedPackage.id === pkg.id
                        ? "bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {pkg.tag && (
                      <span className="absolute -top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                        {pkg.tag}
                      </span>
                    )}
                    <div className="font-extrabold text-slate-900 text-xs">{pkg.hours} Hours / {pkg.kmIncluded} km</div>
                    <div className="text-base font-black text-blue-700 mt-1">₹{pkg.baseFare}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Extra: ₹{pkg.extraHourRate}/hr · ₹{pkg.extraKmRate}/km</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Garage Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-slate-700" /> Select Your Car
              </span>
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Car
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {garage.map((veh) => {
                const isSelected = selectedVehicle?.id === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicle(veh)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">{veh.brand} {veh.model}</div>
                      <div className={`text-[10px] font-mono ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {veh.plate} · {veh.transmission}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule vs Now */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-700" /> Dispatch Time
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setIsScheduled(false)}
                  className={`px-3 py-1 rounded-md transition ${
                    !isScheduled ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Ride Now
                </button>
                <button
                  onClick={() => setIsScheduled(true)}
                  className={`px-3 py-1 rounded-md transition ${
                    isScheduled ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Schedule Later
                </button>
              </div>
            </div>

            {isScheduled && (
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Pick Date &amp; Time for Chauffeur Arrival</label>
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>
            )}
          </div>

          {/* Locations Input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Point (Chauffeur will arrive here)
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {pickupCoords[0].toFixed(4)}, {pickupCoords[1].toFixed(4)}
                </span>
              </div>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
              />

              {/* Landmark Presets */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 self-center mr-1">Quick Hubs:</span>
                {PRESET_LANDMARKS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPresetLocation(preset)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                      pickupLocation === preset.name
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {preset.name.split(",")[0]} ({preset.rto})
                  </button>
                ))}
              </div>
            </div>

            {serviceMode !== "HOURLY_RENTAL" && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> Destination
                </label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                />
              </div>
            )}

            {/* Operating Zone & Geofence Status Badge */}
            {regionValidation && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition ${
                  regionValidation.isAllowed
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : regionValidation.status === "REGION_OFFLINE"
                    ? "bg-rose-50 border-rose-300 text-rose-900"
                    : "bg-amber-50 border-amber-300 text-amber-900"
                }`}
              >
                {regionValidation.isAllowed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-extrabold flex items-center gap-1.5">
                    <span>
                      {regionValidation.isAllowed
                        ? `Operational Zone: ${regionValidation.matchedRegion?.name} (${regionValidation.matchedRegion?.rtoCode})`
                        : regionValidation.status === "REGION_OFFLINE"
                        ? `Operating Zone Offline: ${regionValidation.matchedRegion?.name}`
                        : "Location Outside Operating Geofence"}
                    </span>
                    {regionValidation.isAllowed && (
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-tight">
                    {regionValidation.message}
                  </p>
                  {!regionValidation.isAllowed && (
                    <Link
                      href="/regions"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline mt-1.5"
                    >
                      <span>Manage Geofence &amp; Operating Zones in Studio</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Damage Protection Add-on */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                  <span>Accidental Damage Protection (₹2,00,000 cover)</span>
                  <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                    +₹{serviceMode === "OUTSTATION" ? "49" : "29"}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                  Covers scratches, minor bumper dents, or transit accidents while the chauffeur operates your vehicle.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={insuranceProtection}
              onChange={(e) => setInsuranceProtection(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded-md focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Fare Summary & CTA */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
              <span>Estimated Fare (incl. GST SAC 9966)</span>
              <span>Payment: UPI / Cash to Driver</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-black text-white">₹{fareDetails.total}</div>
                <div className="text-[11px] text-slate-400">
                  Base ₹{fareDetails.base} · GST ₹{fareDetails.gst} {insuranceProtection && `· Insurance ₹${fareDetails.ins}`}
                </div>
              </div>
              <button
                onClick={handleConfirmBooking}
                disabled={regionValidation !== null && !regionValidation.isAllowed}
                className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition shadow-md flex items-center gap-2 ${
                  regionValidation !== null && !regionValidation.isAllowed
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                <span>Request Chauffeur</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1.5: BROADCASTING & MATCHING WITH CHAUFFEURS IN ZONE */}
      {currentStep === "CONFIRMING" && activeTrip && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
            {/* Pulsing Radar Ring */}
            <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Radio className="w-8 h-8 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Active Zone Dispatch Radar
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Searching for Chauffeur in {activeTrip.zoneName || "Vidisha (MP-40)"}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Broadcasting ride offer to verified drivers authorized in this operating zone.
              </p>
            </div>

            {/* Live 30s Countdown Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-mono font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Chauffeur Acceptance Window: {matchingCountdown}s</span>
            </div>

            {/* Trip Details Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold">Booking Reference</span>
                <span className="font-mono font-extrabold text-slate-900">{activeTrip.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Your Car</span>
                <span className="font-bold text-slate-900">{activeTrip.vehicle.brand} {activeTrip.vehicle.model} ({activeTrip.vehicle.transmission})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Pickup Point</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{activeTrip.pickupAddress}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Fare (Est.)</span>
                <span className="font-black text-slate-900 text-sm">₹{activeTrip.fareEstimated}</span>
              </div>
            </div>

            {/* Dual Actions for Live Multi-Window or 1-Click Demo */}
            <div className="space-y-2 pt-2">
              <Link
                href="/driver"
                target="_blank"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Open Driver Partner Cockpit (/driver) to Accept Duty</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={handleSimulateDriverAccept}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Driver Acceptance (Instant Demo Match)</span>
              </button>

              <button
                type="button"
                onClick={handleCancelMatching}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-rose-600 font-bold text-xs transition"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CHAUFFEUR MATCHED & 4-DIGIT SECURITY OTP */}
      {currentStep === "MATCHED" && activeTrip && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-700 animate-bounce">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Chauffeur Assigned</span>
            <h2 className="text-2xl font-black text-slate-900">Driver Arriving in 8 mins</h2>
            <p className="text-xs text-slate-500 mt-1">Share the Handover OTP with your chauffeur upon arrival</p>
          </div>

          {/* Security Permanent Sathi PIN Card */}
          <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Your Permanent Sathi PIN
              </span>
            </div>
            <div className="text-4xl font-black font-mono tracking-widest text-blue-900 my-1">{activeTrip.otp}</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Unique to your account • Tell this PIN to your chauffeur to start your trip
            </div>
          </div>

          {/* Assigned Chauffeur Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                RS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{activeTrip.assignedDriver?.name}</h3>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> MoRTH Sarathi
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center text-amber-500 font-bold">★ {activeTrip.assignedDriver?.rating}</span>
                  <span>· {activeTrip.assignedDriver?.totalTrips} Trips Completed</span>
                  <span>· {activeTrip.assignedDriver?.rtoCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <a
                href={`tel:${activeTrip.assignedDriver?.phone}`}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" /> Call Chauffeur
              </a>
              <button
                onClick={shareOnWhatsApp}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition text-center flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Next Button: Proceed to Handover Review */}
          <button
            onClick={() => setCurrentStep("HANDOVER")}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>Proceed to Vehicle Handover Audit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: CUSTOMER DIGITAL VEHICLE HANDOVER REVIEW */}
      {currentStep === "HANDOVER" && activeTrip && (
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">Step 2: Pre-Trip Handover</span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">Confirm Vehicle Condition</h2>
            <p className="text-xs text-slate-500">
              Review odometer &amp; existing scratch log before handing car keys to chauffeur Rajesh Sharma.
            </p>
          </div>

          {/* Vehicle Info Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">{activeTrip.vehicle.brand} {activeTrip.vehicle.model}</span>
            <span className="font-mono text-slate-900">{activeTrip.vehicle.plate}</span>
          </div>

          {/* Odometer & Fuel Verification */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Starting Odometer (km)</label>
              <input
                type="number"
                value={handoverOdometer}
                onChange={(e) => setHandoverOdometer(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Fuel Gauge (% Level)</label>
              <input
                type="number"
                value={handoverFuel}
                onChange={(e) => setHandoverFuel(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
              />
            </div>
          </div>

          {/* Inspection 4-Photo Preview Mock */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-700">360° Exterior Photographs Uploaded by Chauffeur:</div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
              <div className="h-16 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <span>Front Bumper</span>
                <span className="text-emerald-600 font-semibold">✓ Clear</span>
              </div>
              <div className="h-16 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <span>Rear Bumper</span>
                <span className="text-amber-600 font-semibold">⚠ Scratch Log</span>
              </div>
              <div className="h-16 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <span>Left Side</span>
                <span className="text-emerald-600 font-semibold">✓ Clear</span>
              </div>
              <div className="h-16 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <span>Right Side</span>
                <span className="text-emerald-600 font-semibold">✓ Clear</span>
              </div>
            </div>
          </div>

          {/* Checkbox agreement */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="cb-handover"
              checked={handoverAgreed}
              onChange={(e) => setHandoverAgreed(e.target.checked)}
              className="w-5 h-5 text-amber-600 rounded focus:ring-0 mt-0.5 cursor-pointer"
            />
            <label htmlFor="cb-handover" className="text-xs text-amber-900 leading-relaxed cursor-pointer font-medium">
              I have checked the car condition photos and odometer reading. I authorize verified chauffeur <b>Rajesh Sharma</b> to operate my personal vehicle.
            </label>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleAcceptHandover}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Confirm &amp; Hand Over Car Keys</span>
          </button>
        </div>
      )}

      {/* STEP 4: TRIP IN PROGRESS & LIVE SHARING */}
      {currentStep === "ACTIVE_RIDE" && activeTrip && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TRIP IN PROGRESS
              </span>
              <span className="text-xs font-mono text-slate-400">{activeTrip.bookingId}</span>
            </div>

            <div>
              <div className="text-2xl font-black text-white">En Route to Destination</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {activeTrip.dropoffAddress}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">CHAUFFEUR:</span>
                <span className="font-bold text-white">{activeTrip.assignedDriver?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">VEHICLE:</span>
                <span className="font-bold text-white">{activeTrip.vehicle.plate}</span>
              </div>
            </div>
          </div>

          {/* Live Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/track?id=${activeTrip.trackingToken}`}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <Navigation className="w-4 h-4" /> Open Live GPS Map
            </Link>

            <button
              onClick={shareOnWhatsApp}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4" /> Share on WhatsApp
            </button>
          </div>

          {/* Emergency SOS Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold text-rose-900">Feeling Unsafe or in Distress?</div>
              <div className="text-[11px] text-rose-700">1-Tap SOS alerts police 112 &amp; emergency family contacts</div>
            </div>
            <Link
              href="/emergency"
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition"
            >
              Trigger SOS
            </Link>
          </div>

          {/* Test Action: Complete Ride */}
          <div className="pt-4 text-center">
            <button
              onClick={handleCompleteRide}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
            >
              (Simulator Test: Simulate Trip Completion)
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: COMPLETED RIDE, TIP & TAX INVOICE */}
      {currentStep === "COMPLETED" && activeTrip && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-700">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Trip Completed Successfully</span>
            <h2 className="text-2xl font-black text-slate-900">Hope you had a safe journey!</h2>
          </div>

          {/* Final Receipt Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Chauffeur</span>
              <span className="font-bold text-slate-900">{activeTrip.assignedDriver?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Distance Tracked</span>
              <span className="font-bold text-slate-900">14.2 km</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Trip Fare (incl. GST SAC 9966)</span>
              <span className="font-black font-mono text-slate-900 text-sm">₹{activeTrip.fareEstimated}</span>
            </div>
            {selectedTip && (
              <div className="flex justify-between py-1 text-emerald-700 font-bold">
                <span>Chauffeur Tip</span>
                <span>+₹{selectedTip}</span>
              </div>
            )}
          </div>

          {/* Tipping Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" /> Add Tip for Rajesh Sharma
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedTip(amt === 0 ? null : amt)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    selectedTip === amt || (amt === 0 && selectedTip === null)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {amt === 0 ? "No Tip" : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Download Tax Invoice */}
          <Link
            href="/reports"
            className="w-full py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Download GST SAC 9966 Tax Invoice</span>
          </Link>

          {/* Book Again CTA */}
          <button
            onClick={() => setCurrentStep("FORM")}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition shadow-lg"
          >
            Book Another Chauffeur
          </button>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" /> Add Car to Your Garage
              </h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Car Brand *</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota / Hyundai / Tata"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Car Model *</label>
                <input
                  type="text"
                  placeholder="e.g. Fortuner / Creta / Harrier"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Registration Number Plate *</label>
                <input
                  type="text"
                  placeholder="e.g. MP-40-CA-4921"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Transmission Type</label>
                <select
                  value={newTransmission}
                  onChange={(e) => setNewTransmission(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="MANUAL">Manual Transmission (MT)</option>
                  <option value="AUTOMATIC">Automatic Transmission (AT/CVT/DCT)</option>
                  <option value="LUXURY">Luxury German / EV (Audi/BMW/Mercedes)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleAddNewVehicle}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                >
                  Save Car to Garage
                </button>
                <button
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* BOTTOM PERSISTENT NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 py-2.5 px-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around text-center text-[10px] font-bold">
          <Link href="/book" className="text-blue-600 flex flex-col items-center gap-1">
            <Navigation className="w-4 h-4" />
            <span>Book Ride</span>
          </Link>
          <Link href="/customer" className="text-slate-500 hover:text-blue-600 flex flex-col items-center gap-1">
            <Key className="w-4 h-4 text-amber-500" />
            <span>Sathi Pass</span>
          </Link>
          <Link href="/customer/register" className="text-slate-500 hover:text-blue-600 flex flex-col items-center gap-1">
            <User className="w-4 h-4" />
            <span>New Profile</span>
          </Link>
          <Link href="/track" className="text-slate-500 hover:text-emerald-600 flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Live Radar</span>
          </Link>
          <Link href="/driver" className="text-emerald-800 hover:text-emerald-950 flex flex-col items-center gap-1">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Driver App ↗</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
