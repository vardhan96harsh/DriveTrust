"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Car,
  Plus,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  Shield,
  Smartphone,
  Star,
  MapPin,
} from "lucide-react";
import {
  getCustomers,
  getDrivers,
  Customer,
  Driver,
  DEFAULT_CUSTOMERS,
  DEFAULT_DRIVERS,
} from "@/lib/userStore";

export default function DirectoryHubPage() {
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [drivers, setDrivers] = useState<Driver[]>(DEFAULT_DRIVERS);

  useEffect(() => {
    setCustomers(getCustomers());
    setDrivers(getDrivers());
  }, []);

  const totalCustomers = customers.length;
  const verifiedCustomers = customers.filter((c) => c.verificationStatus === "VERIFIED" && !c.isBlocked).length;
  const totalVehicles = customers.reduce((acc, c) => acc + (c.vehicles?.length || 0), 0);

  const totalDrivers = drivers.length;
  const onlineDrivers = drivers.filter((d) => d.isOnline && !d.isBlocked).length;
  const approvedDrivers = drivers.filter((d) => d.kycStatus === "APPROVED" && !d.isBlocked).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Fleet &amp; Accounts Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Separate, dedicated management portals for Registered Passengers and Commercial Chauffeurs.
        </p>
      </div>

      {/* Two Large Dedicated Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway 1: Customers Portal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-100" />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                PASSENGERS
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Customers &amp; Garage</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage registered customer profiles, vehicle garage specs, Aadhaar and phone verification, and account access.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{totalCustomers}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Verified</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{verifiedCustomers}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Vehicles</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{totalVehicles}</div>
              </div>
            </div>

            {/* Recent Customers Mini-List */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Recent Customer Accounts
              </div>
              {customers.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{c.fullName}</span>
                    <span className="text-slate-400 ml-2 font-mono text-[11px]">{c.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.vehicles.length} vehicle(s)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href="/customers"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Open Customers Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gateway 2: Chauffeurs Portal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-slate-100" />
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                CHAUFFEURS
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Chauffeurs &amp; Fleet</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage commercial chauffeur partners, Sarathi driving licenses, police clearances, duty toggles, and payouts.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Fleet</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{totalDrivers}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Online</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">{onlineDrivers}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">KYC OK</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{approvedDrivers}</div>
              </div>
            </div>

            {/* Recent Chauffeurs Mini-List */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Recent Chauffeur Partners
              </div>
              {drivers.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${d.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="font-semibold text-slate-800">{d.fullName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {d.licenseNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href="/drivers"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Open Chauffeurs Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
