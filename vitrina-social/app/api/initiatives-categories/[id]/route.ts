import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";
import { serializeCategory } from "@/lib/serialize";
import { apiOk, apiError } from "@/lib/api";

async function requireAdmin(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return { error: apiError(401, "Debes estar autenticado") };
  if (!isAdminUser(auth)) return { error: apiError(403, "Solo administradores") };
  return { auth };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const name = String(body?.data?.name ?? body?.name ?? "").trim();
  if (!name) return apiError(400, "El nombre es obligatorio");

  const existing = await prisma.initiativeCategory.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Categoría no encontrada");

  const category = await prisma.initiativeCategory.update({
    where: { documentId: id },
    data: { name },
  });
  return apiOk(serializeCategory(category));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.initiativeCategory.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Categoría no encontrada");

  await prisma.initiativeCategory.delete({ where: { documentId: id } });
  return apiOk({ id });
}
