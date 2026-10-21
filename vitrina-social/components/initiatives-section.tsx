"use client";

import { useEffect, useState } from "react";
import { getIniciatives } from "@/actions/initiative.actions";
import { InitiativeCard } from "@/components/initiative-card";
import { getMediaUrl } from "@/lib/media";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Lightbulb, Loader2 } from "lucide-react";

export function InitiativesSection() {
  const selectedCategoryName = useCategoryStore((s) => s.selectedCategoryName);

  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getIniciatives(selectedCategoryName);
      if (result.success) {
        setInitiatives(result.data);
        setError(null);
      } else {
        setError("No se pudieron cargar las iniciativas");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedCategoryName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          Cargando iniciativas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section id="initiatives" className="py-4">
      <div className="mb-8 space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">
          {selectedCategoryName
            ? `Iniciativas en ${selectedCategoryName}`
            : "Iniciativas destacadas"}
        </h3>
        <p className="text-muted-foreground max-w-2xl">
          Programas disenados para impulsar el crecimiento, la formacion y el exito 
          de comunidades en proceso de reconstruccion.
        </p>
      </div>

      {initiatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative) => {
            const imageUrl = getMediaUrl(initiative.images?.[0]?.url, "/holder_iniciativas.jpeg");
            const categoryName = initiative.initiatives_categories?.[0]?.name;

            return (
              <InitiativeCard
                key={initiative.id}
                documentId={initiative.documentId}
                title={initiative.title}
                organization={
                  initiative.foundation?.name || "Organizacion aliada"
                }
                description={initiative.objective}
                imageSrc={imageUrl}
                imageAlt={`Imagen de ${initiative.title}`}
                category={categoryName}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-muted/30">
          <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="font-semibold text-foreground mb-1">
            Sin iniciativas disponibles
          </p>
          <p className="text-muted-foreground text-sm">
            No hay iniciativas activas en esta categoria. Vuelve pronto.
          </p>
        </div>
      )}
    </section>
  );
}
