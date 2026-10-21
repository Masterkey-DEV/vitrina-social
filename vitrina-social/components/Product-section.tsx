"use client";

import { useEffect, useState } from "react";
import { getProducts, getProductCategories } from "@/actions/product.actions";
import { Product, ProductCategory } from "@/types/product";
import { API_URL } from "@/const/api";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Product row component (inline or separate)
function ProductRow({ product }: { product: Product }) {
  const rawUrl = product.images?.[0]?.url;
  const imageUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : `${API_URL}${rawUrl}`
    : "/holder_productos.jpeg";

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group flex flex-col sm:flex-row gap-4 border border-muted rounded-xl p-4 hover:bg-muted/5 transition-colors"
    >
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-muted/20 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.product_categories?.[0]?.name && (
            <p className="text-sm text-muted-foreground">
              {product.product_categories[0].name}
            </p>
          )}
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          {product.usuario && (
            <div className="flex items-center gap-3 py-4 border-y border-border/60">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-primary">
                  {product.usuario.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendido por</p>
                <p className="text-sm font-bold">{product.usuario.username}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            {product.price != null
              ? `$${Number(product.price).toLocaleString("es-CO")} COP`
              : "Consultar precio"}
          </span>
          <Button size="sm" variant="ghost" className="gap-1">
            Ver detalles
          </Button>
        </div>
      </div>
    </Link>
  );
}

export function ProductsSection() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedLocalCategory, setSelectedLocalCategory] =
    useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getProductCategories();
      if (result.success) setCategories(result.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getProducts(selectedLocalCategory);
      if (result.success) {
        setProducts(result.data);
        setError(null);
      } else {
        setError(result.error || "Error desconocido");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedLocalCategory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium text-center">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <section id="products" className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <h3 className="font-semibold text-lg">Categorías</h3>
            <div className="flex flex-row md:flex-col flex-wrap gap-2">
              <Button
                variant={
                  selectedLocalCategory === "all" ? "default" : "outline"
                }
                onClick={() => setSelectedLocalCategory("all")}
                size="sm"
                className="justify-start"
              >
                Todos
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    selectedLocalCategory === cat.name ? "default" : "outline"
                  }
                  onClick={() => setSelectedLocalCategory(cat.name)}
                  size="sm"
                  className="justify-start"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products List */}
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {selectedLocalCategory !== "all"
                ? `Explora ${selectedLocalCategory}`
                : "Nuestros Productos"}
            </h2>
            <p className="text-muted-foreground mt-1">
              Calidad seleccionada para apoyar tu camino.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-muted rounded-[2rem] bg-muted/5">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold">Sin existencias</h3>
              <p className="text-muted-foreground mt-1">
                No hay productos disponibles en esta categoría.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
