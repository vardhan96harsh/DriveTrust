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
        <linearGradient id="sathiBacking" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="sathiEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="sathiCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Modern Squircle Backing */}
      <rect width="48" height="48" rx="13" fill="url(#sathiBacking)" />
      <rect x="1" y="1" width="46" height="46" rx="12" stroke="#334155" strokeWidth="1" />

      {/* Connected Infinity Path / S Letter Curve */}
      <path
        d="M33 16 C33 12, 17 12, 17 21 C17 28, 31 24, 31 31 C31 37, 15 37, 15 32"
        stroke="url(#sathiEmerald)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Live Connection Dot */}
      <circle cx="33" cy="16" r="3" fill="url(#sathiCyan)" />
      <circle cx="15" cy="32" r="3" fill="#10B981" />
    </svg>
  );
}
