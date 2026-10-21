import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { apiOk, apiError, parseFilters, parsePopulate, parsePagination } from "@/lib/api";

function autoSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const PRODUCT_INCLUDE = {
  images: true,
  product_categories: true,
  usuario: true,
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const where = parseFilters(params, "product");
  const include = parsePopulate(params, "product");
  const { take, skip } = parsePagination(params);

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include, take, skip, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  return apiOk(items.map(serializeProduct), {
    pagination: { page: 1, pageSize: items.length, pageCount: 1, total },
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const name = String(d.name ?? "").trim();
  if (!name) return apiError(400, "El nombre es obligatorio");

  const categoryIds = (d.product_categories ?? d.categories ?? [])
    .map((n: any) => Number(n))
    .filter((n: number) => Number.isFinite(n));
  const imageIds = (d.images ?? [])
    .map((n: any) => Number(n))
    .filter((n: number) => Number.isFinite(n));

  const product = await prisma.product.create({
    data: {
      name,
      slug: String(d.slug ?? "").trim() || autoSlug(name),
      shortDescription: d.shortDescription ?? null,
      description: d.description ?? null,
      price: d.price != null && d.price !== "" ? Number(d.price) : null,
      stock: d.stock != null && d.stock !== "" ? Number(d.stock) : null,
      featured: Boolean(d.featured),
      usuarioId: auth.id,
      publishedAt: new Date(),
      ...(categoryIds.length
        ? { product_categories: { connect: categoryIds.map((id: number) => ({ id })) } }
        : {}),
      ...(imageIds.length
        ? { images: { connect: imageIds.map((id: number) => ({ id })) } }
        : {}),
    },
    include: PRODUCT_INCLUDE,
  });

  return apiOk(serializeProduct(product));
}
