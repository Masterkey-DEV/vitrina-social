// @/components/register/form-steps.tsx (actualizado)
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step < current
                  ? "bg-primary text-white"
                  : step === current
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {step < current ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
              {step === 1 && "Acceso"}
              {step === 2 && "Personal"}
              {step === 3 && "Preferencias"}
            </span>
          </div>
          {step < total && (
            <div
              className={cn(
                "flex-1 h-[2px] mx-2 transition-all",
                step < current ? "bg-primary" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function FieldWrapper({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
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
