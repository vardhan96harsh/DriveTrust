"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: "emerald" | "blue" | "amber" | "purple";
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = "positive",
  subtitle,
  icon,
  accentColor = "emerald",
}: MetricCardProps) {
  const accentBorder = {
    emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    blue: "from-blue-500/20 via-blue-500/5 to-transparent",
    amber: "from-amber-500/20 via-amber-500/5 to-transparent",
    purple: "from-purple-500/20 via-purple-500/5 to-transparent",
  }[accentColor];

  const iconStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    blue: "bg-blue-50 text-blue-700 border-blue-200/80",
    amber: "bg-amber-50 text-amber-700 border-amber-200/80",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80",
  }[accentColor];

  return (
    <div className="relative group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      {/* Subtle top gradient accent glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentBorder}`} />

      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          {title}
        </span>
        {icon && (
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${iconStyles}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 mb-1.5">
        <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              changeType === "positive"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                : changeType === "negative"
                ? "bg-rose-50 text-rose-700 border border-rose-200/70"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            ) : changeType === "negative" ? (
              <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{change}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
