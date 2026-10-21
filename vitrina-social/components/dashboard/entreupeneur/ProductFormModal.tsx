// @/components/dashboard/entreupeneur/ProductFormModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, Upload, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_URL } from "@/const/api";

// Campo reutilizable
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

interface ProductCategory {
  id: number;
  documentId: string;
  name: string;
  description?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData: {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: string;
    stock: string;
    featured: boolean;
    categories?: number[]; // IDs de categorías seleccionadas
  };
  onClose: () => void;
  onSave: (formData: any, imageFile: File | null) => void;
  saving: boolean;
  jwt: string | null; // Añadimos JWT para autenticar la petición de categorías
}

export function ProductFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  saving,
  jwt,
}: ProductFormModalProps) {
  const [form, setForm] = useState(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Cargar categorías de productos al abrir el modal
  useEffect(() => {
    if (!isOpen || !jwt) return;

    setLoadingCategories(true);
    fetch(
      `${API_URL}/api/product-categories?fields[0]=id&fields[1]=documentId&fields[2]=name&sort=name:asc`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json();
      })
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("Error cargando categorías:", error);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, [isOpen, jwt]);

  useEffect(() => {
    setForm(initialData);
    setImageFile(null);
  }, [initialData]);

  if (!isOpen) return null;

  const autoSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const inputCls =
    "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  const currentCategories = form.categories ?? [];

  function toggleCategory(categoryId: number) {
    const next = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setForm({ ...form, categories: next });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-black text-xl">
            {mode === "create" ? "Nuevo producto" : "Editar producto"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onClose}
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
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="25000"
                className={inputCls}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="10"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Imagen">
            <label
              className={cn(
                "flex items-center gap-3 cursor-pointer border border-dashed rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group",
                imageFile ? "border-primary/40 bg-primary/5" : "border-input",
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

          {/* Categorías */}
          <Field label="Categorías">
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando categorías...
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No hay categorías disponibles.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const selected = currentCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                        "text-sm font-medium border transition-all",
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </Field>

          {/* Featured toggle */}
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
            <span className="text-sm font-semibold">Marcar como destacado</span>
          </label>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold"
            onClick={() => onSave(form, imageFile)}
            disabled={saving || !form.name}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "create" ? (
              "Crear producto"
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
