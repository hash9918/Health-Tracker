/**
 * Classifies a blood pressure reading into a general category based on
 * commonly cited clinical thresholds (AHA-style guidance). This is for
 * general informational display only — not a medical diagnosis.
 */
export const getBpCategory = (systolic, diastolic) => {
  if (systolic >= 180 || diastolic >= 120) {
    return { label: "Hypertensive Crisis", color: "signal-high", tone: "high" };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { label: "High (Stage 2)", color: "signal-high", tone: "high" };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { label: "High (Stage 1)", color: "signal-elevated", tone: "elevated" };
  }
  if (systolic >= 120 && diastolic < 80) {
    return { label: "Elevated", color: "signal-elevated", tone: "elevated" };
  }
  return { label: "Normal", color: "signal-normal", tone: "normal" };
};

/** Maps a tone to Tailwind utility classes for badges/dots. */
export const toneClasses = {
  normal: {
    text: "text-signal-normal",
    bg: "bg-signal-normal/10",
    dot: "bg-signal-normal",
  },
  elevated: {
    text: "text-signal-elevated",
    bg: "bg-signal-elevated/10",
    dot: "bg-signal-elevated",
  },
  high: {
    text: "text-signal-high",
    bg: "bg-signal-high/10",
    dot: "bg-signal-high",
  },
};
