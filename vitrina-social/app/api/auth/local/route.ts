import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { apiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError(400, "Cuerpo inválido");

  const identifier = String(body.identifier ?? "").trim();
  const password = String(body.password ?? "");

  if (!identifier || !password) {
    return apiError(400, "identifier y password son obligatorios");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { username: identifier }],
    },
    include: { role: true, foundation: { include: { image: true } } },
  });

  if (!user) {
    return apiError(400, "Identificador o contraseña incorrectos");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return apiError(400, "Identificador o contraseña incorrectos");
  }

  const jwt = await signToken({ id: user.id });
  return Response.json({ jwt, user: serializeUser(user) });
}
