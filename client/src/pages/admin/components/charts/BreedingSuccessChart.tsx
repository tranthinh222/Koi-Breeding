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

export interface BreedingPoint {
  label: string;
  successful: number;
  failed: number;
}

export function BreedingSuccessChart({ data }: { data: BreedingPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} />
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
            fontSize: "13px",
            boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)"
          }}
          cursor={{ fill: "var(--surface-secondary)" }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "var(--text-muted)", paddingTop: "10px" }}
        />
        <Bar dataKey="successful" name="Successful" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="failed" name="Failed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}