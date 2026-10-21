"use client";

import { MessageCircle, Search } from "lucide-react";

const WHATSAPP_NUMBER = "573161562302"; // ← reemplaza con tu número real
const WHATSAPP_MESSAGE = encodeURIComponent(
  "a ganar la bendita hackaton bros"
);

export function BuyerSupportBanner() {
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
      "_blank"
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <div className="border border-border rounded-[2rem] px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/20">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-black text-lg text-foreground">
              ¿No encuentras lo que buscas?
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Cuéntanos qué necesitas y te conectamos con el emprendimiento
              indicado.
            </p>
          </div>
        </div>
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-7 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#25D366]/20 shrink-0 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          Escribir por WhatsApp
        </button>
      </div>
    </section>
  );
}