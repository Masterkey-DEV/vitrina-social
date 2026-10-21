import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeCategory } from "@/lib/serialize";
import { apiOk, apiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const sort = request.nextUrl.searchParams.get("sort");
  let orderBy: any = undefined;
  if (sort) {
    const [field, direction] = sort.split(":");
    orderBy = { [field]: direction === "desc" ? "desc" : "asc" };
  }

  const categories = await prisma.initiativeCategory.findMany({ orderBy });
  return apiOk(categories.map(serializeCategory));
}

function isAdmin(auth: { role?: { name: string } | null } | null) {
  const n = auth?.role?.name;
  return n === "admin" || n === "strapi-super-admin";
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");
  if (!isAdmin(auth)) return apiError(403, "Solo administradores pueden crear categorías");

  const body = await request.json().catch(() => null);
  const name = String(body?.data?.name ?? body?.name ?? "").trim();
  if (!name) return apiError(400, "El nombre es obligatorio");

  const category = await prisma.initiativeCategory.create({
    data: { name, publishedAt: new Date() },
  });
  return apiOk(serializeCategory(category));
}
