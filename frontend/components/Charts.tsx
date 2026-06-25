"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/types";

export function TokensChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Tokens por mes</h2>
        <p className="text-sm text-slate-500">EcoTokens simulados acreditados por acciones aprobadas.</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="tokens" stroke="#16a34a" fill="url(#tokens)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ImpactChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Impacto ambiental</h2>
        <p className="text-sm text-slate-500">CO2 compensado y acciones realizadas.</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="co2" fill="#15803d" radius={[6, 6, 0, 0]} />
          <Bar dataKey="acciones" fill="#0f172a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
