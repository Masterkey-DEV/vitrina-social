"use client";

import { useEffect, useState } from "react";
import { getProducts, getProductCategories } from "@/actions/product.actions";
import { Product, ProductCategory } from "@/types/product";
import { ProductCard } from "@/components/product-card";
import { API_URL } from "@/const/api";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductsSection() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedLocalCategory, setSelectedLocalCategory] = useState<string>("all");
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

  return (
    <section id="products" className="px-4 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {selectedLocalCategory !== "all"
              ? `Explora ${selectedLocalCategory}`
              : "Nuestros Productos"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Calidad seleccionada para apoyar tu camino.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLocalCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedLocalCategory("all")}
            size="sm"
          >
            Todos
          </Button>
          {categories.map((cat: ProductCategory) => (
            <Button
              key={cat.id}
              variant={selectedLocalCategory === cat.name ? "default" : "outline"}
              onClick={() => setSelectedLocalCategory(cat.name)}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => {
            const rawUrl = product.images?.[0]?.url;
            const imageUrl = rawUrl
              ? rawUrl.startsWith("http")
                ? rawUrl
                : `${API_URL}${rawUrl}`
              : "/placeholder.jpg";

            return (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                category={product.product_categories?.[0]?.name}
                imageSrc={imageUrl}
                shortDescription={product.shortDescription}
                href={`/products/${product.slug || product.id}`}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-muted rounded-[2rem] bg-muted/5">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-xl font-semibold">Sin existencias</h3>
          <p className="text-muted-foreground mt-1">
            No hay productos disponibles por ahora.
          </p>
        </div>
      )}
    </section>
  );
}