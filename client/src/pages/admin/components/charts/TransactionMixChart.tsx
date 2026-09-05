import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface TransactionSlice {
  label: string;
  value: number;
}

const COLORS = ["#0ea5e9", "#f59e0b", "#22c55e", "#8b5cf6"];

export function TransactionMixChart({ data }: { data: TransactionSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
            fontSize: "13px",
            boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)"
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}