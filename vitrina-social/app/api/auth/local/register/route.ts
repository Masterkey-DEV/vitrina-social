import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { apiError } from "@/lib/api";

const USER_FIELDS = [
  "fullName",
  "phone",
  "whatsapp",
  "address",
  "city",
  "department",
  "bio",
  "receiveNewsletter",
  "receiveUpdates",
];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError(400, "Cuerpo inválido");

  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!username || !email || !password) {
    return apiError(400, "username, email y password son obligatorios");
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return apiError(400, "Email or Username are already taken");
  }

  let roleId: number | null = null;
  const defaultRole = await prisma.role.findUnique({
    where: { name: "authenticated" },
  });
  if (defaultRole) roleId = defaultRole.id;

  const extra: Record<string, unknown> = {};
  for (const field of USER_FIELDS) {
    if (body[field] !== undefined && body[field] !== null && body[field] !== "") {
      extra[field] = body[field];
    }
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        provider: "local",
        confirmed: true,
        roleId,
        ...extra,
      },
      include: { role: true, foundation: { include: { image: true } } },
    });

    const jwt = await signToken({ id: user.id });
    return Response.json({ jwt, user: serializeUser(user) });
  } catch (err: any) {
    if (String(err?.message ?? "").includes("Unique")) {
      return apiError(400, "Email or Username are already taken");
    }
    console.error(err);
    return apiError(500, "Error al registrar el usuario");
  }
}
