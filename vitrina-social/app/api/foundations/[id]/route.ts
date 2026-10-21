import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";
import { serializeFoundation } from "@/lib/serialize";
import { apiOk, apiError } from "@/lib/api";

const FOUNDATION_INCLUDE = {
  image: true,
  usuario: true,
  iniciatives: {
    include: { images: true, initiatives_categories: true, users: true },
  },
};

function isFoundation(auth: { role?: { name: string; type: string } | null } | null) {
  return auth?.role?.name === "foundation" || auth?.role?.type === "foundation";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const foundation = await prisma.foundation.findUnique({
    where: { documentId: id },
    include: FOUNDATION_INCLUDE,
  });
  if (!foundation) return apiError(404, "Fundación no encontrada");
  return apiOk(serializeFoundation(foundation));
}

const UPDATABLE = [
  "name",
  "siglas",
  "objective",
  "description",
  "whatsapp",
  "facebook",
  "instagram",
  "website",
  "twitter",
  "linkedin",
  "department",
  "city",
  "location",
  "phone",
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isFoundation(auth) && !isAdminUser(auth)) {
    return apiError(403, "Solo fundaciones pueden editar su perfil");
  }

  const { id } = await params;
  const existing = await prisma.foundation.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Fundación no encontrada");
  if (existing.usuarioId !== auth.id && !isAdminUser(auth)) {
    return apiError(403, "No tienes permiso para editar esta fundación");
  }

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const data: any = {};
  for (const field of UPDATABLE) {
    if (d[field] !== undefined) data[field] = d[field] || null;
  }
  if (d.image != null) {
    data.imageId = Number(d.image);
  }

  const foundation = await prisma.foundation.update({
    where: { documentId: id },
    data,
    include: FOUNDATION_INCLUDE,
  });

  return apiOk(serializeFoundation(foundation));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isFoundation(auth) && !isAdminUser(auth)) {
    return apiError(403, "Solo fundaciones pueden eliminar su perfil");
  }

  const { id } = await params;
  const existing = await prisma.foundation.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Fundación no encontrada");
  if (existing.usuarioId !== auth.id && !isAdminUser(auth)) {
    return apiError(403, "No tienes permiso para eliminar esta fundación");
  }

  await prisma.foundation.delete({ where: { documentId: id } });
  return apiOk({ id });
}
