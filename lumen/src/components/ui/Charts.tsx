"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e6ebf2",
  borderRadius: 12,
  fontSize: 12,
};

export function TrafficAreaChart({
  data,
  dataKey = "traffic",
  xKey = "month",
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12856f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#12856f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6ebf2" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey={dataKey} stroke="#0f6b5c" strokeWidth={2.5} fill="url(#trafficFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarChart({
  data,
  dataKey,
  xKey,
  color = "#0f6b5c",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  xKey: string;
  color?: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#e6ebf2" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DualLineChart({
  data,
  aKey,
  bKey,
  xKey,
}: {
  data: Record<string, string | number>[];
  aKey: string;
  bKey: string;
  xKey: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#e6ebf2" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7b8ba5", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={aKey} stroke="#0f6b5c" strokeWidth={2.2} dot={false} />
          <Line type="monotone" dataKey={bKey} stroke="#e7a116" strokeWidth={2.2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_COLORS = ["#0f6b5c", "#12856f", "#e7a116", "#2563eb", "#7b8ba5", "#d64545"];

export function DonutChart({
  data,
  nameKey,
  valueKey,
}: {
  data: Record<string, string | number>[];
  nameKey: string;
  valueKey: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius={55} outerRadius={90} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
