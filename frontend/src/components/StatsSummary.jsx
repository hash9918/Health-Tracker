import React from "react";
import { getBpCategory, toneClasses } from "../utils/bpCategory";

/**
 * StatsSummary
 * Displays average BP/pulse plus max/min ranges for the currently selected time range.
 */
const StatsSummary = ({ stats, count }) => {
  const hasData = count > 0 && stats?.avgSystolic !== null;

  if (!hasData) {
    return (
      <div className="bg-clinic-surface rounded-xl2 shadow-card border border-clinic-border p-6 text-center text-clinic-muted text-sm">
        No readings in this time range yet.
      </div>
    );
  }

  const category = getBpCategory(stats.avgSystolic, stats.avgDiastolic);
  const tone = toneClasses[category.tone];

  const cards = [
    {
      label: "Average BP",
      value: `${stats.avgSystolic}/${stats.avgDiastolic}`,
      unit: "mmHg",
      badge: category.label,
      badgeTone: tone,
    },
    {
      label: "Average Pulse",
      value: stats.avgPulse,
      unit: "bpm",
    },
    {
      label: "Systolic Range",
      value: `${stats.minSystolic}–${stats.maxSystolic}`,
      unit: "mmHg",
    },
    {
      label: "Diastolic Range",
      value: `${stats.minDiastolic}–${stats.maxDiastolic}`,
      unit: "mmHg",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-clinic-surface rounded-xl2 shadow-card border border-clinic-border p-4"
        >
          <p className="text-xs text-clinic-muted mb-1.5">{card.label}</p>
          <p className="font-mono text-2xl font-semibold text-clinic-ink leading-tight">
            {card.value}
            <span className="text-xs font-body font-normal text-clinic-muted ml-1">{card.unit}</span>
          </p>
          {card.badge && (
            <span
              className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${card.badgeTone.bg} ${card.badgeTone.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${card.badgeTone.dot}`} />
              {card.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;
