import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const templates = await prisma.promptTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const systemPrompt = String(body.systemPrompt ?? "").trim();
  const developerPrompt = String(body.developerPrompt ?? "").trim();

  if (!name || !systemPrompt || !developerPrompt) {
    return NextResponse.json({ message: "Campos requeridos" }, { status: 400 });
  }

  if (body.active) {
    await prisma.promptTemplate.updateMany({
      data: { active: false },
    });
  }

  const template = await prisma.promptTemplate.create({
    data: {
      name,
      systemPrompt,
      developerPrompt,
      active: !!body.active,
      rulesJson: body.rulesJson ?? null,
    },
  });
  return NextResponse.json(template, { status: 201 });
}

