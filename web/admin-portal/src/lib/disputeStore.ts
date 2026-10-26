"use client";

export type DisputeCategory =
  | "DRIVER_LATE"
  | "ROUTE_DEVIATION"
  | "RASH_DRIVING"
  | "OVERCHARGED"
  | "DRIVER_BEHAVIOUR"
  | "CAR_CONDITION"
  | "LOST_ITEM"
  | "OTHER";

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "RESOLVED_REFUND"
  | "RESOLVED_CREDIT"
  | "RESOLVED_NO_ACTION"
  | "ESCALATED";

export type RefundMethod = "UPI" | "CARD" | "WALLET_CREDIT";

export interface GrievanceTicket {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehiclePlate: string;
  tripRoute: string;
  originalFare: number;
  category: DisputeCategory;
  description: string;
  status: DisputeStatus;
  raisedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  refundAmount?: number;
  refundMethod?: RefundMethod;
  refundTransactionId?: string;
  creditAmount?: number;
  adminNotes?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface LostItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  driverName: string;
  driverPhone: string;
  itemDescription: string;
  reportedAt: string;
  status: "REPORTED" | "DRIVER_CONFIRMED" | "RETURNED" | "NOT_FOUND";
  returnedAt?: string;
  adminNotes?: string;
}

const DISPUTE_STORE_KEY = "dt_disputes_v1";
const LOST_ITEMS_KEY = "dt_lost_items_v1";

export const DEFAULT_DISPUTES: GrievanceTicket[] = [
  {
    id: "TKT-2026-001",
    bookingCode: "DT-928103",
    customerName: "Harshvardhan",
    customerPhone: "+91 98450 12345",
    driverName: "Rajesh Sharma",
    driverPhone: "+91 99801 84920",
    vehicleModel: "Toyota Fortuner 4x4",
    vehiclePlate: "MP-40-CA-4921",
    tripRoute: "Vidisha Station → Collectorate",
    originalFare: 450,
    category: "DRIVER_LATE",
    description: "Driver arrived 22 minutes late for airport pickup. I nearly missed my train.",
    status: "UNDER_REVIEW",
    raisedAt: "2026-10-23T08:45:00",
    priority: "HIGH",
  },
  {
    id: "TKT-2026-002",
    bookingCode: "DT-910221",
    customerName: "Priya Sharma",
    customerPhone: "+91 99801 77332",
    driverName: "Mukesh Patel",
    driverPhone: "+91 98451 22340",
    vehicleModel: "Hyundai Creta SX(O)",
    vehiclePlate: "MP-04-AB-1290",
    tripRoute: "Arera Colony → Raja Bhoj Airport",
    originalFare: 980,
    category: "OVERCHARGED",
    description: "Driver demanded extra ₹150 for toll claiming highway charges not pre-included.",
    status: "RESOLVED_REFUND",
    raisedAt: "2026-10-20T14:10:00",
    resolvedAt: "2026-10-21T11:30:00",
    resolvedBy: "Admin Harsh",
    refundAmount: 150,
    refundMethod: "UPI",
    refundTransactionId: "UPI-TXN-8821001",
    adminNotes: "Driver warned; toll policy communicated to driver fleet.",
    priority: "MEDIUM",
  },
  {
    id: "TKT-2026-003",
    bookingCode: "DT-899410",
    customerName: "Rajesh Chouhan",
    customerPhone: "+91 97412 88901",
    driverName: "Sunil Yadav",
    driverPhone: "+91 94770 33210",
    vehicleModel: "Mahindra Scorpio-N",
    vehiclePlate: "MP-40-MB-7788",
    tripRoute: "Durga Nagar → Sagar Road",
    originalFare: 320,
    category: "RASH_DRIVING",
    description: "Speed exceeded 90 km/h inside city. Family was very scared. Complained of reckless overtaking.",
    status: "ESCALATED",
    raisedAt: "2026-10-18T19:30:00",
    priority: "HIGH",
    adminNotes: "Telematics report pulled. Driver speed data under review.",
  },
  {
    id: "TKT-2026-004",
    bookingCode: "DT-881203",
    customerName: "Anjali Mishra",
    customerPhone: "+91 88001 55221",
    driverName: "Ramesh Gupta",
    driverPhone: "+91 90099 44810",
    vehicleModel: "Honda City ZX CVT",
    vehiclePlate: "MP-04-ZX-5521",
    tripRoute: "MP Nagar Zone-1 → Habibganj",
    originalFare: 560,
    category: "LOST_ITEM",
    description: "Left iPhone 15 Pro Max in back seat during night trip on 17 Oct.",
    status: "OPEN",
    raisedAt: "2026-10-17T22:45:00",
    priority: "HIGH",
  },
];

export const DEFAULT_LOST_ITEMS: LostItem[] = [
  {
    id: "LOST-001",
    bookingCode: "DT-881203",
    customerName: "Anjali Mishra",
    customerPhone: "+91 88001 55221",
    driverName: "Ramesh Gupta",
    driverPhone: "+91 90099 44810",
    itemDescription: "iPhone 15 Pro Max (Black Titanium) with red leather case. Lock screen photo is a golden retriever.",
    reportedAt: "2026-10-17T22:50:00",
    status: "DRIVER_CONFIRMED",
    adminNotes: "Driver confirmed item found. Arranged return pickup from driver home in Kolar.",
  },
  {
    id: "LOST-002",
    bookingCode: "DT-872990",
    customerName: "Col. Sanjeev Nair",
    customerPhone: "+91 98261 44552",
    driverName: "Rajesh Sharma",
    driverPhone: "+91 99801 84920",
    itemDescription: "Brown leather briefcase (Samsonite) with documents and laptop.",
    reportedAt: "2026-10-14T16:20:00",
    status: "RETURNED",
    returnedAt: "2026-10-15T10:00:00",
    adminNotes: "Item returned by driver at customer's office address.",
  },
];

function readDisputesFromStore(): GrievanceTicket[] {
  if (typeof window === "undefined") return DEFAULT_DISPUTES;
  try {
    const raw = localStorage.getItem(DISPUTE_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DISPUTES;
  } catch {
    return DEFAULT_DISPUTES;
  }
}

function writeDisputesToStore(disputes: GrievanceTicket[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISPUTE_STORE_KEY, JSON.stringify(disputes));
}

function readLostItemsFromStore(): LostItem[] {
  if (typeof window === "undefined") return DEFAULT_LOST_ITEMS;
  try {
    const raw = localStorage.getItem(LOST_ITEMS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_LOST_ITEMS;
  } catch {
    return DEFAULT_LOST_ITEMS;
  }
}

function writeLostItemsToStore(items: LostItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOST_ITEMS_KEY, JSON.stringify(items));
}

export function getDisputes(): GrievanceTicket[] {
  return readDisputesFromStore();
}

export function resolveDisputeWithRefund(
  ticketId: string,
  refundAmount: number,
  refundMethod: RefundMethod,
  adminNotes: string,
  resolvedBy: string
): GrievanceTicket[] {
  const disputes = readDisputesFromStore();
  const updated = disputes.map((d) =>
    d.id === ticketId
      ? {
          ...d,
          status: "RESOLVED_REFUND" as DisputeStatus,
          resolvedAt: new Date().toISOString(),
          resolvedBy,
          refundAmount,
          refundMethod,
          refundTransactionId: `UPI-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          adminNotes,
        }
      : d
  );
  writeDisputesToStore(updated);
  return updated;
}

export function resolveDisputeWithCredit(
  ticketId: string,
  creditAmount: number,
  adminNotes: string,
  resolvedBy: string
): GrievanceTicket[] {
  const disputes = readDisputesFromStore();
  const updated = disputes.map((d) =>
    d.id === ticketId
      ? {
          ...d,
          status: "RESOLVED_CREDIT" as DisputeStatus,
          resolvedAt: new Date().toISOString(),
          resolvedBy,
          creditAmount,
          adminNotes,
        }
      : d
  );
  writeDisputesToStore(updated);
  return updated;
}

export function resolveDisputeNoAction(
  ticketId: string,
  adminNotes: string,
  resolvedBy: string
): GrievanceTicket[] {
  const disputes = readDisputesFromStore();
  const updated = disputes.map((d) =>
    d.id === ticketId
      ? {
          ...d,
          status: "RESOLVED_NO_ACTION" as DisputeStatus,
          resolvedAt: new Date().toISOString(),
          resolvedBy,
          adminNotes,
        }
      : d
  );
  writeDisputesToStore(updated);
  return updated;
}

export function escalateDispute(ticketId: string): GrievanceTicket[] {
  const disputes = readDisputesFromStore();
  const updated = disputes.map((d) =>
    d.id === ticketId ? { ...d, status: "ESCALATED" as DisputeStatus, priority: "HIGH" as const } : d
  );
  writeDisputesToStore(updated);
  return updated;
}

export function getLostItems(): LostItem[] {
  return readLostItemsFromStore();
}

export function updateLostItemStatus(
  itemId: string,
  status: LostItem["status"]
): LostItem[] {
  const items = readLostItemsFromStore();
  const updated = items.map((i) =>
    i.id === itemId
      ? { ...i, status, ...(status === "RETURNED" ? { returnedAt: new Date().toISOString() } : {}) }
      : i
  );
  writeLostItemsToStore(updated);
  return updated;
}

export const DISPUTE_CATEGORY_LABELS: Record<DisputeCategory, string> = {
  DRIVER_LATE: "Driver Late / No-Show",
  ROUTE_DEVIATION: "Route Deviation",
  RASH_DRIVING: "Rash / Unsafe Driving",
  OVERCHARGED: "Overcharged / Fare Dispute",
  DRIVER_BEHAVIOUR: "Driver Behaviour",
  CAR_CONDITION: "Vehicle Condition",
  LOST_ITEM: "Lost Item",
  OTHER: "Other",
};
