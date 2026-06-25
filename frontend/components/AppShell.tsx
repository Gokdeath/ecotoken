import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Leaf, LayoutDashboard, PlusCircle, Blocks, Trophy, ShieldCheck, LogOut } from "lucide-react";
import { clearSessionCookie } from "@/backend/auth/auth";

type AppShellProps = {
  children: ReactNode;
  user?: {
    firstName: string;
    lastName: string;
    role: string;
  };
};

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-eco-500 text-white shadow-soft">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="text-xl">EcoToken</span>
    </Link>
  );
}

export function AppShell({ children, user }: AppShellProps) {
  async function logout() {
    "use server";
    await clearSessionCookie();
    redirect("/");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/actions/new", label: "Registrar", icon: PlusCircle },
    { href: "/blockchain", label: "Blockchain", icon: Blocks },
    { href: "/ranking", label: "Ranking", icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white/90 px-5 py-6 backdrop-blur lg:block">
        <Logo />
        <nav className="mt-9 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          {user?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>
        {user ? (
          <div className="absolute bottom-6 left-5 right-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{user.role}</p>
            </div>
            <form action={logout}>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </form>
          </div>
        ) : null}
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/dashboard" className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white">
            Ingresar
          </Link>
        </div>
      </header>

      <main className="lg:pl-72">{children}</main>
    </div>
  );
}
