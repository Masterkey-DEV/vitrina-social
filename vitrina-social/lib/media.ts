import { API_URL } from "@/const/api";

/**
 * Devuelve una URL de imagen válida independientemente de si
 * el proveedor es Cloudinary (URL absoluta) o almacenamiento
 * local de Strapi (ruta relativa).
 *
 * - Cloudinary:  "https://res.cloudinary.com/..." → se usa directo
 * - Local:       "/uploads/foto.jpg"              → API_URL + ruta
 * - Vacía/null:  fallback al placeholder
 */
export function getMediaUrl(
  url?: string | null,
  fallback = "/placeholder.jpg",
): string {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url}`;
}