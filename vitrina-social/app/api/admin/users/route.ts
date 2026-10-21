import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isAdminUser(auth)) return apiError(403, "Solo administradores");

  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    data: users.map((u) => ({
      id: u.id,
      documentId: u.documentId,
      username: u.username,
      email: u.email,
      blocked: u.blocked,
      role: u.role ? { id: u.role.id, name: u.role.name, type: u.role.type } : null,
      createdAt: u.createdAt,
    })),
  });
}
