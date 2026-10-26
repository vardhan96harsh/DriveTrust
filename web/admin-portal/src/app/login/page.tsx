"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  PhoneCall,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import {
  loginAdmin,
  getAdminSession,
  PRECONFIGURED_ADMINS,
  AdminRole,
} from "@/lib/adminAuthStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const existing = getAdminSession();
    if (existing) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password, rememberMe);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Authentication failed. Check credentials.");
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (targetEmail: string) => {
    const config = PRECONFIGURED_ADMINS[targetEmail];
    if (config) {
      setEmail(targetEmail);
      setPassword(config.password);
      setError(null);
      setLoading(true);

      setTimeout(() => {
        loginAdmin(targetEmail, config.password, rememberMe);
        router.push("/");
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[250px] bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner mb-4">
            <BrandLogo className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sathi <span className="text-emerald-400">Command</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Aapki Gaadi, Aapka Sathi • Tier-1 Operations Terminal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Admin Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sathi.in"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-600 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-950"
              />
              <span>Remember active session</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-semibold cursor-pointer hover:underline">
              2FA Protected
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Access Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Roles */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 text-center font-mono">
            One-Click Operational Role Presets
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@sathi.in")}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Super Admin</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">admin@sathi.in</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("dispatch@sathi.in")}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-white group-hover:text-blue-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>Dispatch Desk</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">dispatch@sathi.in</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("kyc@sathi.in")}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>KYC Auditor</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">kyc@sathi.in</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("safety@sathi.in")}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-white group-hover:text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Safety 112 Desk</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">safety@sathi.in</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-slate-500 text-xs font-mono">
        Sathi Mobility Technologies Ltd. • Aapki Gaadi, Aapka Sathi
      </div>
    </div>
  );
}
