import React from "react";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "month", label: "Last Month" },
  { key: "6months", label: "6 Months" },
  { key: "year", label: "Year" },
];

/**
 * TimeRangeSelector
 * Horizontal pill/segmented control used to filter both the chart and the history table.
 */
const TimeRangeSelector = ({ selected, onChange }) => {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap"
      role="tablist"
      aria-label="Select time range"
    >
      {RANGES.map((r) => (
        <button
          key={r.key}
          role="tab"
          aria-selected={selected === r.key}
          onClick={() => onChange(r.key)}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition border ${
            selected === r.key
              ? "bg-pulse-500 border-pulse-500 text-white shadow-sm"
              : "bg-clinic-surface border-clinic-border text-clinic-muted hover:border-pulse-400 hover:text-pulse-500"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
