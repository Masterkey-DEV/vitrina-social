import "server-only";
import { prisma } from "@/lib/prisma";
import {
  serializeProduct,
  serializeFoundation,
  serializeInitiative,
} from "@/lib/serialize";

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: { images: true, product_categories: true, usuario: true },
    });
    return { success: true, data: product ? serializeProduct(product) : null };
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return { success: false, data: null, error: "No se encontró el producto" };
  }
}

export async function getFoundations() {
  try {
    const foundations = await prisma.foundation.findMany({
      include: { image: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: foundations.map(serializeFoundation) };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getFoundationBySiglas(siglas: string) {
  try {
    const decoded = decodeURIComponent(siglas);
    const foundation = await prisma.foundation.findFirst({
      where: { siglas: decoded },
      include: {
        image: true,
        iniciatives: {
          include: { images: true, initiatives_categories: true, users: true },
        },
      },
    });
    return { success: true, data: foundation ? serializeFoundation(foundation) : null };
  } catch (error) {
    console.error("Fetch Foundation Error:", error);
    return { success: false, data: null };
  }
}

export async function getIniciatives(categoryName?: string | null) {
  try {
    const initiatives = await prisma.initiative.findMany({
      where:
        categoryName && categoryName !== "all"
          ? { initiatives_categories: { some: { name: categoryName } } }
          : undefined,
      include: { foundation: true, images: true, initiatives_categories: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: initiatives.map(serializeInitiative) };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar las iniciativas",
    };
  }
}

export async function getInitiativeCategories() {
  try {
    const categories = await prisma.initiativeCategory.findMany({
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: categories.map((c) => ({ id: c.id, name: c.name, documentId: c.documentId })),
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getInitiativeByDocumentId(documentId: string) {
  try {
    const initiative = await prisma.initiative.findUnique({
      where: { documentId },
      include: {
        foundation: true,
        images: true,
        initiatives_categories: true,
        users: true,
      },
    });
    return {
      success: true,
      data: initiative ? serializeInitiative(initiative) : null,
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error: "No se encontró la iniciativa" };
  }
}
