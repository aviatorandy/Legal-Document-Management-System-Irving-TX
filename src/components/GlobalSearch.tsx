"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Claim, Matter } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const typeTone: Record<string, "navy" | "blue" | "amber" | "zinc"> = {
  "Vendor Contract": "blue",
  Ordinance: "zinc",
  "Civil Action": "navy",
};

type SearchResult =
  | { kind: "matter"; record: Matter }
  | { kind: "claim"; record: Claim };

export function GlobalSearch({
  matters,
  claims,
  onSelectMatter,
  onSelectClaim,
}: {
  matters: Matter[];
  claims: Claim[];
  onSelectMatter: (matter: Matter) => void;
  onSelectClaim: (claim: Claim) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matterResults: SearchResult[] = matters
      .filter(
        (m) =>
          m.caseNumber.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.dept.toLowerCase().includes(q)
      )
      .map((record) => ({ kind: "matter" as const, record }));
    const claimResults: SearchResult[] = claims
      .filter(
        (c) =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.dept.toLowerCase().includes(q) ||
          c.claimantName.toLowerCase().includes(q)
      )
      .map((record) => ({ kind: "claim" as const, record }));
    return [...matterResults, ...claimResults].slice(0, 6);
  }, [matters, claims, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(r: SearchResult) {
    if (r.kind === "matter") onSelectMatter(r.record);
    else onSelectClaim(r.record);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search docket, case #, or party..."
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 focus:border-[#0b2340] focus:bg-white transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400">
              No matters or claims found for &quot;{query}&quot;
            </div>
          ) : (
            <ul>
              {results.map((r) => {
                const key = r.kind === "matter" ? r.record.id : r.record.id;
                const caseNumber =
                  r.kind === "matter" ? r.record.caseNumber : r.record.claimNumber;
                return (
                  <li key={key}>
                    <button
                      onClick={() => handleSelect(r)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors",
                        "flex items-center justify-between gap-3"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium text-slate-500">
                            {caseNumber}
                          </span>
                          {r.kind === "matter" ? (
                            <Badge tone={typeTone[r.record.type]}>{r.record.type}</Badge>
                          ) : (
                            <Badge tone="amber">Claim</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-800 truncate mt-0.5">
                          {r.record.title}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
