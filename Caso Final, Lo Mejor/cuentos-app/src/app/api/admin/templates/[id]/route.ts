import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.active) {
    await prisma.promptTemplate.updateMany({
      where: { id: { not: id } },
      data: { active: false },
    });
  }

  const template = await prisma.promptTemplate.update({
    where: { id },
    data: {
      name: body.name,
      systemPrompt: body.systemPrompt,
      developerPrompt: body.developerPrompt,
      active: !!body.active,
      rulesJson: body.rulesJson ?? null,
    },
  });
  return NextResponse.json(template);
}

