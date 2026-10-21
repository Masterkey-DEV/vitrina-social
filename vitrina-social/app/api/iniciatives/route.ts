import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeInitiative } from "@/lib/serialize";
import { apiOk, apiError, parseFilters, parsePopulate, parsePagination } from "@/lib/api";

const INITIATIVE_INCLUDE = {
  foundation: true,
  images: true,
  initiatives_categories: true,
  users: true,
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const where = parseFilters(params, "iniciative");
  const include = parsePopulate(params, "iniciative");
  const { take, skip } = parsePagination(params);

  const [items, total] = await Promise.all([
    prisma.initiative.findMany({ where, include, take, skip, orderBy: { createdAt: "desc" } }),
    prisma.initiative.count({ where }),
  ]);

  return apiOk(items.map(serializeInitiative), {
    pagination: { page: 1, pageSize: items.length, pageCount: 1, total },
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (auth.role?.name !== "foundation") {
    return apiError(403, "Solo fundaciones pueden crear iniciativas");
  }

  const foundation = await prisma.foundation.findFirst({ where: { usuarioId: auth.id } });
  if (!foundation) return apiError(400, "No tienes una fundación registrada");

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const title = String(d.title ?? "").trim();
  if (!title) return apiError(400, "El título es obligatorio");

  const categoryIds = (d.initiatives_categories ?? [])
    .map((n: any) => Number(n))
    .filter((n: number) => Number.isFinite(n));
  const imageIds = (d.images ?? [])
    .map((n: any) => Number(n))
    .filter((n: number) => Number.isFinite(n));

  const initiative = await prisma.initiative.create({
    data: {
      title,
      objective: d.objective ?? "",
      description: d.description ?? null,
      foundationId: foundation.id,
      publishedAt: new Date(),
      ...(categoryIds.length
        ? { initiatives_categories: { connect: categoryIds.map((id: number) => ({ id })) } }
        : {}),
      ...(imageIds.length
        ? { images: { connect: imageIds.map((id: number) => ({ id })) } }
        : {}),
    },
    include: INITIATIVE_INCLUDE,
  });

  return apiOk(serializeInitiative(initiative));
}
