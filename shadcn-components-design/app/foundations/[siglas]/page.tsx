import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getFoundationBySiglas } from "@/actions/foundation.actions";
import { getMediaUrl } from "@/lib/media";
import type { Initiative } from "@/types/initiative";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowLeft,
  Building2,
  Lightbulb,
  Users,
  MapPin,
  Globe,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import {
  SiWhatsapp,
  SiInstagram,
  SiFacebook,
  SiX,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface Props {
  params: Promise<{ siglas: string }>;
}

// ── Tipos ──────────────────────────────────────────────────────────────────
interface SocialLink {
  href: string;
  label: string;
  icon: IconType | LucideIcon;
  color: string;
  bg: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function cleanWebsiteLabel(url: string): string {
  return url.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
}

function normalizeUrl(value: string, base: string): string {
  return value.includes("http") ? value : `${base}/${value.replace("@", "")}`;
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);
  if (!result.success || !result.data) return { title: "Fundación no encontrada" };
  const f = result.data;
  return {
    title: `${f.name} | Vitrina Social`,
    description: f.description ?? `Conoce los programas e iniciativas de ${f.name}.`,
    openGraph: {
      title: f.name,
      description: f.description ?? "",
      images: f.image?.url ? [f.image.url] : [],
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function FoundationDetailPage({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);
  if (!result.success || !result.data) notFound();

  const foundation = result.data;
  const initiatives: Initiative[] = foundation.iniciatives ?? [];
  const initiativeCount = initiatives.length;
  const memberCount = initiatives.reduce((acc, i) => acc + (i.users?.length ?? 0), 0);
  const logoUrl = getMediaUrl(foundation.image?.url, "/holder_fundaciones.jpeg");
  const hasLocation = foundation.city || foundation.department;

const fullLocation = [foundation.city, foundation.department]
  .filter(Boolean)
  .join(" • ");

  // Construye los links de redes — solo los que tienen valor
  const socialLinks: SocialLink[] = [
    foundation.whatsapp && {
      href: `https://wa.me/${cleanPhone(foundation.whatsapp)}`,
      label: "WhatsApp",
      icon: SiWhatsapp,
      color: "#25D366",
      bg: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20",
    },
    foundation.website && {
      href: foundation.website.startsWith("http") ? foundation.website : `https://${foundation.website}`,
      label: cleanWebsiteLabel(foundation.website),
      icon: Globe,
      color: "#0F172A",
      bg: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    },
    foundation.instagram && {
      href: normalizeUrl(foundation.instagram, "https://instagram.com"),
      label: "Instagram",
      icon: SiInstagram,
      color: "#E4405F",
      bg: "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20",
    },
    foundation.linkedin && {
      href: normalizeUrl(foundation.linkedin, "https://linkedin.com/company"),
      label: "LinkedIn",
      icon: FaLinkedin,
      color: "#0A66C2",
      bg: "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20",
    },
    foundation.facebook && {
      href: normalizeUrl(foundation.facebook, "https://facebook.com"),
      label: "Facebook",
      icon: SiFacebook,
      color: "#1877F2",
      bg: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20",
    },
    foundation.twitter && {
      href: normalizeUrl(foundation.twitter, "https://x.com"),
      label: "X / Twitter",
      icon: SiX,
      color: "#000000",
      bg: "bg-black/5 text-black hover:bg-black/10",
    },
  ].filter(Boolean) as SocialLink[];

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* ── NAV ── */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/foundations"
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <div className="p-2 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          VOLVER
        </Link>
        <Badge
          variant="outline"
          className="rounded-full border-slate-200 text-slate-400 font-medium"
        >
          Perfil Verificado
        </Badge>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-8">
        {/* Columna principal */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 border border-slate-50 flex-shrink-0 relative overflow-hidden">
              <Image
                src={logoUrl}
                alt={`Logo de ${foundation.name}`}
                fill
                className="object-contain p-6"
                sizes="128px"
                priority
              />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                {foundation.siglas && (
                  <Badge className="bg-primary hover:bg-primary text-white font-black italic rounded-lg px-3">
                    {foundation.siglas}
                  </Badge>
                )}
                {hasLocation ? (
  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
    <MapPin className="h-4 w-4" />
    {fullLocation}
  </div>
) : foundation.location && (
  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
    <MapPin className="h-4 w-4" />
    {foundation.location}
  </div>
)}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none italic uppercase">
                {foundation.name}
              </h1>
              {foundation.description && (
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                  {foundation.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
              <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-black text-slate-900">{initiativeCount}</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {initiativeCount === 1 ? "Iniciativa" : "Iniciativas"}
              </p>
            </div>
            {memberCount > 0 && (
              <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-4">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-black text-slate-900">{memberCount}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Miembros
                </p>
              </div>
            )}
          </div>

          {/* Misión */}
          {foundation.objective && (
            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
                Misión
              </p>
              <p className="text-xl font-medium text-slate-700 leading-relaxed italic">
                "{foundation.objective}"
              </p>
            </div>
          )}
        </div>

        {/* Sidebar de contacto */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 sticky top-8">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 italic uppercase text-sm tracking-widest">
              Contacto
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </h3>
            {socialLinks.length > 0 ? (
              <div className="space-y-3">
                {socialLinks.map(({ href, label, icon: Icon, color, bg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all group ${bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} color={color} />
                      <span>{label}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                Sin datos de contacto aún.
              </p>
            )}

            {/* CTA WhatsApp */}
            {foundation.whatsapp && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-4 text-center">
                  ¿Quieres involucrarte?
                </p>
                <a
                  href={`https://wa.me/${cleanPhone(foundation.whatsapp)}?text=Hola, vi tu perfil en Vitrina Social y me gustaría unirme a sus programas.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase italic"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar Mensaje
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── INICIATIVAS ── */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-20 mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                Programas Activos
              </h2>
              <p className="text-slate-500 font-medium">Iniciativas diseñadas para el impacto social</p>
            </div>
            <Building2 className="h-12 w-12 text-slate-200" />
          </div>
          {initiativeCount > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {initiatives.map((init) => (
                <InitiativeCard key={init.id} initiative={init} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-3xl">
              <Lightbulb className="mx-auto h-14 w-14 text-slate-200 mb-5" />
              <h3 className="text-lg font-black text-slate-400 mb-2">Sin iniciativas aún</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Esta fundación no ha publicado iniciativas todavía. ¡Vuelve pronto!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ── Subcomponente ──────────────────────────────────────────────────────────
function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <Link
      href={`/initiatives/${initiative.documentId}`}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none rounded-lg px-2 py-1 font-bold text-[10px] uppercase tracking-widest">
            {initiative.initiatives_categories?.[0]?.name ?? "General"}
          </Badge>
          <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 italic uppercase group-hover:text-primary transition-colors line-clamp-1">
          {initiative.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
          {initiative.objective}
        </p>
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between font-bold text-xs uppercase tracking-tighter">
          <span className="text-primary">Ver programa →</span>
          {(initiative.users?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-slate-400">
              <Users size={14} />
              {initiative.users!.length} Miembros
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}