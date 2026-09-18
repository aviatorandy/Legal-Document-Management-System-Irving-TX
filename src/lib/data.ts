export type MatterType = "Vendor Contract" | "Ordinance" | "Civil Action";

export type MatterStatus =
  | "Under Review"
  | "Legal Redline"
  | "Briefing"
  | "Filed"
  | "Investigation"
  | "Negotiation"
  | "Awaiting Council"
  | "Discovery"
  | "Closed - Settled"
  | "Executed"
  | "Closed - Compliant";

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
  linkedClaimId?: string; // set when this matter was escalated from a Claim
  renewalAlertSet?: boolean;
}

export type ClaimStatus =
  | "Notice Filed"
  | "Under Review"
  | "Investigation"
  | "Denied"
  | "Settled"
  | "Converted to Litigation";

export interface Claim {
  id: string;
  claimNumber: string;
  title: string;
  incidentDate: string; // ISO date
  incidentLocation: string;
  dept: string;
  claimantName: string;
  initialDemand: number;
  status: ClaimStatus;
  linkedMatterId?: string; // set once converted to litigation
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
  const overdueDays = Math.abs(daysRemaining);
  const dayWord = (n: number) => (n === 1 ? "Day" : "Days");
  const label = overdue
    ? `⚠️ OVERDUE by ${overdueDays} ${dayWord(overdueDays)} (${matter.deadlineType})`
    : urgent
    ? `⚠️ ${daysRemaining} ${dayWord(daysRemaining)} (${matter.deadlineType})`
    : `${daysRemaining} ${dayWord(daysRemaining)} (${matter.deadlineType})`;
  return { daysRemaining, urgent, overdue, label };
}

export const initialClaims: Claim[] = [
  {
    id: "c1",
    claimNumber: "CLM-2026-089",
    title: "Pothole & Axle Structural Damage (MacArthur Blvd)",
    incidentDate: "2026-08-28",
    incidentLocation: "MacArthur Blvd",
    dept: "Public Works",
    claimantName: "Marcus Whitfield",
    initialDemand: 4250,
    status: "Under Review",
  },
  {
    id: "c2",
    claimNumber: "CLM-2026-091",
    title: "Sidewalk Trip & Fall Injury Claim (Rock Island Rd)",
    incidentDate: "2026-09-02",
    incidentLocation: "Rock Island Rd",
    dept: "Parks & Recreation",
    claimantName: "Della Ramirez",
    initialDemand: 12500,
    status: "Under Review",
  },
  {
    id: "c3",
    claimNumber: "CLM-2026-084",
    title: "Water Main Break Property Flooding Claim (Story Rd)",
    incidentDate: "2026-08-15",
    incidentLocation: "Story Rd",
    dept: "Public Works",
    claimantName: "Harold Beckett",
    initialDemand: 8900,
    status: "Investigation",
  },
  {
    id: "c4",
    claimNumber: "CLM-2026-077",
    title: "Fleet Vehicle Collision - Third Party Damage",
    incidentDate: "2026-08-05",
    incidentLocation: "Story Rd & O'Connor Rd",
    dept: "Fleet Services",
    claimantName: "Priya Nandakumar",
    initialDemand: 22000,
    status: "Investigation",
  },
  {
    id: "c5",
    claimNumber: "CLM-2026-070",
    title: "Traffic Signal Malfunction Vehicle Damage Claim",
    incidentDate: "2026-07-30",
    incidentLocation: "Belt Line Rd & Rochelle Blvd",
    dept: "Public Works",
    claimantName: "Alan Foster",
    initialDemand: 5600,
    status: "Under Review",
  },
  {
    id: "c6",
    claimNumber: "CLM-2026-063",
    title: "Municipal Pool Slip & Fall Personal Injury Claim",
    incidentDate: "2026-07-18",
    incidentLocation: "Georgia Farrow Recreation Center",
    dept: "Parks & Recreation",
    claimantName: "Renee Castillo",
    initialDemand: 15750,
    status: "Settled",
  },
  {
    id: "c7",
    claimNumber: "CLM-2026-058",
    title: "Storm Debris Property Damage Claim (Delaware Creek)",
    incidentDate: "2026-07-10",
    incidentLocation: "Delaware Creek",
    dept: "Public Works",
    claimantName: "Yusuf Okafor",
    initialDemand: 9800,
    status: "Investigation",
  },
];

export const initialMatters: Matter[] = [
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
    status: "Discovery",
    exposure: 45000,
    exposureLabel: "$45,000",
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
    status: "Awaiting Council",
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
  claimId?: string;
  matterId?: string;
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
    claimId: "c1",
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
    claimId: "c1",
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
    claimId: "c1",
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
    claimId: "c1",
  },
  {
    id: "d5",
    fileName: "Citation_Notice_STR.pdf",
    docType: "Code Compliance Citation",
    tags: [
      { label: "Repeat Violation", tone: "warning" },
      { label: "Municipal Court", tone: "neutral" },
    ],
    status: "Indexed",
    progress: 100,
    matterId: "m15",
  },
  {
    id: "d6",
    fileName: "Field_Inspection_Photos.pdf",
    docType: "Photographic Evidence",
    tags: [{ label: "Site: Short-Term Rental Property", tone: "neutral" }],
    status: "Linked",
    progress: 100,
    matterId: "m15",
  },
  {
    id: "d7",
    fileName: "Officer_Field_Notice_Abatement.pdf",
    docType: "Code Compliance Notice",
    tags: [{ label: "Nuisance Abatement", tone: "neutral" }],
    status: "Indexed",
    progress: 100,
    matterId: "m17",
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

export function isClaimCategory(category: string): boolean {
  return category.startsWith("Tort");
}

export function categoryToType(category: string): MatterType {
  if (category.startsWith("Vendor")) return "Vendor Contract";
  if (category.startsWith("Municipal")) return "Ordinance";
  return "Civil Action";
}

export function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
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
    action: "Created claim",
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
  {
    id: "a4",
    timestamp: "2026-09-14T16:20:00Z",
    user: "Officer R. Ramirez",
    action: "Citation issued",
    targetEntity: "ORD-2026-021",
  },
  {
    id: "a5",
    timestamp: "2026-09-12T11:05:00Z",
    user: "Field Officer",
    action: "Citation served to property owner",
    targetEntity: "ORD-2026-015",
  },
];

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
