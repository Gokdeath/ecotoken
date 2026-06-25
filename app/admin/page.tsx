import { Activity, Blocks, Coins, Users } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/frontend/components/AppShell";
import { StatCard } from "@/frontend/components/StatCard";
import { requireAdmin } from "@/backend/auth/auth";
import { prisma } from "@/backend/db/prisma";
import { getGlobalStats } from "@/backend/services/stats";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [stats, users, actions, blocks] = await Promise.all([
    getGlobalStats(),
    prisma.user.findMany({ include: { wallet: true }, orderBy: { createdAt: "desc" } }),
    prisma.action.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.block.findMany({ orderBy: { id: "desc" }, take: 10 })
  ]);

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div>
          <p className="text-sm font-medium text-eco-700">Rol ADMIN</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Panel administrador</h1>
        </div>
        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Usuarios" value={stats.users.toString()} helper="Cuentas creadas" icon={Users} />
          <StatCard title="Acciones" value={stats.actions.toString()} helper="Registros totales" icon={Activity} />
          <StatCard title="EcoTokens" value={stats.totalTokens.toLocaleString("es-AR")} helper="Emitidos internamente" icon={Coins} />
          <StatCard title="Bloques" value={stats.blocks.toString()} helper="Cadena simulada" icon={Blocks} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <Panel title="Usuarios">
            {users.map((item) => (
              <Row key={item.id} left={`${item.firstName} ${item.lastName}`} right={`${item.wallet?.balance ?? 0} ECO`} sub={item.email} />
            ))}
          </Panel>
          <Panel title="Acciones recientes">
            {actions.map((action) => (
              <Row key={action.id} left={action.type} right={action.status} sub={`${action.user.firstName} - ${action.tokensAwarded} ECO`} />
            ))}
          </Panel>
          <div className="xl:col-span-2">
            <Panel title="Ultimos bloques">
              {blocks.map((block) => (
                <Row key={block.id} left={`Bloque #${block.id}`} right={block.hash.slice(0, 18)} sub={block.previousHash} />
              ))}
            </Panel>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="divide-y divide-slate-200">{children}</div>
    </div>
  );
}

function Row({ left, right, sub }: { left: string; right: string; sub: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="truncate font-medium">{left}</p>
        <p className="truncate text-sm text-slate-500">{sub}</p>
      </div>
      <p className="font-mono text-xs text-slate-500">{right}</p>
    </div>
  );
}
