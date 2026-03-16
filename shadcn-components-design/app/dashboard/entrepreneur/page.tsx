"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  LogOut,
  Loader2,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  stock?: number;
  featured?: boolean;
  images?: { url: string }[];
}

type ModalState = "closed" | "create" | "edit";
const EMPTY_FORM = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "",
  featured: false,
};

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

const inputCls =
  "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

export default function EntrepreneurDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>("closed");
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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
      // CAMBIO CLAVE: Usar 'usuario' en lugar de 'owner'
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

  function openCreate() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditTarget(null);
    setModal("create");
  }
  function openEdit(p: Product) {
    setForm({
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? "",
      description: "",
      price: p.price?.toString() ?? "",
      stock: p.stock?.toString() ?? "",
      featured: p.featured ?? false,
    });
    setImageFile(null);
    setEditTarget(p);
    setModal("edit");
  }
  function closeModal() {
    setModal("closed");
    setEditTarget(null);
  }

  async function handleSave() {
    if (!jwt || !user?.id) return; // Necesitamos el ID del usuario
    setSaving(true);
    try {
      let imageId: number | undefined;

      // Lógica de subida de imagen (se mantiene igual)
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

      // CAMBIO 2: Incluir el 'owner' en el payload
      const payload = {
        name: form.name,
        slug: form.slug || autoSlug(form.name),
        shortDescription: form.shortDescription,
        description: form.description,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
        // CAMBIO: Aquí también usamos el nombre técnico de la relación
        usuario: user.id,
        ...(imageId ? { images: [imageId] } : {}),
      };

      if (modal === "create") {
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
      } else if (modal === "edit" && editTarget) {
        // CAMBIO 3: Usar el documentId para el PUT
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
    setDeleting(documentId);
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
      setDeleting(null);
    }
  }

  function handleLogout() {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }

  if (authLoading || dataLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
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

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black text-primary">
              {products.length}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Productos
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black">
              {products.filter((p) => p.featured).length}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Destacados
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black">
              {products.reduce((a, p) => a + (p.stock ?? 0), 0)}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Stock total
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-black text-lg">Mis productos</h2>
          {products.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
              <Package className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <div>
                <p className="font-bold">Aún no tienes productos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crea tu primer producto para aparecer en el catálogo
                </p>
              </div>
              <Button
                onClick={openCreate}
                className="rounded-xl gap-2 font-bold mt-2"
              >
                <Plus className="h-4 w-4" />
                Crear producto
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden shrink-0">
                      {prod.images?.[0] ? (
                        <img
                          src={`${API_URL}${prod.images[0].url}`}
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black truncate">{prod.name}</h3>
                        {prod.featured && (
                          <Badge className="rounded-full text-[10px] px-2">
                            Destacado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {prod.shortDescription}
                      </p>
                      <p className="text-xs font-bold text-primary">
                        ${prod.price?.toLocaleString("es-CO")} · {prod.stock} en
                        stock
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/products/${prod.slug}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-9 w-9"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-9 w-9"
                      onClick={() => openEdit(prod)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleDelete(prod.documentId)}
                      disabled={deleting === prod.documentId}
                    >
                      {deleting === prod.documentId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-black text-xl">
                {modal === "create" ? "Nuevo producto" : "Editar producto"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={closeModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Nombre *">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: autoSlug(e.target.value),
                    })
                  }
                  placeholder="Producto artesanal"
                  className={inputCls}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="producto-artesanal"
                  className={inputCls}
                />
              </Field>
              <Field label="Descripción corta">
                <input
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  placeholder="Breve descripción visible en el catálogo"
                  className={inputCls}
                />
              </Field>
              <Field label="Descripción completa">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe tu producto en detalle..."
                  className={cn(inputCls, "resize-none")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio (COP)">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="25000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="10"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Imagen">
                <label
                  className={cn(
                    "flex items-center gap-3 cursor-pointer border border-dashed rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group",
                    imageFile
                      ? "border-primary/40 bg-primary/5"
                      : "border-input",
                  )}
                >
                  {imageFile ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                  <span className="text-sm text-muted-foreground truncate">
                    {imageFile ? imageFile.name : "Subir imagen del producto"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
              </Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={cn(
                    "h-6 w-11 rounded-full transition-colors relative",
                    form.featured ? "bg-primary" : "bg-muted-foreground/20",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      form.featured ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </div>
                <span className="text-sm font-semibold">
                  Marcar como destacado
                </span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={closeModal}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 rounded-xl font-bold"
                onClick={handleSave}
                disabled={saving || !form.name}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : modal === "create" ? (
                  "Crear producto"
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
