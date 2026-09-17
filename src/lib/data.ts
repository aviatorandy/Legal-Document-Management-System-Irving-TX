export type MatterType =
  | "Tort Claim"
  | "Vendor Contract"
  | "Ordinance"
  | "Civil Action";

export type MatterStatus =
  | "Under Review"
  | "Legal Redline"
  | "Briefing"
  | "Filed"
  | "Investigation"
  | "Negotiation"
  | "Awaiting Council"
  | "Discovery"
  | "Closed - Settled";

export interface Matter {
  id: string;
  caseNumber: string;
  title: string;
  type: MatterType;
  dept: string;
  slaLabel: string;
  slaDays: number;
  slaUrgent: boolean;
  status: MatterStatus;
  exposure: number | null;
  exposureLabel: string;
  pendingCouncil: boolean;
}

export const initialMatters: Matter[] = [
  {
    id: "m1",
    caseNumber: "CLM-2026-089",
    title: "Pothole & Axle Structural Damage (MacArthur Blvd)",
    type: "Tort Claim",
    dept: "Public Works",
    slaLabel: "⚠️ 12 Days (TTCA Notice)",
    slaDays: 12,
    slaUrgent: true,
    status: "Under Review",
    exposure: 4250,
    exposureLabel: "$4,250",
    pendingCouncil: false,
  },
  {
    id: "m2",
    caseNumber: "CNT-2026-014",
    title: "Enterprise Cloud Infrastructure Master Services Agreement",
    type: "Vendor Contract",
    dept: "IT",
    slaLabel: "6 Days (Council Agenda)",
    slaDays: 6,
    slaUrgent: false,
    status: "Legal Redline",
    exposure: 480000,
    exposureLabel: "$480,000",
    pendingCouncil: true,
  },
  {
    id: "m3",
    caseNumber: "LIT-2026-042",
    title: "Commercial Zoning Setback Variance Appeal",
    type: "Civil Action",
    dept: "Planning",
    slaLabel: "19 Days (Civil Court Answer)",
    slaDays: 19,
    slaUrgent: false,
    status: "Briefing",
    exposure: null,
    exposureLabel: "Injunction Risk",
    pendingCouncil: false,
  },
  {
    id: "m4",
    caseNumber: "CLM-2026-091",
    title: "Sidewalk Trip & Fall Injury Claim (Rock Island Rd)",
    type: "Tort Claim",
    dept: "Parks & Recreation",
    slaLabel: "⚠️ 9 Days (TTCA Notice)",
    slaDays: 9,
    slaUrgent: true,
    status: "Under Review",
    exposure: 12500,
    exposureLabel: "$12,500",
    pendingCouncil: false,
  },
  {
    id: "m5",
    caseNumber: "CLM-2026-084",
    title: "Water Main Break Property Flooding Claim (Story Rd)",
    type: "Tort Claim",
    dept: "Public Works",
    slaLabel: "34 Days (TTCA Notice)",
    slaDays: 34,
    slaUrgent: false,
    status: "Investigation",
    exposure: 8900,
    exposureLabel: "$8,900",
    pendingCouncil: false,
  },
  {
    id: "m6",
    caseNumber: "CLM-2026-077",
    title: "Fleet Vehicle Collision - Third Party Damage",
    type: "Tort Claim",
    dept: "Fleet Services",
    slaLabel: "41 Days (TTCA Notice)",
    slaDays: 41,
    slaUrgent: false,
    status: "Investigation",
    exposure: 22000,
    exposureLabel: "$22,000",
    pendingCouncil: false,
  },
  {
    id: "m7",
    caseNumber: "CLM-2026-070",
    title: "Traffic Signal Malfunction Vehicle Damage Claim",
    type: "Tort Claim",
    dept: "Public Works",
    slaLabel: "28 Days (TTCA Notice)",
    slaDays: 28,
    slaUrgent: false,
    status: "Under Review",
    exposure: 5600,
    exposureLabel: "$5,600",
    pendingCouncil: false,
  },
  {
    id: "m8",
    caseNumber: "CLM-2026-063",
    title: "Municipal Pool Slip & Fall Personal Injury Claim",
    type: "Tort Claim",
    dept: "Parks & Recreation",
    slaLabel: "45 Days (TTCA Notice)",
    slaDays: 45,
    slaUrgent: false,
    status: "Closed - Settled",
    exposure: 15750,
    exposureLabel: "$15,750",
    pendingCouncil: false,
  },
  {
    id: "m9",
    caseNumber: "CLM-2026-058",
    title: "Storm Debris Property Damage Claim (Delaware Creek)",
    type: "Tort Claim",
    dept: "Public Works",
    slaLabel: "52 Days (TTCA Notice)",
    slaDays: 52,
    slaUrgent: false,
    status: "Investigation",
    exposure: 9800,
    exposureLabel: "$9,800",
    pendingCouncil: false,
  },
  {
    id: "m10",
    caseNumber: "CNT-2026-011",
    title: "Public Safety Records Management Software License",
    type: "Vendor Contract",
    dept: "Police",
    slaLabel: "17 Days (Council Agenda)",
    slaDays: 17,
    slaUrgent: false,
    status: "Awaiting Council",
    exposure: 210000,
    exposureLabel: "$210,000",
    pendingCouncil: true,
  },
  {
    id: "m11",
    caseNumber: "CNT-2026-009",
    title: "Municipal Fleet Maintenance Services Agreement",
    type: "Vendor Contract",
    dept: "Fleet Services",
    slaLabel: "23 Days (Council Agenda)",
    slaDays: 23,
    slaUrgent: false,
    status: "Negotiation",
    exposure: 65000,
    exposureLabel: "$65,000",
    pendingCouncil: false,
  },
  {
    id: "m12",
    caseNumber: "CNT-2026-006",
    title: "Parks Landscaping & Irrigation Maintenance Contract",
    type: "Vendor Contract",
    dept: "Parks & Recreation",
    slaLabel: "31 Days (Council Agenda)",
    slaDays: 31,
    slaUrgent: false,
    status: "Legal Redline",
    exposure: 38500,
    exposureLabel: "$38,500",
    pendingCouncil: false,
  },
  {
    id: "m13",
    caseNumber: "CNT-2026-003",
    title: "Body-Worn Camera & Digital Evidence Platform Agreement",
    type: "Vendor Contract",
    dept: "Police",
    slaLabel: "14 Days (Council Agenda)",
    slaDays: 14,
    slaUrgent: false,
    status: "Awaiting Council",
    exposure: 120000,
    exposureLabel: "$120,000",
    pendingCouncil: true,
  },
  {
    id: "m14",
    caseNumber: "CNT-2025-098",
    title: "Downtown Streetscape Design-Build Contract",
    type: "Vendor Contract",
    dept: "Planning",
    slaLabel: "27 Days (Council Agenda)",
    slaDays: 27,
    slaUrgent: false,
    status: "Awaiting Council",
    exposure: 95000,
    exposureLabel: "$95,000",
    pendingCouncil: true,
  },
  {
    id: "m15",
    caseNumber: "ORD-2026-021",
    title: "Repeat Short-Term Rental Ordinance Violation (Citation Appeal)",
    type: "Ordinance",
    dept: "Code Compliance",
    slaLabel: "20 Days (Municipal Court)",
    slaDays: 20,
    slaUrgent: false,
    status: "Filed",
    exposure: 2500,
    exposureLabel: "$2,500",
    pendingCouncil: false,
  },
  {
    id: "m16",
    caseNumber: "ORD-2026-018",
    title: "Commercial Signage Code Violation Enforcement",
    type: "Ordinance",
    dept: "Code Compliance",
    slaLabel: "38 Days (Municipal Court)",
    slaDays: 38,
    slaUrgent: false,
    status: "Investigation",
    exposure: 1800,
    exposureLabel: "$1,800",
    pendingCouncil: false,
  },
  {
    id: "m17",
    caseNumber: "ORD-2026-015",
    title: "Illegal Dumping Nuisance Abatement Citation",
    type: "Ordinance",
    dept: "Code Compliance",
    slaLabel: "44 Days (Municipal Court)",
    slaDays: 44,
    slaUrgent: false,
    status: "Filed",
    exposure: 3200,
    exposureLabel: "$3,200",
    pendingCouncil: false,
  },
  {
    id: "m18",
    caseNumber: "LIT-2026-036",
    title: "Inverse Condemnation Claim - Drainage Easement Dispute",
    type: "Civil Action",
    dept: "Public Works",
    slaLabel: "61 Days (Civil Court Answer)",
    slaDays: 61,
    slaUrgent: false,
    status: "Discovery",
    exposure: 329700,
    exposureLabel: "$329,700",
    pendingCouncil: false,
  },
];

export type FilterKey = "All" | MatterType;

export const filterPills: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All Matters" },
  { key: "Tort Claim", label: "Tort Claims" },
  { key: "Vendor Contract", label: "Vendor Contracts" },
  { key: "Ordinance", label: "Ordinances" },
  { key: "Civil Action", label: "Civil Actions" },
];

export interface IngestedDoc {
  id: string;
  fileName: string;
  docType: string;
  tags: { label: string; tone: "neutral" | "warning" | "success" }[];
  status: string;
  progress: number;
}

export const initialDocs: IngestedDoc[] = [
  {
    id: "d1",
    fileName: "Citizen_Damage_Notice.pdf",
    docType: "Tort Claim Notice",
    tags: [
      { label: "TTCA § 101", tone: "neutral" },
      { label: "Incident: 08/28/2026", tone: "neutral" },
      { label: "Claim: $4,250.00", tone: "neutral" },
    ],
    status: "Indexed",
    progress: 100,
  },
  {
    id: "d2",
    fileName: "Irving_PD_Incident_Report_902.pdf",
    docType: "Police Incident Report",
    tags: [
      { label: "⚠️ Juvenile PII Detected", tone: "warning" },
      { label: "Redaction Suggested", tone: "warning" },
    ],
    status: "Action Required",
    progress: 100,
  },
  {
    id: "d3",
    fileName: "Precision_Collision_Repair_Quote.pdf",
    docType: "Financial Estimate",
    tags: [
      { label: "Amount: $4,250.00", tone: "neutral" },
      { label: "Line Items Verified", tone: "success" },
    ],
    status: "Matched",
    progress: 100,
  },
  {
    id: "d4",
    fileName: "BeltLine_MacArthur_Pothole.jpg",
    docType: "Photographic Evidence",
    tags: [
      { label: "Geo-Tagged: MacArthur Blvd", tone: "neutral" },
      { label: "Roadway Defect Confirmed", tone: "success" },
    ],
    status: "Linked",
    progress: 100,
  },
];

export const departments = [
  "Public Works",
  "Information Technology",
  "Police",
  "Planning & Zoning",
  "Parks & Recreation",
  "Citizen Direct",
];

export const matterCategories = [
  "Tort Claim / Property Damage",
  "Vendor Agreement / Contract",
  "Municipal Ordinance Violation",
  "Civil Lawsuit",
];

export function categoryToType(category: string): MatterType {
  if (category.startsWith("Tort")) return "Tort Claim";
  if (category.startsWith("Vendor")) return "Vendor Contract";
  if (category.startsWith("Municipal")) return "Ordinance";
  return "Civil Action";
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
