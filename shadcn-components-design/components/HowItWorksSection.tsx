"use client";

import { Search, ShoppingCart, Heart, Package } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Explora",
    description: "Descubre productos artesanales unicos creados por comunidades colombianas en proceso de reconstruccion.",
  },
  {
    icon: Heart,
    title: "Conecta",
    description: "Conoce las historias detras de cada producto y el impacto que tu compra genera en vidas reales.",
  },
  {
    icon: ShoppingCart,
    title: "Compra",
    description: "Realiza tu compra de forma segura. El 100% del valor llega directamente al artesano.",
  },
  {
    icon: Package,
    title: "Recibe",
    description: "Tu producto llega a casa con un certificado de origen y la historia de quien lo creo.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
            Proceso simple
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Como funciona Vitrina Social
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprar con proposito nunca fue tan facil. En cuatro pasos conectas 
            con artesanos y transformas vidas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <div 
              key={step.title}
              className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line for desktop */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
