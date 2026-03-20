// components/register/foundation/Step2Profile.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FieldWrapper } from "@/components/register/form-steps";
import { ColombiaSelector } from "./ColombiaSelector";
import type { FormValues } from "@/schemas/foundation";

interface Props {
  form: UseFormReturn<FormValues>;
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;
}

export function Step2Profile({ form, logoFile, onLogoChange }: Props) {
  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">Perfil Organizacional</h3>
        <p className="text-sm text-muted-foreground">Datos visibles para la comunidad.</p>
      </header>

      <FieldWrapper label="Nombre de la Fundación" error={form.formState.errors.foundationName?.message} required>
        <input
          {...form.register("foundationName")}
          placeholder="Fundación Esperanza"
          className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
        />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Siglas" error={form.formState.errors.siglas?.message} required>
          <input
            {...form.register("siglas")}
            placeholder="FEC"
            className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
          />
        </FieldWrapper>

        {/* Logo — completamente opcional */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Logo <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
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

      {/* Selector encadenado departamento → ciudad */}
      <ColombiaSelector form={form} />

      {/* Misión — opcional */}
      <FieldWrapper label="Misión u objetivo (opcional)">
        <input
          {...form.register("objective")}
          placeholder="¿Cuál es el propósito principal de tu fundación?"
          className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
        />
      </FieldWrapper>

      {/* Descripción — opcional */}
      <FieldWrapper label="Descripción (opcional)">
        <textarea
          {...form.register("description")}
          rows={3}
          placeholder="Cuéntale a la comunidad quiénes son y qué hacen..."
          className="flex w-full rounded-xl border border-input bg-slate-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none resize-none"
        />
      </FieldWrapper>
    </div>
  );
}