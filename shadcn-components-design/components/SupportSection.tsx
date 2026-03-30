"use client";

import { useState } from "react";
import {
  Send,
  MessageSquare,
  Lightbulb,
  Package,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_EMAIL = "contacto@vitrinasocial.com";

const QUICK_TOPICS = [
  {
    icon: Package,
    label: "Quiero vender mis productos",
    subject: "Quiero vender en Vitrina Social",
    body: "Hola, me gustaria registrar mis productos artesanales en Vitrina Social. Aqui algunos detalles:\n\n- Nombre del emprendimiento:\n- Tipo de artesania:\n- Ubicacion:\n- Como conoci la plataforma:",
  },
  {
    icon: Lightbulb,
    label: "Registrar mi fundacion",
    subject: "Registro de fundacion - Vitrina Social",
    body: "Hola, represento una fundacion y me gustaria vincularla a Vitrina Social:\n\n- Nombre de la fundacion:\n- Mision:\n- Comunidades que acompanamos:",
  },
  {
    icon: MessageSquare,
    label: "Tengo una consulta",
    subject: "Consulta general - Vitrina Social",
    body: "Hola, me comunico porque:\n\n",
  },
];

export function SupportSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<
    (typeof QUICK_TOPICS)[0] | null
  >(null);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const topic = selectedTopic ?? QUICK_TOPICS[2];
    const subject = encodeURIComponent(
      selectedTopic ? topic.subject : `Consulta de ${name || "un visitante"}`
    );
    const body = encodeURIComponent(
      `${topic.body}${message ? `\n\nMensaje adicional:\n${message}` : ""}${name ? `\n\nNombre: ${name}` : ""}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const isReady = message.trim().length > 0 || selectedTopic !== null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
      <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="bg-primary px-6 md:px-12 py-10 relative overflow-hidden">
          {/* Patron decorativo */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="support-pattern" patternUnits="userSpaceOnUse" width="15" height="15">
                <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#support-pattern)" />
            </svg>
          </div>
          
          <div className="relative flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-primary-foreground/70 text-sm font-medium mb-2">
                <Heart className="h-4 w-4" />
                Estamos para ayudarte
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-primary-foreground leading-tight">
                Unete a nuestra comunidad artesanal
              </h2>
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
              Ya seas artesano, fundacion o comprador consciente, queremos conocerte.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-12 grid md:grid-cols-2 gap-10">
          {/* Izquierda: Temas rapidos */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Selecciona un tema
            </p>
            <div className="space-y-3">
              {QUICK_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const active = selectedTopic?.label === topic.label;
                return (
                  <button
                    key={topic.label}
                    onClick={() =>
                      setSelectedTopic(active ? null : topic)
                    }
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 group
                      ${
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40 text-foreground"
                      }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium flex-1">
                      {topic.label}
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${active ? "text-primary translate-x-1" : "text-muted-foreground/40"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Derecha: Formulario */}
          <div className="space-y-4 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tu mensaje
            </p>

            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />

            <textarea
              rows={5}
              placeholder={
                selectedTopic
                  ? `Cuentanos mas sobre "${selectedTopic.label}"...`
                  : "Escribe tu mensaje aqui..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none flex-1 min-h-[120px]"
            />

            <Button
              onClick={handleSend}
              disabled={!isReady}
              size="lg"
              className={`w-full rounded-xl font-semibold transition-all duration-200 gap-2
                ${
                  sent
                    ? "bg-accent text-foreground"
                    : isReady
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              {sent ? (
                "Abriendo tu correo..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar mensaje
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Se abrira tu cliente de correo con el mensaje prellenado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
