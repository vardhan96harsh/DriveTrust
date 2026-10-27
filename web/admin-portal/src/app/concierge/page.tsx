"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  User,
  Car,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  ShieldCheck,
  Building2,
  Navigation,
} from "lucide-react";
import { getDrivers, saveLiveBooking } from "@/lib/userStore";

const DRIVER_DIRECTORY: Record<string, { name: string; phone: string; rto: string }> = {
  "drv-001": { name: "Rajesh Sharma", phone: "+91 99801 84920", rto: "MP-40" },
  "drv-002": { name: "Mukesh Patel", phone: "+91 98451 22340", rto: "MP-40" },
  "drv-003": { name: "Dharmendra Lodhi", phone: "+91 97412 55441", rto: "MP-04" },
  "drv-005": { name: "Imran Qureshi", phone: "+91 98264 56789", rto: "MP-04" },
};

export default function ConciergeBookingPage() {
  const [passengerName, setPassengerName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [serviceTier, setServiceTier] = useState<"NIGHT_DROP" | "HOURLY" | "OUTSTATION">("NIGHT_DROP");
  const [transmission, setTransmission] = useState<"AUTOMATIC" | "MANUAL" | "LUXURY">("AUTOMATIC");
  const [carModel, setCarModel] = useState("Toyota Fortuner (Automatic)");
  const [carPlate, setCarPlate] = useState("MP-40-CA-4921");
  const [pickupLandmark, setPickupLandmark] = useState("Vidisha Railway Station, Station Rd");
  const [dropoffLandmark, setDropoffLandmark] = useState("Collectorate Civil Lines, Vidisha");
  const [selectedDriverId, setSelectedDriverId] = useState("drv-001");
  const [estimatedFare, setEstimatedFare] = useState<number>(450);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentDispatches, setRecentDispatches] = useState([
    {
      code: "DT-CON-9102",
      customer: "Suresh Agarwal (Hotel Grand)",
      phone: "+91 98260 99881",
      driver: "Rajesh Sharma (MP-40)",
      route: "Vidisha Station → Civil Lines",
      car: "Creta (Automatic)",
      fare: 350,
      time: "10 mins ago",
    },
    {
      code: "DT-CON-9101",
      customer: "Col. Sanjeev Nair",
      phone: "+91 98261 44552",
      driver: "Mukesh Patel (MP-04)",
      route: "MP Nagar Zone-1 → Bhopal Airport",
      car: "BMW 330Li (Luxury)",
      fare: 850,
      time: "1 hour ago",
    },
  ]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim() || phone.length < 10) {
      alert("Please enter customer name and valid phone number.");
      return;
    }

    const assignedDriver = DRIVER_DIRECTORY[selectedDriverId] || {
      name: "Rajesh Sharma",
      phone: "+91 99801 84920",
      rto: "MP-40",
    };

    const newCode = `DT-CON-${Math.floor(1000 + Math.random() * 9000)}`;
    const driverLabel = `${assignedDriver.name} (${assignedDriver.rto})`;

    const newEntry = {
      code: newCode,
      customer: passengerName.trim(),
      phone: phone.trim(),
      driver: driverLabel,
      route: `${pickupLandmark.split(",")[0]} → ${dropoffLandmark.split(",")[0]}`,
      car: carModel,
      fare: estimatedFare,
      time: "Just now",
    };

    saveLiveBooking({
      bookingCode: newCode,
      serviceType: serviceTier,
      driverName: assignedDriver.name,
      driverPhone: assignedDriver.phone,
      customerName: passengerName.trim(),
      customerPhone: phone.trim(),
      vehicleModel: carModel,
      vehiclePlate: carPlate.toUpperCase(),
      state: "ACCEPTED",
      fare: estimatedFare,
      otp: "5421",
      startedAt: "Just now",
      pickup: pickupLandmark,
      dropoff: dropoffLandmark,
    });

    setRecentDispatches([newEntry, ...recentDispatches]);
    setPassengerName("");
    setPhone("+91 ");
    showToast(`✓ Phone Booking ${newCode} dispatched to ${driverLabel}! Synced with live tracking.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Concierge &amp; Phone Booking Desk
              </h1>
              <p className="text-xs text-slate-500">
                Direct phone dispatch for Vidisha &amp; Bhopal passengers, hotel concierges, and VIP airport transfers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
            OPERATOR DESK: ONLINE
          </span>
        </div>
      </div>

      {/* Operator Phone Script & Commute Rule */}
      <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 text-xs text-blue-950 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <span className="w-5 h-5 rounded-md bg-blue-200 flex items-center justify-center text-blue-800 text-[11px] font-black">📞</span>
            <span>Telephone Operator Script &amp; Arrival Promise (फोन बुकिंग गाइड)</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            ESTIMATED ARRIVAL: ~20-25 MINS
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-blue-900/90">
          <strong>What to say to customer on call:</strong> &quot;Namaste, your DriveTrust chauffeur is being dispatched to drive your car. Since our chauffeur travels across the city to your garage, please expect arrival in <strong>~20 to 25 minutes</strong>. A 4-digit start OTP has been generated for your safety.&quot;
        </p>
      </div>

      {/* Main Grid: Form & Recent Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" />
              <span>Create Customer Booking (Phone / In-Person)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Vidisha MP-40 / Bhopal MP-04</span>
          </div>

          <form onSubmit={handleCreateBooking} className="space-y-5">
            {/* Passenger Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number (SMS Alerts) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98260 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Service Tier & Transmission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Category
                </label>
                <select
                  value={serviceTier}
                  onChange={(e) => {
                    const tier = e.target.value as any;
                    setServiceTier(tier);
                    setEstimatedFare(tier === "NIGHT_DROP" ? 450 : tier === "HOURLY" ? 750 : 1850);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="NIGHT_DROP">Night Safe Drop (Point to Point)</option>
                  <option value="HOURLY">Hourly Chauffeur Package (4 Hours / 40 km)</option>
                  <option value="OUTSTATION">Outstation Highway Duty (Bhopal ⇄ Vidisha)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Transmission Skill
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-center">
                  {(["AUTOMATIC", "MANUAL", "LUXURY"] as const).map((trans) => (
                    <button
                      type="button"
                      key={trans}
                      onClick={() => setTransmission(trans)}
                      className={`py-1.5 rounded-lg transition ${
                        transmission === trans
                          ? "bg-white text-slate-900 shadow-xs font-extrabold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {trans}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Being Driven */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Customer Car Model
                </label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="e.g. Innova Crysta, Fortuner"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vehicle Registration Plate
                </label>
                <input
                  type="text"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  placeholder="e.g. MP-40-CA-4921"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Pickup & Destination */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pickup Location</span>
                </label>
                <select
                  value={pickupLandmark}
                  onChange={(e) => setPickupLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Vidisha Railway Station, Station Rd">Vidisha Railway Station, Station Road</option>
                  <option value="Durga Nagar / Neem Tal Market, Vidisha">Durga Nagar / Neem Tal Market, Vidisha</option>
                  <option value="Collectorate Civil Lines, Vidisha">Collectorate Civil Lines, Vidisha</option>
                  <option value="DB City Mall, MP Nagar Zone-1, Bhopal">DB City Mall, MP Nagar Zone-1, Bhopal</option>
                  <option value="Raja Bhoj International Airport, VIP Rd, Bhopal">Raja Bhoj International Airport, VIP Road, Bhopal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>Destination / Dropoff</span>
                </label>
                <select
                  value={dropoffLandmark}
                  onChange={(e) => setDropoffLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Collectorate Civil Lines, Vidisha">Collectorate Civil Lines, Vidisha</option>
                  <option value="Vidisha Railway Station, Station Rd">Vidisha Railway Station, Station Road</option>
                  <option value="Raja Bhoj International Airport, VIP Rd, Bhopal">Raja Bhoj International Airport, Bhopal</option>
                  <option value="Sanchi Stupa Tourism Complex (SH-19)">Sanchi Stupa Tourism Complex (SH-19)</option>
                  <option value="Arera Colony / 10 No. Market, Bhopal">Arera Colony / 10 No. Market, Bhopal</option>
                </select>
              </div>
            </div>

            {/* Select Nearby Verified Chauffeur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assign Verified Chauffeur
              </label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="drv-001">Chauffeur Rajesh Sharma (Vidisha MP-40) • Score 99/100 • 0.8 km away</option>
                <option value="drv-002">Chauffeur Mukesh Patel (Vidisha MP-40) • Score 98/100 • 1.4 km away</option>
                <option value="drv-003">Chauffeur Dharmendra Lodhi (Bhopal MP-04) • Score 99/100 • Available</option>
                <option value="drv-005">Chauffeur Imran Qureshi (Bhopal VIP Rd) • Score 99/100 • Available</option>
              </select>
            </div>

            {/* Price Preview & Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Estimated Fare (Inc. GST)</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{estimatedFare}.00</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Confirm &amp; Dispatch Chauffeur</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recent Phone Dispatches Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">Recent Concierge Bookings</h3>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Phone Desk
            </span>
          </div>

          <div className="space-y-3">
            {recentDispatches.map((b) => (
              <div key={b.code} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{b.code}</span>
                  <span className="text-[10px] text-slate-400">{b.time}</span>
                </div>
                <div className="font-bold text-slate-800">{b.customer}</div>
                <div className="text-[11px] text-slate-500 font-mono">{b.phone}</div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  Route: <b>{b.route}</b>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500 font-mono">{b.car}</span>
                  <span className="font-extrabold text-slate-900 font-mono">₹{b.fare}.00</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Operator Telephony Notes</span>
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              When a customer calls the Vidisha/Bhopal helpline, dispatchers can book without the customer installing the app. The customer immediately receives an SMS with chauffeur tracking link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
