import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface MarketplacePoint {
  date: string;
  active: number;
  sold: number;
  cancelled: number;
}

export function MarketplaceStatusChart({ data }: { data: MarketplacePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={36} />
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
          }}
          cursor={{ fill: "var(--surface-secondary)" }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--text-muted)", paddingTop: 10 }} />
        <Bar dataKey="sold" name="Sold" stackId="a" fill="#22c55e" />
        <Bar dataKey="active" name="Active" stackId="a" fill="#0ea5e9" />
        <Bar dataKey="cancelled" name="Cancelled or expired" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
