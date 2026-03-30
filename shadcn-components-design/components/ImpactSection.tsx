"use client";

import { MapPin, Users, ShoppingBag, TrendingUp } from "lucide-react";

const IMPACT_STATS = [
  {
    icon: Users,
    value: "150+",
    label: "Artesanos activos",
    description: "Emprendedores transformando sus vidas",
  },
  {
    icon: MapPin,
    value: "32",
    label: "Municipios",
    description: "Presencia en todo el territorio",
  },
  {
    icon: ShoppingBag,
    value: "500+",
    label: "Productos",
    description: "Artesanias unicas y autenticas",
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Impacto directo",
    description: "Sin intermediarios ni comisiones ocultas",
  },
];

export function ImpactSection() {
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Patron decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="impact-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <circle cx="15" cy="15" r="2" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#impact-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-semibold mb-4">
            Nuestro impacto
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">
            Numeros que transforman vidas
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Cada cifra representa una historia de superacion, una familia que avanza 
            y una comunidad que se reconstruye.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {IMPACT_STATS.map((stat) => (
            <div 
              key={stat.label}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-primary-foreground/15 transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <stat.icon className="h-6 w-6 text-accent" />
              </div>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="font-semibold text-primary-foreground mb-1">
                {stat.label}
              </p>
              <p className="text-sm text-primary-foreground/70">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
