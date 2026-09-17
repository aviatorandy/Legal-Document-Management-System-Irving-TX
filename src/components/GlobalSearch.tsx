"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Matter } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const typeTone: Record<string, "navy" | "blue" | "amber" | "zinc"> = {
  "Tort Claim": "amber",
  "Vendor Contract": "blue",
  Ordinance: "zinc",
  "Civil Action": "navy",
};

export function GlobalSearch({
  matters,
  onSelect,
}: {
  matters: Matter[];
  onSelect: (matter: Matter) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return matters
      .filter(
        (m) =>
          m.caseNumber.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.dept.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [matters, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(m: Matter) {
    onSelect(m);
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
          placeholder="Search case #, matter title, or department..."
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
              No matters found for &quot;{query}&quot;
            </div>
          ) : (
            <ul>
              {results.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => handleSelect(m)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors",
                      "flex items-center justify-between gap-3"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-slate-500">
                          {m.caseNumber}
                        </span>
                        <Badge tone={typeTone[m.type]}>{m.type}</Badge>
                      </div>
                      <p className="text-sm text-slate-800 truncate mt-0.5">{m.title}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
