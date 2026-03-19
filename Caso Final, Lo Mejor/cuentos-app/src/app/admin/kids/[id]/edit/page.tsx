import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { KidForm } from "@/components/kid-form";
import { prisma } from "@/lib/db";
import { getAdminSessionOrRedirect } from "@/lib/server-auth";

export default async function AdminEditKidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getAdminSessionOrRedirect();
  const { id } = await params;

  const kid = await prisma.childProfile.findUnique({ where: { id } });
  if (!kid) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav role="ADMIN" />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="mb-5 text-2xl font-bold text-slate-900">Editar perfil de niño (admin)</h1>
        <KidForm
          mode="edit"
          kidId={kid.id}
          apiBasePath="/api/admin/kids"
          redirectPath="/admin/kids"
          initial={{
            displayName: kid.displayName,
            age: kid.age,
            readingLevel: kid.readingLevel,
            language: kid.language,
            spanishVariant: kid.spanishVariant,
            preferredLength: kid.preferredLength,
            defaultSegmentMode: kid.defaultSegmentMode,
            interests: kid.interests,
            avoidTopics: kid.avoidTopics,
          }}
        />
      </main>
    </div>
  );
}

