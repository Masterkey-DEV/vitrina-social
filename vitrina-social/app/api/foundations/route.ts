import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeFoundation } from "@/lib/serialize";
import { apiOk, apiError, parseFilters, parsePopulate, parsePagination } from "@/lib/api";

const FOUNDATION_INCLUDE = {
  image: true,
  usuario: true,
  iniciatives: {
    include: {
      images: true,
      initiatives_categories: true,
      users: true,
    },
  },
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const where = parseFilters(params, "foundation");
  const include = parsePopulate(params, "foundation");
  const { take, skip } = parsePagination(params);

  const [items, total] = await Promise.all([
    prisma.foundation.findMany({ where, include, take, skip, orderBy: { createdAt: "desc" } }),
    prisma.foundation.count({ where }),
  ]);

  return apiOk(items.map(serializeFoundation), {
    pagination: { page: 1, pageSize: items.length, pageCount: 1, total },
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const existing = await prisma.foundation.findFirst({ where: { usuarioId: auth.id } });
  if (existing) return apiError(400, "Ya tienes una fundación registrada");

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const name = String(d.name ?? "").trim();
  const siglas = String(d.siglas ?? "").trim();
  if (!name || !siglas) return apiError(400, "name y siglas son obligatorios");

  const imageId = d.image != null ? Number(d.image) : null;

  try {
    const foundation = await prisma.foundation.create({
      data: {
        name,
        siglas,
        objective: d.objective ?? null,
        description: d.description ?? null,
        whatsapp: d.whatsapp ?? null,
        facebook: d.facebook ?? null,
        instagram: d.instagram ?? null,
        website: d.website ?? null,
        twitter: d.twitter ?? null,
        linkedin: d.linkedin ?? null,
        department: d.department ?? null,
        city: d.city ?? null,
        location: d.location ?? null,
        phone: d.phone ?? null,
        usuarioId: auth.id,
        publishedAt: new Date(),
        ...(imageId && Number.isFinite(imageId) ? { imageId } : {}),
      },
      include: FOUNDATION_INCLUDE,
    });

    return apiOk(serializeFoundation(foundation));
  } catch (err: any) {
    if (String(err?.message ?? "").includes("Unique")) {
      return apiError(400, "El nombre o las siglas ya están en uso");
    }
    console.error(err);
    return apiError(500, "Error al crear la fundación");
  }
}
