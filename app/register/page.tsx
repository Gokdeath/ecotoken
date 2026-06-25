import Link from "next/link";
import { Logo } from "@/frontend/components/AppShell";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-7 shadow-soft">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold">Crear cuenta</h1>
        <form action="/api/auth/register" method="post" className="mt-6 grid gap-4 sm:grid-cols-2">
          <input name="firstName" placeholder="Nombre" required className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
          <input name="lastName" placeholder="Apellido" required className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500" />
          <input name="email" type="email" placeholder="Email" required className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500 sm:col-span-2" />
          <input name="password" type="password" minLength={8} placeholder="Contrasena" required className="rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-eco-500 sm:col-span-2" />
          <button className="rounded-lg bg-eco-500 px-4 py-3 text-sm font-semibold text-white hover:bg-eco-600 sm:col-span-2">Registrarme</button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          Ya tenes cuenta? <Link href="/login" className="font-semibold text-eco-700">Ingresar</Link>
        </p>
      </div>
    </main>
  );
}
