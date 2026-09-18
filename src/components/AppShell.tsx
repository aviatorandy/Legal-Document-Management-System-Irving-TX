"use client";

import { useState } from "react";
import { Sidebar, tabs, TabKey } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ToastViewport, ToastMessage } from "@/components/ui/Toast";
import { DocketTab } from "@/components/docket/DocketTab";
import { IngestionTab } from "@/components/ingestion/IngestionTab";
import { ContractTab } from "@/components/contract/ContractTab";
import { ReportingTab } from "@/components/reporting/ReportingTab";
import { AuditLogTab } from "@/components/audit/AuditLogTab";
import { NewMatterModal } from "@/components/modals/NewMatterModal";
import {
  initialMatters,
  initialDocs,
  initialAuditLog,
  Matter,
  IngestedDoc,
  AuditLogEntry,
} from "@/lib/data";
import { cn } from "@/lib/utils";

let toastSeq = 1;
let auditSeq = 1;

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("docket");
  const [matters, setMatters] = useState<Matter[]>(initialMatters);
  const [docs, setDocs] = useState<IngestedDoc[]>(initialDocs);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditLog);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  function handleOpenCase(matter: Matter) {
    if (matter.id === "m2") {
      setActiveTab("contract");
      return;
    }
    if (matter.id === "m1") {
      setActiveTab("ingestion");
      return;
    }
    setActiveTab("docket");
    notify(`Opening ${matter.caseNumber}`, matter.title);
  }

  function handleCreateMatter(matter: Matter) {
    setMatters((prev) => [matter, ...prev]);
    logAudit("Created matter", matter.caseNumber);
  }

  function handleRedact() {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === "d2"
          ? {
              ...d,
              status: "Redacted & Signed",
              tags: [
                { label: "PII Redacted", tone: "success" },
                { label: "Adobe Pro Signed", tone: "success" },
              ],
            }
          : d
      )
    );
    notify(
      "Adobe Pro PII Redaction complete",
      "Juvenile PII redacted and document digitally signed."
    );
    logAudit("Redacted PII and applied Adobe Pro digital signature", "CLM-2026-089");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onSelect={setActiveTab} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeTab={activeTab}
          matters={matters}
          onSelectMatter={handleOpenCase}
          onNewMatter={() => setModalOpen(true)}
        />

        <div className="lg:hidden border-b border-slate-200 bg-white px-4">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((t) => {
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
            <DocketTab matters={matters} onOpenCase={handleOpenCase} />
          )}
          {activeTab === "ingestion" && (
            <IngestionTab
              docs={docs}
              onRedact={handleRedact}
              onNotify={notify}
              onAudit={logAudit}
            />
          )}
          {activeTab === "contract" && (
            <ContractTab onNotify={notify} onAudit={logAudit} />
          )}
          {activeTab === "reporting" && <ReportingTab matters={matters} />}
          {activeTab === "audit" && <AuditLogTab entries={auditLog} />}
        </main>
      </div>

      <NewMatterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateMatter}
      />

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
