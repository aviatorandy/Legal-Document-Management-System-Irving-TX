"use client";

import { useState } from "react";
import { Gavel, FolderInput, FileCheck2, Plus, BarChart3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { ToastViewport, ToastMessage } from "@/components/ui/Toast";
import { DocketTab } from "@/components/docket/DocketTab";
import { IngestionTab } from "@/components/ingestion/IngestionTab";
import { ContractTab } from "@/components/contract/ContractTab";
import { ReportingTab } from "@/components/reporting/ReportingTab";
import { NewMatterModal } from "@/components/modals/NewMatterModal";
import { GlobalSearch } from "@/components/GlobalSearch";
import { initialMatters, initialDocs, Matter, IngestedDoc } from "@/lib/data";
import { cn } from "@/lib/utils";

type TabKey = "docket" | "ingestion" | "contract" | "reporting";

const tabs: { key: TabKey; label: string; icon: typeof Gavel }[] = [
  { key: "docket", label: "Litigation & Claims Docket", icon: Gavel },
  { key: "ingestion", label: "Document Bundle Ingestion & Triage", icon: FolderInput },
  { key: "contract", label: "Contract Compliance Studio", icon: FileCheck2 },
  { key: "reporting", label: "Reporting & Analytics", icon: BarChart3 },
];

let toastSeq = 1;

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("docket");
  const [matters, setMatters] = useState<Matter[]>(initialMatters);
  const [docs, setDocs] = useState<IngestedDoc[]>(initialDocs);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function notify(title: string, description?: string) {
    const id = toastSeq++;
    setToasts((prev) => [...prev, { id, title, description }]);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition-colors",
                      active
                        ? "border-[#0b2340] text-[#0b2340]"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <div className="hidden lg:flex items-center gap-3 py-2">
              <GlobalSearch matters={matters} onSelect={handleOpenCase} />
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" />
                New Matter Intake
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden px-6 pt-4 space-y-3">
        <GlobalSearch matters={matters} onSelect={handleOpenCase} />
        <Button className="w-full" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Matter Intake
        </Button>
      </div>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        {activeTab === "docket" && (
          <DocketTab matters={matters} onOpenCase={handleOpenCase} />
        )}
        {activeTab === "ingestion" && (
          <IngestionTab docs={docs} onRedact={handleRedact} onNotify={notify} />
        )}
        {activeTab === "contract" && <ContractTab onNotify={notify} />}
        {activeTab === "reporting" && <ReportingTab matters={matters} />}
      </main>

      <NewMatterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateMatter}
      />

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
