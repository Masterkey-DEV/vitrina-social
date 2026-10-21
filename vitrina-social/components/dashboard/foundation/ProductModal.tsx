"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { ImageUpload } from "./ImageUpload";
import { ModalShell } from "./ModalShell";
import { Toggle } from "./Toggle";
import { inputCls, autoSlug } from "@/utils/dashboard";
import { API_URL } from "@/const/api";
import type { ProdForm } from "@/types/dashboard";
import type { ProductCategory } from "@/types/product";

interface ProductModalProps {
  mode: "create" | "edit";
  form: ProdForm;
  image: File | null;
  saving: boolean;
  jwt: string | null;
  onFormChange: (form: ProdForm) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProductModal({
  mode, form, image, saving, jwt,
  onFormChange, onImageChange, onSave, onClose,
}: ProductModalProps) {
  const title = mode === "create" ? "Nuevo producto" : "Editar producto";
  const submitLabel = mode === "create" ? "Crear producto" : "Guardar cambios";

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  useEffect(() => {
    if (!jwt) return;
    setLoadingCats(true);
    fetch(
      `${API_URL}/api/product-categories?fields[0]=id&fields[1]=name&sort=name:asc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(console.error)
      .finally(() => setLoadingCats(false));
  }, [jwt]);

  const toggleCategory = (id: number) => {
    const ids = form.product_category_ids ?? [];
    onFormChange({
      ...form,
      product_category_ids: ids.includes(id)
        ? ids.filter((x) => x !== id)
        : [...ids, id],
    });
  };

  return (
    <ModalShell title={title} onClose={onClose}>

      <Field label="Nombre *">
        <input
          value={form.name}
          onChange={(e) =>
            onFormChange({
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
          onChange={(e) => onFormChange({ ...form, slug: e.target.value })}
          placeholder="producto-artesanal"
          className={inputCls}
        />
      </Field>

      <Field label="Descripción corta">
        <input
          value={form.shortDescription}
          onChange={(e) =>
            onFormChange({ ...form, shortDescription: e.target.value })
          }
          placeholder="Breve descripción visible en el catálogo"
          className={inputCls}
        />
      </Field>

      <Field label="Descripción completa">
        <textarea
          value={form.description}
          onChange={(e) =>
            onFormChange({ ...form, description: e.target.value })
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
            min={0}
            value={form.price}
            onChange={(e) => onFormChange({ ...form, price: e.target.value })}
            placeholder="25000"
            className={inputCls}
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => onFormChange({ ...form, stock: e.target.value })}
            placeholder="10"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Imagen">
        <ImageUpload
          file={image}
          onChange={onImageChange}
          placeholder="Subir imagen del producto"
        />
      </Field>

      <Field label="Categorías">
        {loadingCats ? (
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
              const selected = (form.product_category_ids ?? []).includes(cat.id);
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
                      : "bg-background text-foreground border-border hover:border-primary/50"
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

      <Toggle
        checked={form.featured}
        onChange={(v) => onFormChange({ ...form, featured: v })}
        label="Marcar como destacado"
      />

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1 rounded-xl font-bold"
          onClick={onSave}
          disabled={saving || !form.name.trim()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
        </Button>
      </div>

    </ModalShell>
  );
}