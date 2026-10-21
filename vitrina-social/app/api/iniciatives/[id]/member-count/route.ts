import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const initiative = await prisma.initiative.findUnique({
    where: { documentId: id },
    include: { users: { select: { id: true } } },
  });
  if (!initiative) return apiError(404, "Iniciativa no encontrada");

  return Response.json({ count: initiative.users.length });
}
