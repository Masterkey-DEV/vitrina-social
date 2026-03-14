"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, Eye, Lightbulb, Package, Plus } from "lucide-react";

import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

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

  const initiatives = useInitiatives(jwt);
  const products = useProducts(jwt);
  const { categories, fetch: fetchCategories } = useCategories(jwt);

  // ──────────────────────────────────────────────
  // FIX 1: Guardar las funciones fetch en refs para que
  // initDashboard no dependa de objetos que cambian en
  // cada render, evitando el bucle infinito.
  // ──────────────────────────────────────────────
  const initiativesFetchRef = useRef(initiatives.fetch);
  const productsFetchRef = useRef(products.fetch);
  const fetchCategoriesRef = useRef(fetchCategories);

  useEffect(() => {
    initiativesFetchRef.current = initiatives.fetch;
  }, [initiatives.fetch]);
  useEffect(() => {
    productsFetchRef.current = products.fetch;
  }, [products.fetch]);
  useEffect(() => {
    fetchCategoriesRef.current = fetchCategories;
  }, [fetchCategories]);

  // ──────────────────────────────────────────────
  // Cargar fundación del usuario
  // ──────────────────────────────────────────────
  // DESPUÉS — usa /api/users/me que ya confirmas que funciona (200)
  const fetchFoundation = useCallback(async () => {
    if (!user || !jwt) return null;

    try {
      // Opción 1: poblar foundation desde el usuario autenticado
      const res = await fetch(
        `${API_URL}/api/users/me?populate[foundation][populate]=*`,
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
  }, [jwt, toast]);

  // ──────────────────────────────────────────────
  // Inicializar Dashboard
  // FIX 2: Las dependencias solo incluyen funciones
  // estables (fetchFoundation + refs). Sin bucle.
  // ──────────────────────────────────────────────
  const initDashboard = useCallback(async () => {
    try {
      setDataLoading(true);

      await fetchCategoriesRef.current();

      const found = await fetchFoundation();

      if (!found) {
        toast({
          variant: "destructive",
          title: "Sin fundación",
          description: "Tu usuario no tiene una fundación asociada.",
        });
        // FIX 3: return explícito para no continuar con found=null
        return;
      }

      setFoundation(found);

      await Promise.all([
        initiativesFetchRef.current(found.documentId),
        productsFetchRef.current(),
      ]);
    } catch (err) {
      console.error("Dashboard error:", err);
      toast({ variant: "destructive", title: "Error al cargar el panel" });
    } finally {
      // Siempre se desactiva el loading, incluso en error
      setDataLoading(false);
    }
  }, [fetchFoundation, toast]);

  // ──────────────────────────────────────────────
  // Auth guard
  // FIX 4: setDataLoading(false) si se redirige,
  // para no dejar el estado colgado.
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;

    if (!user || !jwt) {
      setDataLoading(false);
      router.replace("/login");
      return;
    }

    const role = user.role?.name?.toLowerCase();

    if (role !== "foundation") {
      setDataLoading(false);
      router.replace("/dashboard");
      return;
    }

    initDashboard();
  }, [authLoading, user, jwt, router, initDashboard]);

  // ──────────────────────────────────────────────
  // FIX 5: handleLogout memoizado con useCallback
  // ──────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }, [logout, toast, router]);

  // ──────────────────────────────────────────────
  // Loading state
  // ──────────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Panel de fundación
            </p>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">
                {foundation?.name ?? user.username}
              </h1>

              {foundation && (
                <Badge
                  variant="outline"
                  className="rounded-full text-sm font-black"
                >
                  {foundation.siglas}
                </Badge>
              )}
            </div>

            {foundation && (
              <Link
                href={`/foundations/${foundation.siglas}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <Eye className="h-3 w-3" />
                Ver perfil público
              </Link>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl gap-2 text-destructive border-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>

        {/* STATS */}
        <StatsGrid
          foundation={foundation}
          initiatives={initiatives.initiatives}
          products={products.products}
        />

        {/* TABS */}
        <TabBar active={tab} onChange={setTab} />

        {/* INITIATIVES */}
        {tab === "initiatives" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis iniciativas</h2>
              <Button
                onClick={initiatives.openCreate}
                className="rounded-xl gap-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Nueva iniciativa
              </Button>
            </div>

            {initiatives.initiatives.length === 0 ? (
              <EmptyState
                icon={Lightbulb}
                title="Sin iniciativas"
                description="Crea tu primera iniciativa."
                actionLabel="Crear iniciativa"
                onAction={initiatives.openCreate}
              />
            ) : (
              <div className="grid gap-3">
                {initiatives.initiatives.map((init) => (
                  <InitiativeCard
                    key={init.id}
                    initiative={init}
                    deleting={initiatives.deleting === init.documentId}
                    onEdit={() => initiatives.openEdit(init)}
                    onDelete={() =>
                      foundation &&
                      initiatives.remove(init.documentId, foundation.documentId)
                    }
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
              <Button
                onClick={products.openCreate}
                className="rounded-xl gap-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Nuevo producto
              </Button>
            </div>

            {products.products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Sin productos"
                description="Agrega productos vinculados a tu fundación."
                actionLabel="Crear producto"
                onAction={products.openCreate}
              />
            ) : (
              <div className="grid gap-3">
                {products.products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    deleting={products.deleting === prod.documentId}
                    onEdit={() => products.openEdit(prod)}
                    onDelete={() => products.remove(prod.documentId)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* MODALS */}
      {initiatives.modal !== "closed" && (
        <InitiativeModal
          mode={initiatives.modal}
          form={initiatives.form}
          categories={categories}
          image={initiatives.image}
          saving={initiatives.saving}
          editTarget={initiatives.editTarget}
          onFormChange={initiatives.setForm}
          onImageChange={initiatives.setImage}
          onSave={() => foundation && initiatives.save(foundation.documentId)}
          onClose={initiatives.close}
        />
      )}

      {products.modal !== "closed" && (
        <ProductModal
          mode={products.modal}
          form={products.form}
          image={products.image}
          saving={products.saving}
          onFormChange={products.setForm}
          onImageChange={products.setImage}
          onSave={products.save}
          onClose={products.close}
        />
      )}
    </div>
  );
}
