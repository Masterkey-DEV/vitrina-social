"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API_URL } from "@/const/api";
import { Product } from "@/types/product";
import { getMediaUrl } from "@/lib/media";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, LogOut, X, CheckCircle2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StatsCards } from "@/components/dashboard/entreupeneur/StatsCard";
import { ProductListItem } from "@/components/dashboard/entreupeneur/ProductListItem";
import { EmptyProductsState } from "@/components/dashboard/entreupeneur/EmptyProductState";
import { ProductFormModal } from "@/components/dashboard/entreupeneur/ProductFormModal";
import { LoadingSpinner } from "@/components/dashboard/entreupeneur/LoadingSpinner";

export default function EntrepreneurDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalState, setModalState] = useState<"closed" | "create" | "edit">(
    "closed",
  );
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Cargar productos
  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) {
      router.replace("/login");
      return;
    }
    if (user.role?.name?.toLowerCase() !== "entrepreneur") {
      router.replace("/dashboard");
      return;
    }
    loadProducts();
  }, [authLoading, user, jwt, router]);

  async function loadProducts() {
    if (!jwt || !user?.id) return;
    setDataLoading(true);
    try {
      const query = `filters[usuario][id][$eq]=${user.id}&populate=images`;
      const res = await fetch(`${API_URL}/api/products?${query}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error en la respuesta de Strapi");
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setDataLoading(false);
    }
  }

  async function handleSave(formData: any, imageFile: File | null) {
    if (!jwt || !user?.id) return;
    setSaving(true);
    try {
      let imageId: number | undefined;
      if (imageFile) {
        const fd = new FormData();
        fd.append("files", imageFile);
        const up = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${jwt}` },
          body: fd,
        });
        if (up.ok) {
          const u = await up.json();
          imageId = u[0]?.id;
        }
      }

      const payload = {
        name: formData.name,
        slug: formData.slug || autoSlug(formData.name),
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured,
        usuario: user.id,
        categories: formData.categories || [],
        ...(imageId ? { images: [imageId] } : {}),
      };

      if (modalState === "create") {
        const res = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: payload }),
        });
        if (!res.ok) throw new Error("Error al crear");
        toast({ title: "¡Producto creado! 🚀" });
      } else if (modalState === "edit" && editTarget) {
        const res = await fetch(
          `${API_URL}/api/products/${editTarget.documentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ data: payload }),
          },
        );
        if (!res.ok) throw new Error("Error al actualizar");
        toast({ title: "Producto actualizado ✅" });
      }

      await loadProducts();
      closeModal();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(documentId: string) {
    if (!jwt) return;
    setDeletingId(documentId);
    try {
      const res = await fetch(`${API_URL}/api/products/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error();
      toast({ title: "Producto eliminado" });
      await loadProducts();
    } catch {
      toast({ variant: "destructive", title: "Error al eliminar" });
    } finally {
      setDeletingId(null);
    }
  }

  function openCreate() {
    setModalState("create");
    setEditTarget(null);
  }

  function openEdit(product: Product) {
    setModalState("edit");
    setEditTarget(product);
  }

  function closeModal() {
    setModalState("closed");
    setEditTarget(null);
  }

  function handleLogout() {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }

  if (authLoading || dataLoading) return <LoadingSpinner />;
  if (!user) return null;

  // Inicializa los datos del formulario según el modo
  const initialFormData =
    modalState === "create"
      ? {
          name: "",
          slug: "",
          shortDescription: "",
          description: "",
          price: "",
          stock: "",
          featured: false,
          categories: [],
        }
      : editTarget
        ? {
            name: editTarget.name,
            slug: editTarget.slug,
            shortDescription: editTarget.shortDescription ?? "",
            description: "",
            price: editTarget.price?.toString() ?? "",
            stock: editTarget.stock?.toString() ?? "",
            featured: editTarget.featured ?? false,
          }
        : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Panel de emprendedor
            </p>
            <h1 className="text-3xl font-black tracking-tight">
              Hola, {user.username} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gestiona tu catálogo de productos
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={openCreate} className="rounded-xl gap-2 font-bold">
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl gap-2 text-destructive hover:text-destructive border-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards products={products} />

        {/* Products List */}
        <div className="space-y-3">
          <h2 className="font-black text-lg">Mis productos</h2>
          {products.length === 0 ? (
            <EmptyProductsState onCreate={openCreate} />
          ) : (
            <div className="grid gap-3">
              {products.map((prod) => (
                <ProductListItem
                  key={prod.id}
                  product={prod}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === prod.documentId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalState !== "closed" && initialFormData && (
        <ProductFormModal
          isOpen={true}
          mode={modalState}
          initialData={initialFormData}
          onClose={closeModal}
          onSave={handleSave}
          saving={saving}
          jwt={jwt}
        />
      )}
    </div>
  );
}

// Helper local
function autoSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
