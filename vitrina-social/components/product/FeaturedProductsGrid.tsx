// @/components/FeaturedProductsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/actions/product.actions";
import { Product } from "@/types/product";
import { API_URL } from "@/const/api";
import { Loader2, ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeaturedProductsGridProps {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
}

function ProductCard({ product }: { product: Product }) {
  const rawUrl = product.images?.[0]?.url;
  const imageUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `${API_URL}${rawUrl}`
    : "/holder_productos.jpeg";

  return (
    <Link href={`/products/${product.slug || product.id}`} className="group">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 group-hover:scale-[1.02]">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {product.featured && (
            <Badge className="absolute top-3 left-3 z-10 bg-primary text-white">
              Destacado
            </Badge>
          )}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
          {product.product_categories?.[0]?.name && (
            <p className="text-xs text-muted-foreground">
              {product.product_categories[0].name}
            </p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.shortDescription}
          </p>
          {product.usuario && (
            <div className="flex items-center gap-2 pt-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {product.usuario.username[0].toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {product.usuario.username}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {product.price != null
              ? `$${Number(product.price).toLocaleString("es-CO")}`
              : "Consultar"}
          </span>
          <Button size="sm" variant="ghost" className="gap-1">
            Ver más
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function FeaturedProductsGrid({
  limit = 6,
  showViewAll = true,
  title = "Productos Destacados",
  subtitle = "Descubre los productos más populares de nuestra comunidad",
}: FeaturedProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const result = await getFeaturedProducts(limit);
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error || "Error al cargar productos");
        }
      } catch (err) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-semibold">No hay productos destacados</h3>
        <p className="text-muted-foreground mt-1">
          Pronto tendremos productos disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showViewAll && (
        <div className="text-center pt-4">
          <Link href="/products">
            <Button variant="outline" className="rounded-full gap-2">
              Ver todos los productos
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
