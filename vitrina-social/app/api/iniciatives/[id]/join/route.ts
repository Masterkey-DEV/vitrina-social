import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeInitiative } from "@/lib/serialize";
import { apiOk, apiError } from "@/lib/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (auth.role?.name !== "member") {
    return apiError(403, 'Solo usuarios con rol "member" pueden unirse');
  }

  const { id } = await params;
  const initiative = await prisma.initiative.findUnique({
    where: { documentId: id },
    include: { users: { select: { id: true } } },
  });
  if (!initiative) return apiError(404, "Iniciativa no encontrada");

  if (initiative.users.some((u) => u.id === auth.id)) {
    return apiError(400, "Ya eres miembro de esta iniciativa");
  }

  const updated = await prisma.initiative.update({
    where: { documentId: id },
    data: { users: { connect: { id: auth.id } } },
    include: { foundation: true, images: true, initiatives_categories: true, users: true },
  });

  return apiOk(serializeInitiative(updated));
}
