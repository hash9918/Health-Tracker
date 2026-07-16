import React, { useState, useEffect } from "react";
import { createRecord } from "../api/records";

/**
 * InputForm
 * Captures a new blood pressure + pulse rate reading and submits it to the API.
 * The current device date/time is captured automatically and displayed live,
 * so the user can see exactly what timestamp will be recorded.
 */
const InputForm = ({ onRecordCreated }) => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  const [armSelection, setArmSelection] = useState("Left");
  const [comments, setComments] = useState("");
  const [now, setNow] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successFlash, setSuccessFlash] = useState(false);

  // Live-updating clock so the user sees the exact device time that will be stamped.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const resetForm = () => {
    setSystolic("");
    setDiastolic("");
    setPulseRate("");
    setComments("");
    // Arm selection intentionally persists — most users track the same arm repeatedly.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation before hitting the API
    if (!systolic || !diastolic || !pulseRate) {
      setError("Systolic, diastolic, and pulse rate are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulseRate: Number(pulseRate),
        armSelection,
        comments,
        timestamp: new Date().toISOString(), // device-local time at moment of submission
      };
      const result = await createRecord(payload);
      onRecordCreated(result.data); // instantly update parent UI
      resetForm();
      setSuccessFlash(true);
      setTimeout(() => setSuccessFlash(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save reading. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-clinic-surface rounded-xl2 shadow-card border border-clinic-border p-6 sm:p-7">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-lg font-semibold text-clinic-ink">New Reading</h2>
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-clinic-muted font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-pulse-500 animate-pulse" />
          live
        </span>
      </div>
      <p className="text-xs text-clinic-muted mb-5 font-mono">{formattedTime}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Systolic / Diastolic / Pulse — grouped as the three vitals */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="systolic" className="block text-xs font-medium text-clinic-muted mb-1.5">
              Systolic <span className="text-clinic-muted/70">(mmHg)</span>
            </label>
            <input
              id="systolic"
              type="number"
              inputMode="numeric"
              placeholder="120"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full rounded-lg border border-clinic-border bg-clinic-bg px-3 py-2.5 font-mono text-lg font-semibold text-clinic-ink focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none transition"
              min="40"
              max="300"
              required
            />
          </div>
          <div>
            <label htmlFor="diastolic" className="block text-xs font-medium text-clinic-muted mb-1.5">
              Diastolic <span className="text-clinic-muted/70">(mmHg)</span>
            </label>
            <input
              id="diastolic"
              type="number"
              inputMode="numeric"
              placeholder="80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full rounded-lg border border-clinic-border bg-clinic-bg px-3 py-2.5 font-mono text-lg font-semibold text-clinic-ink focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none transition"
              min="20"
              max="200"
              required
            />
          </div>
          <div>
            <label htmlFor="pulseRate" className="block text-xs font-medium text-clinic-muted mb-1.5">
              Pulse <span className="text-clinic-muted/70">(bpm)</span>
            </label>
            <input
              id="pulseRate"
              type="number"
              inputMode="numeric"
              placeholder="72"
              value={pulseRate}
              onChange={(e) => setPulseRate(e.target.value)}
              className="w-full rounded-lg border border-clinic-border bg-clinic-bg px-3 py-2.5 font-mono text-lg font-semibold text-clinic-ink focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none transition"
              min="20"
              max="250"
              required
            />
          </div>
        </div>

        {/* Arm selection toggle */}
        <div>
          <span className="block text-xs font-medium text-clinic-muted mb-1.5">Arm Used</span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-clinic-bg rounded-lg border border-clinic-border">
            {["Left", "Right"].map((arm) => (
              <button
                key={arm}
                type="button"
                onClick={() => setArmSelection(arm)}
                className={`py-2 rounded-md text-sm font-medium transition ${
                  armSelection === arm
                    ? "bg-pulse-500 text-white shadow-sm"
                    : "text-clinic-muted hover:bg-pulse-50"
                }`}
                aria-pressed={armSelection === arm}
              >
                {arm} Hand
              </button>
            ))}
          </div>
        </div>

        {/* Optional comments */}
        <div>
          <label htmlFor="comments" className="block text-xs font-medium text-clinic-muted mb-1.5">
            Additional Comments <span className="text-clinic-muted/70">(optional)</span>
          </label>
          <textarea
            id="comments"
            rows={2}
            maxLength={280}
            placeholder="e.g. After coffee, felt dizzy, before medication..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full rounded-lg border border-clinic-border bg-clinic-bg px-3 py-2.5 text-sm text-clinic-ink placeholder:text-clinic-muted/60 focus:border-pulse-500 focus:ring-1 focus:ring-pulse-500 outline-none transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-signal-high bg-signal-high/10 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-pulse-500 hover:bg-pulse-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition shadow-sm"
        >
          {submitting ? "Saving..." : successFlash ? "Saved ✓" : "Save Reading"}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
