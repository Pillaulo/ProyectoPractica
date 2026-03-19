import { AppNav } from "@/components/app-nav";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminHomePage() {
  await getAdminSessionOrRedirect();

  const [usersCount, kidsCount, storiesCount, activeTemplate] = await Promise.all([
    prisma.user.count(),
    prisma.childProfile.count(),
    prisma.story.count(),
    prisma.promptTemplate.findFirst({ where: { active: true } }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Panel de administración</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card label="Usuarios" value={usersCount} />
          <Card label="Perfiles de niños" value={kidsCount} />
          <Card label="Cuentos generados" value={storiesCount} />
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Plantilla activa</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {activeTemplate?.name ?? "Sin plantilla activa"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

