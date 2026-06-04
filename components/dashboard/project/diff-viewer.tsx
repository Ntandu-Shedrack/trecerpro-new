import * as React from "react";

interface DiffViewerProps {
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
}

export function DiffViewer({ before = {}, after = {} }: DiffViewerProps) {
  const b = before || {};
  const a = after || {};
  
  const allKeys = Array.from(new Set([...Object.keys(b), ...Object.keys(a)]));

  const diffs = allKeys.map((key) => {
    const valBefore = b[key];
    const valAfter = a[key];
    const hasBefore = key in b;
    const hasAfter = key in a;
    
    if (valBefore === valAfter) return null;

    return {
      key,
      before: hasBefore ? String(valBefore) : null,
      after: hasAfter ? String(valAfter) : null,
      type: !hasBefore ? "added" : !hasAfter ? "deleted" : "updated",
    };
  }).filter(Boolean) as Array<{
    key: string;
    before: string | null;
    after: string | null;
    type: "added" | "deleted" | "updated";
  }>;

  if (diffs.length === 0) {
    return <span className="text-xs text-slate-500 italic">No value changes detected.</span>;
  }

  return (
    <div className="mt-3 bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden text-xs animate-in fade-in duration-350">
      <div className="grid grid-cols-2 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 p-2">
        <div>Original State</div>
        <div>New State</div>
      </div>
      <div className="divide-y divide-slate-800">
        {diffs.map((diff) => (
          <div key={diff.key} className="grid grid-cols-2 p-2 hover:bg-slate-900/40">
            {/* Before (Original) */}
            <div className="pr-2 border-r border-slate-800 flex flex-wrap gap-1.5 items-start">
              <span className="font-semibold text-slate-400 font-mono text-[10px]">{diff.key}:</span>
              {diff.before !== null ? (
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded line-through break-all">
                  {diff.before}
                </span>
              ) : (
                <span className="text-slate-600 italic">none</span>
              )}
            </div>
            {/* After (New) */}
            <div className="pl-2 flex flex-wrap gap-1.5 items-start">
              <span className="font-semibold text-slate-400 font-mono text-[10px]">{diff.key}:</span>
              {diff.after !== null ? (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded break-all">
                  {diff.after}
                </span>
              ) : (
                <span className="text-slate-500 italic">removed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DiffViewer;
