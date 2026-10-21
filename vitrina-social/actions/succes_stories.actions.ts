import { API_URL } from "@/const/api";

export async function getStories() {
  try {
    const response = await fetch(`${API_URL}/api/iniciatives?populate=*`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al obtener iniciativas");
    }
  } catch (error) {}
}
