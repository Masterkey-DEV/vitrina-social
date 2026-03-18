"use client";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import Image from "next/image";
import { Foundation } from "@/types/foundation";
import { API_URL } from "@/const/api";
import { ArrowUpRight } from "lucide-react";

interface Props {
  foundation: Foundation;
}

export function FoundationCard({ foundation }: Props) {
  const imageUrl = getMediaUrl(foundation.image?.url, "/placeholder-logo.jpg");

  return (
    <Link href={`/foundations/${foundation.siglas}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-card border shadow-sm hover:shadow-2xl transition-all duration-500">
        {/* Imagen */}
        <div className="relative h-[420px] w-full">
          <Image
            src={imageUrl}
            alt={foundation.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Badge superior */}
          <div className="absolute top-5 left-5">
            <span className="px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground shadow-lg">
              {foundation.siglas}
            </span>
          </div>
        </div>

        {/* Contenido inferior */}
        <div className="absolute bottom-0 w-full p-6 text-white space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-2xl font-bold leading-tight max-w-[85%]">
              {foundation.name}
            </h3>

            <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>

          <p className="text-sm text-white/80">
            {foundation.iniciatives?.length ?? 0} iniciativas activas
          </p>

          <div className="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}
