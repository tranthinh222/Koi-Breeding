import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface LifeStagePoint {
  stage: string; // EGG, LARVA, FRY, JUVENILE, ADULT
  count: number;
}

export function KoiLifeStageChart({ data }: { data: LifeStagePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: -16 }}>
        <XAxis dataKey="stage" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            background: "var(--dropdown-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            color: "var(--dropdown-text)",
          }}
          cursor={{ fill: "var(--surface-secondary)" }}
        />
        {/* Tạo hiệu ứng phễu với màu Gradient/Tím */}
        <Bar dataKey="count" name="Koi count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
