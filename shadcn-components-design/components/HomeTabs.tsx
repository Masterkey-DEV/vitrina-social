// @/components/HomeTabs.tsx
"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabNav } from "./tab-nav";
import { TabKey } from "@/const/tabs";

import { FoundationsSection } from "./FoundationsSection";
import { CategoriesSection } from "./categories-section";
import { InitiativesSection } from "./initiatives-section"; // ✅ lowercase, nombre correcto
import { ProductsSection } from "./Product-section";

export function HomeTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("emprendimientos");

  const tabContent: Record<TabKey, ReactNode> = {
    iniciativas: (
      <div className="space-y-12">
        <CategoriesSection />
        <InitiativesSection />
      </div>
    ),

    emprendimientos: (
      <div className="space-y-10">
        <header className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Emprendimientos con <span className="text-primary">Propósito</span>
          </h2>
          <p className="text-muted-foreground text-lg italic">
            "Productos que cuentan historias de resiliencia y cambio."
          </p>
        </header>
        <ProductsSection />
      </div>
    ),

    fundaciones: <FoundationsSection />,

    nosotros: (
      <div className="max-w-4xl mx-auto py-20 px-6 bg-muted/30 rounded-[3rem] border border-border/50">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl font-black tracking-tight">Nuestra Misión</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Somos una plataforma dedicada a visibilizar y potenciar proyectos de
            reconciliación en Colombia, creando puentes entre comunidades
            resilientes y personas que quieren apoyar el cambio.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <div className="h-1 w-4 bg-primary/30 rounded-full" />
            <div className="h-1 w-4 bg-primary/30 rounded-full" />
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
