import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";
import { serializeInitiative } from "@/lib/serialize";
import { apiOk, apiError, parsePopulate } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const include = parsePopulate(request.nextUrl.searchParams, "iniciative");

  const initiative = await prisma.initiative.findUnique({
    where: { documentId: id },
    include,
  });
  if (!initiative) return apiError(404, "Iniciativa no encontrada");

  return apiOk(serializeInitiative(initiative));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (auth.role?.name !== "foundation" && !isAdminUser(auth)) {
    return apiError(403, "Solo fundaciones pueden editar iniciativas");
  }

  const { id } = await params;
  const existing = await prisma.initiative.findUnique({
    where: { documentId: id },
    include: { foundation: { include: { usuario: true } } },
  });
  if (!existing) return apiError(404, "Iniciativa no encontrada");
  if (existing.foundation?.usuarioId !== auth.id && !isAdminUser(auth)) {
    return apiError(403, "No tienes permiso para editar esta iniciativa");
  }

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const data: any = {};
  if (d.title !== undefined) data.title = String(d.title).trim();
  if (d.objective !== undefined) data.objective = d.objective ?? "";
  if (d.description !== undefined) data.description = d.description ?? null;

  const categoryIds = (d.initiatives_categories ?? []).map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n));
  const imageIds = (d.images ?? []).map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n));

  if (d.initiatives_categories !== undefined) {
    data.initiatives_categories = { set: categoryIds.map((id: number) => ({ id })) };
  }
  if (d.images !== undefined) {
    data.images = { set: imageIds.map((id: number) => ({ id })) };
  }

  const initiative = await prisma.initiative.update({
    where: { documentId: id },
    data,
    include: { foundation: true, images: true, initiatives_categories: true, users: true },
  });

  return apiOk(serializeInitiative(initiative));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (auth.role?.name !== "foundation" && !isAdminUser(auth)) {
    return apiError(403, "Solo fundaciones pueden eliminar iniciativas");
  }

  const { id } = await params;
  const existing = await prisma.initiative.findUnique({
    where: { documentId: id },
    include: { foundation: { include: { usuario: true } } },
  });
  if (!existing) return apiError(404, "Iniciativa no encontrada");
  if (existing.foundation?.usuarioId !== auth.id && !isAdminUser(auth)) {
    return apiError(403, "No tienes permiso para eliminar esta iniciativa");
  }

  await prisma.initiative.delete({ where: { documentId: id } });
  return apiOk({ id });
}
