"use client";

import { useEffect, useState, useRef } from "react";
import { getFeaturedProducts } from "@/actions/product.actions";
import { Product } from "@/types/product";
import { API_URL } from "@/const/api";
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeaturedProductsSliderProps {
  limit?: number;
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
}

function ProductSlide({ product }: { product: Product }) {
  const rawUrl = product.images?.[0]?.url;
  const imageUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `${API_URL}${rawUrl}`
    : "/holder_productos.jpeg";

  return (
    <Link href={`/products/${product.slug || product.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.featured && (
            <Badge className="absolute top-3 left-3 z-10 bg-accent text-foreground font-medium">
              Destacado
            </Badge>
          )}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.product_categories?.[0]?.name && (
              <Badge variant="outline" className="text-xs mt-2 font-normal">
                {product.product_categories[0].name}
              </Badge>
            )}
          </div>
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">
              {product.price != null
                ? `$${Number(product.price).toLocaleString("es-CO")}`
                : "Consultar"}
            </span>
            {product.price != null && (
              <p className="text-xs text-muted-foreground">COP</p>
            )}
          </div>
          <Button size="sm" variant="outline" className="rounded-full text-sm">
            Ver producto
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function FeaturedProductsSlider({
  limit = 10,
  title = "Productos Destacados",
  subtitle = "Descubre lo mejor de nuestros artesanos",
  autoplay = true,
  autoplayDelay = 5000,
}: FeaturedProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>(null);

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
      } catch {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  const totalSlides = Math.ceil(products.length / 3);

  const nextSlide = () => {
    if (isAnimating || totalSlides <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || totalSlides <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (autoplay && products.length > 3) {
      autoplayRef.current = setInterval(nextSlide, autoplayDelay);
      return () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      };
    }
  }, [autoplay, autoplayDelay, products.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground mt-4 text-sm">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-border">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-border">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Proximamente</h3>
        <p className="text-muted-foreground mt-2">
          Pronto tendras acceso a productos artesanales unicos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>

      {/* Slider */}
      <div className="relative">
        {totalSlides > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-card shadow-lg hover:bg-muted hidden md:flex"
              onClick={prevSlide}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-card shadow-lg hover:bg-muted hidden md:flex"
              onClick={nextSlide}
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        <div ref={sliderRef} className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                  {products.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                    <ProductSlide key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <Link href="/products">
          <Button variant="outline" className="rounded-full gap-2 px-6">
            Ver todos los productos
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
