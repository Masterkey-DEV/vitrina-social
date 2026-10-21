"use client";

import { UseFormReturn } from "react-hook-form";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ColombiaSelector } from "./ColombiaSelector";
import type { FormValues } from "@/schemas/foundation";

interface Props {
  form: UseFormReturn<FormValues>;
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;
}

export function Step2Profile({ form, logoFile, onLogoChange }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  const inputClass =
    "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none";

  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">
          Perfil Organizacional
        </h3>
        <p className="text-sm text-muted-foreground">
          Datos visibles para la comunidad.
        </p>
      </header>

      {/* Nombre de la fundación (obligatorio) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Nombre de la Fundación <span className="text-destructive">*</span>
        </Label>
        <input
          {...register("foundationName")}
          placeholder="Fundación Esperanza"
          className={inputClass}
        />
        {errors.foundationName && (
          <p className="text-destructive text-xs">
            {errors.foundationName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Siglas (obligatorio) */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">
            Siglas <span className="text-destructive">*</span>
          </Label>
          <input
            {...register("siglas")}
            placeholder="FEC"
            className={inputClass}
          />
          {errors.siglas && (
            <p className="text-destructive text-xs">{errors.siglas.message}</p>
          )}
        </div>

        {/* Logo opcional */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Logo{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (opcional)
            </span>
          </Label>
          <label className="flex items-center justify-center gap-2 h-12 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all group">
            <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            <span className="text-xs text-muted-foreground group-hover:text-primary truncate max-w-[80px]">
              {logoFile ? logoFile.name : "Subir"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => onLogoChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>

      {/* Teléfono (obligatorio) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          Teléfono <span className="text-destructive">*</span>
        </Label>
        <input
          {...register("phone")}
          placeholder="3123456789"
          className={inputClass}
        />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* WhatsApp (obligatorio) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">
          WhatsApp <span className="text-destructive">*</span>
        </Label>
        <input
          {...register("whatsapp")}
          placeholder="3123456789"
          className={inputClass}
        />
        {errors.whatsapp && (
          <p className="text-destructive text-xs">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Selector encadenado departamento → ciudad (obligatorio) */}
      <ColombiaSelector form={form} />

      {/* Misión (opcional) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Misión u objetivo (opcional)
        </Label>
        <input
          {...register("objective")}
          placeholder="¿Cuál es el propósito principal de tu fundación?"
          className={inputClass}
        />
      </div>

      {/* Descripción (opcional) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Descripción (opcional)</Label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Cuéntale a la comunidad quiénes son y qué hacen..."
          className="flex w-full rounded-xl border border-input bg-slate-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none resize-none"
        />
      </div>
    </div>
  );
}
