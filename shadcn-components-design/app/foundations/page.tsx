// /app/fundaciones/page.tsx
import { getFoundations } from "@/actions/foundation.actions";
import { getMediaUrl } from "@/lib/media";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FoundationCTA } from "@/components/Foundationcta";

export const metadata = {
  title: "Fundaciones Aliadas | Vitrina Social",
  description:
    "Conoce a las organizaciones que hacen posible la reconciliación y el apoyo comunitario.",
};

export default async function FoundationsPage() {
  const result = await getFoundations();
  const foundations = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary/5 border-b border-primary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold"
          >
            Red de Apoyo
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-6">
            Fundaciones <span className="text-primary">Aliadas</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Organizaciones comprometidas con la transformación social, brindando
            respaldo técnico, humano y logístico a los emprendimientos de
            nuestra red.
          </p>
        </div>
      </section>

      {/* Grid de Fundaciones */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(foundations as any[]).map((foundation) => (
            <Link
              href={`/foundations/${foundation.siglas}`}
              key={foundation.id}
              className="group relative flex flex-col bg-card border border-border/50 rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2"
            >
              {/* Logo */}
              <div className="p-8 flex items-center gap-6 border-b border-border/40 bg-muted/20">
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-background bg-white shadow-sm shrink-0">
                  <Image
                    src={getMediaUrl(foundation.image?.url, "/holder_fundaciones.jpeg")}
                    alt={foundation.name}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                    {foundation.name}
                  </h2>
                  {/* Ubicación combinando departamento y ciudad */}
                  <div className="flex items-center gap-1 text-muted-foreground mt-2 text-xs font-bold">
                    <MapPin className="h-3 w-3" />
                    {(() => {
                      const department = foundation.department;
                      const city = foundation.city;
                      if (department && city) return `${city}, ${department}`;
                      if (city) return city;
                      if (department) return department;
                      return foundation.location || "Sede Nacional";
                    })()}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6">
                  {foundation.description ||
                    "Esta organización trabaja activamente en proyectos de impacto social y reconstrucción del tejido comunitario."}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-primary/60 flex items-center gap-1">
                    Ver Perfil <ArrowRight className="h-3 w-3" />
                  </span>
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {foundations.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
            <Building2 className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-bold">Aún no hay fundaciones registradas</h3>
            <p className="text-muted-foreground">Estamos construyendo nuestra red de aliados.</p>
          </div>
        )}
      </section>

      {/* CTA para registrar organización */}
      <FoundationCTA />
    </main>
  );
}