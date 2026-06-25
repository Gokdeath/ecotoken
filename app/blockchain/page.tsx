import { AppShell } from "@/frontend/components/AppShell";
import { BlockList } from "@/frontend/components/BlockList";
import { getCurrentUser } from "@/backend/auth/auth";
import { blockchain } from "@/backend/services/blockchain";
import { prisma } from "@/backend/db/prisma";

export const dynamic = "force-dynamic";

export default async function BlockchainPage() {
  const user = await getCurrentUser();
  const [blocks, valid] = await Promise.all([
    prisma.block.findMany({ orderBy: { id: "desc" }, take: 100 }),
    blockchain.isValid()
  ]);

  return (
    <AppShell user={user ?? undefined}>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-eco-700">Explorador tipo Etherscan</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Blockchain simulada</h1>
            <p className="mt-2 text-slate-500">Bloques enlazados por hash SHA-256 para demostrar inmutabilidad y trazabilidad.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-soft">
            Integridad: <span className={valid ? "font-semibold text-eco-700" : "font-semibold text-red-700"}>{valid ? "Valida" : "Inconsistente"}</span>
          </div>
        </div>
        <div className="mt-7">
          <BlockList blocks={blocks} />
        </div>
      </div>
    </AppShell>
  );
}
