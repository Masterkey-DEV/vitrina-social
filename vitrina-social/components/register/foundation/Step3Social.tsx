"use client";

import { UseFormReturn } from "react-hook-form";
import { Globe, Phone } from "lucide-react";
// Corregido: SiLinkedin y SiX
import { SiWhatsapp, SiInstagram, SiFacebook, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { FieldWrapper } from "@/components/register/form-steps";
import type { FormValues } from "@/schemas/foundation";

interface Props {
  form: UseFormReturn<FormValues>;
}

export function Step3Social({ form }: Props) {
  const inputStyles = "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none";

  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">Contacto Digital</h3>
        <p className="text-sm text-muted-foreground">
          Enlaza tus canales o complétalos luego desde tu dashboard.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldWrapper label="WhatsApp" icon={SiWhatsapp}>
          <input {...form.register("whatsapp")} placeholder="573001234567" className={inputStyles} />
        </FieldWrapper>

        <FieldWrapper label="Sitio Web" icon={Globe}>
          <input {...form.register("website")} placeholder="www.mifundacion.org" className={inputStyles} />
        </FieldWrapper>

        <FieldWrapper label="Instagram" icon={SiInstagram}>
          <input {...form.register("instagram")} placeholder="@usuario" className={inputStyles} />
        </FieldWrapper>

        <FieldWrapper label="LinkedIn" icon={FaLinkedin}>
          <input {...form.register("linkedin")} placeholder="mi-fundacion" className={inputStyles} />
        </FieldWrapper>

        <FieldWrapper label="Facebook" icon={SiFacebook}>
          <input {...form.register("facebook")} placeholder="mifundacion" className={inputStyles} />
        </FieldWrapper>

        <FieldWrapper label="Twitter / X" icon={SiX}>
          <input {...form.register("twitter")} placeholder="@mifundacion" className={inputStyles} />
        </FieldWrapper>
      </div>
    </div>
  );
}