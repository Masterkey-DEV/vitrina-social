"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  price: number;
  imageSrc: string;
  category?: string;
  shortDescription?: string;
  href: string;
}

export function ProductCard({
  name,
  price,
  imageSrc,
  category,
  shortDescription,
  href,
}: ProductCardProps) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  return (
    <Link
      href={href}
      className="group relative flex flex-col w-full bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder-product.jpg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {category && (
          <Badge className="absolute top-3 left-3 z-20 bg-card/90 backdrop-blur-sm text-foreground font-medium">
            {category}
          </Badge>
        )}

        {/* Overlay visual de "Ver detalle" */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-card/95 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Eye className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Informacion del Producto */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          {shortDescription && (
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1.5">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-border">
          <span className="text-xl font-bold text-primary">
            {formatter.format(price)}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Ver detalles del producto
          </p>
        </div>
      </div>
    </Link>
  );
}
