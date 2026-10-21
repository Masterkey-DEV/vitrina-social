"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Handshake } from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "9M+", label: "Víctimas del conflicto en Colombia" },
  { value: "69%", label: "Sin presencia digital activa" },
  { value: "0", label: "Plataformas especializadas antes de nosotros" },
];

const STORY_ITEMS = [
  "Hace ruanas a mano con técnica ancestral",
  "Vende por Facebook sin alcance real",
  "No tiene visibilidad fuera de su región",
  "Desconfía de los pagos en línea",
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Confianza",
    body: "Cada vendedor pasa por verificación. El comprador sabe con quién está comprando.",
  },
  {
    icon: TrendingUp,
    title: "Mercado",
    body: "Nicho con alto valor y baja competencia. Ganamos cuando ellos venden.",
  },
  {
    icon: Handshake,
    title: "Impacto",
    body: "No vendemos lástima. Vendemos oportunidad económica real y dignificante.",
  },
];

const WHY_NOW = [
  { label: "E-commerce en alza", sub: "Crecimiento acelerado post-pandemia" },
  { label: "Consumo consciente", sub: "Más compradores buscan impacto real" },
  { label: "Acceso a smartphones", sub: "Mayor conectividad en zonas rurales" },
  { label: "0 competidores directos", sub: "Nicho especializado sin solución real" },
];

const BUSINESS = [
  { tag: "Core", title: "2% de comisión", desc: "Por cada venta realizada. Sin cobros por inscribirse." },
  { tag: "Growth", title: "Boost de productos", desc: "Visibilidad destacada dentro del catálogo para quienes quieren escalar." },
  { tag: "Premium", title: "Suscripción mensual", desc: "Herramientas avanzadas: analítica, gestión de inventario y más." },
];

const ROADMAP = [
  { year: "2026", items: ["MVP en producción", "20–50 productos validados", "Red inicial de fundaciones aliadas"] },
  { year: "2027", items: ["Expansión nacional", "Integraciones con pagos formales", "Comunidad de compradores conscientes"] },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay: i * 0.1, ease: EASE },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -44 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.72, delay: i * 0.08, ease: EASE },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 44 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.72, delay: i * 0.08, ease: EASE },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

// ─── ANIMATED SECTION WRAPPER ────────────────────────────────────────────────

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variant = direction === "left" ? fadeLeft : direction === "right" ? fadeRight : fadeUp;
  return (
    <motion.div
      ref={ref}
      variants={variant}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center border-b border-border overflow-hidden"
      >
        <motion.span
          aria-hidden
          style={{ y: heroY }}
          className="absolute right-[-2vw] top-0 text-[22vw] font-black text-foreground/[0.03] leading-none select-none pointer-events-none"
        >
          VS
        </motion.span>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-4 pt-24 pb-32 relative z-10 w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-8"
          >
            Marketplace de impacto · Colombia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl xl:text-[6rem] font-black tracking-tighter leading-[0.9] text-foreground max-w-5xl"
          >
            Cada producto vendido
            <br />
            <em className="not-italic text-primary">es una vida</em>
            <br />
            que se reconstruye.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light"
          >
            En Colombia hay millones de personas que ya sobrevivieron al
            conflicto… pero no al mercado. Nosotros estamos resolviendo eso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex items-center gap-3 text-muted-foreground/40"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 bg-muted-foreground/40 rounded-full" />
            </motion.div>
            <span className="text-xs uppercase tracking-widest">Scroll</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/20">
        <RevealGroup className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={value}
              variants={fadeUp}
              custom={i}
              className="py-10 md:py-8 md:px-12 first:pl-0 last:pr-0"
            >
              <p className="text-6xl md:text-7xl font-black text-primary tracking-tighter">
                {value}
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-snug max-w-[200px]">
                {label}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* ── PROBLEMA ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-36">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Reveal direction="left" delay={0}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                El problema
              </p>
            </Reveal>
            <Reveal direction="left" delay={1}>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                Su producto no falla.
                <br />
                <span className="text-primary">El sistema sí.</span>
              </h2>
            </Reveal>
            <Reveal direction="left" delay={2}>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Hoy, miles de emprendedores venden en Facebook o en la calle —
                sin alcance, sin confianza y sin crecimiento. No por falta de
                talento, sino porque el internet no fue construido para ellos.
              </p>
            </Reveal>
          </div>

          <Reveal direction="right">
            <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="text-5xl">👩‍🧵</div>
              <div>
                <p className="font-black text-xl text-foreground">Madre indígena, Nariño</p>
                <p className="text-sm text-muted-foreground mt-1">Historia real</p>
              </div>
              <RevealGroup className="space-y-3">
                {STORY_ITEMS.map((item) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    className="flex items-start gap-3 text-sm text-muted-foreground list-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </RevealGroup>
              <Reveal delay={5}>
                <p className="text-sm font-semibold text-foreground pt-4 border-t border-border">
                  "Este no es un problema abstracto. Es una persona real que
                  quiere vender… pero el sistema no está hecho para ella."
                </p>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SOLUCIÓN ─────────────────────────────────────────────────────── */}
      <section className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-36 space-y-16">
          <div className="space-y-6">
            <Reveal delay={0}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-background/40">
                Nuestra solución
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight max-w-4xl">
                No solo conectamos oferta y demanda.
                <br />
                <span className="text-primary">Construimos confianza</span>{" "}
                donde hoy no existe.
              </h2>
            </Reveal>
          </div>

          <RevealGroup className="grid md:grid-cols-3 gap-px bg-background/10 rounded-3xl overflow-hidden">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-foreground p-10 space-y-5 group transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xl font-black text-background">{title}</p>
                <p className="text-background/60 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── WHY NOW ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-36">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <Reveal direction="left" delay={0}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Por qué ahora
              </p>
            </Reveal>
            <Reveal direction="left" delay={1}>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                El mercado ya está listo.
                <br />
                Lo único que falta es{" "}
                <span className="text-primary">organizarlo.</span>
              </h2>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-2 gap-4 pt-4">
            {WHY_NOW.map(({ label, sub }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="bg-muted/30 border border-border rounded-2xl p-6 space-y-2 cursor-default"
              >
                <p className="font-black text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground leading-snug">{sub}</p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── MODELO DE NEGOCIO ────────────────────────────────────────────── */}
      <section className="border-t border-b border-border bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 space-y-14">
          <div className="space-y-4">
            <Reveal delay={0}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Modelo de negocio
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
                Ganamos cuando ellos venden.
              </h2>
            </Reveal>
          </div>

          <RevealGroup className="grid md:grid-cols-3 gap-6">
            {BUSINESS.map(({ tag, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="bg-card border border-border rounded-[1.75rem] p-8 space-y-4 hover:border-primary/30 transition-colors cursor-default"
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {tag}
                </span>
                <p className="text-xl font-black text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-36 space-y-16">
        <div className="space-y-4">
          <Reveal delay={0}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Hoja de ruta
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              No buscamos crecer rápido.
              <br />
              <span className="text-primary">Buscamos crecer bien.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
          {ROADMAP.map(({ year, items }, yi) => (
            <RevealGroup key={year}>
              <motion.div variants={fadeUp} custom={0} className="mb-4">
                <p className="text-6xl font-black text-primary/20 tracking-tighter select-none">
                  {year}
                </p>
              </motion.div>
              <ul className="space-y-3">
                {items.map((item, ii) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    custom={ii + 1}
                    className="flex items-start gap-3 text-sm text-foreground list-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </RevealGroup>
          ))}
        </div>
      </section>

      {/* ── CIERRE ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-28 md:py-44 text-center space-y-10">
          <Reveal delay={0}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
              En definitiva
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-tight max-w-4xl mx-auto">
              No es comercio.
              <br />
              <span className="text-primary">Es reconstrucción económica.</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Vitrina Social es una nueva forma de integrar a miles de personas
              a la economía digital — con dignidad, con confianza y con impacto
              medible.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl shadow-lg shadow-primary/20"
                >
                  Explorar el catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/foundations"
                  className="inline-flex items-center gap-2 border border-border text-foreground font-bold px-8 py-4 rounded-2xl hover:bg-muted/40 transition-colors"
                >
                  Conocer fundaciones aliadas
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}