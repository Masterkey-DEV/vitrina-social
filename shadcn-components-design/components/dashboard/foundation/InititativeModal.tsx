import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { ImageUpload } from "./ImageUpload";
import { ModalShell } from "./ModalShell";
import { inputCls } from "@/utils/dashboard";
import type { InitForm } from "@/types/dashboard";
import type { Category, Initiative } from "@/types/initiative";

interface InitiativeModalProps {
  mode: "create" | "edit";
  form: InitForm;
  categories: Category[];
  image: File | null;
  saving: boolean;
  editTarget: Initiative | null;
  onFormChange: (form: InitForm) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
  onClose: () => void;
}

export function InitiativeModal({
  mode,
  form,
  categories,
  image,
  saving,
  onFormChange,
  onImageChange,
  onSave,
  onClose,
}: InitiativeModalProps) {
  const title = mode === "create" ? "Nueva iniciativa" : "Editar iniciativa";
  const submitLabel =
    mode === "create" ? "Crear iniciativa" : "Guardar cambios";

  // FIX: guard contra categories undefined por cualquier path
  const currentCategories = form.categories ?? [];

  function toggleCategory(id: number) {
    const next = currentCategories.includes(id)
      ? currentCategories.filter((c) => c !== id)
      : [...currentCategories, id];
    onFormChange({ ...form, categories: next });
  }

  return (
    <ModalShell title={title} onClose={onClose}>
      <Field label="Título *">
        <input
          value={form.title}
          onChange={(e) => onFormChange({ ...form, title: e.target.value })}
          placeholder="Nombre de la iniciativa"
          className={inputCls}
        />
      </Field>

      <Field label="Objetivo">
        <input
          value={form.objective}
          onChange={(e) => onFormChange({ ...form, objective: e.target.value })}
          placeholder="¿Qué busca lograr esta iniciativa?"
          className={inputCls}
        />
      </Field>

      <Field label="Descripción">
        <textarea
          value={form.description}
          onChange={(e) =>
            onFormChange({ ...form, description: e.target.value })
          }
          rows={3}
          placeholder="Describe la iniciativa en detalle..."
          className={cn(inputCls, "resize-none")}
        />
      </Field>

      {categories.length > 0 && (
        <Field label="Categorías">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              // FIX: usa currentCategories que siempre es un array
              const selected = currentCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    selected
                      ? "bg-primary text-white border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      <Field label="Imagen">
        <ImageUpload file={image} onChange={onImageChange} />
      </Field>

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
          disabled={saving || !form.title.trim()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </ModalShell>
  );
}
