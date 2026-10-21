// @/actions/foundation.actions.ts
import { API_URL } from "@/const/api";

export async function getFoundations() {
  try {
    const res = await fetch(`${API_URL}/api/foundations?populate=*`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener fundaciones");
    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getFoundationBySiglas(siglas: string) {
  try {
    const decodedSiglas = decodeURIComponent(siglas);
    const params = new URLSearchParams();

    // ✅ Strapi v5: no mezclar fields[] con populate[] en el mismo nivel
    // Usamos populate=* para los campos raíz y populate específico para relaciones

    // Iniciativas con sus relaciones
    params.append("populate[iniciatives][populate][images][fields][0]", "url");
    params.append("populate[iniciatives][populate][initiatives_categories][fields][0]", "name");
    params.append("populate[iniciatives][populate][users][fields][0]", "id");

    // Imagen de la fundación
    params.append("populate[image][fields][0]", "url");
    params.append("populate[image][fields][1]", "alternativeText");

    // Filtro
    params.append("filters[siglas][$eq]", decodedSiglas);

    const res = await fetch(`${API_URL}/api/foundations?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener la fundación");
    const json = await res.json();

    return { success: true, data: json.data?.[0] ?? null };
  } catch (error) {
    console.error("Fetch Foundation Error:", error);
    return { success: false, data: null };
  }
}