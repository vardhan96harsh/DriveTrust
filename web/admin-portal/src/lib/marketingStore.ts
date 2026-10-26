"use client";

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: "FLAT" | "PERCENT";
  discountValue: number; // ₹ for FLAT, % for PERCENT
  maxDiscount?: number; // cap in ₹ for PERCENT type
  minFare: number; // minimum fare to apply
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  targetCity?: string; // null = all cities
  createdBy: string;
  createdAt: string;
}

export interface PushBroadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: "ALL_DRIVERS" | "ONLINE_DRIVERS" | "VIDISHA_DRIVERS" | "BHOPAL_DRIVERS" | "ALL_CUSTOMERS";
  incentiveAmount?: number; // ₹ extra incentive for drivers
  validForMinutes?: number;
  sentAt: string;
  sentBy: string;
  recipientCount: number;
}

const PROMO_STORE_KEY = "dt_promo_codes_v1";
const BROADCAST_STORE_KEY = "dt_broadcasts_v1";

export const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    id: "promo-001",
    code: "SANCHI50",
    description: "Tourist package discount — Sanchi Stupa visitors",
    discountType: "FLAT",
    discountValue: 50,
    minFare: 300,
    validFrom: "2026-10-01",
    validUntil: "2026-12-31",
    usageLimit: 500,
    usedCount: 87,
    isActive: true,
    targetCity: "Vidisha",
    createdBy: "Admin Harsh",
    createdAt: "2026-09-28",
  },
  {
    id: "promo-002",
    code: "MP40LAUNCH",
    description: "Vidisha hub launch celebration promo",
    discountType: "PERCENT",
    discountValue: 20,
    maxDiscount: 150,
    minFare: 400,
    validFrom: "2026-10-01",
    validUntil: "2026-10-31",
    usageLimit: 200,
    usedCount: 198,
    isActive: false,
    targetCity: "Vidisha",
    createdBy: "Admin Harsh",
    createdAt: "2026-09-25",
  },
  {
    id: "promo-003",
    code: "AIRPORT100",
    description: "Bhopal airport flat ₹100 off",
    discountType: "FLAT",
    discountValue: 100,
    minFare: 600,
    validFrom: "2026-10-15",
    validUntil: "2026-11-30",
    usageLimit: 300,
    usedCount: 44,
    isActive: true,
    targetCity: "Bhopal",
    createdBy: "Admin Harsh",
    createdAt: "2026-10-14",
  },
];

export const DEFAULT_BROADCASTS: PushBroadcast[] = [
  {
    id: "bc-001",
    title: "High Demand — Railway Station Vidisha",
    message: "📍 Surge demand near Vidisha Railway Station. ₹100 extra per trip incentive for next 2 hours. Rush now!",
    targetAudience: "VIDISHA_DRIVERS",
    incentiveAmount: 100,
    validForMinutes: 120,
    sentAt: "2026-10-24T08:30:00",
    sentBy: "Admin Harsh",
    recipientCount: 6,
  },
  {
    id: "bc-002",
    title: "Weekend Launch — SANCHI50 Promo Active",
    message: "🎉 New promo SANCHI50 is live! Remind customers to use this code for ₹50 off on Vidisha routes.",
    targetAudience: "ALL_CUSTOMERS",
    sentAt: "2026-10-22T10:00:00",
    sentBy: "Admin Harsh",
    recipientCount: 142,
  },
];

function readPromosFromStore(): PromoCode[] {
  if (typeof window === "undefined") return DEFAULT_PROMO_CODES;
  try {
    const raw = localStorage.getItem(PROMO_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROMO_CODES;
  } catch {
    return DEFAULT_PROMO_CODES;
  }
}

function writePromosToStore(promos: PromoCode[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROMO_STORE_KEY, JSON.stringify(promos));
}

function readBroadcastsFromStore(): PushBroadcast[] {
  if (typeof window === "undefined") return DEFAULT_BROADCASTS;
  try {
    const raw = localStorage.getItem(BROADCAST_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_BROADCASTS;
  } catch {
    return DEFAULT_BROADCASTS;
  }
}

function writeBroadcastsToStore(broadcasts: PushBroadcast[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BROADCAST_STORE_KEY, JSON.stringify(broadcasts));
}

export function getPromoCodes(): PromoCode[] {
  return readPromosFromStore();
}

export function addPromoCode(promo: Omit<PromoCode, "id" | "usedCount" | "createdAt">): PromoCode[] {
  const promos = readPromosFromStore();
  const newPromo: PromoCode = {
    ...promo,
    id: `promo-${Date.now()}`,
    usedCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updated = [...promos, newPromo];
  writePromosToStore(updated);
  return updated;
}

export function togglePromoCode(promoId: string): PromoCode[] {
  const promos = readPromosFromStore();
  const updated = promos.map((p) =>
    p.id === promoId ? { ...p, isActive: !p.isActive } : p
  );
  writePromosToStore(updated);
  return updated;
}

export function deletePromoCode(promoId: string): PromoCode[] {
  const promos = readPromosFromStore();
  const updated = promos.filter((p) => p.id !== promoId);
  writePromosToStore(updated);
  return updated;
}

export function getBroadcasts(): PushBroadcast[] {
  return readBroadcastsFromStore();
}

export function sendBroadcast(
  broadcast: Omit<PushBroadcast, "id" | "sentAt" | "sentBy" | "recipientCount">
): PushBroadcast[] {
  const broadcasts = readBroadcastsFromStore();
  const audienceCount: Record<PushBroadcast["targetAudience"], number> = {
    ALL_DRIVERS: 18,
    ONLINE_DRIVERS: 7,
    VIDISHA_DRIVERS: 9,
    BHOPAL_DRIVERS: 9,
    ALL_CUSTOMERS: 142,
  };
  const newBroadcast: PushBroadcast = {
    ...broadcast,
    id: `bc-${Date.now()}`,
    sentAt: new Date().toISOString(),
    sentBy: "Admin Harsh",
    recipientCount: audienceCount[broadcast.targetAudience] || 0,
  };
  const updated = [newBroadcast, ...broadcasts];
  writeBroadcastsToStore(updated);
  return updated;
}

export function calculateDiscount(promo: PromoCode, fareAmount: number): number {
  if (!promo.isActive) return 0;
  if (fareAmount < promo.minFare) return 0;
  const today = new Date().toISOString().split("T")[0];
  if (today < promo.validFrom || today > promo.validUntil) return 0;
  if (promo.usedCount >= promo.usageLimit) return 0;

  if (promo.discountType === "FLAT") {
    return Math.min(promo.discountValue, fareAmount);
  } else {
    const raw = (fareAmount * promo.discountValue) / 100;
    return Math.min(raw, promo.maxDiscount || raw);
  }
}
