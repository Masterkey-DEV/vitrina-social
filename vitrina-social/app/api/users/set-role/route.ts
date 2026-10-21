import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { apiError } from "@/lib/api";

const VALID_ROLES = ["member", "entrepreneur", "foundation", "authenticated"];

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const body = await request.json().catch(() => null);
  const roleName = String(body?.role ?? "").toLowerCase();

  if (!VALID_ROLES.includes(roleName)) {
    return apiError(400, 'Rol no válido. Debe ser "member", "entrepreneur" o "foundation"');
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return apiError(500, `Rol "${roleName}" no encontrado`);

  await prisma.user.update({
    where: { id: auth.id },
    data: { roleId: role.id },
  });

  return Response.json({ message: `Rol "${roleName}" asignado correctamente` });
}
