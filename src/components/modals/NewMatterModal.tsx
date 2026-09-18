"use client";

import { FormEvent, useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  categoryToType,
  departments,
  isClaimCategory,
  matterCategories,
  Claim,
  Matter,
  TODAY,
} from "@/lib/data";

let trackingSeq = 904;

export function NewMatterModal({
  open,
  onClose,
  onCreateMatter,
  onCreateClaim,
}: {
  open: boolean;
  onClose: () => void;
  onCreateMatter: (matter: Matter) => void;
  onCreateClaim: (claim: Claim) => void;
}) {
  const [dept, setDept] = useState(departments[0]);
  const [category, setCategory] = useState(matterCategories[0]);
  const [title, setTitle] = useState("");
  const [claimantName, setClaimantName] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);

  const isClaim = isClaimCategory(category);

  function reset() {
    setDept(departments[0]);
    setCategory(matterCategories[0]);
    setTitle("");
    setClaimantName("");
    setDate("");
    setValue("");
    setFileName(null);
    setTracking(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const numericValue = Number(value.replace(/[^0-9.]/g, "")) || 0;

    if (isClaim) {
      trackingSeq += 1;
      const trackingCode = `IRV-2026-CLM-${trackingSeq}`;
      const newClaim: Claim = {
        id: `c-${Date.now()}`,
        claimNumber: `CLM-2026-${trackingSeq}`,
        title: title.trim(),
        incidentDate: date || TODAY.toISOString().slice(0, 10),
        incidentLocation: "Location on file",
        dept,
        claimantName: claimantName.trim() || "Citizen Claimant",
        initialDemand: numericValue,
        status: "Notice Filed",
      };
      onCreateClaim(newClaim);
      setTracking(trackingCode);
      return;
    }

    const type = categoryToType(category);
    const prefix = type === "Vendor Contract" ? "CNT" : type === "Ordinance" ? "ORD" : "LIT";
    trackingSeq += 1;
    const trackingCode = `IRV-2026-${prefix}-${trackingSeq}`;
    const deadlineType =
      type === "Vendor Contract"
        ? "Council Agenda"
        : type === "Ordinance"
        ? "Municipal Court"
        : "Civil Court Answer";
    const fallbackTarget = new Date(TODAY.getTime() + 30 * 86400000)
      .toISOString()
      .slice(0, 10);

    const newMatter: Matter = {
      id: `m-${Date.now()}`,
      caseNumber: `${prefix}-2026-${trackingSeq}`,
      title: title.trim(),
      type,
      dept,
      targetDate: date || fallbackTarget,
      deadlineType,
      status: "Under Review",
      exposure: numericValue || null,
      exposureLabel: numericValue ? `$${numericValue.toLocaleString()}` : "TBD",
      pendingCouncil: type === "Vendor Contract",
    };

    onCreateMatter(newMatter);
    setTracking(trackingCode);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isClaim ? "New Claim Intake" : "New Matter Intake"}
      description={
        isClaim
          ? "Log a new administrative tort claim for triage and review"
          : "Route a new legal matter to the Office of the City Attorney"
      }
    >
      {tracking ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {isClaim ? "Claim intake submitted successfully" : "Matter intake submitted successfully"}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Tracking Code:{" "}
                <span className="font-mono font-semibold">{tracking}</span>
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                {isClaim
                  ? "Added to Claims Intake & Triage. Metrics updated."
                  : "Added to the Litigation & Claims Docket. Metrics updated."}
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Originating Department">
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="Matter Category">
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {matterCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label={isClaim ? "Claim Title / Subject" : "Matter Title / Subject"}>
            <input
              required
              type="text"
              placeholder="e.g. Retaining Wall Collapse Property Damage Claim"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          {isClaim && (
            <Field label="Claimant Name">
              <input
                type="text"
                placeholder="e.g. Jordan Alvarez"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Statutory Date of Loss / Target Council Date">
              <input
                type="date"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field label="Estimated Financial Value / Exposure ($)">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Supporting Documents">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                setFileName("Attached_Supporting_Document.pdf");
              }}
              onClick={() => setFileName("Attached_Supporting_Document.pdf")}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center text-xs transition-colors ${
                dragOver
                  ? "border-[#0b2340] bg-slate-50"
                  : "border-slate-300 bg-slate-50/50"
              }`}
            >
              <UploadCloud className="mx-auto h-5 w-5 text-slate-400 mb-1" />
              {fileName ? (
                <span className="font-medium text-slate-600">{fileName}</span>
              ) : (
                <span className="text-slate-400">
                  Drag &amp; drop files, or click to simulate upload
                </span>
              )}
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isClaim ? "Submit Claim Intake" : "Submit Matter Intake"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
