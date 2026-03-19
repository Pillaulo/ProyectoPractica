import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AdminKidDeleteButton } from "@/components/admin-kid-delete-button";
import { readingLevelLabel } from "@/lib/labels";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminKidsPage() {
  await getAdminSessionOrRedirect();

  const kids = await prisma.childProfile.findMany({
    include: {
      tutor: { select: { email: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Niños de todos los tutores</h1>
        <div className="space-y-3">
          {kids.map((kid) => (
            <div key={kid.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{kid.displayName}</p>
                  <p className="text-sm text-slate-600">
                    Tutor: {kid.tutor.email} · Edad {kid.age} · Nivel {readingLevelLabel[kid.readingLevel]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Intereses: {kid.interests.join(", ") || "Sin intereses"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/kids/${kid.id}/edit`}
                    className="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    Editar
                  </Link>
                  <AdminKidDeleteButton kidId={kid.id} />
                </div>
              </div>
            </div>
          ))}
          {kids.length === 0 ? (
            <div className="rounded-xl bg-white p-5 text-sm text-slate-500 shadow-sm">
              No hay perfiles de niños.
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

