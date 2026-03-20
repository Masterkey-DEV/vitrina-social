import * as z from "zod";
import { de } from "zod/v4/locales";

export const formSchema = z.object({
  // ── Acceso (requeridos) ──
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),

  // ── Fundación (requeridos) ──
  foundationName: z.string().min(2, "Nombre requerido"),
  siglas: z.string().min(2, "Siglas requeridas").max(10, "Máximo 10 caracteres"),

  // ── Fundación (opcionales) ──
  objective: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),

  // ── Contacto y redes (todos opcionales) ──
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

export  type FormValues = z.infer<typeof formSchema>;
