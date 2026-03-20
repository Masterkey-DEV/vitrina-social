"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { ImageUpload } from "./ImageUpload";
import { ModalShell } from "./ModalShell";
import { inputCls } from "@/utils/dashboard";
import { API_URL } from "@/const/api";
import type { InitForm } from "@/types/dashboard";
import type { Initiative } from "@/types/initiative";

interface Category {
  id: number;
  name: string;
}

interface InitiativeModalProps {
  mode: "create" | "edit";
  form: InitForm;
  image: File | null;
  saving: boolean;
  jwt: string | null;
  editTarget: Initiative | null;
  onFormChange: (form: InitForm) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
  onClose: () => void;
}

export function InitiativeModal({
  mode,
  form,
  image,
  saving,
  jwt,
  onFormChange,
  onImageChange,
  onSave,
  onClose,
}: InitiativeModalProps) {
  const title = mode === "create" ? "Nueva iniciativa" : "Editar iniciativa";
  const submitLabel = mode === "create" ? "Crear iniciativa" : "Guardar cambios";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  useEffect(() => {
    if (!jwt) return;
    setLoadingCats(true);
    fetch(
      `${API_URL}/api/initiatives-categories?fields[0]=id&fields[1]=name&sort=name:asc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(console.error)
      .finally(() => setLoadingCats(false));
  }, [jwt]);

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

      <Field label="Imagen">
        <ImageUpload file={image} onChange={onImageChange} />
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