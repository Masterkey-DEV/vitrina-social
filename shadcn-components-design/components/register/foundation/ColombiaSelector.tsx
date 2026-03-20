// components/register/foundation/ColombiaSelector.tsx
"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { COLOMBIA, getMunicipios } from "@/data/colombia";
import { FieldWrapper } from "@/components/register/form-steps";
import type { FormValues } from "@/schemas/foundation";

const selectCls =
  "flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

// Departamentos ordenados alfabéticamente
const DEPARTAMENTOS = [...COLOMBIA].sort((a, b) =>
  a.departamento.localeCompare(b.departamento, "es")
);

interface Props {
  form: UseFormReturn<FormValues>;
}

export function ColombiaSelector({ form }: Props) {
  const [selectedDept, setSelectedDept] = useState("");
  const municipios = getMunicipios(selectedDept, COLOMBIA);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptName = e.target.value;
    setSelectedDept(deptName);
    form.setValue("department", deptName);
    form.setValue("city", ""); // limpia ciudad al cambiar departamento
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <MapPin className="h-3.5 w-3.5" />
        Ubicación en Colombia{" "}
        <span className="font-normal normal-case">(opcional)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Departamento */}
        <FieldWrapper
          label="Departamento"
          error={form.formState.errors.department?.message}
        >
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
        </FieldWrapper>

        {/* Ciudad — deshabilitada hasta elegir departamento */}
        <FieldWrapper
          label="Ciudad / Municipio"
          error={form.formState.errors.city?.message}
        >
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
        </FieldWrapper>

      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}