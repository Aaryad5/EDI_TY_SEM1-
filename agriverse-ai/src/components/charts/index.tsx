"use client";

import {
  Area,
  AreaChart as RC_AreaChart,
  Bar,
  BarChart as RC_BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RC_LineChart,
  Pie,
  PieChart as RC_PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RC_RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GREEN = ["#2d6a4f", "#52b788", "#95d5b2", "#1b4332", "#8b5e3c", "#d8f3dc", "#40916c", "#74c69d"];

function customTooltip(props: unknown) {
  const { active, payload, label } = (props ?? {}) as {
    active?: boolean;
    payload?: readonly { name?: string; value?: unknown; color?: string }[];
    label?: string;
  };
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-agri/15 bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-dark">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-1.5 text-dark/70">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color ?? GREEN[i] }} />
          {entry.name}: <span className="font-medium text-dark">{String(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function AreaChart({
  data,
  xKey,
  series,
  height = 240,
  unit = "",
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  height?: number;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RC_AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? GREEN[1]} stopOpacity={0.45} />
              <stop offset="100%" stopColor={s.color ?? GREEN[1]} stopOpacity={0.03} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.08)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <Tooltip content={customTooltip} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? GREEN[1]}
            strokeWidth={2.5}
            fill={`url(#grad_${s.key})`}
            unit={unit}
          />
        ))}
      </RC_AreaChart>
    </ResponsiveContainer>
  );
}

export function BarChart({
  data,
  xKey,
  series,
  height = 240,
  unit = "",
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  height?: number;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RC_BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.08)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <Tooltip content={customTooltip} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color ?? GREEN[0]} radius={[6, 6, 0, 0]} unit={unit} />
        ))}
      </RC_BarChart>
    </ResponsiveContainer>
  );
}

export function PieChart({
  data,
  height = 240,
}: {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RC_PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={3}>
          {data.map((entry, i) => (
            <Cell key={`cell_${i}`} fill={entry.color ?? GREEN[i % GREEN.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RC_PieChart>
    </ResponsiveContainer>
  );
}

export function RadialStatusChart({
  target,
  sections = [75, 38, 58, 22],
  height = 200,
}: {
  target: string;
  sections?: number[];
  height?: number;
}) {
  const data = sections.map((v, i) => ({
    name: i === 0 ? target : `Zone ${i}`,
    value: v,
    fill: GREEN[i % GREEN.length],
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="85%"
        barSize={12}
        data={data}
      >
        <RadialBar dataKey="value" background={{ fill: "#eaf1ec" }} cornerRadius={8} />
        <Legend iconSize={10} layout="vertical" wrapperStyle={{ fontSize: 11 }} verticalAlign="middle" align="right" />
        <Tooltip content={customTooltip} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function RadarChart({
  data,
  xKey,
  series,
  height = 240,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RC_RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(27,67,50,0.15)" />
        <PolarAngleAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#6b7c72" }} />
        <Radar
          dataKey={series[0]?.key ?? "value"}
          name={series[0]?.name ?? "Score"}
          stroke={series[0]?.color ?? GREEN[1]}
          fill={series[0]?.color ?? GREEN[1]}
          fillOpacity={0.35}
        />
        <Tooltip content={customTooltip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RC_RadarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({
  data,
  xKey,
  series,
  height = 240,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RC_LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.08)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7c72" }} axisLine={false} tickLine={false} />
        <Tooltip content={customTooltip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? GREEN[1]}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </RC_LineChart>
    </ResponsiveContainer>
  );
}