"use client";

import React, { useState } from "react";
import { Check, X, Globe, Shield, Sparkles } from "lucide-react";

interface DriverWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriverWalkthroughModal({ isOpen, onClose }: DriverWalkthroughModalProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showLanguageSheet, setShowLanguageSheet] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  if (!isOpen) return null;

  const slides = [
    {
      title: "Drive. Earn. Succeed.",
      subtitle:
        "Enjoy flexible hours, more rides, and higher earnings with DriveTrust. Your journey, your growth, your rewards.",
      illustration: "DRIVE_SUCCEED",
    },
    {
      title: "Instant Payouts",
      subtitle:
        "Instant, hassle-free withdrawals to bank or UPI — track earnings live and cash out anytime.",
      illustration: "INSTANT_PAYOUTS",
    },
    {
      title: "Boost Your Earnings",
      subtitle:
        "Grow earnings with surge zones, peak-hour incentives, and streak bonuses that reward your hustle.",
      illustration: "BOOST_EARNINGS",
    },
  ];

  const languages = [
    { id: "en", name: "English", subtitle: "Default language" },
    { id: "hi", name: "हिन्दी", subtitle: "Hindi" },
    { id: "mr", name: "मराठी", subtitle: "Marathi" },
    { id: "bn", name: "বাংলা", subtitle: "Bengali" },
    { id: "ta", name: "தமிழ்", subtitle: "Tamil" },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setShowLanguageSheet(true);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("drivetrust_driver_walkthrough_completed", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white text-slate-800 rounded-[28px] shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[580px] animate-in zoom-in-95 duration-200 border border-slate-100">
        {/* Top Header: Skip Button */}
        <div className="flex items-center justify-end w-full">
          <button
            onClick={handleFinish}
            className="text-slate-400 hover:text-slate-700 font-medium text-sm px-3 py-1 rounded-full transition cursor-pointer"
          >
            skip
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {slides[currentSlide].title}
          </h2>

          <p className="text-slate-500 text-sm sm:text-[15px] mt-3 leading-relaxed max-w-xs mx-auto">
            {slides[currentSlide].subtitle}
          </p>

          {/* Clean Vector SVG Illustration */}
          <div className="w-56 h-56 my-6 flex items-center justify-center">
            {currentSlide === 0 && <IllustrationDriveSucceed />}
            {currentSlide === 1 && <IllustrationInstantPayouts />}
            {currentSlide === 2 && <IllustrationBoostEarnings />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="w-full flex flex-col items-center">
          {/* Page Indicator Dots */}
          <div className="flex items-center gap-2 mb-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? "w-6 bg-[#00B779]"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-[#00B779] hover:bg-[#009e66] active:scale-[0.99] text-white font-bold rounded-2xl text-base shadow-lg shadow-[#00B779]/25 transition cursor-pointer flex items-center justify-center"
          >
            {currentSlide < slides.length - 1 ? "Next" : "Choose Language"}
          </button>
        </div>

        {/* Language Selection Sheet */}
        {showLanguageSheet && (
          <div className="absolute inset-0 bg-white z-20 p-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-250">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00B779] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Choose Language</h3>
                </div>
                <button
                  onClick={() => setShowLanguageSheet(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Select your preferred app language for passenger pickups, fares, and navigation instructions.
              </p>

              <div className="space-y-2.5">
                {languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.name;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left ${
                        isSelected
                          ? "bg-emerald-50/70 border-[#00B779] text-[#00B779] shadow-sm"
                          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? "text-emerald-700" : "text-slate-800"}`}>
                          {lang.name}
                        </div>
                        <div className="text-xs text-slate-500">{lang.subtitle}</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#00B779] text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full mt-4 py-4 bg-[#00B779] hover:bg-[#009e66] text-white font-bold rounded-2xl text-base shadow-lg shadow-[#00B779]/25 transition cursor-pointer"
            >
              Confirm & Start Duty
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Vector SVG 1: Driver Thumbs Up Behind Steering Wheel
// -------------------------------------------------------------
function IllustrationDriveSucceed() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Rearview mirror */}
      <rect x="68" y="24" width="104" height="22" rx="10" fill="none" stroke="#1E293B" strokeWidth="4" />
      <line x1="112" y1="24" x2="112" y2="12" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <line x1="128" y1="24" x2="128" y2="12" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

      {/* Driver Body in Vibrant Mint Polo */}
      <path
        d="M 96 148 L 86 182 L 186 182 L 174 148 Z"
        fill="#00B779"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Driver Head */}
      <circle cx="135" cy="110" r="38" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />

      {/* Eyes & Friendly Smile */}
      <circle cx="127" cy="108" r="3" fill="#1E293B" />
      <circle cx="147" cy="108" r="3" fill="#1E293B" />
      <path
        d="M 130 122 Q 138 130 148 122"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Hair */}
      <path
        d="M 108 98 Q 120 74 148 76 Q 174 82 173 110"
        fill="none"
        stroke="#1E293B"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Thumbs Up Hand on Left */}
      <path
        d="M 92 148 L 86 122 Q 90 114 98 120 L 98 138 L 108 142 L 108 162 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Steering Wheel Foreground */}
      <path
        d="M 80 178 A 45 45 0 0 1 190 178"
        fill="none"
        stroke="#1E293B"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line x1="135" y1="165" x2="135" y2="182" stroke="#1E293B" strokeWidth="5" />
    </svg>
  );
}

// -------------------------------------------------------------
// Vector SVG 2: Driver Beside White Car with Instant Earnings
// -------------------------------------------------------------
function IllustrationInstantPayouts() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Soft Cyan Sky Backdrop */}
      <circle cx="130" cy="125" r="75" fill="#E0F2FE" />

      {/* Upward Profit Arrow */}
      <path
        d="M 110 125 L 128 110 L 148 95 L 165 80"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 152 78 L 170 78 L 170 96"
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gold Currency Coins */}
      <circle cx="108" cy="85" r="14" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
      <text x="108" y="90" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E293B">
        ₹
      </text>

      <circle cx="180" cy="120" r="12" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
      <text x="180" y="124" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1E293B">
        ₹
      </text>

      {/* Modern White Sedan */}
      <path
        d="M 75 152 L 105 130 L 165 130 L 188 142 L 202 152 L 202 170 L 68 170 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Car Windshield & Windows */}
      <path
        d="M 110 134 L 158 134 L 158 148 L 102 148 Z"
        fill="#BAE6FD"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Car Wheels */}
      <circle cx="95" cy="170" r="12" fill="#334155" stroke="#1E293B" strokeWidth="3" />
      <circle cx="178" cy="170" r="12" fill="#334155" stroke="#1E293B" strokeWidth="3" />

      {/* Driver Standing in Yellow Uniform with Cap */}
      <rect x="58" y="104" width="26" height="10" rx="4" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
      <circle cx="71" cy="120" r="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <rect x="56" y="132" width="30" height="34" rx="6" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
    </svg>
  );
}

// -------------------------------------------------------------
// Vector SVG 3: Confident Driver in Car with Surge Earnings
// -------------------------------------------------------------
function IllustrationBoostEarnings() {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      {/* Lower Dashboard Dome in Soft Blue */}
      <path
        d="M 45 160 A 75 55 0 0 0 195 160 Z"
        fill="#DCEAF7"
        stroke="#1E293B"
        strokeWidth="4"
      />

      {/* Driver Head */}
      <circle cx="120" cy="100" r="30" fill="#FED7AA" stroke="#1E293B" strokeWidth="4" />

      {/* Glasses */}
      <circle cx="110" cy="100" r="8" fill="none" stroke="#1E293B" strokeWidth="3" />
      <circle cx="130" cy="100" r="8" fill="none" stroke="#1E293B" strokeWidth="3" />
      <line x1="118" y1="100" x2="122" y2="100" stroke="#1E293B" strokeWidth="3" />

      {/* Hair */}
      <path
        d="M 95 90 Q 112 72 135 72 Q 152 80 148 100"
        fill="#5A3825"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Brown Jacket / Uniform */}
      <path
        d="M 85 130 L 60 162 L 180 162 L 155 130 Z"
        fill="#8B5E3C"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Black Safety Seatbelt */}
      <line x1="145" y1="130" x2="95" y2="162" stroke="#0F172A" strokeWidth="12" />

      {/* Steering Wheel Held Firmly */}
      <path
        d="M 86 142 A 38 38 0 0 1 154 142"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Surge Multiplier Tag in Mint Green */}
      <rect x="156" y="70" width="48" height="24" rx="8" fill="#00B779" />
      <text x="180" y="86" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
        2.4x
      </text>
    </svg>
  );
}
