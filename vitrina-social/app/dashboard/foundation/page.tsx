"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, Eye, Lightbulb, Package, Plus, X } from "lucide-react";

import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import { StatsGrid } from "@/components/dashboard/foundation/Statsgrid";
import { TabBar } from "@/components/dashboard/foundation/Tabbar";
import { InitiativeCard } from "@/components/dashboard/foundation/InitiativeCard";
import { ProductCard } from "@/components/dashboard/foundation/ProductCard";
import { EmptyState } from "@/components/dashboard/foundation/EmptyState";
import { InitiativeModal } from "@/components/dashboard/foundation/InititativeModal";
import { ProductModal } from "@/components/dashboard/foundation/ProductModal";

import { useInitiatives, useProducts, useCategories } from "@/hooks/dashboard";

import type { Foundation, Tab } from "@/types/dashboard";

export default function FoundationDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [tab, setTab] = useState<Tab>("initiatives");
  const [dataLoading, setDataLoading] = useState(true);

  // ── Filtros de categoría ──────────────────────────────────────────────────
  const [initiativeCategoryFilter, setInitiativeCategoryFilter] = useState<string | null>(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string | null>(null);

  const initiatives = useInitiatives(jwt);
  const products = useProducts(jwt);
  const { categories, fetch: fetchCategories } = useCategories(jwt);

  const initiativesFetchRef = useRef(initiatives.fetch);
  const productsFetchRef = useRef(products.fetch);
  const fetchCategoriesRef = useRef(fetchCategories);

  useEffect(() => { initiativesFetchRef.current = initiatives.fetch; }, [initiatives.fetch]);
  useEffect(() => { productsFetchRef.current = products.fetch; }, [products.fetch]);
  useEffect(() => { fetchCategoriesRef.current = fetchCategories; }, [fetchCategories]);

  const fetchFoundation = useCallback(async () => {
    if (!user || !jwt) return null;
    try {
      const res = await fetch(
        `${API_URL}/api/users/me?populate[foundation][fields][0]=id&populate[foundation][fields][1]=documentId&populate[foundation][fields][2]=name&populate[foundation][fields][3]=siglas`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.foundation ?? null;
    } catch (err) {
      console.error("Error loading foundation:", err);
      toast({ variant: "destructive", title: "Error al cargar fundación" });
      return null;
    }
  }, [user, jwt, toast]);

  const initDashboard = useCallback(async () => {
    try {
      setDataLoading(true);
      await fetchCategoriesRef.current();
      const found = await fetchFoundation();
      if (!found) {
        toast({ variant: "destructive", title: "Sin fundación", description: "Tu usuario no tiene una fundación asociada." });
        return;
      }
      setFoundation(found);
      await Promise.all([
        initiativesFetchRef.current(found.documentId),
        productsFetchRef.current(user!.id),
      ]);
    } catch (err) {
      console.error("Dashboard error:", err);
      toast({ variant: "destructive", title: "Error al cargar el panel" });
    } finally {
      setDataLoading(false);
    }
  }, [fetchFoundation, user, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) { setDataLoading(false); router.replace("/login"); return; }
    if (user.role?.name?.toLowerCase() !== "foundation") { setDataLoading(false); router.replace("/dashboard"); return; }
    initDashboard();
  }, [authLoading, user, jwt, router, initDashboard]);

  const handleLogout = useCallback(() => {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }, [logout, toast, router]);

  // ── Listas filtradas ──────────────────────────────────────────────────────
  const filteredInitiatives = useMemo(() => {
    if (!initiativeCategoryFilter) return initiatives.initiatives;
    return initiatives.initiatives.filter((i) =>
      i.initiatives_categories?.some((c) => c.name === initiativeCategoryFilter)
    );
  }, [initiatives.initiatives, initiativeCategoryFilter]);

  const filteredProducts = useMemo(() => {
    if (!productCategoryFilter) return products.products;
    return products.products.filter((p) =>
      p.product_categories?.some((c) => c.name === productCategoryFilter)
    );
  }, [products.products, productCategoryFilter]);

  // ── Categorías únicas presentes en los datos actuales ─────────────────────
  const initiativeCategories = useMemo(() => {
    const seen = new Map<string, string>();
    initiatives.initiatives.forEach((i) =>
      i.initiatives_categories?.forEach((c) => seen.set(c.name, c.name))
    );
    return Array.from(seen.values());
  }, [initiatives.initiatives]);

  const productCategories = useMemo(() => {
    const seen = new Map<string, string>();
    products.products.forEach((p) =>
      p.product_categories?.forEach((c) => seen.set(c.name, c.name))
    );
    return Array.from(seen.values());
  }, [products.products]);

  if (authLoading || dataLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Panel de fundación</p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{foundation?.name ?? user.username}</h1>
              {foundation && <Badge variant="outline" className="rounded-full text-sm font-black">{foundation.siglas}</Badge>}
            </div>
            {foundation && (
              <Link href={`/foundations/${foundation.siglas}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1">
                <Eye className="h-3 w-3" />Ver perfil público
              </Link>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl gap-2 text-destructive border-destructive/20">
            <LogOut className="h-4 w-4" />Salir
          </Button>
        </div>

        {/* STATS */}
        <StatsGrid foundation={foundation} initiatives={initiatives.initiatives} products={products.products} />

        {/* TABS */}
        <TabBar active={tab} onChange={setTab} />

        {/* INITIATIVES */}
        {tab === "initiatives" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis iniciativas</h2>
              <Button onClick={initiatives.openCreate} className="rounded-xl gap-2 font-bold">
                <Plus className="h-4 w-4" />Nueva iniciativa
              </Button>
            </div>

            {/* Filtro de categorías */}
            {initiativeCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setInitiativeCategoryFilter(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    !initiativeCategoryFilter
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  Todas
                </button>
                {initiativeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInitiativeCategoryFilter(
                      initiativeCategoryFilter === cat ? null : cat
                    )}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      initiativeCategoryFilter === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {cat}
                    {initiativeCategoryFilter === cat && <X className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}

            {filteredInitiatives.length === 0 ? (
              initiativeCategoryFilter ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  No hay iniciativas en la categoría <span className="font-semibold">"{initiativeCategoryFilter}"</span>.{" "}
                  <button onClick={() => setInitiativeCategoryFilter(null)} className="text-primary hover:underline">Ver todas</button>
                </div>
              ) : (
                <EmptyState icon={Lightbulb} title="Sin iniciativas" description="Crea tu primera iniciativa." actionLabel="Crear iniciativa" onAction={initiatives.openCreate} />
              )
            ) : (
              <div className="grid gap-3">
                {filteredInitiatives.map((init) => (
                  <InitiativeCard
                    key={init.id}
                    initiative={init}
                    deleting={initiatives.deleting === init.documentId}
                    onEdit={() => initiatives.openEdit(init)}
                    onDelete={() => foundation && initiatives.remove(init.documentId, foundation.documentId)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis productos</h2>
              <Button onClick={products.openCreate} className="rounded-xl gap-2 font-bold">
                <Plus className="h-4 w-4" />Nuevo producto
              </Button>
            </div>

            {/* Filtro de categorías */}
            {productCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setProductCategoryFilter(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    !productCategoryFilter
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  Todos
                </button>
                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(
                      productCategoryFilter === cat ? null : cat
                    )}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      productCategoryFilter === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {cat}
                    {productCategoryFilter === cat && <X className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              productCategoryFilter ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  No hay productos en la categoría <span className="font-semibold">"{productCategoryFilter}"</span>.{" "}
                  <button onClick={() => setProductCategoryFilter(null)} className="text-primary hover:underline">Ver todos</button>
                </div>
              ) : (
                <EmptyState icon={Package} title="Sin productos" description="Agrega productos vinculados a tu cuenta." actionLabel="Crear producto" onAction={products.openCreate} />
              )
            ) : (
              <div className="grid gap-3">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    deleting={products.deleting === prod.documentId}
                    onEdit={() => products.openEdit(prod)}
                    onDelete={() => products.remove(prod.documentId, user.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* MODAL INICIATIVA */}
      {initiatives.modal !== "closed" && (
        <InitiativeModal
          mode={initiatives.modal}
          form={initiatives.form}
          jwt={jwt}
          image={initiatives.image}
          saving={initiatives.saving}
          editTarget={initiatives.editTarget}
          onFormChange={initiatives.setForm}
          onImageChange={initiatives.setImage}
          onSave={() => foundation && initiatives.save(foundation.documentId)}
          onClose={initiatives.close}
        />
      )}

      {/* MODAL PRODUCTO */}
      {products.modal !== "closed" && (
        <ProductModal
          mode={products.modal}
          form={products.form}
          image={products.image}
          saving={products.saving}
          jwt={jwt}
          onFormChange={products.setForm}
          onImageChange={products.setImage}
          onSave={() => products.save(user.id)}
          onClose={products.close}
        />
      )}
    </div>
  );
}