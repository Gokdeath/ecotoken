import Link from "next/link";
import { ArrowRight, BarChart3, Blocks, BrainCircuit, Leaf, ShieldCheck, WalletCards } from "lucide-react";
import { Logo } from "@/frontend/components/AppShell";
import { StatCard } from "@/frontend/components/StatCard";
import { getGlobalStats } from "@/backend/services/stats";

export const dynamic = "force-dynamic";

const benefits = [
  {
    title: "IA simulada",
    text: "Reglas matematicas validan cada accion y estiman CO2 compensado.",
    icon: BrainCircuit
  },
  {
    title: "Tokens internos",
    text: "1 kg de CO2 equivale a 100 EcoTokens, sin ERC20 ni Solidity.",
    icon: WalletCards
  },
  {
    title: "Trazabilidad",
    text: "Cada validacion crea un bloque con SHA-256 y hash anterior.",
    icon: BarChart3
  }
];

export default async function HomePage() {
  const stats = await getGlobalStats().catch(() => ({
    users: 0,
    actions: 0,
    blocks: 0,
    totalCo2: 0,
    totalTokens: 0
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/login" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Ingresar
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-eco-100 bg-white px-3 py-2 text-sm font-medium text-eco-700 shadow-soft">
            <ShieldCheck className="h-4 w-4" />
            Demo academica sin criptomonedas reales
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
            EcoToken
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Plataforma educativa que simula creditos de carbono con validacion de IA, tokens internos y una blockchain academica trazable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-eco-500 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-eco-600">
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/blockchain" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Ver blockchain
              <Blocks className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard title="Usuarios" value={stats.users.toString()} helper="Comunidad demo" icon={Leaf} />
            <StatCard title="Acciones" value={stats.actions.toString()} helper="Evidencias registradas" icon={BrainCircuit} />
            <StatCard title="EcoTokens" value={stats.totalTokens.toLocaleString("es-AR")} helper="Saldo simulado" icon={WalletCards} />
            <StatCard title="Bloques" value={stats.blocks.toString()} helper="Cadena academica" icon={Blocks} />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
          {benefits.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-slate-200 p-5">
              <Icon className="h-6 w-6 text-eco-600" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
