// @/app/initiatives/page.tsx
import {
  getIniciatives,
  getInitiativeCategories,
} from "@/lib/server/queries";
import { getMediaUrl } from "@/lib/media";
import { InitiativeCard } from "@/components/initiative-card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Iniciativas | Vitrina Social",
  description:
    "Explora programas y proyectos diseñados para impulsar tu crecimiento y desarrollo comunitario.",
};

interface PageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function InitiativesPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams;

  const [initiativesResult, categoriesResult] = await Promise.all([
    getIniciatives(categoria),
    getInitiativeCategories(),
  ]);

  const initiatives = initiativesResult.success ? initiativesResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary/5 border-b border-primary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold"
          >
            Oportunidades
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-6">
            Iniciativas <span className="text-primary">Activas</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Programas diseñados para impulsar tu crecimiento, sanación y éxito
            profesional dentro de tu comunidad.
          </p>
        </div>
      </section>

      {/* Filtros sticky */}
      {categories.length > 0 && (
        <section className="border-b border-border/50 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <Link
                href="/initiatives"
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                  !categoria
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todos
              </Link>
              {(categories as any[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/initiatives?categoria=${encodeURIComponent(cat.name)}`}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                    categoria === cat.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {categoria && (
          <p className="text-sm text-muted-foreground mb-8 font-medium">
            Mostrando{" "}
            <span className="text-foreground font-bold">
              {(initiatives as any[]).length}
            </span>{" "}
            iniciativa{(initiatives as any[]).length !== 1 ? "s" : ""} en{" "}
            <span className="text-primary font-bold">{categoria}</span>
          </p>
        )}

        {(initiatives as any[]).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(initiatives as any[]).map((initiative) => {
              // ✅ FIX: getMediaUrl resuelve Cloudinary y local sin doble prefijo
              const imageUrl = getMediaUrl(initiative.images?.[0]?.url, "/holder_iniciativas.jpeg");
              const categoryName = initiative.initiatives_categories?.[0]?.name;

              return (
                <InitiativeCard
                  key={initiative.id}
                  documentId={initiative.documentId}
                  title={initiative.title}
                  organization={initiative.foundation?.name || "Organización Aliada"}
                  description={initiative.objective}
                  imageSrc={imageUrl}
                  imageAlt={`Imagen de ${initiative.title}`}
                  category={categoryName}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
            <Lightbulb className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">Sin iniciativas por aquí</h3>
            <p className="text-muted-foreground">
              {categoria
                ? `No hay iniciativas en "${categoria}" por ahora.`
                : "Aún no hay iniciativas registradas. ¡Vuelve pronto!"}
            </p>
            {categoria && (
              <Link
                href="/initiatives"
                className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Ver todas las iniciativas
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}