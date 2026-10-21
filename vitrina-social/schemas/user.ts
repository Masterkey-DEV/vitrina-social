// @/schemas/user.ts
import * as z from "zod";

export const userFormSchema = z.object({
  // Paso 1: Credenciales (requeridos)
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const completeUserFormSchema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
    fullName: z.string().optional(),
    phone: z.string().min(10, "Número de teléfono inválido (10 dígitos)"),
    whatsapp: z.string().min(10, "Número de WhatsApp inválido (10 dígitos)"),
    address: z.string().optional(),
    city: z.string().min(1, "Ciudad es requerida"),
    department: z.string().min(1, "Departamento es requerido"),
    bio: z.string().optional(),
    receiveNewsletter: z.boolean().optional(),
    receiveUpdates: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


export type CompleteUserFormValues = z.infer<typeof completeUserFormSchema>;