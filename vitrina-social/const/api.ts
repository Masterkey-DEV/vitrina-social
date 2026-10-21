// Resuelve la URL base de la API.
// - En el navegador: se usa ruta relativa (misma app en Vercel).
// - En el servidor (SSR/route handlers): se usa una URL absoluta
//   (NEXT_PUBLIC_APP_URL, o VERCEL_URL en producción, o localhost en dev).
export const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
    : "";
