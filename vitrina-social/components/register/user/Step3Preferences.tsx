// @/components/register/user/Step3Preferences.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { Mail, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompleteUserFormValues } from "@/schemas/user";

interface Props {
  form: UseFormReturn<CompleteUserFormValues>;
}

export function Step3Preferences({ form }: Props) {
  const { register, watch } = form;
  const receiveNewsletter = watch("receiveNewsletter");
  const receiveUpdates = watch("receiveUpdates");

  const inputStyles =
    "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none";

  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">
          Preferencias
        </h3>
        <p className="text-sm text-muted-foreground">
          Personaliza tu experiencia en la plataforma
        </p>
      </header>

      <div className="space-y-4">
        <FieldWrapper label="Biografía / Descripción" icon={User}>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Cuéntanos sobre ti, tus intereses y motivaciones..."
            className={cn(inputStyles, "resize-none h-auto py-3")}
          />
        </FieldWrapper>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50/30">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Boletín informativo</p>
                <p className="text-xs text-muted-foreground">
                  Recibe noticias y novedades de la plataforma
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("receiveNewsletter")}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative",
                  receiveNewsletter && "bg-primary",
                )}
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50/30">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Actualizaciones</p>
                <p className="text-xs text-muted-foreground">
                  Recibe notificaciones sobre nuevas iniciativas y productos
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("receiveUpdates")}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-11 h-6 bg-muted-foreground/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative",
                  receiveUpdates && "bg-primary",
                )}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente FieldWrapper auxiliar
function FieldWrapper({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </label>
      {children}
    </div>
  );
}
