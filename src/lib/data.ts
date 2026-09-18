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
  targetDate: string; // ISO date the statutory/administrative deadline falls on
  deadlineType: string; // e.g. "TTCA Notice", "Council Agenda", "Civil Court Answer"
  status: MatterStatus;
  exposure: number | null;
  exposureLabel: string;
  pendingCouncil: boolean;
}

export const TODAY = new Date("2026-09-17T00:00:00Z");

export interface DeadlineStatus {
  daysRemaining: number;
  urgent: boolean;
  overdue: boolean;
  label: string;
}

export function getDeadlineStatus(matter: Pick<Matter, "targetDate" | "deadlineType">): DeadlineStatus {
  const target = new Date(matter.targetDate + "T00:00:00Z");
  const daysRemaining = Math.round((target.getTime() - TODAY.getTime()) / 86400000);
  const overdue = daysRemaining < 0;
  const urgent = !overdue && daysRemaining < 15;
  const label = overdue
    ? `⚠️ OVERDUE by ${Math.abs(daysRemaining)} Days (${matter.deadlineType})`
    : urgent
    ? `⚠️ ${daysRemaining} Days (${matter.deadlineType})`
    : `${daysRemaining} Days (${matter.deadlineType})`;
  return { daysRemaining, urgent, overdue, label };
}

export const initialMatters: Matter[] = [
  {
    id: "m1",
    caseNumber: "CLM-2026-089",
    title: "Pothole & Axle Structural Damage (MacArthur Blvd)",
    type: "Tort Claim",
    dept: "Public Works",
    targetDate: "2026-09-29",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-09-23",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-06",
    deadlineType: "Civil Court Answer",
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
    targetDate: "2026-09-26",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-10-21",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-10-28",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-10-15",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-11-01",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-11-08",
    deadlineType: "TTCA Notice",
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
    targetDate: "2026-10-04",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-10",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-18",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-01",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-14",
    deadlineType: "Council Agenda",
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
    targetDate: "2026-10-07",
    deadlineType: "Municipal Court",
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
    targetDate: "2026-10-25",
    deadlineType: "Municipal Court",
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
    targetDate: "2026-10-31",
    deadlineType: "Municipal Court",
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
    targetDate: "2026-11-17",
    deadlineType: "Civil Court Answer",
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

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO datetime
  user: string;
  action: string;
  targetEntity: string;
}

export const initialAuditLog: AuditLogEntry[] = [
  {
    id: "a1",
    timestamp: "2026-09-15T09:12:00Z",
    user: "Andy Chang",
    action: "Created matter",
    targetEntity: "CLM-2026-089",
  },
  {
    id: "a2",
    timestamp: "2026-09-16T14:03:00Z",
    user: "Andy Chang",
    action: "Uploaded document bundle (4 files)",
    targetEntity: "CLM-2026-089",
  },
  {
    id: "a3",
    timestamp: "2026-09-17T10:47:00Z",
    user: "Andy Chang",
    action: "Opened contract redline",
    targetEntity: "CNT-2026-014",
  },
];

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
