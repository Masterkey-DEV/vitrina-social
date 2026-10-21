import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Intentamos obtener el token de la cookie
  const token = request.cookies.get("jwt_token")?.value;
  const { pathname } = request.nextUrl;

  // Definimos las rutas
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // CASO 1: El usuario intenta entrar al dashboard pero NO tiene token
  if (isDashboardPage && !token) {
    // Redirigimos al login y guardamos la intención original en un parámetro 'from'
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASO 2: El usuario YA tiene token e intenta ir a login o registro
  if (isAuthPage && token) {
    // Lo mandamos al dashboard porque ya está autenticado
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // En cualquier otro caso, dejamos pasar la petición
  return NextResponse.next();
}

// El matcher controla en qué rutas se ejecuta este script
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/foundations/register",
  ],
};
