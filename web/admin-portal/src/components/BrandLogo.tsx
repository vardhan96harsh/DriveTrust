import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = "w-10 h-10", size = 40 }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dtObsidian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="dtGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="dtGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Modern Squircle Backing */}
      <rect width="48" height="48" rx="14" fill="url(#dtObsidian)" />
      <rect x="1" y="1" width="46" height="46" rx="13" stroke="url(#dtGold)" strokeWidth="1.2" strokeOpacity="0.6" />

      {/* Luxury Shield Contour */}
      <path
        d="M24 10 L34 14.5 V23.5 C34 29.5 29.8 35 24 38 C18.2 35 14 29.5 14 23.5 V14.5 L24 10 Z"
        stroke="url(#dtGoldLight)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#1E293B"
        fillOpacity="0.4"
      />

      {/* Monogram Monolith 'DT' */}
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="12"
        fill="url(#dtGoldLight)"
        letterSpacing="0.5"
      >
        DT
      </text>

      {/* Trust Crown Dot */}
      <circle cx="24" cy="15" r="1.8" fill="#F59E0B" />
    </svg>
  );
}
