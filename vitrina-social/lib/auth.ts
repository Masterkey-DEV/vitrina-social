import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "vitrina-social-dev-secret");

export interface JwtPayload {
  id: number;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ id: payload.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.id !== "number") return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}

export function bearerFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export type AuthUser = Awaited<ReturnType<typeof getAuthUser>>;

export async function getAuthUser(request: Request) {
  const token = bearerFromRequest(request);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      role: true,
      foundation: { include: { image: true } },
    },
  });

  if (!user || user.blocked) return null;
  return user;
}

export function isAdminUser(user: { role?: { name: string } | null } | null): boolean {
  const name = user?.role?.name;
  return name === "admin" || name === "strapi-super-admin";
}
