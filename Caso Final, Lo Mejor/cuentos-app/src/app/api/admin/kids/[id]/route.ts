import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { kidInputSchema } from "@/lib/schemas";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const kid = await prisma.childProfile.findUnique({
    where: { id },
    include: { tutor: { select: { email: true, id: true } } },
  });
  if (!kid) return NextResponse.json({ message: "Perfil no encontrado" }, { status: 404 });
  return NextResponse.json(kid);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = kidInputSchema.safeParse({
    ...body,
    interests: Array.isArray(body.interests)
      ? body.interests
      : String(body.interests ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    avoidTopics: Array.isArray(body.avoidTopics)
      ? body.avoidTopics
      : String(body.avoidTopics ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
  });
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
  }

  const updated = await prisma.childProfile.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  const { id } = await params;
  await prisma.childProfile.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

