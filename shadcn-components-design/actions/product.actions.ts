import { Product } from "@/types/product";
import { API_URL } from "@/const/api";

/**
 * Obtiene las categorías de productos para los filtros locales
 */
export async function getProductCategories() {
  try {
    // ✅ product-category solo tiene "name" — sin slug
    const res = await fetch(
      `${API_URL}/api/product-categories?fields[0]=name`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error("Error al obtener categorías");

    const json = await res.json();

    const data = json.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return { success: false, data: [], error: "No se pudieron cargar las categorías" };
  }
}

/**
 * Obtiene productos filtrados por categoría
 */
export async function getProducts(categoryName?: string | null) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");

    if (categoryName && categoryName !== "all" && categoryName !== "Todos") {
      params.append("filters[product_categories][name][$eq]", categoryName);
    }

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener los productos");

    const json = await res.json();

    return { success: true, data: json.data as Product[] };
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return { success: false, data: [], error: "No se pudieron cargar los productos" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("filters[slug][$eq]", slug);

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener el producto");

    const json = await res.json();

    return {
      success: true,
      data: json.data && json.data.length > 0 ? (json.data[0] as Product) : null,
    };
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return { success: false, data: null, error: "No se encontró el producto" };
  }
}