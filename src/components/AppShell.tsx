"use client";

import { useState } from "react";
import { Sidebar, tabs, TabKey } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ToastViewport, ToastMessage } from "@/components/ui/Toast";
import { DocketTab } from "@/components/docket/DocketTab";
import { ClaimsTab } from "@/components/claims/ClaimsTab";
import { ClaimDetailModal } from "@/components/claims/ClaimDetailModal";
import { MatterDetailModal } from "@/components/matters/MatterDetailModal";
import { IngestionTab } from "@/components/ingestion/IngestionTab";
import { ContractTab } from "@/components/contract/ContractTab";
import { ReportingTab } from "@/components/reporting/ReportingTab";
import { AuditLogTab } from "@/components/audit/AuditLogTab";
import { NewMatterModal } from "@/components/modals/NewMatterModal";
import { OutlookFilingDrawer } from "@/components/OutlookFilingDrawer";
import {
  initialMatters,
  initialClaims,
  initialDocs,
  initialAuditLog,
  Matter,
  Claim,
  IngestedDoc,
  AuditLogEntry,
  formatCurrency,
  TODAY,
} from "@/lib/data";
import { Role, roleTabAccess } from "@/lib/roles";
import { cn } from "@/lib/utils";

let toastSeq = 1;
let auditSeq = 1;
let escalationSeq = 42;

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("docket");
  const [matters, setMatters] = useState<Matter[]>(initialMatters);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [docs, setDocs] = useState<IngestedDoc[]>(initialDocs);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditLog);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("City Attorney");
  const [outlookOpen, setOutlookOpen] = useState(false);
  const [outlookTarget, setOutlookTarget] = useState<
    { kind: "matter" | "claim"; id: string; caseNumber: string; title: string } | null
  >(null);

  function openOutlook(
    target?: { kind: "matter" | "claim"; id: string; caseNumber: string; title: string }
  ) {
    setOutlookTarget(target ?? null);
    setOutlookOpen(true);
  }
  const visibleTabs = roleTabAccess[role];

  function handleResetDemo() {
    setMatters(initialMatters);
    setClaims(initialClaims);
    setDocs(initialDocs);
    setAuditLog(initialAuditLog);
    setSelectedMatterId(null);
    setSelectedClaimId(null);
    setModalOpen(false);
    setOutlookOpen(false);
    setActiveTab("docket");
    escalationSeq = 42;
    notify("Demo reset", "All matters, claims, documents and the audit log have been restored to their original state.");
  }

  function handleRoleChange(newRole: Role) {
    setRole(newRole);
    if (!roleTabAccess[newRole].includes(activeTab)) {
      setActiveTab(roleTabAccess[newRole][0]);
    }
  }

  function notify(title: string, description?: string) {
    const id = toastSeq++;
    setToasts((prev) => [...prev, { id, title, description }]);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function logAudit(action: string, targetEntity: string) {
    const entry: AuditLogEntry = {
      id: `audit-${auditSeq++}`,
      timestamp: new Date().toISOString(),
      user: "Andy Chang",
      action,
      targetEntity,
    };
    setAuditLog((prev) => [...prev, entry]);
  }

  function handleOpenMatter(matter: Matter) {
    if (matter.id === "m2" && roleTabAccess[role].includes("contract")) {
      setActiveTab("contract");
      return;
    }
    setSelectedMatterId(matter.id);
  }

  function handleOpenClaim(claim: Claim) {
    setSelectedClaimId(claim.id);
  }

  function handleCreateMatter(matter: Matter) {
    setMatters((prev) => [matter, ...prev]);
    logAudit("Created matter", matter.caseNumber);
  }

  function handleCreateClaim(claim: Claim) {
    setClaims((prev) => [claim, ...prev]);
    logAudit("Created claim", claim.claimNumber);
  }

  function handleUpdateMatter(updated: Matter) {
    setMatters((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  function handleUpdateClaim(updated: Claim) {
    setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleRedactFinalize(acceptedCount: number) {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === "d2"
          ? {
              ...d,
              fileName: "Irving_PD_Incident_Report_902_REDACTED.pdf",
              status: "Redacted & Signed",
              tags: [
                { label: `${acceptedCount} Items Redacted`, tone: "success" },
                { label: "PIA Compliant", tone: "success" },
              ],
            }
          : d
      )
    );
  }

  function handleEscalate(claim: Claim) {
    escalationSeq += 1;
    const caseNumber = `LIT-2026-${String(escalationSeq).padStart(3, "0")}`;
    const targetDate = new Date(TODAY.getTime() + 20 * 86400000)
      .toISOString()
      .slice(0, 10);

    const newMatter: Matter = {
      id: `m-esc-${Date.now()}`,
      caseNumber,
      title: claim.title,
      type: "Civil Action",
      dept: claim.dept,
      targetDate,
      deadlineType: "Civil Court Answer",
      status: "Under Review",
      exposure: claim.initialDemand || null,
      exposureLabel: formatCurrency(claim.initialDemand),
      pendingCouncil: false,
      linkedClaimId: claim.id,
    };

    setMatters((prev) => [newMatter, ...prev]);
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id
          ? { ...c, status: "Converted to Litigation", linkedMatterId: newMatter.caseNumber }
          : c
      )
    );
    setDocs((prev) =>
      prev.map((d) => (d.claimId === claim.id ? { ...d, matterId: newMatter.id } : d))
    );
    logAudit(`Converted claim ${claim.claimNumber} to litigation matter`, newMatter.caseNumber);
    notify(
      `Claim converted — ${caseNumber} created`,
      "Incident details and all attachments carried over automatically."
    );

    setSelectedClaimId(null);
    setActiveTab("docket");
    setSelectedMatterId(newMatter.id);
  }

  function handleFileFromOutlook(
    target: { kind: "matter" | "claim"; id: string; caseNumber: string },
    saveBody: boolean,
    saveAttachment: boolean
  ) {
    const newDocs: IngestedDoc[] = [];
    const ownerField = target.kind === "matter" ? { matterId: target.id } : { claimId: target.id };
    if (saveAttachment) {
      newDocs.push({
        id: `outlook-${Date.now()}-1`,
        fileName: "Answer_and_Counterclaim.pdf",
        docType: "Correspondence Attachment",
        tags: [{ label: "Filed via Outlook Add-In", tone: "neutral" }],
        status: "Indexed",
        progress: 100,
        ...ownerField,
      });
    }
    if (saveBody) {
      newDocs.push({
        id: `outlook-${Date.now()}-2`,
        fileName: "Email_Correspondence_Klein_Associates.pdf",
        docType: "Correspondence",
        tags: [{ label: "Filed via Outlook Add-In", tone: "neutral" }],
        status: "Indexed",
        progress: 100,
        ...ownerField,
      });
    }
    setDocs((prev) => [...prev, ...newDocs]);
    logAudit(
      `Filed email correspondence from Outlook (${newDocs.length} item${newDocs.length === 1 ? "" : "s"})`,
      target.caseNumber
    );
    notify(
      `Filed to ${target.caseNumber}`,
      "Document repository updated from Outlook 365 Add-In."
    );
  }

  const selectedMatter = matters.find((m) => m.id === selectedMatterId) ?? null;
  const selectedClaim = claims.find((c) => c.id === selectedClaimId) ?? null;
  const convertedMatterNumber = claims.find((c) => c.id === "c1")?.linkedMatterId;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeTab={activeTab}
        visibleTabs={visibleTabs}
        onSelect={setActiveTab}
        onResetDemo={handleResetDemo}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeTab={activeTab}
          matters={matters}
          claims={claims}
          role={role}
          onRoleChange={handleRoleChange}
          onSelectMatter={handleOpenMatter}
          onSelectClaim={handleOpenClaim}
          onNewMatter={() => setModalOpen(true)}
          onOpenOutlook={() => openOutlook()}
        />

        <div className="lg:hidden border-b border-slate-200 bg-white px-4">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {tabs.filter((t) => visibleTabs.includes(t.key)).map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
                    active
                      ? "border-[#0b2340] text-[#0b2340]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-6">
          {activeTab === "docket" && (
            <DocketTab matters={matters} onOpenCase={handleOpenMatter} />
          )}
          {activeTab === "claims" && (
            <ClaimsTab claims={claims} onOpenClaim={handleOpenClaim} />
          )}
          {activeTab === "ingestion" && (
            <IngestionTab
              docs={docs.filter((d) => d.claimId === "c1")}
              onRedactFinalize={handleRedactFinalize}
              onNotify={notify}
              onAudit={logAudit}
              linkedMatterNumber={convertedMatterNumber}
            />
          )}
          {activeTab === "contract" && (
            <ContractTab
              matter={matters.find((m) => m.id === "m2")!}
              onNotify={notify}
              onAudit={logAudit}
              onUpdateMatter={handleUpdateMatter}
            />
          )}
          {activeTab === "reporting" && <ReportingTab matters={matters} />}
          {activeTab === "audit" && <AuditLogTab entries={auditLog} />}
        </main>
      </div>

      <NewMatterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreateMatter={handleCreateMatter}
        onCreateClaim={handleCreateClaim}
      />

      <ClaimDetailModal
        claim={selectedClaim}
        docs={docs}
        auditLog={auditLog}
        onClose={() => setSelectedClaimId(null)}
        onEscalate={handleEscalate}
        onUpdateClaim={handleUpdateClaim}
        onAudit={logAudit}
        onNotify={notify}
        onRedactFinalize={handleRedactFinalize}
        onOpenOutlook={openOutlook}
      />

      <MatterDetailModal
        matter={selectedMatter}
        docs={docs}
        auditLog={auditLog}
        claims={claims}
        onClose={() => setSelectedMatterId(null)}
        onUpdateMatter={handleUpdateMatter}
        onAudit={logAudit}
        onNotify={notify}
        onRedactFinalize={handleRedactFinalize}
        onOpenOutlook={openOutlook}
      />

      <OutlookFilingDrawer
        open={outlookOpen}
        onClose={() => setOutlookOpen(false)}
        matters={matters}
        claims={claims}
        onFile={handleFileFromOutlook}
        defaultTarget={outlookTarget}
      />

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
