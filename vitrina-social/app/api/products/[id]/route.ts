import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { apiOk, apiError } from "@/lib/api";

const PRODUCT_INCLUDE = {
  images: true,
  product_categories: true,
  usuario: true,
};

function isAdmin(auth: { role?: { name: string } | null } | null) {
  return auth?.role?.name === "admin" || auth?.role?.name === "strapi-super-admin";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { documentId: id },
    include: PRODUCT_INCLUDE,
  });
  if (!product) return apiError(404, "Producto no encontrado");
  return apiOk(serializeProduct(product));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Producto no encontrado");

  if (existing.usuarioId !== auth.id && !isAdmin(auth)) {
    return apiError(403, "No tienes permiso para editar este producto");
  }

  const body = await request.json().catch(() => null);
  const d = body?.data ?? body ?? {};

  const data: any = {};
  if (d.name !== undefined) data.name = String(d.name).trim();
  if (d.slug !== undefined) data.slug = String(d.slug).trim();
  if (d.shortDescription !== undefined) data.shortDescription = d.shortDescription ?? null;
  if (d.description !== undefined) data.description = d.description ?? null;
  if (d.price !== undefined) data.price = d.price !== "" && d.price != null ? Number(d.price) : null;
  if (d.stock !== undefined) data.stock = d.stock !== "" && d.stock != null ? Number(d.stock) : null;
  if (d.featured !== undefined) data.featured = Boolean(d.featured);

  const categoryIds = (d.product_categories ?? d.categories ?? []).map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n));
  const imageIds = (d.images ?? []).map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n));

  if (d.product_categories !== undefined || d.categories !== undefined) {
    data.product_categories = { set: categoryIds.map((id: number) => ({ id })) };
  }
  if (d.images !== undefined) {
    data.images = { set: imageIds.map((id: number) => ({ id })) };
  }

  const product = await prisma.product.update({
    where: { documentId: id },
    data,
    include: PRODUCT_INCLUDE,
  });

  return apiOk(serializeProduct(product));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { documentId: id } });
  if (!existing) return apiError(404, "Producto no encontrado");

  if (existing.usuarioId !== auth.id && !isAdmin(auth)) {
    return apiError(403, "No tienes permiso para eliminar este producto");
  }

  const product = await prisma.product.delete({ where: { documentId: id } });
  return apiOk(serializeProduct(product));
}
