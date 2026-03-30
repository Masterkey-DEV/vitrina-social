"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, MapPin } from "lucide-react";

const stories = [
  {
    quote:
      "El programa de reintegracion me dio una segunda oportunidad. Hoy tengo mi propio taller de confeccion y me siento parte de mi comunidad nuevamente.",
    name: "Maria Garcia",
    location: "Medellin, Antioquia",
    avatar: "/maria.jpeg",
    craft: "Textiles",
  },
  {
    quote:
      "Unirme al programa no fue facil, pero valio la pena. Estaba en un punto bajo y ahora entiendo mi potencial como artesano.",
    name: "Carlos Mendez",
    location: "Bogota, Cundinamarca",
    avatar: "/carlos.jpeg",
    craft: "Ceramica",
  },
  {
    quote:
      "Mis tejidos wayuu ahora llegan a personas en todo el pais. Cada mochila que vendo es un paso mas hacia la independencia economica de mi familia.",
    name: "Luz Mery Pushaina",
    location: "Riohacha, La Guajira",
    avatar: "/placeholder.svg",
    craft: "Tejidos Wayuu",
  },
];

export function SuccessStories() {
  return (
    <section className="px-4 py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header de seccion */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
            Historias de transformacion
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Voces de resiliencia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conoce las historias de quienes han encontrado en el arte y el emprendimiento 
            un camino hacia la reconciliacion y la autonomia economica.
          </p>
        </div>

        {/* Grid de historias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card
              key={story.name}
              className="border border-border bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-accent mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {`"${story.quote}"`}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={story.avatar || "/placeholder.svg"}
                      alt={`Retrato de ${story.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {story.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{story.location}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                    {story.craft}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
