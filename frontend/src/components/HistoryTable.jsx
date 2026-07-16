import React from "react";
import { format } from "date-fns";
import { getBpCategory, toneClasses } from "../utils/bpCategory";

/**
 * HistoryTable
 * Lists the filtered records with date, time, arm used, and comments.
 * Renders as a table on larger screens and stacked cards on mobile for readability.
 */
const HistoryTable = ({ records, onDelete }) => {
  if (!records.length) {
    return (
      <div className="text-center text-sm text-clinic-muted py-10">
        No readings recorded in this time range.
      </div>
    );
  }

  // Show most recent first in the table, even though the chart wants ascending order.
  const sorted = [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-clinic-muted border-b border-clinic-border">
              <th className="py-2.5 pr-4 font-medium">Date</th>
              <th className="py-2.5 pr-4 font-medium">Time</th>
              <th className="py-2.5 pr-4 font-medium">BP (mmHg)</th>
              <th className="py-2.5 pr-4 font-medium">Pulse</th>
              <th className="py-2.5 pr-4 font-medium">Arm</th>
              <th className="py-2.5 pr-4 font-medium">Category</th>
              <th className="py-2.5 pr-4 font-medium">Comments</th>
              <th className="py-2.5 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const category = getBpCategory(r.systolic, r.diastolic);
              const tone = toneClasses[category.tone];
              return (
                <tr key={r._id} className="border-b border-clinic-border/60 hover:bg-clinic-bg/60 transition">
                  <td className="py-2.5 pr-4 whitespace-nowrap">{format(new Date(r.timestamp), "MMM d, yyyy")}</td>
                  <td className="py-2.5 pr-4 whitespace-nowrap font-mono text-clinic-muted">
                    {format(new Date(r.timestamp), "HH:mm")}
                  </td>
                  <td className="py-2.5 pr-4 font-mono font-semibold whitespace-nowrap">
                    {r.systolic}/{r.diastolic}
                  </td>
                  <td className="py-2.5 pr-4 font-mono whitespace-nowrap">{r.pulseRate} bpm</td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">{r.armSelection}</td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${tone.bg} ${tone.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                      {category.label}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 max-w-[200px] truncate text-clinic-muted" title={r.comments}>
                    {r.comments || "—"}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onDelete(r._id)}
                      className="text-clinic-muted hover:text-signal-high transition text-xs"
                      aria-label="Delete reading"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="sm:hidden space-y-3">
        {sorted.map((r) => {
          const category = getBpCategory(r.systolic, r.diastolic);
          const tone = toneClasses[category.tone];
          return (
            <div key={r._id} className="border border-clinic-border rounded-xl p-3.5">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="font-mono text-xl font-semibold">
                    {r.systolic}/{r.diastolic} <span className="text-xs font-body font-normal text-clinic-muted">mmHg</span>
                  </p>
                  <p className="text-xs text-clinic-muted font-mono">{r.pulseRate} bpm · {r.armSelection} arm</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${tone.bg} ${tone.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                  {category.label}
                </span>
              </div>
              <p className="text-xs text-clinic-muted mb-1">
                {format(new Date(r.timestamp), "MMM d, yyyy · HH:mm")}
              </p>
              {r.comments && <p className="text-sm text-clinic-ink/80 italic">"{r.comments}"</p>}
              <button
                onClick={() => onDelete(r._id)}
                className="mt-2 text-xs text-clinic-muted hover:text-signal-high transition"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTable;
