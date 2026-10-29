"use client";

import React, { useState } from "react";
import { Check, X, Globe } from "lucide-react";

interface DriverWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: string;
  onLanguageChanged?: (lang: string) => void;
}

export function DriverWalkthroughModal({
  isOpen,
  onClose,
  initialLanguage = "English",
  onLanguageChanged,
}: DriverWalkthroughModalProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showLanguageSheet, setShowLanguageSheet] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);

  if (!isOpen) return null;

  const slides = [
    {
      title: selectedLanguage === "हिन्दी" ? "चलाएं। कमाएं। सफल बनें।" : "Drive. Earn. Succeed.",
      subtitle:
        selectedLanguage === "हिन्दी"
          ? "फ्लेक्सिबल समय, अधिक राइड्स और DriveTrust के साथ बेहतरीन कमाई का आनंद लें। आपकी यात्रा, आपका विकास।"
          : "Enjoy flexible hours, more rides, and higher earnings with DriveTrust. Your journey, your growth, your rewards.",
      illustration: "DRIVE_SUCCEED",
    },
    {
      title: selectedLanguage === "हिन्दी" ? "त्वरित भुगतान (Instant Payouts)" : "Instant Payouts",
      subtitle:
        selectedLanguage === "हिन्दी"
          ? "बैंक या UPI में तुरंत और बिना किसी परेशानी के निकासी — लाइव कमाई ट्रैक करें और कभी भी पैसे निकालें।"
          : "Instant, hassle-free withdrawals to bank or UPI — track earnings live and cash out anytime.",
      illustration: "INSTANT_PAYOUTS",
    },
    {
      title: selectedLanguage === "हिन्दी" ? "अपनी कमाई बढ़ाएं" : "Boost Your Earnings",
      subtitle:
        selectedLanguage === "हिन्दी"
          ? "सर्ज ज़ोन, पीक-ऑवर इंसेंटिव और स्ट्रीक बोनस के साथ अपनी कमाई को और अधिक बढ़ाएं।"
          : "Grow earnings with surge zones, peak-hour incentives, and streak bonuses that reward your hustle.",
      illustration: "BOOST_EARNINGS",
    },
  ];

  const languages = [
    { id: "en", name: "English" },
    { id: "hi", name: "हिन्दी" },
    { id: "mr", name: "मराठी" },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleConfirmLanguage = () => {
    setShowLanguageSheet(false);
    if (onLanguageChanged) {
      onLanguageChanged(selectedLanguage);
    }
    localStorage.setItem("drivetrust_selected_language", selectedLanguage);
  };

  const handleFinish = () => {
    localStorage.setItem("drivetrust_driver_walkthrough_completed", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      {/* Main Walkthrough Container */}
      <div className="relative w-full max-w-md bg-white text-slate-800 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[600px] animate-in zoom-in-95 duration-200 border border-slate-100">
        
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

          {/* Clean Vector SVG Illustration matching screenshots */}
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

          {/* Action Button: Next -> Next -> Get Started */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-[#00B779] hover:bg-[#009e66] active:scale-[0.99] text-white font-bold rounded-[28px] text-base shadow-lg shadow-[#00B779]/25 transition cursor-pointer flex items-center justify-center"
          >
            {currentSlide < slides.length - 1
              ? (selectedLanguage === "हिन्दी" ? "आगे बढ़ें (Next)" : "Next")
              : (selectedLanguage === "हिन्दी" ? "शुरू करें (Get Started)" : "Get Started")}
          </button>

          {/* Change Language on Slide 3 */}
          {currentSlide === slides.length - 1 && (
            <button
              onClick={() => setShowLanguageSheet(true)}
              className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              {selectedLanguage === "हिन्दी" ? "भाषा बदलें (Choose Language: हिन्दी)" : `Choose Language (${selectedLanguage})`}
            </button>
          )}
        </div>

        {/* STEP 1: Choose Language Bottom Sheet - Pops up FIRST before the 3 screens */}
        {showLanguageSheet && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-30 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[32px] p-6 sm:p-8 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-slate-100">
              
              {/* Centered Title matching screenshot */}
              <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
                Choose Language
              </h3>

              {/* Radio Button Options List */}
              <div className="space-y-6 mb-8 px-2">
                {languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.name;
                  return (
                    <div
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className="flex items-center gap-4 cursor-pointer select-none py-1"
                    >
                      {/* High-Fidelity Circular Radio Button matching screenshot */}
                      <div className={`w-[22px] h-[22px] rounded-full border-[2.5px] flex items-center justify-center shrink-0 ${
                        isSelected ? "border-slate-800" : "border-slate-300"
                      }`}>
                        {isSelected && (
                          <div className="w-[10px] h-[10px] rounded-full bg-slate-800" />
                        )}
                      </div>

                      {/* Language Label */}
                      <span className="text-[17px] font-normal text-slate-800">
                        {lang.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Vibrant Emerald Mint Confirm Button matching screenshot */}
              <button
                onClick={handleConfirmLanguage}
                className="w-full py-4 bg-[#00B779] hover:bg-[#009e66] active:scale-[0.99] text-white font-bold rounded-[24px] text-base shadow-lg shadow-[#00B779]/25 transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
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

      {/* Brown Jacket */}
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
