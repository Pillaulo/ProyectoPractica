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

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  const kids = await prisma.childProfile.findMany({
    include: {
      tutor: {
        select: { id: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(kids);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const tutorId = String(body.tutorId ?? "");
  if (!tutorId) {
    return NextResponse.json({ message: "tutorId es requerido" }, { status: 400 });
  }

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

  const kid = await prisma.childProfile.create({
    data: {
      tutorId,
      ...parsed.data,
    },
  });
  return NextResponse.json(kid, { status: 201 });
}

