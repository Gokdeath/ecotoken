import { Blocks } from "lucide-react";

type BlockListProps = {
  blocks: {
    id: number;
    hash: string;
    previousHash: string;
    timestamp: Date;
    data: string;
    nonce: number;
  }[];
};

export function BlockList({ blocks }: BlockListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Blocks className="h-5 w-5 text-eco-600" />
          Cadena simulada
        </h2>
      </div>
      <div className="divide-y divide-slate-200">
        {blocks.map((block) => (
          <article key={block.id} className="grid gap-4 p-5 xl:grid-cols-[110px_1fr]">
            <div>
              <p className="text-sm text-slate-500">Bloque</p>
              <p className="text-2xl font-semibold">#{block.id}</p>
              <p className="mt-2 text-xs text-slate-500">Nonce {block.nonce}</p>
            </div>
            <div className="min-w-0 space-y-3">
              <HashLine label="Hash actual" value={block.hash} tone="current" />
              <HashLine label="Hash anterior" value={block.previousHash} />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Datos</p>
                <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{formatData(block.data)}</pre>
              </div>
              <p className="text-sm text-slate-500">{block.timestamp.toLocaleString("es-AR")}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function HashLine({ label, value, tone }: { label: string; value: string; tone?: "current" }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-1 break-all rounded-lg px-3 py-2 font-mono text-xs ${tone === "current" ? "bg-eco-50 text-eco-700" : "bg-slate-50 text-slate-600"}`}>
        {value}
      </p>
    </div>
  );
}

function formatData(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}
