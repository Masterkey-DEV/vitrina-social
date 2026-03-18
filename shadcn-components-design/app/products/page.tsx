// @/app/productos/page.tsx
import { ProductsSection } from "@/components/Product-section";
import { BuyerSupportBanner } from "@/components/Buyersupportbanner";
// import { CategoryFilter } from "@/components/CategoryFilter";

export const metadata = {
  title: "Catálogo de Productos | Impact Ventures",
  description:
    "Explora nuestra selección de productos con impacto social y comunitario.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header de la Sección */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
              Nuestro <span className="text-primary">Catálogo</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Descubre productos creados por emprendimientos locales. Cada
              compra es un voto de confianza para el crecimiento de nuestra
              comunidad.
            </p>
          </div>
        </div>
      </div>

      {/* Área de Filtros */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* <CategoryFilter /> */}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Filtra por categoría para encontrar lo que buscas
          </p>
        </div>
      </div>

      {/* Listado de Productos */}
      <div className="py-12">
        <ProductsSection />
      </div>

      {/* Banner simple para compradores */}
      <BuyerSupportBanner />
    </main>
  );
}