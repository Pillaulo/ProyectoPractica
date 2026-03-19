import { AppNav } from "@/components/app-nav";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminStoriesPage() {
  await getAdminSessionOrRedirect();

  const stories = await prisma.story.findMany({
    include: {
      tutor: { select: { email: true } },
      childProfile: { select: { displayName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Cuentos generados</h1>
        <div className="space-y-3">
          {stories.map((story) => (
            <div key={story.id} className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{story.title}</p>
              <p className="text-sm text-slate-600">
                Tutor: {story.tutor.email} · Niño: {story.childProfile.displayName} ·{" "}
                {new Date(story.createdAt).toLocaleString("es-CL")}
              </p>
              <p className="mt-2 text-sm text-slate-700 line-clamp-3">{story.contentText}</p>
            </div>
          ))}
          {stories.length === 0 ? (
            <div className="rounded-xl bg-white p-5 shadow-sm text-sm text-slate-500">
              Aún no hay cuentos generados.
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

