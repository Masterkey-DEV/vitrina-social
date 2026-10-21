"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabNav } from "./tab-nav";
import { TabKey } from "@/const/tabs";
import { FoundationsSection } from "./FoundationsSection";
import { CategoriesSection } from "./categories-section";
import { InitiativesSection } from "./initiatives-section";
import { FeaturedProductsSlider } from "./product/FeaturedProductsSlider";
import { Heart, Users, Target, Sparkles } from "lucide-react";

const MISSION_VALUES = [
  {
    icon: Heart,
    title: "Comercio con proposito",
    description: "Cada transaccion genera impacto directo en comunidades que reconstruyen sus vidas.",
  },
  {
    icon: Users,
    title: "Conexion autentica",
    description: "Vinculamos artesanos con compradores que valoran las historias detras de cada producto.",
  },
  {
    icon: Target,
    title: "Transparencia total",
    description: "Origen verificado, trazabilidad completa y precios justos para todos.",
  },
  {
    icon: Sparkles,
    title: "Reconciliacion activa",
    description: "Creemos que el emprendimiento es un camino hacia la paz y la autonomia.",
  },
];

export function HomeTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("emprendimientos");

  const tabContent: Record<TabKey, ReactNode> = {
    iniciativas: (
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Iniciativas de impacto
          </h2>
          <p className="text-muted-foreground">
            Proyectos que transforman comunidades y generan oportunidades para quienes mas lo necesitan.
          </p>
        </div>
        <CategoriesSection />
        <InitiativesSection />
      </div>
    ),

    emprendimientos: (
      <div className="space-y-10">
        <FeaturedProductsSlider 
          title="Productos con historia"
          subtitle="Artesanias autenticas creadas por manos colombianas"
        />
      </div>
    ),

    fundaciones: <FoundationsSection />,

    nosotros: (
      <div className="py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Nuestra razon de ser
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 text-balance">
            Transformamos vidas a traves del{" "}
            <span className="text-primary">comercio consciente</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Somos una plataforma que conecta el talento de comunidades resilientes 
            con personas que valoran lo autentico y quieren ser parte del cambio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MISSION_VALUES.map((value) => (
            <div 
              key={value.title}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <value.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Desde Colombia para el mundo</span>
            <div className="h-px w-12 bg-border" />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="relative overflow-hidden">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-20 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
