import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/motion-wrapper";
import { getInitiativeByDocumentId } from "@/actions/initiative.actions";
import { JoinInitiativeButton } from "@/components/JoinInitiativeButton";
import { API_URL } from "@/const/api";
import {
  ArrowLeft,
  Building2,
  Lightbulb,
  ArrowUpRight,
  Users,
} from "lucide-react";

interface PageProps {
  params: Promise<{ initiative: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { initiative } = await params;
  const result = await getInitiativeByDocumentId(initiative);
  if (!result.success || !result.data) return {};
  return {
    title: `${result.data.title} | Reintegration Portal`,
    description: result.data.objective,
  };
}

export default async function InitiativeDetailPage({ params }: PageProps) {
  const { initiative } = await params;
  const result = await getInitiativeByDocumentId(initiative);

  if (!result.success || !result.data) notFound();

  const data = result.data;
  const imageUrl = data.images?.[0]?.url
    ? `${API_URL}${data.images[0].url}`
    : "/placeholder.jpg";
  const categoryName =
    data.initiatives_categories?.[0]?.name || "Sin categoría";
  const memberCount = data.usuario?.length || 0;

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[420px] md:h-[560px] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={data.title}
          fill
          className="object-cover scale-105 blur-[1px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-16 text-white space-y-5">
            <FadeUp>
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground uppercase tracking-widest text-[10px]">
                  {categoryName}
                </Badge>
                {memberCount > 0 && (
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                    <Users className="h-3.5 w-3.5" />
                    {memberCount} {memberCount === 1 ? "miembro" : "miembros"}
                  </span>
                )}
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl leading-[1.05]">
                {data.title}
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-lg max-w-2xl text-white/70 leading-relaxed">
                {data.objective}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/initiatives"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver a iniciativas
          </Link>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-16">
          {/* MAIN */}
          <div className="md:col-span-2 space-y-12">
            {data.description && (
              <FadeUp>
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    Sobre esta iniciativa
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                    {data.description}
                  </p>
                </div>
              </FadeUp>
            )}

            {/* Galería adicional */}
            {data.images?.length > 1 && (
              <FadeUp delay={0.1}>
                <div className="grid grid-cols-3 gap-3">
                  {data.images.slice(1, 4).map((img: any, i: number) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
                    >
                      <Image
                        src={`${API_URL}${img.url}`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* Fundación */}
            <FadeUp delay={0.1}>
              <div className="p-6 rounded-3xl border bg-muted/30 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <Building2 className="h-4 w-4" />
                  Organización
                </h3>
                {data.foundation?.siglas ? (
                  <Link
                    href={`/foundations/${data.foundation.siglas}`}
                    className="flex items-center justify-between group"
                  >
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {data.foundation.name || "Organización Aliada"}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                ) : (
                  <p className="font-medium text-foreground">
                    {data.foundation?.name || "Organización Aliada"}
                  </p>
                )}
              </div>
            </FadeUp>

            {/* Miembros */}
            <FadeUp delay={0.15}>
              <div className="p-6 rounded-3xl border bg-muted/30 space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <Users className="h-4 w-4" />
                  Comunidad
                </h3>
                <p className="text-3xl font-black text-foreground">
                  {memberCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {memberCount === 1 ? "persona unida" : "personas unidas"} a
                  esta iniciativa
                </p>
              </div>
            </FadeUp>

            {/* CTA - Join button */}
            <FadeUp delay={0.2}>
              <div className="p-6 rounded-3xl border bg-card space-y-4">
                <JoinInitiativeButton
                  initiativeId={data.documentId}
                  initialMembers={data.usuario || []}
                />
                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  Al unirte, formas parte activa de esta iniciativa y sus
                  actividades.
                </p>
              </div>
            </FadeUp>
          </aside>
        </div>
      </section>
    </main>
  );
}
