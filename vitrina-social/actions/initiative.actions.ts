// @/actions/initiative.actions.ts
import { API_URL } from "@/const/api";

export async function getInitiativeCategories() {
  try {
    const res = await fetch(
      `${API_URL}/api/initiatives-categories?fields[0]=name&fields[1]=id`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("Error al obtener categorías");
    const json = await res.json();
    return { success: true, data: json.data as { id: number; name: string }[] };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getIniciatives(categoryName?: string | null) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");

    // ✅ Campo correcto: initiatives_categories (plural, array)
    if (categoryName && categoryName !== "all") {
      params.append("filters[initiatives_categories][name][$eq]", categoryName);
    }

    const res = await fetch(`${API_URL}/api/iniciatives?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener iniciativas");

    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar las iniciativas",
    };
  }
}

export async function getInitiativeByDocumentId(documentId: string) {
  try {
    // populate=* en Strapi 5 NO popula users (relación a plugin::users-permissions.user)
    // Hay que pedirlo explícitamente con populate[users][fields]
    const params = new URLSearchParams({
      "populate[users][fields][0]": "id",        // solo IDs, no datos sensibles
      "populate[foundation][populate]": "*",
      "populate[initiatives_categories][fields][0]": "name",
      "populate[images][fields][0]": "url",
    });

    const res = await fetch(
      `${API_URL}/api/iniciatives/${documentId}?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Error al obtener la iniciativa");

    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, error: "No se encontró la iniciativa" };
  }
}
