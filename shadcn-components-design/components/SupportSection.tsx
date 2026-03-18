"use client";

import { useState } from "react";
import {
  Send,
  MessageSquare,
  Lightbulb,
  Package,
  ChevronRight,
} from "lucide-react";

const SUPPORT_EMAIL = "juansebastianmoreno4.0@gmail.com";

const QUICK_TOPICS = [
  {
    icon: Package,
    label: "Postular mi proyecto",
    subject: "Quiero postular mi proyecto a Impact Ventures",
    body: "Hola, me gustaría postular mi proyecto/emprendimiento a Impact Ventures. Aquí algunos detalles:\n\n- Nombre del proyecto:\n- Categoría:\n- Descripción breve:\n- ¿Cómo me contactaron?:",
  },
  {
    icon: Lightbulb,
    label: "Tengo una idea",
    subject: "Tengo una idea para Impact Ventures",
    body: "Hola, tengo una idea que me gustaría compartir con el equipo de Impact Ventures:\n\n",
  },
  {
    icon: MessageSquare,
    label: "Soporte general",
    subject: "Consulta general - Impact Ventures",
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
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <div className="rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-sm">
        {/* Header strip */}
        <div className="bg-primary px-8 md:px-14 py-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60 mb-1">
              Soporte directo
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-primary-foreground leading-tight">
              ¿Tienes un proyecto o una pregunta?
            </h2>
          </div>
          <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed">
            Escríbenos directamente. Respondemos en menos de 48 horas.
          </p>
        </div>

        {/* Body */}
        <div className="p-8 md:p-14 grid md:grid-cols-2 gap-10">
          {/* Left: Quick topics */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ¿En qué podemos ayudarte?
            </p>
            <div className="space-y-2">
              {QUICK_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const active = selectedTopic?.label === topic.label;
                return (
                  <button
                    key={topic.label}
                    onClick={() =>
                      setSelectedTopic(active ? null : topic)
                    }
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 group
                      ${
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40 text-foreground"
                      }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="font-semibold text-sm flex-1">
                      {topic.label}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${active ? "rotate-90 text-primary" : "text-muted-foreground/40"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Message form */}
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
                  ? `Cuéntanos más sobre "${selectedTopic.label}"...`
                  : "Escribe tu mensaje aquí..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none flex-1"
            />

            <button
              onClick={handleSend}
              disabled={!isReady}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200
                ${
                  sent
                    ? "bg-green-500 text-white scale-95"
                    : isReady
                      ? "bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-lg active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              {sent ? (
                "¡Listo! Abriendo tu correo…"
              ) : (
                <>
                  <Send size={15} />
                  Enviar mensaje
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground/50 text-center">
              Se abrirá tu cliente de correo con el mensaje prellenado a{" "}
              <span className="font-mono">{SUPPORT_EMAIL}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}