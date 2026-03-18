"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FoundationCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
            ¿Eres parte de una{" "}
            <span className="text-primary">Fundación</span>?
          </h2>
          <p className="max-w-xl mx-auto text-background/60 text-lg">
            Únete a nuestra red para potenciar iniciativas de reconciliación y
            emprendimientos comunitarios.
          </p>
          <div className="pt-6">
            <Link
              href="/foundations/register"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black tracking-widest uppercase hover:scale-105 transition-transform shadow-xl shadow-primary/20"
            >
              Registrar mi Organización
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>
    </section>
  );
}