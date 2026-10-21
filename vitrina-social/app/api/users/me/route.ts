import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { apiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const params = request.nextUrl.searchParams;
  const withFoundation = params.toString().includes("populate[foundation]");

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    include: {
      role: true,
      foundation: withFoundation ? { include: { image: true } } : false,
    },
  });

  if (!user) return apiError(401, "Usuario no encontrado");

  return Response.json(serializeUser(user));
}

const UPDATABLE = [
  "fullName",
  "phone",
  "whatsapp",
  "address",
  "city",
  "department",
  "bio",
  "receiveNewsletter",
  "receiveUpdates",
  "username",
];

export async function PUT(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const body = await request.json().catch(() => null);
  if (!body) return apiError(400, "Cuerpo inválido");

  const data: Record<string, unknown> = {};
  for (const field of UPDATABLE) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  try {
    const user = await prisma.user.update({
      where: { id: auth.id },
      data,
      include: { role: true, foundation: { include: { image: true } } },
    });
    return Response.json(serializeUser(user));
  } catch (err: any) {
    console.error(err);
    return apiError(500, "No se pudo actualizar el perfil");
  }
}
