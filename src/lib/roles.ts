import { TabKey } from "@/components/Sidebar";

export type Role = "City Attorney" | "Paralegal" | "Risk Manager";

export const personas: Record<Role, { name: string; initials: string }> = {
  "City Attorney": { name: "Andy Chang", initials: "AC" },
  Paralegal: { name: "Maria Torres", initials: "MT" },
  "Risk Manager": { name: "David Chen", initials: "DC" },
};

// Tabs each role can see. City Attorney has full access (every tab).
// Paralegal handles day-to-day intake/documents/contracts but not
// executive reporting or the compliance audit trail.
// Risk Manager is claims-centric: exposure, reporting, and audit, but
// not document triage or contract drafting.
export const roleTabAccess: Record<Role, TabKey[]> = {
  "City Attorney": ["docket", "claims", "ingestion", "contract", "reporting", "audit"],
  Paralegal: ["docket", "claims", "ingestion", "contract"],
  "Risk Manager": ["docket", "claims", "reporting", "audit"],
};
