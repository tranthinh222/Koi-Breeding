import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export function UserGrowthChart({ data }: { data: TimeSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={36} />
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
            fontSize: "13px",
            boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)"
          }}
          labelStyle={{ color: "#0ea5e9" }}
          cursor={{ stroke: "var(--border-color)" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name="New users"
          stroke="#0ea5e9"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#0ea5e9", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}