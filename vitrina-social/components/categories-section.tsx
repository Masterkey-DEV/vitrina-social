"use client";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Users, Palette, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "comunidad", label: "Comunidad", icon: Users },
  { id: "educacion", label: "Educacion", icon: GraduationCap },
  { id: "empleo", label: "Empleo", icon: Briefcase },
  { id: "artesanias", label: "Artesanias", icon: Palette },
  { id: "bienestar", label: "Bienestar", icon: Heart },
];

export function CategoriesSection() {
  const { selectedCategoryName, setCategory } = useCategoryStore();

  return (
    <section className="py-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
            selectedCategoryName === null
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          Todas las categorias
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategoryName === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
