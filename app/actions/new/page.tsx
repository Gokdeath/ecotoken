import { AppShell } from "@/frontend/components/AppShell";
import { ActionForm } from "@/frontend/components/ActionForm";
import { requireUser } from "@/backend/auth/auth";

export default async function NewActionPage() {
  const user = await requireUser();

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-7">
          <p className="text-sm font-medium text-eco-700">Validacion con IA simulada</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Registrar accion sustentable</h1>
          <p className="mt-2 text-slate-500">Carga evidencia, descripcion y cantidad para recibir EcoTokens simulados.</p>
        </div>
        <ActionForm />
      </div>
    </AppShell>
  );
}
