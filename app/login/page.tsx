import Link from "next/link";
import { Logo } from "@/frontend/components/AppShell";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 shadow-soft">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold">Ingresar</h1>
        <p className="mt-2 text-sm text-slate-500">Usa tu cuenta EcoToken para acceder al panel.</p>
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
          <input name="password" type="password" placeholder="Contrasena" required className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
          <button className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Ingresar</button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          No tenes cuenta? <Link href="/register" className="font-semibold text-eco-700">Registrate</Link>
        </p>
        <p className="mt-4 rounded-lg bg-eco-50 px-3 py-2 text-xs text-eco-700">Demo admin: admin@ecotoken.edu / EcoToken123!</p>
      </div>
    </main>
  );
}
