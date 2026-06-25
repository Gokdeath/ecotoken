import { Activity, CloudSun, Coins, Trophy } from "lucide-react";
import { AppShell } from "@/frontend/components/AppShell";
import { ImpactChart, TokensChart } from "@/frontend/components/Charts";
import { StatCard } from "@/frontend/components/StatCard";
import { requireUser } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";
import { getUserStats } from "@/backend/services/stats";
import type { ChartPoint } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await getUserStats(user.id);
  const rank = await getRank(user.id);
  const chartData = buildMonthlyData(stats.actions);

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-eco-700">Panel de impacto</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Hola, {user.firstName}</h1>
            <p className="mt-2 text-slate-500">Tu actividad sustentable convertida en trazabilidad academica.</p>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Saldo EcoTokens" value={stats.balance.toLocaleString("es-AR")} helper="Token interno simulado" icon={Coins} />
          <StatCard title="CO2 compensado" value={`${stats.totalCo2} kg`} helper="Calculado por reglas IA" icon={CloudSun} />
          <StatCard title="Acciones" value={stats.actions.length.toString()} helper="Evidencias registradas" icon={Activity} />
          <StatCard title="Ranking" value={`#${rank}`} helper="Posicion comunitaria" icon={Trophy} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <TokensChart data={chartData} />
          <ImpactChart data={chartData} />
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Historial de transacciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Accion</th>
                  <th className="px-5 py-3">Tokens</th>
                  <th className="px-5 py-3">Bloque</th>
                  <th className="px-5 py-3">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-5 py-4 text-slate-500">{tx.createdAt.toLocaleDateString("es-AR")}</td>
                    <td className="px-5 py-4 font-medium">{tx.action?.type ?? "Ajuste"}</td>
                    <td className="px-5 py-4 text-eco-700">+{tx.amount}</td>
                    <td className="px-5 py-4">#{tx.block?.id ?? "-"}</td>
                    <td className="max-w-[300px] truncate px-5 py-4 font-mono text-xs text-slate-500">{tx.block?.hash ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

async function getRank(userId: string) {
  const wallets = await prisma.wallet.findMany({ orderBy: { balance: "desc" } });
  return wallets.findIndex((wallet) => wallet.userId === userId) + 1 || wallets.length;
}

function buildMonthlyData(actions: { createdAt: Date; tokensAwarded: number; co2Compensated: number }[]): ChartPoint[] {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
  return months.map((name, index) => {
    const monthActions = actions.filter((action) => action.createdAt.getMonth() === index);
    return {
      name,
      tokens: monthActions.reduce((sum, action) => sum + action.tokensAwarded, 0),
      co2: Number(monthActions.reduce((sum, action) => sum + action.co2Compensated, 0).toFixed(2)),
      acciones: monthActions.length
    };
  });
}
