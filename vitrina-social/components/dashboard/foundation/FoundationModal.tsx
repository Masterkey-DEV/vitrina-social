"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./Field";
import { ModalShell } from "./ModalShell";
import { inputCls } from "@/utils/dashboard";
import { API_URL } from "@/const/api";

interface FoundationForm {
  name: string;
  siglas: string;
  city?: string;
  department?: string;
  location?: string;
  description?: string;
}

interface FoundationModalProps {
  foundation: any;
  form: FoundationForm;
  saving: boolean;
  jwt: string | null;
  onFormChange: (form: FoundationForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function FoundationModal({
  foundation,
  form,
  saving,
  jwt,
  onFormChange,
  onSave,
  onClose,
}: FoundationModalProps) {
  const [localSaving, setLocalSaving] = useState(false);

  const handleSave = async () => {
    if (!jwt) return;

    try {
      setLocalSaving(true);

      const res = await fetch(
        `${API_URL}/api/foundations/${foundation.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              name: form.name,
              siglas: form.siglas,
              city: form.city,
              department: form.department,
              location: form.location,
              description: form.description,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Error actualizando fundación");

      onSave();   // refresca dashboard
      onClose();  // cierra modal
    } catch (err) {
      console.error(err);
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <ModalShell title="Editar fundación" onClose={onClose}>

      <Field label="Nombre *">
        <input
          value={form.name}
          onChange={(e) =>
            onFormChange({ ...form, name: e.target.value })
          }
          className={inputCls}
        />
      </Field>

      <Field label="Siglas">
        <input
          value={form.siglas}
          onChange={(e) =>
            onFormChange({ ...form, siglas: e.target.value })
          }
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ciudad">
          <input
            value={form.city}
            onChange={(e) =>
              onFormChange({ ...form, city: e.target.value })
            }
            placeholder="Cali"
            className={inputCls}
          />
        </Field>

        <Field label="Departamento">
          <input
            value={form.department}
            onChange={(e) =>
              onFormChange({ ...form, department: e.target.value })
            }
            placeholder="Valle del Cauca"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Ubicación (fallback)">
        <input
          value={form.location}
          onChange={(e) =>
            onFormChange({ ...form, location: e.target.value })
          }
          placeholder="Colombia"
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
          className={inputCls}
        />
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
          onClick={handleSave}
          disabled={localSaving || !form.name.trim()}
        >
          {localSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </ModalShell>
  );
}