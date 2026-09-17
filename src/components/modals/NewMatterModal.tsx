"use client";

import { FormEvent, useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  categoryToType,
  departments,
  matterCategories,
  Matter,
} from "@/lib/data";

let trackingSeq = 904;

export function NewMatterModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (matter: Matter) => void;
}) {
  const [dept, setDept] = useState(departments[0]);
  const [category, setCategory] = useState(matterCategories[0]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);

  function reset() {
    setDept(departments[0]);
    setCategory(matterCategories[0]);
    setTitle("");
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

    const type = categoryToType(category);
    const prefix =
      type === "Tort Claim"
        ? "CLM"
        : type === "Vendor Contract"
        ? "CNT"
        : type === "Ordinance"
        ? "ORD"
        : "LIT";
    trackingSeq += 1;
    const trackingCode = `IRV-2026-${prefix}-${trackingSeq}`;

    const numericValue = Number(value.replace(/[^0-9.]/g, "")) || 0;

    const newMatter: Matter = {
      id: `m-${Date.now()}`,
      caseNumber: `${prefix}-2026-${trackingSeq}`,
      title: title.trim(),
      type,
      dept,
      slaLabel: date ? `Target: ${date}` : "Pending Assignment",
      slaDays: 30,
      slaUrgent: false,
      status: "Under Review",
      exposure: numericValue || null,
      exposureLabel: numericValue ? `$${numericValue.toLocaleString()}` : "TBD",
      pendingCouncil: type === "Vendor Contract",
    };

    onCreate(newMatter);
    setTracking(trackingCode);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Matter Intake"
      description="Route a new legal matter to the Office of the City Attorney"
    >
      {tracking ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Matter intake submitted successfully
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Tracking Code:{" "}
                <span className="font-mono font-semibold">{tracking}</span>
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Added to the Litigation &amp; Claims Docket. Metrics updated.
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

          <Field label="Matter Title / Subject">
            <input
              required
              type="text"
              placeholder="e.g. Retaining Wall Collapse Property Damage Claim"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

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
              Submit Matter Intake
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
