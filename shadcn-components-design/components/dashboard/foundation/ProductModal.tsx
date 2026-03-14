import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { ImageUpload } from "./ImageUpload";
import { ModalShell } from "./ModalShell";
import { Toggle } from "./Toggle";
import { inputCls } from "@/utils/dashboard";
import { autoSlug } from "@/utils/dashboard";
import type { ProdForm } from "@/types/dashboard";

interface ProductModalProps {
  mode: "create" | "edit";
  form: ProdForm;
  image: File | null;
  saving: boolean;
  onFormChange: (form: ProdForm) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProductModal({
  mode,
  form,
  image,
  saving,
  onFormChange,
  onImageChange,
  onSave,
  onClose,
}: ProductModalProps) {
  const title = mode === "create" ? "Nuevo producto" : "Editar producto";
  const submitLabel = mode === "create" ? "Crear producto" : "Guardar cambios";

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
