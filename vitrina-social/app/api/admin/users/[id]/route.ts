import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isAdminUser(auth)) return apiError(403, "Solo administradores");

  const { id } = await params;
  const existing = await prisma.user.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Usuario no encontrado");

  const body = await request.json().catch(() => null);

  const data: any = {};
  if (body.blocked !== undefined) data.blocked = Boolean(body.blocked);

  if (body.role !== undefined || body.roleId !== undefined) {
    if (body.roleId !== undefined) {
      data.roleId = Number(body.roleId);
    } else {
      const role = await prisma.role.findUnique({ where: { name: String(body.role).toLowerCase() } });
      if (!role) return apiError(400, "Rol no encontrado");
      data.roleId = role.id;
    }
  }

  const user = await prisma.user.update({
    where: { documentId: id },
    data,
    include: { role: true },
  });

  return Response.json({
    data: {
      id: user.id,
      documentId: user.documentId,
      username: user.username,
      email: user.email,
      blocked: user.blocked,
      role: user.role ? { id: user.role.id, name: user.role.name, type: user.role.type } : null,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isAdminUser(auth)) return apiError(403, "Solo administradores");

  const { id } = await params;
  const existing = await prisma.user.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Usuario no encontrado");

  if (existing.id === auth.id) {
    return apiError(400, "No puedes eliminar tu propia cuenta");
  }

  await prisma.user.delete({ where: { documentId: id } });
  return Response.json({ data: { id } });
}
