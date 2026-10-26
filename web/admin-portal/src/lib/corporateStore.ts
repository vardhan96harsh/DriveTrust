"use client";

export interface CorporateAccount {
  id: string;
  companyName: string;
  brandName?: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  city: string;
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  monthlyCreditLimit: number;
  currentCycleUsage: number;
  billingCycle: "1ST_OF_MONTH" | "15TH_OF_MONTH";
  paymentTermsDays: number; // e.g. 15 or 30 days
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED_OVERDUE";
  authorizedEmployeesCount: number;
  contractStartDate: string;
  contractEndDate: string;
  sacCode: "9966"; // Rental of transport vehicles with chauffeur
}

export interface CorporateInvoice {
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  billingPeriod: string;
  invoiceDate: string;
  dueDate: string;
  totalTrips: number;
  baseAmount: number;
  cgst: number; // 2.5% or 0%
  sgst: number; // 2.5% or 0%
  igst: number; // 5% or 0%
  totalAmount: number;
  status: "PAID" | "UNPAID" | "OVERDUE";
  sacCode: "9966";
}

export const DEFAULT_CORPORATE_ACCOUNTS: CorporateAccount[] = [
  {
    id: "CORP-001",
    companyName: "Sanchi Heritage Luxury Resorts & Hotels Pvt Ltd",
    brandName: "The Gateway Resort Sanchi",
    gstin: "23AABCS1429F1Z4",
    pan: "AABCS1429F",
    billingAddress: "Sanchi Hilltop Gate, Vidisha-Bhopal Highway, MP - 464661",
    city: "Vidisha / Sanchi",
    primaryContactName: "Vikramaditya Rathore (General Manager)",
    primaryContactPhone: "+91 94250 11990",
    primaryContactEmail: "gm@sanchiresorts.com",
    monthlyCreditLimit: 150000,
    currentCycleUsage: 64200,
    billingCycle: "1ST_OF_MONTH",
    paymentTermsDays: 30,
    status: "ACTIVE",
    authorizedEmployeesCount: 12,
    contractStartDate: "2026-01-01",
    contractEndDate: "2026-12-31",
    sacCode: "9966",
  },
  {
    id: "CORP-002",
    companyName: "Bhopal Prestige Auto Motors (Authorized Luxury Showroom)",
    brandName: "Prestige Mercedes & Audi Bhopal",
    gstin: "23AAACB9921B1ZM",
    pan: "AAACB9921B",
    billingAddress: "Hoshangabad Road, Near Misrod, Bhopal, MP - 462026",
    city: "Bhopal",
    primaryContactName: "Sunil Mathur (Service Director)",
    primaryContactPhone: "+91 98260 77312",
    primaryContactEmail: "sunil.service@prestigemotors.in",
    monthlyCreditLimit: 200000,
    currentCycleUsage: 118400,
    billingCycle: "1ST_OF_MONTH",
    paymentTermsDays: 15,
    status: "ACTIVE",
    authorizedEmployeesCount: 24,
    contractStartDate: "2026-03-01",
    contractEndDate: "2027-02-28",
    sacCode: "9966",
  },
  {
    id: "CORP-003",
    companyName: "Vidisha Agro Infrastructure Corporation Ltd",
    brandName: "Vidisha Agro",
    gstin: "23AABCV5501A1Z9",
    pan: "AABCV5501A",
    billingAddress: "Industrial Area, Ahmedpur Road, Vidisha, MP - 464001",
    city: "Vidisha",
    primaryContactName: "Rameshwar Patidar (Director Operations)",
    primaryContactPhone: "+91 98930 44882",
    primaryContactEmail: "ops@vidishaagro.com",
    monthlyCreditLimit: 75000,
    currentCycleUsage: 22800,
    billingCycle: "15TH_OF_MONTH",
    paymentTermsDays: 15,
    status: "ACTIVE",
    authorizedEmployeesCount: 6,
    contractStartDate: "2026-06-01",
    contractEndDate: "2027-05-31",
    sacCode: "9966",
  },
];

export const DEFAULT_CORPORATE_INVOICES: CorporateInvoice[] = [
  {
    invoiceNumber: "INV-2026-B2B-001",
    companyId: "CORP-001",
    companyName: "Sanchi Heritage Luxury Resorts",
    billingPeriod: "September 2026",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-31",
    totalTrips: 42,
    baseAmount: 58000,
    cgst: 1450,
    sgst: 1450,
    igst: 0,
    totalAmount: 60900,
    status: "PAID",
    sacCode: "9966",
  },
  {
    invoiceNumber: "INV-2026-B2B-002",
    companyId: "CORP-002",
    companyName: "Bhopal Prestige Auto Motors",
    billingPeriod: "September 2026",
    invoiceDate: "2026-10-01",
    dueDate: "2026-10-15",
    totalTrips: 76,
    baseAmount: 112000,
    cgst: 2800,
    sgst: 2800,
    igst: 0,
    totalAmount: 117600,
    status: "PAID",
    sacCode: "9966",
  },
];

const CORP_STORE_KEY = "dt_corporate_accounts_v1";

function readAccounts(): CorporateAccount[] {
  if (typeof window === "undefined") return DEFAULT_CORPORATE_ACCOUNTS;
  try {
    const raw = localStorage.getItem(CORP_STORE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CORPORATE_ACCOUNTS;
  } catch {
    return DEFAULT_CORPORATE_ACCOUNTS;
  }
}

function writeAccounts(accounts: CorporateAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CORP_STORE_KEY, JSON.stringify(accounts));
}

export function getCorporateAccounts(): CorporateAccount[] {
  return readAccounts();
}

export function getCorporateInvoices(): CorporateInvoice[] {
  return DEFAULT_CORPORATE_INVOICES;
}

export function addCorporateAccount(account: Omit<CorporateAccount, "id" | "currentCycleUsage">): CorporateAccount[] {
  const accounts = readAccounts();
  const newAccount: CorporateAccount = {
    ...account,
    id: `CORP-00${accounts.length + 1}`,
    currentCycleUsage: 0,
  };
  const updated = [...accounts, newAccount];
  writeAccounts(updated);
  return updated;
}
