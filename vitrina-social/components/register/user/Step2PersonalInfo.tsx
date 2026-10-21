"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ColombiaSelector } from "./UserColombiaSelector";
import type { CompleteUserFormValues } from "@/schemas/user";

interface Props {
  form: UseFormReturn<CompleteUserFormValues>;
}

export function Step2PersonalInfo({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  const inputClass =
    "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none";

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">
          Información de contacto
        </h3>
        <p className="text-sm text-muted-foreground">
          Necesitamos estos datos para comunicarnos contigo.
        </p>
      </header>

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

      {/* Selector de ubicación (departamento y ciudad) */}
      <ColombiaSelector form={form} />

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Dirección (opcional)</Label>
        <input
          {...register("address")}
          placeholder="Calle 123 #45-67"
          className={inputClass}
        />
      </div>
    </div>
  );
}
