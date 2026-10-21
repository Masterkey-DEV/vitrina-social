import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { serializeMedia } from "@/lib/serialize";
import { apiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const auth = await getAuthUser(request);
  if (!auth) return apiError(401, "Debes estar autenticado");

  const formData = await request.formData().catch(() => null);
  if (!formData) return apiError(400, "FormData inválido");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return apiError(400, "No se recibió ningún archivo");

  const results = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    let uploaded;
    try {
      uploaded = await uploadToCloudinary(buffer, file.name);
    } catch (err) {
      console.error("[upload] cloudinary error", err);
      return apiError(500, "Error subiendo la imagen");
    }

    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: uploaded.url,
        width: uploaded.width,
        height: uploaded.height,
        mime: `image/${uploaded.format}`,
        provider: "cloudinary",
      },
    });

    results.push(serializeMedia(media));
  }

  return Response.json(results);
}
