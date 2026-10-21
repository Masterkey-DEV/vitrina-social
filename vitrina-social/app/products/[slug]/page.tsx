import { getProductBySlug } from "@/lib/server/queries";
import { getMediaUrl } from "@/lib/media";
import type { Product } from "@/types/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) notFound();

  const product: Product = result.data;
  const imageUrl = getMediaUrl(
    product.images?.[0]?.url,
    "/holder_productos.jpeg",
  );

  const price = product.price ?? 0;
  const stock = product.stock ?? 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Explorar más productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Galería */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border bg-muted">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {product.featured && (
              <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-1 rounded-full">
                Destacado
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border-none"
            >
              {product.product_categories?.[0]?.name || "Iniciativa"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 pl-4 border-primary/20">
                "{product.shortDescription}"
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">
              ${price.toLocaleString("es-CO")}
            </span>
            {stock > 0 && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {stock} disponibles
              </span>
            )}
          </div>

          {/* Usuario vinculado */}
          {product.usuario && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/60">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-primary">
                  {product.usuario.username[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Vendido por</p>
                <p className="text-sm font-bold truncate">
                  {product.usuario.username}
                </p>
              </div>
              <User className="h-4 w-4 text-muted-foreground/40 ml-auto shrink-0" />
            </div>
          )}

          {product.description && (
            <div className="prose prose-gray py-6 border-y border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Historia del producto
              </h3>
              <p className="text-foreground/80 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button className="rounded-2xl h-16 text-lg font-bold gap-3 shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-6 w-6" />
              Apoyar Proyecto
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl h-16 border-2 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                className="aspect-square p-0 rounded-2xl h-16 border-2"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
