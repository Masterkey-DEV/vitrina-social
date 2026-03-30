import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Users, Heart, ArrowRight } from "lucide-react";

const STATS = [
  { value: "150+", label: "Artesanos", icon: Users },
  { value: "32", label: "Municipios", icon: MapPin },
  { value: "100%", label: "Impacto directo", icon: Heart },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Patron decorativo sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="artesanal-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#artesanal-pattern)" />
        </svg>
      </div>

      <div className="px-4 py-16 md:py-24 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Contenido principal */}
          <div className="flex flex-col items-start order-last lg:order-first">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Comercio Justo desde Colombia
            </span>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance mb-6 leading-[1.1]">
              Artesanias con{" "}
              <span className="text-primary">alma</span>,{" "}
              hechas por manos que{" "}
              <span className="text-accent">reconstruyen paz</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Conectamos el talento de comunidades resilientes con personas que valoran 
              lo autentico. Cada producto cuenta una historia de superacion y reconciliacion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link href="/products">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 group"
                >
                  Explorar productos
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/foundations">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold border-2 border-border hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Conocer fundaciones
                </Button>
              </Link>
            </div>
            
            {/* Estadisticas de impacto */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-border w-full">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen principal con elementos decorativos */}
          <div className="relative order-first lg:order-last">
            {/* Elemento decorativo de fondo */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-[2rem] bg-accent/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-full h-full rounded-[2rem] bg-primary/10 -z-20" />
            
            <div className="relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/ventana.png" 
                alt="Artesana colombiana tejiendo con dedicacion"
                fill
                className="object-cover"
                priority
              />
              
              {/* Badge de origen verificado */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">Origen Verificado</span>
              </div>
              
              {/* Badge de region */}
              <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
                <p className="text-xs text-muted-foreground mb-0.5">Region de origen</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  Antioquia, Colombia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
