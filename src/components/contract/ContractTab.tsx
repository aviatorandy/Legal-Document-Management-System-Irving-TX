"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Cloud,
  FileSignature,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

type SectionStatus = "flagged" | "resolved";

interface ClauseState {
  section4: SectionStatus;
  section9: SectionStatus;
  section12: SectionStatus;
}

export function ContractTab({
  onNotify,
}: {
  onNotify: (title: string, description?: string) => void;
}) {
  const [clauses, setClauses] = useState<ClauseState>({
    section4: "flagged",
    section9: "flagged",
    section12: "flagged",
  });
  const [packageModalOpen, setPackageModalOpen] = useState(false);

  const resolvedCount = Object.values(clauses).filter(
    (s) => s === "resolved"
  ).length;

  function resolve(key: keyof ClauseState, toastTitle: string) {
    setClauses((prev) => ({ ...prev, [key]: "resolved" }));
    onNotify(toastTitle, "Contract clause updated in working draft.");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Reviewing: IT Cloud Infrastructure Agreement
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Vendor: SkyScale GovCloud Inc. &nbsp;|&nbsp; Value:{" "}
            <span className="font-semibold text-slate-700">$480,000</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={resolvedCount === 3 ? "green" : "amber"}>
            {resolvedCount} / 3 Compliance Flags Resolved
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
        {/* Left panel: document preview */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="h-3 w-3 rounded-full bg-[#0078D4]" />
            <span className="text-xs font-medium text-slate-500">
              Word Online — Enterprise_Cloud_MSA_v1.docx
            </span>
          </div>
          <div className="px-8 py-8 font-serif text-[15px] leading-relaxed text-slate-800 max-h-[640px] overflow-y-auto">
            <h3 className="text-center font-semibold text-base mb-8 tracking-wide">
              ENTERPRISE CLOUD INFRASTRUCTURE
              <br />
              MASTER SERVICES AGREEMENT
            </h3>

            <p className="font-semibold mb-2">
              SECTION 4 — INDEMNIFICATION
            </p>
            <p className="mb-2 text-slate-700">
              Vendor shall indemnify, defend, and hold harmless the City of
              Irving from any claims, damages, or liabilities arising from
              Vendor&apos;s performance under this Agreement, subject to an
              aggregate indemnification cap of{" "}
              <span
                className={cn(
                  "font-semibold",
                  clauses.section4 === "resolved"
                    ? "text-emerald-700"
                    : "text-slate-900"
                )}
              >
                {clauses.section4 === "resolved" ? "$250,000" : "$2,000,000"}
              </span>
              {" "}per occurrence.
            </p>
            <CalloutBox
              tone={clauses.section4 === "resolved" ? "resolved" : "amber"}
            >
              {clauses.section4 === "resolved"
                ? "RESOLVED: Indemnification cap aligned to Texas Municipal Tort Claims Act statutory limit of $250,000."
                : "FLAG: Vendor Indemnification Cap ($2,000,000) Exceeds Texas Municipal Tort Claims Act Statutory Limit of $250,000."}
            </CalloutBox>

            <p className="font-semibold mt-6 mb-2">
              SECTION 9 — STATUTORY MANDATES
            </p>
            <p className="mb-2 text-slate-700">
              {clauses.section9 === "resolved"
                ? "Vendor certifies, in accordance with Tex. Gov. Code § 2271, that it does not boycott Israel and will not boycott Israel during the term of this Agreement, and further certifies compliance with Tex. Gov. Code § 2274 regarding firearm entity and firearm trade association verification."
                : "Vendor shall comply with all applicable federal, state, and local laws in the performance of this Agreement."}
            </p>
            <CalloutBox
              tone={clauses.section9 === "resolved" ? "resolved" : "red"}
            >
              {clauses.section9 === "resolved"
                ? "RESOLVED: Tex. Gov. Code § 2271 anti-boycott / firearm entity verification clause injected."
                : "FLAG: Missing Texas Government Code § 2271 Anti-Boycott / Firearm Entity Verification."}
            </CalloutBox>

            <p className="font-semibold mt-6 mb-2">
              SECTION 12 — FUNDING &amp; TERM
            </p>
            <p className="mb-2 text-slate-700">
              {clauses.section12 === "resolved"
                ? "This Agreement is subject to annual appropriation by the Irving City Council. In the event sufficient funds are not appropriated for any fiscal year, the City may terminate this Agreement without penalty upon 30 days written notice to Vendor, in accordance with standard City of Irving municipal non-appropriation provisions."
                : "This Agreement shall remain in effect for a term of five (5) years from the Effective Date, renewable upon mutual written consent."}
            </p>
            <CalloutBox
              tone={clauses.section12 === "resolved" ? "resolved" : "amber"}
            >
              {clauses.section12 === "resolved"
                ? "RESOLVED: Municipal non-appropriation clause added per City of Irving standard funding provisions."
                : "FLAG: Missing Mandatory Texas Municipal Non-Appropriation Clause."}
            </CalloutBox>
          </div>
        </div>

        {/* Right panel: compliance inspector */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-[#0b2340]" />
              <h3 className="text-sm font-semibold text-slate-900">
                Concourse AI Compliance Inspector
              </h3>
            </div>

            <InspectorItem
              title="Indemnification Cap Exceeds TMTCA Limit"
              citation="Tex. Civ. Prac. & Rem. Code § 101.023"
              rationale="Municipal liability under the Texas Tort Claims Act is capped at $250,000 per person / $250,000 per occurrence for property damage. A vendor indemnification cap above this limit creates unenforceable, misleading contractual exposure."
              resolved={clauses.section4 === "resolved"}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve("section4", "Texas statutory cap applied")
                  }
                  disabled={clauses.section4 === "resolved"}
                >
                  Apply Texas Statutory Cap ($250k)
                </Button>
              }
            />
            <InspectorItem
              title="Missing Anti-Boycott / Firearm Entity Verification"
              citation="Tex. Gov. Code § 2271"
              rationale="Contracts with a value of $100,000 or more require a written verification that the vendor does not boycott Israel and is not a firearm entity/trade association subject to discrimination, before the City may enter into the agreement."
              resolved={clauses.section9 === "resolved"}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve("section9", "§ 2271 verification clause injected")
                  }
                  disabled={clauses.section9 === "resolved"}
                >
                  Inject Tex. Gov Code § 2271 Clause
                </Button>
              }
            />
            <InspectorItem
              title="Missing Non-Appropriation Clause"
              citation="Tex. Local Gov't Code § 271.903"
              rationale="Multi-year municipal contracts must include a non-appropriation clause allowing termination without penalty if City Council does not appropriate funds in a subsequent fiscal year."
              resolved={clauses.section12 === "resolved"}
              last
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    resolve(
                      "section12",
                      "Non-appropriation clause injected"
                    )
                  }
                  disabled={clauses.section12 === "resolved"}
                >
                  Inject Municipal Non-Appropriation Clause
                </Button>
              }
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Finalize &amp; Route
            </p>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                onNotify(
                  "Version 1.2 saved to Irving Legal SharePoint",
                  "Synced via M365 SharePoint connector."
                )
              }
            >
              <Cloud className="h-4 w-4" />
              Sync Updates to M365 SharePoint
            </Button>
            <Button
              variant="primary"
              className="w-full justify-start"
              onClick={() => setPackageModalOpen(true)}
            >
              <FileSignature className="h-4 w-4" />
              Generate Signed Adobe Pro Council Package
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title="Council Agenda Package Generated"
        description="Adobe Acrobat Pro executive packet"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                CNT-2026-014_Council_Agenda_Packet.pdf created
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Bundled contract, compliance summary, and legal sufficiency
                sign-off into a single Adobe Acrobat Pro PDF/A package,
                routed to the City Secretary for agenda placement.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Legal Sufficiency Sign-Off</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <Gavel className="h-3.5 w-3.5" /> Andy Chang, ACA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Compliance Flags</span>
              <span className="font-medium text-slate-700">
                {resolvedCount} / 3 Resolved
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Routing</span>
              <span className="font-medium text-slate-700">
                City Secretary — Council Agenda
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={() => setPackageModalOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function CalloutBox({
  tone,
  children,
}: {
  tone: "amber" | "red" | "resolved";
  children: React.ReactNode;
}) {
  const classes = {
    amber: "border-amber-300 bg-amber-50 text-amber-900",
    red: "border-red-300 bg-red-50 text-red-900",
    resolved: "border-emerald-300 bg-emerald-50 text-emerald-900",
  }[tone];

  return (
    <div className={cn("flex items-start gap-2 rounded-md border px-3 py-2 mb-2 font-sans text-[13px]", classes)}>
      {tone === "resolved" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}

function InspectorItem({
  title,
  citation,
  rationale,
  resolved,
  action,
  last,
}: {
  title: string;
  citation: string;
  rationale: string;
  resolved: boolean;
  action: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "py-3",
        !last && "border-b border-slate-100"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <Badge tone={resolved ? "green" : "amber"}>
          {resolved ? "Resolved" : "Flagged"}
        </Badge>
      </div>
      <p className="text-xs font-mono text-slate-400 mb-1.5">{citation}</p>
      <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">
        {rationale}
      </p>
      {action}
    </div>
  );
}
