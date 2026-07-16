import React, { useState, useEffect, useCallback } from "react";
import InputForm from "./components/InputForm";
import TimeRangeSelector from "./components/TimeRangeSelector";
import StatsSummary from "./components/StatsSummary";
import AnalyticsGraph from "./components/AnalyticsGraph";
import HistoryTable from "./components/HistoryTable";
import { fetchRecords, deleteRecord } from "./api/records";

function App() {
  const [range, setRange] = useState("7days");
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecords = useCallback(async (selectedRange) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchRecords(selectedRange);
      setRecords(result.data);
      setStats(result.stats);
    } catch (err) {
      setError("Couldn't load readings. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords(range);
  }, [range, loadRecords]);

  // Instantly reflect a newly created record without waiting for a full refetch,
  // then quietly re-sync with the server to pick up recalculated stats.
  const handleRecordCreated = (newRecord) => {
    setRecords((prev) => [...prev, newRecord]);
    loadRecords(range);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      loadRecords(range);
    } catch (err) {
      setError("Failed to delete reading.");
    }
  };

  return (
    <div className="min-h-screen bg-clinic-bg">
      {/* --- Header with signature EKG waveform accent --- */}
      <header className="border-b border-clinic-border bg-clinic-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="40" height="28" viewBox="0 0 120 40" className="text-pulse-500 shrink-0">
              <path
                className="ekg-line"
                d="M0 20 L25 20 L32 6 L40 34 L48 20 L60 20 L66 12 L72 20 L120 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1 className="font-display text-xl font-semibold text-clinic-ink leading-tight">Vitals</h1>
              <p className="text-xs text-clinic-muted -mt-0.5">Blood Pressure & Pulse Tracker</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="bg-signal-high/10 text-signal-high text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* --- Left: Input Form --- */}
          <div className="lg:sticky lg:top-6">
            <InputForm onRecordCreated={handleRecordCreated} />
          </div>

          {/* --- Right: Analytics --- */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-clinic-ink">Trends</h2>
              <TimeRangeSelector selected={range} onChange={setRange} />
            </div>

            <StatsSummary stats={stats} count={records.length} />

            <div className="bg-clinic-surface rounded-xl2 shadow-card border border-clinic-border p-5 sm:p-6">
              {loading ? (
                <div className="h-80 flex items-center justify-center text-clinic-muted text-sm">
                  Loading readings...
                </div>
              ) : (
                <AnalyticsGraph records={records} range={range} />
              )}
            </div>

            <div className="bg-clinic-surface rounded-xl2 shadow-card border border-clinic-border p-5 sm:p-6">
              <h3 className="font-display text-base font-semibold text-clinic-ink mb-4">History</h3>
              <HistoryTable records={records} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
