import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface LocationPoint {
  location: string;
  users: number;
}

export function UserLocationChart({ data }: { data: LocationPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 0, left: 16 }}
      >
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="location"
          type="category"
          stroke="var(--text-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={90}
        />
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
            boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)",
          }}
          cursor={{ fill: "var(--surface-secondary)" }}
        />
        <Bar dataKey="users" name="Users" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
