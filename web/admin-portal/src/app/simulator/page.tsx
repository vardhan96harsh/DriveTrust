"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Car,
  Clock,
  CreditCard,
  ShieldCheck,
  Navigation,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Wallet,
  RotateCcw,
  HelpCircle,
  Pause,
  Play,
  Sliders,
  AlertTriangle,
  Key,
  Compass,
  ArrowRight,
  Zap,
  Check,
  Users,
  UserCheck,
  MessageSquare,
  Share2,
  Heart,
  Camera,
  Star,
  ChevronDown,
  ChevronRight,
  Info,
  Copy,
  Send,
  X,
  Globe,
} from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  getCustomers,
  getDrivers,
  getActiveCustomer,
  getActiveDriver,
  setActiveCustomerId,
  setActiveDriverId,
  toggleDriverOnline,
  Customer,
  Driver,
  CustomerVehicle,
} from "@/lib/userStore";
import {
  validateBookingLocation,
  BookingValidationResult,
} from "@/lib/regionStore";
import {
  getPricingZone,
  calculateDetailedFare,
  DetailedFareBreakdown,
  PricingZone,
} from "@/lib/pricingStore";
import { calculateDistanceKm, findNearbyLandmark } from "@/components/RealStreetMap";

type ServiceMode = "NIGHT_DROP" | "HOURLY" | "OUTSTATION";
type Transmission = "AUTOMATIC" | "MANUAL" | "LUXURY";
type StepState =
  | "IDLE"
  | "SEARCHING"
  | "OFFER_DISPATCHED"
  | "ACCEPTED"
  | "DRIVER_EN_ROUTE"
  | "DRIVER_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED";

type ViewMode = "SPLIT" | "CUSTOMER" | "DRIVER";
type CityPreset = "VIDISHA" | "BHOPAL" | "BHOPAL_VIDISHA" | "BANGALORE";

export default function GuidedSimulatorPage() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>("SPLIT");
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [autoPilotStatus, setAutoPilotStatus] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Dynamic User Store integration
  const [registeredCustomers, setRegisteredCustomers] = useState<Customer[]>([]);
  const [registeredDrivers, setRegisteredDrivers] = useState<Driver[]>([]);
  const [activeCustomerObj, setActiveCustomerObj] = useState<Customer | null>(null);
  const [activeDriverObj, setActiveDriverObj] = useState<Driver | null>(null);
  const [showCustomerPicker, setShowCustomerPicker] = useState<boolean>(false);
  const [showDriverPicker, setShowDriverPicker] = useState<boolean>(false);

  // User's Real / Original Data (Customizable)
  const [customerName, setCustomerName] = useState<string>("Harshvardhan");
  const [customerPhone, setCustomerPhone] = useState<string>("+91 98450 12345");
  const [carModel, setCarModel] = useState<string>("Toyota Fortuner");
  const [carPlate, setCarPlate] = useState<string>("MP-40-CA-4921");
  const [driverName, setDriverName] = useState<string>("Rajesh Sharma");
  const [driverPhone, setDriverPhone] = useState<string>("+91 99801 84920");
  const [driverDl, setDriverDl] = useState<string>("MP-40-2019-0012345");

  // Route & City Selection (Default to Vidisha MP)
  const [cityPreset, setCityPreset] = useState<CityPreset>("VIDISHA");
  const [pickup, setPickup] = useState<string>("Vidisha Railway Station Road, Vidisha (M.P.)");
  const [dropoff, setDropoff] = useState<string>("Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)");
  const [pickupCoords, setPickupCoords] = useState<[number, number]>([23.5262, 77.8211]);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number]>([23.5350, 77.8115]);
  const [driverDistanceKm, setDriverDistanceKm] = useState<number>(3.4);
  const [driverEtaMinutes, setDriverEtaMinutes] = useState<number>(8);

  // Time & Scheduling State (Customer booking)
  const [bookingType, setBookingType] = useState<"NOW" | "SCHEDULED">("NOW");
  const [scheduledDate, setScheduledDate] = useState<string>("Today, 23 Oct");
  const [scheduledTime, setScheduledTime] = useState<string>("Immediate (Chauffeur arriving in ~14 mins)");
  const [outstationDays, setOutstationDays] = useState<number>(2);
  const [hourlyPackage, setHourlyPackage] = useState<number>(4);

  // Service Mode & Vehicle Specs
  const [serviceMode, setServiceMode] = useState<ServiceMode>("NIGHT_DROP");
  const [transmission, setTransmission] = useState<Transmission>("AUTOMATIC");
  const [fare, setFare] = useState<number>(540);
  const [startOTP, setStartOTP] = useState<string>("4892");
  const [bookingCode, setBookingCode] = useState<string>("DT-849102");
  const [showSOS, setShowSOS] = useState<boolean>(false);

  // Detailed Pricing & Map Location Picker State
  const [showPricingDetailModal, setShowPricingDetailModal] = useState<boolean>(false);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState<boolean>(false);
  const [locationPickerType, setLocationPickerType] = useState<"pickup" | "dropoff">("pickup");
  const [detailedFare, setDetailedFare] = useState<DetailedFareBreakdown | null>(null);
  const [tempPickerCoords, setTempPickerCoords] = useState<[number, number]>([23.5262, 77.8211]);
  const [tempPickerLabel, setTempPickerLabel] = useState<string>("Vidisha Railway Station Road, Vidisha (M.P.)");
  // Regional Geofence Booking Validation (KML boundaries + ON/OFF state)
  const [bookingValidation, setBookingValidation] = useState<BookingValidationResult | null>(null);

  // Modern Mobility Features State
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [inspectionPassed, setInspectionPassed] = useState<boolean>(false);
  const [odometerKm, setOdometerKm] = useState<string>("42,150 km");
  const [fuelLevel, setFuelLevel] = useState<string>("85% Full");
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "CUSTOMER" | "DRIVER"; text: string; time: string }>>([
    { sender: "DRIVER", text: "Namaste sir, I am arriving at your pickup location.", time: "9:42 AM" },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [tipAmount, setTipAmount] = useState<number>(0);

  // Driver Terminal State
  const [isDriverOnline, setIsDriverOnline] = useState<boolean>(true);
  const [driverWallet, setDriverWallet] = useState<number>(1420);
  const [countdown, setCountdown] = useState<number>(30);
  const [enteredOTP, setEnteredOTP] = useState<string>("");
  const [otpError, setOtpError] = useState<string | null>(null);

  // Trip State Machine & Telematics
  const [tripState, setTripState] = useState<StepState>("IDLE");
  const [speed, setSpeed] = useState<number>(0);
  const [gForce, setGForce] = useState<number>(1.0);
  const [harshBrakeAlert, setHarshBrakeAlert] = useState<boolean>(false);

  // Reference for active timeouts to prevent hanging or memory leaks
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);

  const registerTimeout = (cb: () => void, ms: number) => {
    const id = setTimeout(() => {
      activeTimersRef.current = activeTimersRef.current.filter((t) => t !== id);
      cb();
    }, ms);
    activeTimersRef.current.push(id);
    return id;
  };

  const clearAllTimers = () => {
    activeTimersRef.current.forEach((id) => clearTimeout(id));
    activeTimersRef.current = [];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // Synchronize with persistent User Store
  const refreshUsers = () => {
    const custs = getCustomers();
    const drvs = getDrivers();
    setRegisteredCustomers(custs);
    setRegisteredDrivers(drvs);

    const activeCust = getActiveCustomer();
    if (activeCust) {
      setActiveCustomerObj(activeCust);
      setCustomerName(activeCust.fullName);
      setCustomerPhone(activeCust.phone);
      if (activeCust.vehicles && activeCust.vehicles.length > 0) {
        const v = activeCust.vehicles[0];
        setCarModel(`${v.brand} ${v.model}`);
        setCarPlate(v.plate);
        setTransmission(v.transmission);
      }
    }

    const activeDrv = getActiveDriver();
    if (activeDrv) {
      setActiveDriverObj(activeDrv);
      setDriverName(activeDrv.fullName);
      setDriverPhone(activeDrv.phone);
      setDriverDl(activeDrv.licenseNumber);
      setDriverWallet(activeDrv.walletBalance);
      setIsDriverOnline(activeDrv.isOnline);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const selectCustomerVehicle = (veh: CustomerVehicle) => {
    setCarModel(`${veh.brand} ${veh.model}`);
    setCarPlate(veh.plate);
    setTransmission(veh.transmission);
  };

  const handleSwitchCustomer = (cust: Customer) => {
    setActiveCustomerId(cust.id);
    setActiveCustomerObj(cust);
    setCustomerName(cust.fullName);
    setCustomerPhone(cust.phone);
    if (cust.vehicles && cust.vehicles.length > 0) {
      const v = cust.vehicles[0];
      setCarModel(`${v.brand} ${v.model}`);
      setCarPlate(v.plate);
      setTransmission(v.transmission);
    }
    setShowCustomerPicker(false);
  };

  const handleSwitchDriver = (drv: Driver) => {
    setActiveDriverId(drv.id);
    setActiveDriverObj(drv);
    setDriverName(drv.fullName);
    setDriverPhone(drv.phone);
    setDriverDl(drv.licenseNumber);
    setDriverWallet(drv.walletBalance);
    setIsDriverOnline(drv.isOnline);
    setShowDriverPicker(false);
  };

  // Preset Route Definitions for Vidisha & Bhopal MP Hubs
  const handleSelectCityPreset = (preset: CityPreset) => {
    setCityPreset(preset);
    if (preset === "VIDISHA") {
      setPickup("Vidisha Railway Station Road, Vidisha (M.P.)");
      setDropoff("Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)");
      setPickupCoords([23.5262, 77.8211]);
      setDropoffCoords([23.5350, 77.8115]);
      setDriverDistanceKm(3.4);
      setDriverEtaMinutes(8);
      setDriverName("Rajesh Sharma");
      setCarPlate("MP-40-CA-4921");
    } else if (preset === "BHOPAL") {
      setPickup("DB City Mall, MP Nagar Zone-1, Bhopal (M.P.)");
      setDropoff("Raja Bhoj International Airport, VIP Road, Bhopal (M.P.)");
      setPickupCoords([23.2332, 77.4334]);
      setDropoffCoords([23.2875, 77.3378]);
      setDriverDistanceKm(15.2);
      setDriverEtaMinutes(24);
      setDriverName("Mukesh Patel");
      setCarPlate("MP-04-AB-1290");
    } else if (preset === "BHOPAL_VIDISHA") {
      setPickup("MP Nagar Zone-1, Bhopal (M.P.)");
      setDropoff("Vidisha Railway Station (via SH-19 / Sanchi Stupa)");
      setPickupCoords([23.2332, 77.4334]);
      setDropoffCoords([23.5262, 77.8211]);
      setDriverDistanceKm(54.2);
      setDriverEtaMinutes(70);
      setDriverName("Dharmendra Lodhi");
      setCarPlate("MP-40-MB-7788");
    } else if (preset === "BANGALORE") {
      setPickup("Indiranagar 100ft Rd, Bangalore");
      setDropoff("Koramangala 5th Block, Bangalore");
      setPickupCoords([12.9784, 77.6408]);
      setDropoffCoords([12.9352, 77.6245]);
      setDriverDistanceKm(4.8);
      setDriverEtaMinutes(14);
      setDriverName("Rajesh Kumar");
      setCarPlate("KA-01-MJ-4921");
    }
  };

  // Dynamic Fare Calculation based on mode, distance, and city pricing matrix
  useEffect(() => {
    const zoneCity =
      cityPreset === "VIDISHA"
        ? "Vidisha"
        : cityPreset === "BHOPAL"
        ? "Bhopal"
        : cityPreset === "BHOPAL_VIDISHA"
        ? "Highway"
        : "Bangalore";
    const zone = getPricingZone(zoneCity);
    const breakdown = calculateDetailedFare(
      zone,
      serviceMode,
      driverDistanceKm,
      hourlyPackage,
      outstationDays,
      tipAmount,
      { lat: pickupCoords[0], lng: pickupCoords[1] }
    );
    setDetailedFare(breakdown);
    setFare(breakdown.totalCustomerFare);

    if (serviceMode === "NIGHT_DROP") {
      setScheduledTime("10:30 PM (Night Safe-Drop)");
    } else if (serviceMode === "HOURLY") {
      setScheduledTime("09:00 AM (Hourly Chauffeur)");
    } else if (serviceMode === "OUTSTATION") {
      setScheduledTime("06:00 AM (Outstation Reporting)");
    }
  }, [serviceMode, transmission, outstationDays, hourlyPackage, cityPreset, driverDistanceKm, tipAmount, pickupCoords]);

  // Strict Regional Geofence Validation: Verify pickup coordinates against active KML regions
  useEffect(() => {
    const res = validateBookingLocation(pickupCoords[0], pickupCoords[1]);
    setBookingValidation(res);
  }, [pickupCoords]);

  // Handler when a user selects a location on the interactive map
  const handleMapLocationSelect = (
    type: "pickup" | "dropoff",
    coords: [number, number],
    label: string,
    distKm: number
  ) => {
    if (type === "pickup") {
      setPickup(label);
      setPickupCoords(coords);
      const newDist = calculateDistanceKm(coords[0], coords[1], dropoffCoords[0], dropoffCoords[1]);
      setDriverDistanceKm(newDist);
      setDriverEtaMinutes(Math.max(4, Math.round(newDist * 2.1)));
    } else {
      setDropoff(label);
      setDropoffCoords(coords);
      const newDist = calculateDistanceKm(pickupCoords[0], pickupCoords[1], coords[0], coords[1]);
      setDriverDistanceKm(newDist);
      setDriverEtaMinutes(Math.max(4, Math.round(newDist * 2.1)));
    }
  };

  const openLocationPicker = (type: "pickup" | "dropoff") => {
    setLocationPickerType(type);
    if (type === "pickup") {
      setTempPickerCoords(pickupCoords);
      setTempPickerLabel(pickup);
    } else {
      setTempPickerCoords(dropoffCoords);
      setTempPickerLabel(dropoff);
    }
    setShowLocationPickerModal(true);
  };

  // 30s Countdown timer on Driver side during dispatch
  useEffect(() => {
    if (tripState !== "OFFER_DISPATCHED") return;
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTripState("IDLE");
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tripState]);

  // Speedometer simulation during IN_PROGRESS
  useEffect(() => {
    if (tripState !== "IN_PROGRESS") {
      setSpeed(0);
      return;
    }
    const interval = setInterval(() => {
      setSpeed(Math.floor(42 + Math.random() * 20));
    }, 1200);
    return () => clearInterval(interval);
  }, [tripState]);

  // Step 1: Customer requests a driver
  const handleRequestDriver = () => {
    // 0. STRICT CUSTOMER BLOCK ENFORCEMENT
    if (activeCustomerObj && activeCustomerObj.isBlocked) {
      alert(
        `🚫 ACCOUNT SUSPENDED BY ADMIN!\n\nCustomer ${activeCustomerObj.fullName} is currently BLOCKED.\nReason: ${activeCustomerObj.blockReason || "Policy violation / Terms breach"}\n\nPlease unblock this account in the Admin Directory (/directory) to book rides.`
      );
      return;
    }

    // 0b. STRICT DRIVER BLOCK ENFORCEMENT
    if (activeDriverObj && activeDriverObj.isBlocked) {
      alert(
        `🚫 CHAUFFEUR ACCOUNT BLOCKED!\n\nChauffeur ${activeDriverObj.fullName} has been suspended by Admin.\nReason: ${activeDriverObj.blockReason || "Disciplinary suspension"}\n\nPlease unblock them in the Admin Directory (/directory) to dispatch trips.`
      );
      return;
    }

    // 1. STRICT ADMIN VERIFICATION ENFORCEMENT
    if (activeDriverObj && activeDriverObj.kycStatus !== "APPROVED") {
      alert(
        `⚠️ CHAUFFEUR NOT VERIFIED BY ADMIN!\n\nChauffeur ${activeDriverObj.fullName} has status '${activeDriverObj.kycStatus}' in the KYC Vault.\n\nTo ensure passenger safety, only Admin-verified drivers can receive trip dispatches. Please approve them in the Admin KYC Vault (/kyc) or switch to a verified chauffeur.`
      );
      return;
    }

    // 2. STRICT REGIONAL GEOFENCE & ON/OFF ENFORCEMENT
    // Only users in active, enabled regional KML boundaries can book rides
    const regionValidation = validateBookingLocation(pickupCoords[0], pickupCoords[1]);
    if (!regionValidation.isAllowed) {
      if (regionValidation.status === "REGION_OFFLINE") {
        alert(
          `⛔ REGION BOOKINGS DISABLED BY ADMIN!\n\n${regionValidation.matchedRegion?.name} (${regionValidation.matchedRegion?.rtoCode}) is currently switched OFF.\n\n${regionValidation.message}\n\nAdmins can turn this region back ON in the Geofence Regions Studio (/regions).`
        );
      } else {
        alert(
          `📍 PICKUP OUTSIDE OPERATIONAL REGION!\n\nYour pickup location is outside active Sathi KML boundaries.\n\n${regionValidation.message}\n\nOnly users in active regions (e.g. Vidisha MP-40 / Bhopal MP-04) are eligible for chauffeur dispatch. You can upload a new region KML in /regions.`
        );
      }
      return;
    }

    if (!isDriverOnline) {
      alert("Driver partner is currently OFFLINE! Click the toggle button on the Driver Partner phone.");
      return;
    }
    clearAllTimers();
    const activeCust = getActiveCustomer();
    const newOtp = activeCust?.permanentPin || "4892";
    const newCode = `DT-${Math.floor(100000 + Math.random() * 900000)}`;
    setStartOTP(newOtp);
    setBookingCode(newCode);
    setEnteredOTP("");
    setOtpError(null);
    setInspectionPassed(false);
    setTripState("SEARCHING");

    // Simulate PostGIS / H3 spatial search matching
    registerTimeout(() => {
      setTripState("OFFER_DISPATCHED");
    }, 1400);
  };

  // Step 2: Driver accepts offer
  const handleAcceptOffer = () => {
    clearAllTimers();
    setTripState("ACCEPTED");
  };

  // Step 3: Fast-forward driver traveling to pickup
  const handleDriverArrived = () => {
    clearAllTimers();
    setTripState("DRIVER_ARRIVED");
    // Trigger mandatory 4-point vehicle handover inspection
    setShowInspectionModal(true);
  };

  // Step 4: OTP Verification & Handshake
  const handleStartTrip = () => {
    if (!inspectionPassed) {
      setShowInspectionModal(true);
      return;
    }

    if (enteredOTP === startOTP) {
      clearAllTimers();
      setOtpError(null);
      setTripState("IN_PROGRESS");
    } else {
      setOtpError("Invalid 4-digit code. Check customer phone screen.");
    }
  };

  const handleAutoFillOTP = () => {
    setEnteredOTP(startOTP);
    setOtpError(null);
  };

  // Step 5: Complete trip & trigger settlement
  const handleCompleteTrip = () => {
    clearAllTimers();
    const driverEarnings = Math.round(fare * 0.8 + 150);
    setDriverWallet((prev) => prev + driverEarnings);
    setTripState("COMPLETED");
  };

  // Reset simulator
  const handleReset = () => {
    clearAllTimers();
    setTripState("IDLE");
    setEnteredOTP("");
    setOtpError(null);
    setSpeed(0);
    setGForce(1.0);
    setHarshBrakeAlert(false);
    setIsAutoPilot(false);
    setAutoPilotStatus("");
  };

  // Telematics Brake Test
  const triggerBrakeTest = () => {
    setGForce(2.65);
    setHarshBrakeAlert(true);
    registerTimeout(() => {
      setHarshBrakeAlert(false);
      setGForce(1.0);
    }, 2500);
  };

  // 1-Click Automated Tour
  const runAutoPilot = () => {
    handleReset();
    setIsAutoPilot(true);
    setAutoPilotStatus("Step 1: Booking chauffeur...");

    registerTimeout(() => {
      handleRequestDriver();
      setAutoPilotStatus("Step 2: Spatial matching...");

      registerTimeout(() => {
        setAutoPilotStatus("Step 3: Driver accepting offer...");

        registerTimeout(() => {
          handleAcceptOffer();
          setAutoPilotStatus("Step 4: Chauffeur en route (~14 mins)...");

          registerTimeout(() => {
            handleDriverArrived();
            setAutoPilotStatus("Step 5: Verifying 4-digit OTP...");

            registerTimeout(() => {
              setEnteredOTP(startOTP);

              registerTimeout(() => {
                setTripState("IN_PROGRESS");
                setAutoPilotStatus("Step 6: Live trip navigation...");

                registerTimeout(() => {
                  handleCompleteTrip();
                  setAutoPilotStatus("Completed: Instant payout credited!");
                  setIsAutoPilot(false);
                }, 3000);
              }, 1200);
            }, 1200);
          }, 2000);
        }, 1500);
      }, 1500);
    }, 600);
  };

  // 6-step progress definition
  const steps = [
    { id: 1, label: "1. Schedule & Book", actor: "Customer" },
    { id: 2, label: "2. 30s Dispatch Offer", actor: "Driver" },
    { id: 3, label: "3. Driver En Route (ETA)", actor: "Driver" },
    { id: 4, label: "4. 4-Digit OTP Verify", actor: "Security" },
    { id: 5, label: "5. Live Ride & Telematics", actor: "Both" },
    { id: 6, label: "6. Instant Settlement", actor: "Driver" },
  ];

  const getActiveStepNumber = (): number => {
    switch (tripState) {
      case "IDLE":
        return 1;
      case "SEARCHING":
      case "OFFER_DISPATCHED":
        return 2;
      case "ACCEPTED":
      case "DRIVER_EN_ROUTE":
        return 3;
      case "DRIVER_ARRIVED":
        return 4;
      case "IN_PROGRESS":
        return 5;
      case "COMPLETED":
        return 6;
      default:
        return 1;
    }
  };

  const currentStepNum = getActiveStepNumber();

  // Step-by-Step Guidance Context
  const getGuide = () => {
    switch (tripState) {
      case "IDLE":
        return {
          turn: "CUSTOMER APP (LEFT)",
          turnBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
          title: "Step 1 of 6: Configure Vehicle, Schedule & Book",
          instruction: `Verify your car details (${carModel} • ${carPlate}), select service package, scheduled time, and click 'REQUEST VERIFIED CHAUFFEUR'.`,
          actionHint: "Action: Click 'REQUEST VERIFIED CHAUFFEUR' on left phone",
        };
      case "SEARCHING":
        return {
          turn: "SPATIAL MATCHING ENGINE",
          turnBadge: "bg-blue-50 text-blue-800 border-blue-200",
          title: "Step 2 of 6: Spatial Hexagonal Matching",
          instruction: `Backend is scanning Uber H3 concentric rings (under 2.5km) in ${pickup.split(",")[0]} to lock the nearest verified commercial chauffeur.`,
          actionHint: "Searching: Locking nearest verified driver...",
        };
      case "OFFER_DISPATCHED":
        return {
          turn: "DRIVER PARTNER TERMINAL (RIGHT)",
          turnBadge: "bg-indigo-50 text-indigo-800 border-indigo-200",
          title: "Step 2 of 6: Driver Receives 30-Second Offer",
          instruction: `Chauffeur ${driverName} received the dispatch offer card with customer name (${customerName}) and vehicle model (${carModel}). Click 'ACCEPT RIDE'.`,
          actionHint: "Action: Click 'ACCEPT RIDE' on right phone",
        };
      case "ACCEPTED":
      case "DRIVER_EN_ROUTE":
        return {
          turn: "CHAUFFEUR EN ROUTE (RIGHT)",
          turnBadge: "bg-purple-50 text-purple-800 border-purple-200",
          title: `Step 3 of 6: Chauffeur Traveling to Pickup (ETA ${driverEtaMinutes} mins)`,
          instruction: `Chauffeur ${driverName} is navigating through city streets. Both screens show live route map. Click 'SIMULATE ARRIVAL AT PICKUP' to report at customer location.`,
          actionHint: "Action: Click 'SIMULATE ARRIVAL AT PICKUP' on right phone",
        };
      case "DRIVER_ARRIVED":
        return {
          turn: "SECURITY HANDSHAKE",
          turnBadge: "bg-amber-50 text-amber-800 border-amber-200",
          title: "Step 4 of 6: 4-Digit Security OTP Handshake",
          instruction: `Customer phone shows the secret 4-Digit Start OTP (${startOTP}). On Driver phone, click 'Auto-Fill OTP' and 'VERIFY OTP & START TRIP'.`,
          actionHint: "Action: Click 'Auto-Fill' then 'VERIFY OTP' on right phone",
        };
      case "IN_PROGRESS":
        return {
          turn: "LIVE TRIP IN PROGRESS (BOTH)",
          turnBadge: "bg-teal-50 text-teal-800 border-teal-200",
          title: "Step 5 of 6: Real Street Navigation & Telematics",
          instruction: `Trip is live! The car is actively driving along the street route with real speedometer telemetry. Click 'ARRIVED AT DESTINATION • END TRIP' to finish.`,
          actionHint: "Action: Click 'ARRIVED AT DESTINATION • END TRIP' on right phone",
        };
      case "COMPLETED":
      default:
        return {
          turn: "TRIP COMPLETED",
          turnBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
          title: "Step 6 of 6: Finished & Instant Wallet Settlement",
          instruction: `Customer account was billed ₹${fare}.00. Driver's wallet was instantly credited with 80% fare + return allowance.`,
          actionHint: "Completed: Click 'Book Another Ride' or 'Reset' to test again",
        };
    }
  };

  const guide = getGuide();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Executive Mobility & Dispatch Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              LIGHT MODE • REAL DATA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end sandbox: test original customer data, your own vehicle model, real street map navigation, and instant driver payout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Custom Original Data Config Trigger */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition shadow-xs flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-700" />
            <span>Customize Data</span>
          </button>

          {/* Quick Platform Guide */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Guide</span>
          </button>

          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode("SPLIT")}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "SPLIT"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dual App
            </button>
            <button
              onClick={() => setViewMode("CUSTOMER")}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "CUSTOMER"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setViewMode("DRIVER")}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "DRIVER"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Driver
            </button>
          </div>

          {/* 1-Click Auto-Pilot Tour */}
          <button
            onClick={isAutoPilot ? handleReset : runAutoPilot}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm ${
              isAutoPilot
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {isAutoPilot ? (
              <Pause className="w-3.5 h-3.5 text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isAutoPilot ? autoPilotStatus || "Stop Auto-Pilot" : "1-Click Auto-Pilot"}</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-xs"
            title="Reset Simulator"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Step Visual Timeline Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {steps.map((st) => {
            const isDone = currentStepNum > st.id;
            const isActive = currentStepNum === st.id;

            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : isDone
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive
                        ? "bg-white text-slate-900"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? "✓" : st.id}
                  </div>
                  <span className="text-xs font-bold">{st.label}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-medium opacity-80">
                  {st.actor}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive Next-Action Guidance Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-sm">
            {currentStepNum}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${guide.turnBadge}`}>
                {guide.turn}
              </span>
              <span className="text-xs font-bold text-slate-700">{guide.title}</span>
            </div>
            <div className="text-sm text-slate-900 font-semibold mt-0.5">{guide.instruction}</div>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{guide.actionHint}</span>
        </div>
      </div>

      {/* Phone Mockups Container */}
      <div
        className={`grid gap-8 items-start transition-all ${
          viewMode === "SPLIT"
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 max-w-md mx-auto"
        }`}
      >
        {/* ============================================================== */}
        {/* 1. CUSTOMER PHONE (USER SIDE)                                  */}
        {/* ============================================================== */}
        {(viewMode === "SPLIT" || viewMode === "CUSTOMER") && (
          <div className="relative mx-auto w-full max-w-[400px] rounded-[48px] bg-white shadow-xl border-[8px] border-slate-300 overflow-hidden">
            {/* iOS Light Status Bar with Clean Dynamic Island */}
            <div className="h-11 px-6 pt-2 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 select-none border-b border-slate-100">
              <span className="font-mono text-[11px]">9:41</span>
              {/* Centered Dynamic Island */}
              <div className="w-28 h-6 bg-slate-900 rounded-full flex items-center justify-between px-2.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-[9px] text-slate-300 font-mono">Customer</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Inner App Container */}
            <div className="px-4 pb-3 min-h-[660px] flex flex-col justify-between text-left bg-white">
              {/* App Brand Header with Active Customer Selector */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-2 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                  <span className="text-xs font-bold text-slate-900">Customer App</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCustomerPicker(!showCustomerPicker)}
                    className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 transition"
                  >
                    <User className="w-3 h-3 text-slate-600" />
                    <span>{customerName}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Dropdown to switch between registered customers */}
                {showCustomerPicker && (
                  <div className="absolute top-10 right-0 z-40 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                      Registered Customers
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {registeredCustomers.map((cust) => (
                        <button
                          key={cust.id}
                          onClick={() => handleSwitchCustomer(cust)}
                          className={`w-full p-2 text-left rounded-lg text-xs transition flex items-center justify-between ${
                            cust.fullName === customerName
                              ? "bg-slate-900 text-white font-bold"
                              : "hover:bg-slate-100 text-slate-800"
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1">
                              <span>{cust.fullName}</span>
                              {cust.verificationStatus === "VERIFIED" && (
                                <span title="Verified" className="text-emerald-500 font-bold">✓</span>
                              )}
                              {cust.isBlocked && (
                                <span className="text-[9px] px-1 bg-red-600 text-white rounded font-bold">BLOCKED</span>
                              )}
                            </div>
                            <div className="text-[10px] opacity-75">{cust.phone}</div>
                          </div>
                          <span className="text-[10px] opacity-80">{cust.vehicles.length} cars</span>
                        </button>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 font-bold">
                      <Link href="/customers" className="text-blue-600 hover:underline">
                        + Manage Profile
                      </Link>
                      <Link href="/directory" className="text-slate-600 hover:underline">
                        Admin Controls →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* STATE 1: BOOKING & ADVANCED SCHEDULING SCREEN */}
              {tripState === "IDLE" && (
                <div className="space-y-3.5 my-auto py-1">
                  {/* Account Blocked Notice */}
                  {activeCustomerObj?.isBlocked && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ✕
                      </div>
                      <div>
                        <div className="font-extrabold text-[11px]">Account Suspended by Admin</div>
                        <div className="text-[10px] text-red-700 leading-snug">
                          {activeCustomerObj.blockReason || "Administrative hold applied. Booking is disabled."}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Hire a Verified Chauffeur</h3>
                    <p className="text-xs text-slate-500">Professional driver for your personal vehicle</p>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Service Package
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "NIGHT_DROP", title: "Night Safe", price: "₹540", desc: "Late drop" },
                        { id: "HOURLY", title: "Hourly", price: "₹745", desc: "4 hours" },
                        { id: "OUTSTATION", title: "Outstation", price: "₹3,598", desc: "2 days" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setServiceMode(m.id as ServiceMode)}
                          className={`p-2 rounded-xl text-left border transition ${
                            serviceMode === m.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <div className={`text-xs font-bold ${serviceMode === m.id ? "text-white" : "text-slate-900"}`}>
                            {m.title}
                          </div>
                          <div className={`text-xs font-extrabold font-mono mt-0.5 ${serviceMode === m.id ? "text-emerald-300" : "text-emerald-700"}`}>
                            {m.price}
                          </div>
                          <div className={`text-[9px] ${serviceMode === m.id ? "text-slate-300" : "text-slate-500"}`}>
                            {m.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City & Real Route Quick Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">
                        Select Real Route Preset
                      </label>
                      <button
                        onClick={() => setShowConfigModal(true)}
                        className="text-[10px] text-slate-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Edit Original Data</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { id: "VIDISHA", label: "Vidisha Central (MP-40)" },
                        { id: "BHOPAL", label: "Bhopal VIP Corridor" },
                        { id: "BHOPAL_VIDISHA", label: "Bhopal ⇄ Vidisha (SH-19)" },
                        { id: "BANGALORE", label: "Bangalore Hub" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCityPreset(c.id as CityPreset)}
                          className={`p-2 rounded-xl text-left text-xs font-bold border transition ${
                            cityPreset === c.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Your Real Car Profile Display with Garage Selector */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-600" />
                        <span>Vehicle to be Driven</span>
                      </span>
                      {activeCustomerObj && activeCustomerObj.vehicles && activeCustomerObj.vehicles.length > 1 ? (
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {activeCustomerObj.vehicles.length} in Garage
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {carPlate}
                        </span>
                      )}
                    </div>

                    {activeCustomerObj && activeCustomerObj.vehicles && activeCustomerObj.vehicles.length > 1 ? (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {activeCustomerObj.vehicles.map((v) => {
                          const isSelected = carPlate === v.plate;
                          return (
                            <button
                              key={v.id}
                              onClick={() => selectCustomerVehicle(v)}
                              className={`p-2 rounded-lg text-left border flex items-center justify-between transition ${
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              <div>
                                <div className="font-bold text-xs">{v.brand} {v.model}</div>
                                <div className={`text-[10px] font-mono ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{v.plate}</div>
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                              }`}>
                                {v.transmission}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="font-extrabold text-slate-900">{carModel}</div>
                        <div className="text-[11px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                          {transmission}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DATE & TIME SCHEDULING */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span>Schedule & Reporting Time</span>
                      </span>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          onClick={() => setBookingType("NOW")}
                          className={`px-2 py-0.5 rounded font-bold transition ${
                            bookingType === "NOW"
                              ? "bg-slate-900 text-white"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Ride Now
                        </button>
                        <button
                          onClick={() => setBookingType("SCHEDULED")}
                          className={`px-2 py-0.5 rounded font-bold transition ${
                            bookingType === "SCHEDULED"
                              ? "bg-slate-900 text-white"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[9px] text-slate-500 font-semibold block">DATE</label>
                        <select
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold focus:outline-none"
                        >
                          <option value="Today, 23 Oct">Today, 23 Oct</option>
                          <option value="Tomorrow, 24 Oct">Tomorrow, 24 Oct</option>
                          <option value="Saturday, 25 Oct">Saturday, 25 Oct</option>
                          <option value="Sunday, 26 Oct">Sunday, 26 Oct</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] text-slate-500 font-semibold block">REPORTING TIME</label>
                        <select
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold focus:outline-none"
                        >
                          {bookingType === "NOW" ? (
                            <>
                              <option value="Immediate (Chauffeur arriving in ~14 mins)">Now (ETA 14 mins)</option>
                              <option value="In 30 Minutes">In 30 mins</option>
                            </>
                          ) : (
                            <>
                              <option value="06:00 AM">06:00 AM (Early Departure)</option>
                              <option value="09:00 AM">09:00 AM (Morning Office)</option>
                              <option value="02:30 PM">02:30 PM (Afternoon)</option>
                              <option value="07:00 PM">07:00 PM (Evening Return)</option>
                              <option value="10:30 PM">10:30 PM (Night Safe-Drop)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {serviceMode === "OUTSTATION" && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-600">Outstation Duration:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 5].map((d) => (
                            <button
                              key={d}
                              onClick={() => setOutstationDays(d)}
                              className={`px-2 py-0.5 rounded text-xs font-bold border ${
                                outstationDays === d
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              {d} {d === 1 ? "Day" : "Days"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {serviceMode === "HOURLY" && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-600">Package Hours:</span>
                        <div className="flex items-center gap-1">
                          {[2, 4, 8, 12].map((h) => (
                            <button
                              key={h}
                              onClick={() => setHourlyPackage(h)}
                              className={`px-2 py-0.5 rounded text-xs font-bold border ${
                                hourlyPackage === h
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              {h}h
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address Box with Direct Map Picker Actions */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>PICKUP LOCATION</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => openLocationPicker("pickup")}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition flex items-center gap-1"
                          title="Open map to pick pickup point"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>Pick on Map</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full bg-white p-2 rounded-lg border border-slate-200 text-slate-900 font-semibold focus:outline-none text-xs"
                      />
                    </div>

                    <div className="border-t border-slate-200 pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-red-600" />
                          <span>DESTINATION / ROUTE</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => openLocationPicker("dropoff")}
                          className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-800 text-[10px] font-bold border border-red-200 transition flex items-center gap-1"
                          title="Open map to pick destination point"
                        >
                          <Navigation className="w-3 h-3 text-red-600" />
                          <span>Pick on Map</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        className="w-full bg-white p-2 rounded-lg border border-slate-200 text-slate-900 font-semibold focus:outline-none text-xs"
                      />
                    </div>

                    {/* Calculated Route Telemetry */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-slate-500" />
                        <span>Distance: <b className="font-mono text-slate-900">{driverDistanceKm} km</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Chauffeur ETA: <b className="font-mono text-slate-900">{driverEtaMinutes} mins</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Pricing Breakdown Trigger Card */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          Transparent Fare Calculation
                        </span>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {cityPreset} MATRIX
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black font-mono text-white">₹{fare}.00</div>
                        <div className="text-[10px] text-slate-400">
                          {serviceMode.replace("_", " ")} • {driverDistanceKm} km • GST included
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowPricingDetailModal(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-slate-950" />
                        <span>Price in Detail</span>
                        <ChevronRight className="w-3 h-3 text-slate-950" />
                      </button>
                    </div>
                  </div>

                  {/* Driver Verification Status Banner */}
                  {activeDriverObj && activeDriverObj.kycStatus !== "APPROVED" && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Chauffeur {driverName} is UNVERIFIED</span>
                        </div>
                        <span className="text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-900 font-mono">
                          {activeDriverObj.kycStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Sathi safety policy requires Admin approval before dispatching. Click below to approve in the Admin KYC Vault.
                      </p>
                      <Link
                        href="/kyc"
                        className="inline-block font-bold text-slate-900 underline text-[11px] hover:text-blue-600"
                      >
                        Open Admin KYC Vault to Verify Chauffeur →
                      </Link>
                    </div>
                  )}

                  {/* Regional Geofence Status Badge / Banner */}
                  {bookingValidation && (
                    <div
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                        bookingValidation.isAllowed
                          ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                          : bookingValidation.status === "REGION_OFFLINE"
                          ? "bg-rose-50 border-rose-300 text-rose-950"
                          : "bg-amber-50 border-amber-300 text-amber-950"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center gap-1.5">
                          {bookingValidation.isAllowed ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : bookingValidation.status === "REGION_OFFLINE" ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span>
                            {bookingValidation.isAllowed
                              ? `Geofence Verified: ${bookingValidation.matchedRegion?.name}`
                              : bookingValidation.status === "REGION_OFFLINE"
                              ? `Region OFF: ${bookingValidation.matchedRegion?.name}`
                              : "Out of Active Region"}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            bookingValidation.isAllowed
                              ? "bg-emerald-200/80 text-emerald-900"
                              : bookingValidation.status === "REGION_OFFLINE"
                              ? "bg-rose-200 text-rose-900"
                              : "bg-amber-200 text-amber-900"
                          }`}
                        >
                          {bookingValidation.isAllowed
                            ? `${bookingValidation.matchedRegion?.rtoCode} • ACTIVE`
                            : bookingValidation.status === "REGION_OFFLINE"
                            ? `${bookingValidation.matchedRegion?.rtoCode} • DISABLED`
                            : "UNSERVICED"}
                        </span>
                      </div>

                      <p
                        className={`text-[11px] leading-relaxed ${
                          bookingValidation.isAllowed
                            ? "text-emerald-800"
                            : bookingValidation.status === "REGION_OFFLINE"
                            ? "text-rose-800"
                            : "text-amber-800"
                        }`}
                      >
                        {bookingValidation.isAllowed
                          ? `Pickup is inside approved KML geofence (${bookingValidation.matchedRegion?.areaKm2} km²). Chauffeur dispatch approved.`
                          : bookingValidation.message}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <Link
                          href="/regions"
                          className={`text-[10px] font-bold underline transition ${
                            bookingValidation.isAllowed
                              ? "text-emerald-900 hover:text-emerald-700"
                              : "text-rose-900 hover:text-rose-700"
                          }`}
                        >
                          {bookingValidation.isAllowed
                            ? "Manage Regional KML Geofences →"
                            : "Open Regional Studio to Turn ON or Upload KML →"}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Action Confirmation Button */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                        Step 1 • Ready to Confirm
                      </span>
                    </div>

                    <button
                      onClick={handleRequestDriver}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-wide shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                        !bookingValidation || bookingValidation.isAllowed
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-rose-950 hover:bg-rose-900 text-white border border-rose-500/50"
                      }`}
                    >
                      {bookingValidation && !bookingValidation.isAllowed ? (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-300" />
                          <span>
                            {bookingValidation.status === "REGION_OFFLINE"
                              ? "REGION IS TURNED OFF"
                              : "OUT OF REGION AREA"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>REQUEST VERIFIED CHAUFFEUR</span>
                          <span className="text-emerald-400 font-mono">₹{fare}.00</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 2: SEARCHING & OFFER DISPATCHED */}
              {(tripState === "SEARCHING" || tripState === "OFFER_DISPATCHED") && (
                <div className="my-auto py-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-900 border-t-transparent animate-spin flex items-center justify-center">
                    <Compass className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Scanning Nearby Chauffeurs...</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Uber H3 Resolution 8 spatial grid (under 2.5km radius)
                    </p>
                  </div>

                  {tripState === "OFFER_DISPATCHED" && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-1">
                      <div className="font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Chauffeur {driverName} Assigned!</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Dispatch offer sent to terminal. Awaiting acceptance.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STATE 3: ACCEPTED & EN ROUTE & IN PROGRESS (EMBEDDED REAL MAP) */}
              {(tripState === "ACCEPTED" ||
                tripState === "DRIVER_EN_ROUTE" ||
                tripState === "DRIVER_ARRIVED" ||
                tripState === "IN_PROGRESS") && (
                <div className="space-y-3 my-auto py-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {serviceMode.replace("_", " ")} • {carModel}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {tripState === "ACCEPTED"
                          ? "Chauffeur En Route"
                          : tripState === "DRIVER_ARRIVED"
                          ? "Chauffeur Has Arrived!"
                          : "Trip In Progress"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowChatModal(true)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center gap-1 border border-slate-200 transition shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3 text-slate-700" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() => setShowShareModal(true)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 transition shadow-xs"
                      >
                        <Share2 className="w-3 h-3 text-emerald-700" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => setShowSOS(true)}
                        className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] tracking-wide shadow-xs"
                      >
                        SOS 112
                      </button>
                    </div>
                  </div>

                  {/* Production Route & Live Transit Telemetry (No Map Bloat) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Transit Corridor Telemetry</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {tripState === "IN_PROGRESS" ? "EN ROUTE • 38 km/h" : "DISPATCH READY"}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{pickup.split(",")[0]}</span>
                        <span>{dropoff.split(",")[0]}</span>
                      </div>
                      <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                          style={{
                            width:
                              tripState === "IN_PROGRESS"
                                ? "65%"
                                : tripState === "ACCEPTED"
                                ? "25%"
                                : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Est. Distance</span>
                        <span className="font-bold text-slate-900">{driverDistanceKm} km ({driverEtaMinutes} mins)</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Assigned RTO Hub</span>
                        <span className="font-bold text-blue-700 font-mono">{cityPreset} Corridor</span>
                      </div>
                    </div>
                  </div>

                  {/* REALISTIC DRIVER ARRIVAL TIME BANNER */}
                  {tripState === "ACCEPTED" && (
                    <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span className="text-xs font-bold text-white">Chauffeur Approaching</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {driverEtaMinutes} mins away
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Distance: {driverDistanceKm} km to pickup</span>
                        <span>Reporting: {scheduledTime.split("(")[0]}</span>
                      </div>
                    </div>
                  )}

                  {/* Driver & Vehicle Profile Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {driverName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{driverName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            DL: {driverDl}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        MoRTH Verified
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 pt-1 border-t border-slate-200 flex justify-between">
                      <span>Vehicle: <b>{carModel}</b> ({carPlate})</span>
                      <span className="text-[11px] text-slate-500">{transmission}</span>
                    </div>
                  </div>

                  {/* 4-POINT VEHICLE HANDOVER AUDIT BAR */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-slate-800 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Vehicle Handover Audit</div>
                        <div className="text-[10px] text-slate-500">
                          {inspectionPassed
                            ? "✓ Verified (No pre-existing scratches)"
                            : "Pre-trip condition checklist required"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                        inspectionPassed
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                      }`}
                    >
                      {inspectionPassed ? "View Report" : "Inspect Car"}
                    </button>
                  </div>

                  {/* PERMANENT SATHI PIN SECURITY HANDSHAKE */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white text-center space-y-0.5 shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-slate-300">
                      YOUR PERMANENT 4-DIGIT SATHI PIN
                    </span>
                    <div className="text-2xl font-black text-emerald-300 font-mono tracking-widest py-0.5">
                      {startOTP}
                    </div>
                    <span className="text-[9px] text-slate-400 block">
                      Unique to your account • Give this PIN to chauffeur to start trip
                    </span>
                  </div>

                  {/* Live Speedometer during trip */}
                  {tripState === "IN_PROGRESS" && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[9px] block font-sans">LIVE SPEED</span>
                        <span className="text-base font-bold text-slate-900">{speed} km/h</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block font-sans">IMU G-FORCE</span>
                        <span className="text-base font-bold text-emerald-700">{gForce.toFixed(2)}g</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        GPS Active
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STATE 4: COMPLETED & RECEIPT */}
              {tripState === "COMPLETED" && (
                <div className="my-auto py-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl font-bold shadow-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Trip Completed Safely</h4>
                    <p className="text-[11px] text-slate-500">Thank you for riding with Sathi • Aapki Gaadi, Aapka Sathi</p>
                  </div>

                  {/* Star Rating Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Rate Chauffeur {driverName}
                    </span>
                    <div className="flex items-center justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-0.5 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-[10px] font-bold text-slate-700">
                      {rating === 5
                        ? "★★★★★ Exceptional Driving & Conduct"
                        : rating === 4
                        ? "★★★★☆ Smooth Driving & Punctual"
                        : "★★★☆☆ Good Service"}
                    </div>
                  </div>

                  {/* Instant Driver Tip Buttons */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold uppercase text-slate-500">
                        Chauffeur Tip
                      </span>
                      {tipAmount > 0 && (
                        <span className="font-bold text-emerald-600 font-mono">+₹{tipAmount} credited</span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[0, 50, 100, 200].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setTipAmount(amt)}
                          className={`py-1 rounded-lg text-[11px] font-bold border transition ${
                            tipAmount === amt
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {amt === 0 ? "No Tip" : `₹${amt}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save to Favorite Chauffeur Bookmark */}
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-full py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isFavorite
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-600 text-red-600" : "text-slate-500"}`} />
                    <span>{isFavorite ? "Saved to Favorite Chauffeurs ✓" : "Add Chauffeur to Favorites"}</span>
                  </button>

                  {/* Receipt Breakdown */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle Driven:</span>
                      <span className="font-bold text-slate-900">{carModel} ({carPlate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Billed:</span>
                      <span className="font-black text-slate-900 text-sm">₹{fare + tipAmount}.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 text-[11px]">
                      <span>Payment Method:</span>
                      <span className="font-bold">Auto-Debited via UPI</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
                  >
                    Book Another Ride
                  </button>
                </div>
              )}

              {/* Home Indicator Bar */}
              <div>
                <div className="text-center text-[10px] text-slate-400 font-mono py-1">
                  Booking Ref: {bookingCode}
                </div>
                <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto my-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. DRIVER PARTNER PHONE (DRIVER SIDE)                          */}
        {/* ============================================================== */}
        {(viewMode === "SPLIT" || viewMode === "DRIVER") && (
          <div className="relative mx-auto w-full max-w-[400px] rounded-[48px] bg-white shadow-xl border-[8px] border-slate-300 overflow-hidden">
            {/* iOS Light Status Bar with Dynamic Island */}
            <div className="h-11 px-6 pt-2 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 select-none border-b border-slate-100">
              <span className="font-mono text-[11px]">9:41</span>
              {/* Centered Dynamic Island */}
              <div className="w-28 h-6 bg-slate-900 rounded-full flex items-center justify-between px-2.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-[9px] text-slate-300 font-mono">Driver</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                <span>5G</span>
                <span>94%</span>
              </div>
            </div>

            {/* Inner App Container */}
            <div className="px-4 pb-3 min-h-[660px] flex flex-col justify-between text-left bg-white">
              {/* App Brand Header with Active Driver Selector */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-2 relative">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isDriverOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  <span className="text-xs font-bold text-slate-900">Driver Terminal</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowDriverPicker(!showDriverPicker)}
                    className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 transition"
                  >
                    <UserCheck className="w-3 h-3 text-slate-600" />
                    <span>{driverName.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    ₹{driverWallet}
                  </span>

                  <button
                    onClick={() => {
                      if (!activeDriverObj) return;
                      const res = toggleDriverOnline(activeDriverObj.id);
                      if (res.success) {
                        setIsDriverOnline(res.isOnline);
                        refreshUsers();
                      } else {
                        alert(
                          res.error ||
                            `❌ ACCESS DENIED: ADMIN VERIFICATION REQUIRED\n\nChauffeur ${driverName} is currently marked as '${activeDriverObj.kycStatus}' in the KYC Vault.\n\nTo ensure passenger safety and legal compliance, drivers must be officially verified and approved by Operations Admin in the KYC Vault (/kyc) before they are permitted to go on duty or receive ride bookings.\n\nPlease open the Admin KYC Vault (/kyc) to approve this chauffeur.`
                        );
                      }
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                      isDriverOnline
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200"
                        : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                    }`}
                  >
                    {isDriverOnline ? "Online" : "Offline"}
                  </button>
                </div>

                {/* Dropdown to switch between registered chauffeurs */}
                {showDriverPicker && (
                  <div className="absolute top-10 right-0 z-40 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                      Commercial Chauffeurs
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {registeredDrivers.map((drv) => (
                        <button
                          key={drv.id}
                          onClick={() => handleSwitchDriver(drv)}
                          className={`w-full p-2 text-left rounded-lg text-xs transition flex items-center justify-between ${
                            drv.fullName === driverName
                              ? "bg-slate-900 text-white font-bold"
                              : "hover:bg-slate-100 text-slate-800"
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{drv.fullName}</span>
                              {drv.isBlocked && (
                                <span className="text-[9px] px-1 bg-red-600 text-white rounded font-bold">BLOCKED</span>
                              )}
                              {drv.kycStatus === "APPROVED" && !drv.isBlocked && (
                                <span className="text-[9px] text-emerald-600 font-bold">✓ MoRTH</span>
                              )}
                            </div>
                            <div className="text-[10px] opacity-75">{drv.licenseNumber}</div>
                          </div>
                          <span className="text-[10px] font-mono">₹{drv.walletBalance}</span>
                        </button>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] px-1 font-bold">
                      <Link href="/drivers" className="text-blue-600 hover:underline">
                        + Onboard Chauffeur
                      </Link>
                      <Link href="/directory" className="text-slate-600 hover:underline">
                        Admin Controls →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ADMIN VERIFICATION BANNER ON DRIVER TERMINAL */}
              {activeDriverObj && activeDriverObj.kycStatus !== "APPROVED" && (
                <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>AWAITING ADMIN APPROVAL</span>
                    </div>
                    <span className="text-[9px] bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-900 font-mono">
                      {activeDriverObj.kycStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    You cannot go online or receive customer dispatches until Admin verifies your credentials.
                  </p>
                  <Link
                    href="/kyc"
                    className="inline-block text-[11px] font-bold text-slate-900 underline hover:text-blue-600"
                  >
                    Go to Admin KYC Vault to Approve →
                  </Link>
                </div>
              )}

              {/* STATE 1: WAITING FOR OFFERS */}
              {tripState === "IDLE" && (
                <div className="my-auto py-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs">
                    <Car className="w-8 h-8 text-slate-800" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Driver Terminal Online</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Ready to receive verified commercial chauffeur dispatches.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                    <div>Chauffeur: {driverName}</div>
                    <div>DL: {driverDl}</div>
                    <div>Safety Score: 98/100 • MoRTH Cleared</div>
                  </div>
                </div>
              )}

              {/* STATE 2: 30-SECOND RIDE OFFER POPUP */}
              {tripState === "OFFER_DISPATCHED" && (
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-900 shadow-lg space-y-3.5 text-center my-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      NEW RIDE OFFER
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {transmission}
                    </span>
                  </div>

                  {/* Circular 30s Countdown Ring */}
                  <div className="relative w-16 h-16 mx-auto rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xs">
                    <span className="text-xl font-black text-slate-900 font-mono">{countdown}s</span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{Math.round(fare * 0.8 + 150)}.00
                    </div>
                    <div className="text-[10px] text-slate-500">Net Driver Payout (80% + Return Allowance)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-left text-xs space-y-1 border border-slate-200">
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>CUSTOMER: {customerName}</span>
                      <span>{customerPhone}</span>
                    </div>
                    <div className="font-bold text-slate-900 pt-0.5">
                      Vehicle: {carModel} ({carPlate})
                    </div>
                    <div className="text-slate-700 text-xs pt-1">
                      Pickup: <b>{pickup}</b>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-0.5">Time: {scheduledTime}</div>
                  </div>

                  {/* Highlight Callout for Step 2 */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                      Step 2 • 30s Acceptance Window
                    </span>
                  </div>

                  <button
                    onClick={handleAcceptOffer}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm tracking-wide shadow-md transition transform active:scale-95"
                  >
                    ACCEPT RIDE OFFER (₹{Math.round(fare * 0.8 + 150)}.00) →
                  </button>
                </div>
              )}

              {/* STATE 3: ACCEPTED & EN ROUTE TO PICKUP */}
              {tripState === "ACCEPTED" && (
                <div className="space-y-3.5 my-auto py-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Action 1 of 3: Navigation
                    </span>
                    <h4 className="font-black text-slate-900 text-base">Drive to Customer Pickup</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Navigate to {pickup}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Customer:</span>
                      <span className="text-slate-900 font-bold">{customerName}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Vehicle:</span>
                      <span className="text-slate-900 font-bold">{carModel}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Plate:</span>
                      <span className="text-slate-900 font-bold">{carPlate}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200 font-bold">
                      <span>Estimated Travel ETA:</span>
                      <span>~{driverEtaMinutes} mins</span>
                    </div>
                  </div>

                  {/* Highlight Callout for Step 3 */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                      Step 3 • Report at Location
                    </span>
                  </div>

                  <button
                    onClick={handleDriverArrived}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition transform active:scale-95"
                  >
                    SIMULATE ARRIVAL AT PICKUP →
                  </button>
                </div>
              )}

              {/* STATE 4: ARRIVED & ASKING FOR OTP */}
              {tripState === "DRIVER_ARRIVED" && (
                <div className="space-y-4 my-auto py-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Action 2 of 3: Security Verification
                    </span>
                    <h4 className="font-black text-slate-900 text-base">Enter Customer&apos;s Permanent Sathi PIN</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confirm vehicle MP-40-CA-4921 &amp; ask customer for their 4-digit Sathi PIN.
                    </p>
                  </div>

                  {/* Mandatory 4-Point Vehicle Handover Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-slate-800" />
                        <span className="font-bold text-slate-900">Pre-Trip Handover Audit</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          inspectionPassed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {inspectionPassed ? "✓ Handover Passed" : "Action Required"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {inspectionPassed
                        ? `Audit Verified: Odometer ${odometerKm} • Fuel ${fuelLevel} • No scratches recorded.`
                        : "Before starting customer car, inspect front, rear, sides, odometer, and fuel with owner."}
                    </div>
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className={`w-full py-2 rounded-lg text-xs font-bold border transition ${
                        inspectionPassed
                          ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                      }`}
                    >
                      {inspectionPassed ? "Review 4-Point Checklist" : "Perform 4-Point Inspection Now →"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="4-Digit PIN"
                        maxLength={4}
                        value={enteredOTP}
                        onChange={(e) => setEnteredOTP(e.target.value)}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-2xl font-mono text-center font-black text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                      <button
                        onClick={handleAutoFillOTP}
                        className="px-3.5 py-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold hover:bg-slate-200 whitespace-nowrap transition shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                        <span>Auto-Fill</span>
                      </button>
                    </div>

                    {otpError && (
                      <div className="text-xs text-red-600 font-semibold">{otpError}</div>
                    )}
                  </div>

                  {/* Highlight Callout for Step 4 */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                      Step 4 • Verify Permanent Sathi PIN
                    </span>
                  </div>

                  <button
                    onClick={handleStartTrip}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition transform active:scale-95"
                  >
                    VERIFY SATHI PIN &amp; START TRIP →
                  </button>
                </div>
              )}

              {/* STATE 5: IN PROGRESS & COMPLETE TRIP */}
              {tripState === "IN_PROGRESS" && (
                <div className="space-y-4 my-auto py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Action 3 of 3: Driving
                      </span>
                      <h4 className="font-black text-slate-900 text-base">Driving to Destination</h4>
                    </div>

                    <button
                      onClick={triggerBrakeTest}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold hover:bg-amber-100 transition"
                    >
                      Brake Test
                    </button>
                  </div>

                  {harshBrakeAlert && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>HARSH BRAKING RECORDED (-2 Safety Pts)</span>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Vehicle:</span>
                      <span className="text-slate-900 font-bold">{carModel} ({carPlate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Speed:</span>
                      <span className="text-slate-900 font-bold">{speed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Telemetry:</span>
                      <span className="text-emerald-700 font-bold">12-Part Kafka Stream</span>
                    </div>
                  </div>

                  {/* Highlight Callout for Step 5 */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                      Step 5 • Arrive &amp; Settle
                    </span>
                  </div>

                  <button
                    onClick={handleCompleteTrip}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition transform active:scale-95"
                  >
                    ARRIVED AT DESTINATION • END TRIP →
                  </button>
                </div>
              )}

              {/* STATE 6: COMPLETED */}
              {tripState === "COMPLETED" && (
                <div className="my-auto py-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl font-bold shadow-xs">
                    <Wallet className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg">Trip Finished!</h4>
                    <p className="text-xs text-slate-500 mt-1">Earnings credited to your wallet instantly</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ride Earnings:</span>
                      <span className="font-bold text-slate-900">₹{Math.round(fare * 0.8)}.00</span>
                    </div>
                    <div className="flex justify-between text-blue-700">
                      <span>Return Allowance:</span>
                      <span className="font-bold">+₹150.00</span>
                    </div>
                    <div className="flex justify-between text-slate-900 pt-1 border-t border-slate-200 text-sm font-black">
                      <span>Total Payout:</span>
                      <span>+₹{Math.round(fare * 0.8 + 150)}.00</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
                  >
                    Ready for Next Shift
                  </button>
                </div>
              )}

              {/* Home Indicator Bar */}
              <div>
                <div className="text-center text-[10px] text-slate-400 font-mono py-1">
                  Terminal ID: KA-01-TERMINAL-92
                </div>
                <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto my-1"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOMIZE ORIGINAL DATA MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 text-base">Test with Your Original Data</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Quick Select from Registered Database */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Quick Select from Registered Profiles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 font-semibold block">CUSTOMER PRESET</label>
                    <select
                      value={customerName}
                      onChange={(e) => {
                        const found = registeredCustomers.find((c) => c.fullName === e.target.value);
                        if (found) handleSwitchCustomer(found);
                      }}
                      className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold focus:outline-none"
                    >
                      {registeredCustomers.map((c) => (
                        <option key={c.id} value={c.fullName}>
                          {c.fullName} ({c.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-semibold block">CHAUFFEUR PRESET</label>
                    <select
                      value={driverName}
                      onChange={(e) => {
                        const found = registeredDrivers.find((d) => d.fullName === e.target.value);
                        if (found) handleSwitchDriver(found);
                      }}
                      className="w-full mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold focus:outline-none"
                    >
                      {registeredDrivers.map((d) => (
                        <option key={d.id} value={d.fullName}>
                          {d.fullName} ({d.kycStatus})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 font-bold">
                  <Link href="/customers" className="text-blue-600 hover:underline">
                    + Register New Customer
                  </Link>
                  <Link href="/drivers" className="text-emerald-700 hover:underline">
                    + Onboard Chauffeur
                  </Link>
                  <Link href="/directory" className="text-slate-700 hover:underline">
                    View Directory →
                  </Link>
                </div>
              </div>

              {/* Customer Profile */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  1. Customer Profile
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">CUSTOMER NAME</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Your Personal Car */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  2. Your Vehicle (To be Driven)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">CAR BRAND &amp; MODEL</label>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Toyota Fortuner"
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">PLATE NUMBER</label>
                    <input
                      type="text"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      placeholder="e.g. KA-01-MJ-4921"
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Chauffeur Profile */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  3. Assigned Driver Partner
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">CHAUFFEUR NAME</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-semibold block">COMMERCIAL DL</label>
                    <input
                      type="text"
                      value={driverDl}
                      onChange={(e) => setDriverDl(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
              >
                Apply Original Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Architecture Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 text-base">Sathi Architecture Guide</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">1. Dual-App Mobility Architecture</div>
                <p>
                  Left phone represents the Customer hiring a chauffeur for their personal vehicle. Right phone represents the Driver Partner terminal.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">2. Scheduled Date &amp; Travel Time</div>
                <p>
                  Supports both instant bookings (ETA ~14 mins) and advance scheduling for Outstation and Hourly packages with custom pickup dates and times.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">3. 4-Digit Security OTP Handshake</div>
                <p>
                  Guarantees that unverified drivers cannot claim rides. The driver physically cannot start the trip without entering the customer&apos;s secret code.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-POINT PRE-TRIP VEHICLE INSPECTION & HANDOVER MODAL */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-900" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">4-Point Vehicle Pre-Trip Handover</h3>
                  <p className="text-[11px] text-slate-500">Mutual scratch &amp; cluster audit before starting engine</p>
                </div>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vehicle Details */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase block">VEHICLE ASSIGNED</span>
                <span className="font-extrabold text-slate-900 text-sm">{carModel}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">REGISTRATION PLATE</span>
                <span className="font-mono font-bold text-slate-900">{carPlate}</span>
              </div>
            </div>

            {/* 4 Quadrant Scratch & Damage Checks */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                1. 360° Exterior Bodywork Audit
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Front Bumper &amp; Grille</div>
                    <div className="text-[10px] text-emerald-700">✓ No dents or scratches</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Rear Bumper &amp; Boot</div>
                    <div className="text-[10px] text-emerald-700">✓ Clean / Factory paint</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Left Quarter &amp; Doors</div>
                    <div className="text-[10px] text-emerald-700">✓ Mirror &amp; Glass intact</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Right Quarter &amp; Doors</div>
                    <div className="text-[10px] text-emerald-700">✓ Verified clear</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Odometer & Fuel Telematics */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                2. Instrument Cluster Verification
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9px] text-slate-500 font-semibold block">STARTING ODOMETER (KM)</label>
                  <input
                    type="text"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-semibold block">FUEL / BATTERY LEVEL</label>
                  <input
                    type="text"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Guarantee Disclaimer */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Sathi ₹10 Lakhs Transit Guarantee Active</span>
              </div>
              <p className="text-slate-600">
                Both Chauffeur <b>{driverName}</b> and Vehicle Owner <b>{customerName}</b> have mutually verified vehicle condition before driving.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowInspectionModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectionPassed(true);
                  setShowInspectionModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Sign Off Handover &amp; Unlock Trip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1-CLICK WHATSAPP LIVE RIDE SHARING MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Share Live Ride Link</h3>
                  <p className="text-[11px] text-slate-500">Live GPS tracking for family and loved ones</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Ref:</span>
                <span className="font-mono font-bold text-slate-900">{bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chauffeur:</span>
                <span className="font-bold text-slate-900">{driverName} (MoRTH Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Car:</span>
                <span className="font-bold text-slate-900">{carModel} ({carPlate})</span>
              </div>
            </div>

            {/* Generated Tracking Link */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">PUBLIC TRACKING URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`http://192.168.29.200:3000/track/${bookingCode}`}
                  className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`http://192.168.29.200:3000/track/${bookingCode}`);
                    alert("✓ Public live tracking link copied to clipboard!");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center gap-1 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-700" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Share Button */}
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `🚗 *Sathi Live Ride Tracking*\nChauffeur: ${driverName}\nVehicle: ${carModel} (${carPlate})\nTrip Ref: ${bookingCode}\n\nTrack my live trip and telemetry here:\nhttp://192.168.29.200:3000/track/${bookingCode}`
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>📲 Share on WhatsApp with Family</span>
            </button>
          </div>
        </div>
      )}

      {/* IN-APP QUICK CHAT MODAL */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-3.5 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {driverName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{driverName}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Chauffeur is Online</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-xl min-h-[220px] max-h-[300px]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "CUSTOMER" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs font-medium ${
                      msg.sender === "CUSTOMER"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick 1-Tap Reply Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                "I am at the gate",
                "Coming down in 3 mins",
                "Parked at Basement B14",
                "Turn on AC please",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    setChatMessages((prev) => [...prev, { sender: "CUSTOMER", text: chip, time: now }]);
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        { sender: "DRIVER", text: "Understood sir! I am waiting right here.", time: now },
                      ]);
                    }, 1200);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 whitespace-nowrap transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Type a message to chauffeur..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    const txt = chatInput.trim();
                    setChatMessages((prev) => [...prev, { sender: "CUSTOMER", text: txt, time: now }]);
                    setChatInput("");
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        { sender: "DRIVER", text: "Received sir, thank you!", time: now },
                      ]);
                    }, 1200);
                  }
                }}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                onClick={() => {
                  if (!chatInput.trim()) return;
                  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const txt = chatInput.trim();
                  setChatMessages((prev) => [...prev, { sender: "CUSTOMER", text: txt, time: now }]);
                  setChatInput("");
                  setTimeout(() => {
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: "DRIVER", text: "Received sir, thank you!", time: now },
                    ]);
                  }, 1200);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: INTERACTIVE MAP LOCATION PICKER                             */}
      {/* ==================================================================== */}
      {showLocationPickerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    locationPickerType === "pickup"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {locationPickerType === "pickup" ? (
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Navigation className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Select {locationPickerType === "pickup" ? "Pickup Location" : "Destination"} on Real Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click anywhere on the street map or choose a popular landmark below
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLocationPickerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Landmark Chips */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Popular Landmarks in {cityPreset === "BHOPAL" ? "Bhopal (MP-04)" : "Vidisha (MP-40)"}:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {(cityPreset === "BHOPAL"
                  ? [
                      { name: "DB City Mall, MP Nagar Zone-1", coords: [23.2332, 77.4334] },
                      { name: "Raja Bhoj Airport, VIP Road", coords: [23.2875, 77.3378] },
                      { name: "Rani Kamlapati Station", coords: [23.2167, 77.4398] },
                      { name: "Upper Lake / VIP Road", coords: [23.2540, 77.3780] },
                    ]
                  : [
                      { name: "Vidisha Railway Station Road", coords: [23.5262, 77.8211] },
                      { name: "Collectorate Civil Lines / Durga Nagar", coords: [23.5350, 77.8115] },
                      { name: "Neem Tal Market, Station Rd", coords: [23.5288, 77.8155] },
                      { name: "Tilak Chowk / Civil Hospital", coords: [23.5302, 77.8135] },
                      { name: "Betwa River Ghat / Charans Tirth", coords: [23.5180, 77.8020] },
                      { name: "Sanchi Stupa Highway (SH-19)", coords: [23.4793, 77.7397] },
                    ]
                ).map((lm) => (
                  <button
                    key={lm.name}
                    type="button"
                    onClick={() => {
                      setTempPickerCoords(lm.coords as [number, number]);
                      setTempPickerLabel(lm.name);
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition ${
                      tempPickerLabel === lm.name
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    📍 {lm.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Landmark & Coordinate Verification Console (No Map Bloat) */}
            <div className="rounded-2xl p-5 border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {tempPickerLabel}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Verified Landmark Target in {cityPreset} Corridor
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                  GEOFENCE VERIFIED ✓
                </span>
              </div>

              {/* Exact Coordinate Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tempPickerCoords[0]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setTempPickerCoords([val, tempPickerCoords[1]]);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tempPickerCoords[1]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setTempPickerCoords([tempPickerCoords[0], val]);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Select any popular hub above or enter custom coordinates directly.</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">Sub-millisecond Validation</span>
              </div>
            </div>

            {/* Selected Coordinate Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pinpoint Location:</span>
                <div className="font-extrabold text-slate-900 text-sm">{tempPickerLabel}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  {tempPickerCoords[0].toFixed(5)}°N, {tempPickerCoords[1].toFixed(5)}°E
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationPickerModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleMapLocationSelect(
                      locationPickerType,
                      tempPickerCoords,
                      tempPickerLabel,
                      calculateDistanceKm(pickupCoords[0], pickupCoords[1], tempPickerCoords[0], tempPickerCoords[1])
                    );
                    setShowLocationPickerModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-sm transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Location</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: DETAILED PRICING BREAKDOWN & LEDGER                         */}
      {/* ==================================================================== */}
      {showPricingDetailModal && detailedFare && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Pricing in Detail / Fare Breakdown</h3>
                  <p className="text-xs text-slate-500">
                    City Matrix: <b>{detailedFare.cityName}</b> • {detailedFare.serviceType.replace("_", " ")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPricingDetailModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Itemized Line Items */}
            <div className="space-y-3 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Itemized Service Cost Breakdown
              </div>

              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Base Chauffeur Booking Charge</span>
                  <span className="font-mono font-bold text-slate-900">₹{detailedFare.baseFare}.00</span>
                </div>

                {detailedFare.extraTimeFare > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-600">Extra Hourly Package Fare</span>
                    <span className="font-mono font-bold text-slate-900">₹{detailedFare.extraTimeFare}.00</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div>
                    <span className="text-slate-600">Distance Surcharge</span>
                    <span className="text-[10px] text-slate-400 block">
                      {detailedFare.distanceKm} km @ ₹{detailedFare.perKmRate}/km
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{detailedFare.distanceFare}.00</span>
                </div>

                {detailedFare.nightSurgeFare > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-50 text-amber-800">
                    <div>
                      <span className="font-semibold">Night Time Surge Multiplier</span>
                      <span className="text-[10px] text-amber-600 block">
                        +{Math.round((detailedFare.nightSurgeMultiplier - 1) * 100)}% (Active between 10 PM - 6 AM)
                      </span>
                    </div>
                    <span className="font-mono font-bold">₹{detailedFare.nightSurgeFare}.00</span>
                  </div>
                )}

                {detailedFare.driverReturnAllowance > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-50 text-blue-800">
                    <div>
                      <span className="font-semibold">Chauffeur Night Return Allowance</span>
                      <span className="text-[10px] text-blue-600 block">
                        Ensures verified driver safe return transit after midnight
                      </span>
                    </div>
                    <span className="font-mono font-bold">₹{detailedFare.driverReturnAllowance}.00</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                  <div>
                    <span>Free Waiting Time Window</span>
                    <span className="text-[10px] text-slate-400 block">
                      {detailedFare.freeWaitMinutes} mins free, then demurrage applies
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700">INCLUDED</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 text-emerald-800">
                  <div>
                    <span className="font-semibold">Sathi ₹10,00,000 Transit Guarantee</span>
                    <span className="text-[10px] text-emerald-600 block">
                      Comprehensive personal accident & vehicle protection
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700">₹0.00 (FREE)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                  <span>Convenience Fee</span>
                  <span className="font-mono font-bold text-slate-900">₹{detailedFare.convenienceFee}.00</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                  <span>Goods & Services Tax (GST {detailedFare.gstPct}%)</span>
                  <span className="font-mono font-bold text-slate-900">₹{detailedFare.gstAmount}.00</span>
                </div>

                {detailedFare.tipAmount > 0 && (
                  <div className="flex items-center justify-between py-1 text-emerald-700 font-bold">
                    <span>Driver Appreciation Tip (100% to Driver)</span>
                    <span className="font-mono">₹{detailedFare.tipAmount}.00</span>
                  </div>
                )}

                {detailedFare.geofenceBoundaryNote && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">{detailedFare.geofenceName}</div>
                      <div className="text-[11px] text-emerald-700">{detailedFare.geofenceBoundaryNote}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Customer Amount */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Payable by Rider</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ₹{detailedFare.totalCustomerFare}.00
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono font-bold">
                    All-Inclusive
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">Zero Hidden Charges</div>
                </div>
              </div>

              {/* Full Split Transparency */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Revenue Split Transparency</span>
                  <span className="text-emerald-700 font-bold">Fair Chauffeur Payout</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Chauffeur Payout (Instant Bank Credit):</span>
                  <span className="text-emerald-600 font-mono text-sm">₹{detailedFare.netDriverEarnings}.00</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Platform Operations Take-Rate:</span>
                  <span className="font-mono">₹{detailedFare.platformCommission}.00</span>
                </div>
              </div>

              {/* Admin Matrix Link */}
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <Link
                  href="/pricing"
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin: Manage Pricing Matrix Rates →</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowPricingDetailModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Close Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
