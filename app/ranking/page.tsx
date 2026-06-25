import { Medal, Trophy } from "lucide-react";
import { AppShell } from "@/frontend/components/AppShell";
import { getCurrentUser } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const user = await getCurrentUser();
  const users = await prisma.user.findMany({
    include: {
      wallet: true,
      actions: { where: { status: "APPROVED" } }
    }
  });

  const ranking = users
    .map((item) => ({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      tokens: item.wallet?.balance ?? 0,
      co2: item.actions.reduce((sum, action) => sum + action.co2Compensated, 0)
    }))
    .sort((a, b) => b.tokens - a.tokens);

  return (
    <AppShell user={user ?? undefined}>
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div>
          <p className="text-sm font-medium text-eco-700">Comunidad EcoToken</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Ranking ecologico</h1>
        </div>
        <div className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="divide-y divide-slate-200">
            {ranking.map((row, index) => (
              <div key={row.id} className="grid grid-cols-[60px_1fr_auto] items-center gap-4 px-5 py-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-700">
                  {index === 0 ? <Trophy className="h-5 w-5 text-eco-600" /> : <Medal className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-semibold">#{index + 1} {row.name}</p>
                  <p className="text-sm text-slate-500">{row.co2.toFixed(2)} kg CO2 compensado</p>
                </div>
                <p className="text-right text-lg font-semibold text-eco-700">{row.tokens.toLocaleString("es-AR")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
