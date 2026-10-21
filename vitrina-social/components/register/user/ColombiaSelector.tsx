"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { COLOMBIA, getMunicipios } from "@/data/colombia";
import { Label } from "@/components/ui/label";
import type { CompleteUserFormValues } from "@/schemas/user";

const selectCls =
  "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const DEPARTAMENTOS = [...COLOMBIA].sort((a, b) =>
  a.departamento.localeCompare(b.departamento, "es"),
);

interface Props {
  form: UseFormReturn<CompleteUserFormValues>;
}

export function ColombiaSelector({ form }: Props) {
  const [selectedDept, setSelectedDept] = useState("");

  // Obtener el valor actual del departamento del formulario
  const currentDept = form.watch("department");
  const municipios = getMunicipios(selectedDept, COLOMBIA);

  // Sincronizar el estado local con el formulario
  useEffect(() => {
    if (currentDept && currentDept !== selectedDept) {
      setSelectedDept(currentDept);
    }
  }, [currentDept, selectedDept]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptName = e.target.value;
    setSelectedDept(deptName);
    form.setValue("department", deptName);
    form.setValue("city", "");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <MapPin className="h-3.5 w-3.5" />
        Ubicación en Colombia
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departamento */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">
            Departamento <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <select
              className={selectCls}
              value={selectedDept}
              onChange={handleDeptChange}
            >
              <option value="">Selecciona un departamento</option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d.id} value={d.departamento}>
                  {d.departamento}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
          {form.formState.errors.department && (
            <p className="text-destructive text-xs">
              {form.formState.errors.department.message}
            </p>
          )}
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">
            Ciudad / Municipio <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <select
              className={selectCls}
              disabled={!selectedDept}
              {...form.register("city")}
            >
              <option value="">
                {selectedDept
                  ? "Selecciona una ciudad"
                  : "Primero elige departamento"}
              </option>
              {municipios.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
          {form.formState.errors.city && (
            <p className="text-destructive text-xs">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}
