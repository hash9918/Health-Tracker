import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

/**
 * AnalyticsGraph
 * Renders systolic, diastolic, and pulse rate trends as a responsive line chart.
 * The x-axis label format adapts to the selected time range (e.g. hour-level for "today",
 * date-level for longer ranges) so the graph stays readable at any zoom level.
 */
const AnalyticsGraph = ({ records, range }) => {
  const chartData = useMemo(() => {
    return records.map((r) => ({
      timestamp: r.timestamp,
      systolic: r.systolic,
      diastolic: r.diastolic,
      pulseRate: r.pulseRate,
    }));
  }, [records]);

  const dateFormatter = (isoString) => {
    const date = new Date(isoString);
    if (range === "today") return format(date, "HH:mm");
    if (range === "7days" || range === "month") return format(date, "MMM d");
    return format(date, "MMM yyyy");
  };

  if (!records.length) {
    return (
      <div className="h-72 flex items-center justify-center text-clinic-muted text-sm border border-dashed border-clinic-border rounded-xl2">
        No data to plot for this time range yet. Add a reading to see your trend.
      </div>
    );
  }

  return (
    <div className="h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2ECEC" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={dateFormatter}
            tick={{ fontSize: 11, fill: "#5B7373" }}
            axisLine={{ stroke: "#E2ECEC" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#5B7373" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          {/* Reference lines mark commonly cited normal upper bounds, for visual context only */}
          <ReferenceLine y={120} stroke="#1E9E6B" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={80} stroke="#5B8DEF" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Tooltip
            labelFormatter={(v) => format(new Date(v), "MMM d, yyyy · HH:mm")}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E2ECEC",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Line
            type="monotone"
            dataKey="systolic"
            name="Systolic"
            stroke="#0F766E"
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="diastolic"
            name="Diastolic"
            stroke="#5B8DEF"
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="pulseRate"
            name="Pulse Rate"
            stroke="#D89A2E"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsGraph;
