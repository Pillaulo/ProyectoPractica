import { AppNav } from "@/components/app-nav";
import { TemplateForm } from "@/components/template-form";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminTemplatesPage() {
  await getAdminSessionOrRedirect();
  const templates = await prisma.promptTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2">
        <section>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">Plantillas de prompt</h1>
          <TemplateForm />
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Historial</h2>
          {templates.map((template) => (
            <div key={template.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-slate-900">{template.name}</p>
                {template.active ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Activa
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500">
                {new Date(template.updatedAt).toLocaleString("es-CL")}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-700">{template.systemPrompt}</p>
            </div>
          ))}
          {templates.length === 0 ? (
            <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
              No hay plantillas aún.
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

