import * as z from "zod";

export const formSchema = z
  .object({
    // Datos de acceso (requeridos)
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(), // añadido

    // Datos de la fundación (requeridos)
    foundationName: z.string().min(2, "Nombre requerido"),
    siglas: z.string().min(2, "Siglas requeridas").max(10, "Máximo 10 caracteres"),

    // Datos de contacto (requeridos)
    phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
    whatsapp: z.string().min(10, "WhatsApp debe tener al menos 10 dígitos"),

    // Ubicación (requeridos)
    department: z.string().min(1, "Departamento es requerido"),
    city: z.string().min(1, "Ciudad es requerida"),

    // Opcionales
    objective: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(), // dirección completa, opcional
    website: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof formSchema>;