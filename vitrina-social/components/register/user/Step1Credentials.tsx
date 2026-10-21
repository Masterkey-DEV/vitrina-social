"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { CompleteUserFormValues } from "@/schemas/user";

interface Props {
  form: UseFormReturn<CompleteUserFormValues>;
}

export function Step1Credentials({ form }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass =
    "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none";

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">
          Información de acceso
        </h3>
        <p className="text-sm text-muted-foreground">
          Crea tus credenciales para acceder a la plataforma
        </p>
      </header>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Nombre de usuario <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register("username")}
          placeholder="juanperez"
          className={inputClass}
        />
        {form.formState.errors.username && (
          <p className="text-destructive text-xs">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Correo electrónico <span className="text-destructive">*</span>
        </Label>
        <input
          {...form.register("email")}
          type="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
        {form.formState.errors.email && (
          <p className="text-destructive text-xs">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Contraseña <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-destructive text-xs">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Confirmar contraseña <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <input
            {...form.register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repite tu contraseña"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-destructive text-xs">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  );
}
