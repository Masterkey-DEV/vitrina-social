"use client";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import Image from "next/image";
import { Foundation } from "@/types/foundation";
import { ArrowUpRight, Users } from "lucide-react";

interface Props {
  foundation: Foundation;
}

export function FoundationCard({ foundation }: Props) {
  const imageUrl = getMediaUrl(foundation.image?.url, "/placeholder-logo.jpg");

  return (
    <Link href={`/foundations/${foundation.siglas}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Imagen */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={foundation.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

          {/* Badge superior */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-accent text-foreground shadow-lg">
              {foundation.siglas}
            </span>
          </div>
        </div>

        {/* Contenido inferior */}
        <div className="absolute bottom-0 w-full p-5 text-primary-foreground space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold leading-tight max-w-[85%]">
              {foundation.name}
            </h3>

            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-foreground transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <Users className="h-4 w-4" />
            <span>{foundation.iniciatives?.length ?? 0} iniciativas activas</span>
          </div>

          <div className="h-0.5 w-0 bg-accent group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}
