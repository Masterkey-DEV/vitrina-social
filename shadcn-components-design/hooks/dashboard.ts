"use client";

import { useState, useCallback } from "react";
import { API_URL } from "@/const/api";
import { useToast } from "@/components/ui/use-toast";
import { EMPTY_INIT, EMPTY_PROD, autoSlug } from "@/utils/dashboard";
import type { Initiative, Category } from "@/types/initiative";
import type {
  InitForm,
  ProdForm,
  Product,
  StrapiResponse,
} from "@/types/dashboard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function extractStrapiError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    console.error("[strapi error]", body);
    return body?.error?.message ?? body?.message ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function uploadFile(jwt: string, file: File): Promise<number> {
  const fd = new FormData();
  fd.append("files", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: fd,
  });
  if (!res.ok) throw new Error(await extractStrapiError(res));
  const json = await res.json();
  const id = json[0]?.id;
  if (!id) throw new Error("Upload no devolvió un id");
  return id;
}

// ─── Initiatives ──────────────────────────────────────────────────────────────

export function useInitiatives(jwt: string | null) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [modal, setModal] = useState<"closed" | "create" | "edit">("closed");
  const [editTarget, setEditTarget] = useState<Initiative | null>(null);
  const [form, setForm] = useState<InitForm>(EMPTY_INIT);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInitiatives = useCallback(
    async (foundDocId: string) => {
      if (!jwt) return;

      // CORRECCIÓN: el endpoint en Strapi es "iniciatives" (typo original del proyecto)
      const res = await fetch(
        `${API_URL}/api/iniciatives` +
          `?filters[foundation][documentId][$eq]=${foundDocId}` +
          `&populate[initiatives_categories][fields][0]=id` +
          `&populate[initiatives_categories][fields][1]=documentId` +
          `&populate[initiatives_categories][fields][2]=name` +
          `&populate[images][fields][0]=url` +
          `&populate[images][fields][1]=name`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      if (!res.ok) {
        console.error("[iniciatives fetch]", res.status, await res.text());
        toast({ variant: "destructive", title: "Error al cargar iniciativas" });
        return;
      }

      const data = await res.json();
      setInitiatives(data.data ?? []);
    },
    [jwt, toast],
  );

  const openCreate = useCallback(() => {
    setForm(EMPTY_INIT);
    setImage(null);
    setEditTarget(null);
    setModal("create");
  }, []);

  const openEdit = useCallback((i: Initiative) => {
    setForm({
      title: i.title,
      objective: i.objective ?? "",
      description: i.description ?? "",
      categories: i.initiatives_categories?.map((c) => c.id) ?? [],
    });
    setImage(null);
    setEditTarget(i);
    setModal("edit");
  }, []);

  const close = useCallback(() => {
    setModal("closed");
    setEditTarget(null);
    setForm(EMPTY_INIT);
    setImage(null);
  }, []);

  const save = useCallback(
    async (foundDocId: string) => {
      if (!jwt) return;
      setSaving(true);

      try {
        let imageId: number | undefined;
        if (image) {
          imageId = await uploadFile(jwt, image);
        }

        // CORRECCIÓN: el controller de create asigna foundation automáticamente
        // desde ctx.state.user — no hay que enviarlo en el payload de create.
        // En update tampoco se necesita porque ya está asignada.
        const payload: Record<string, unknown> = {
          title: form.title,
          objective: form.objective,
          description: form.description,
          initiatives_categories: form.categories,
          ...(imageId !== undefined ? { images: [imageId] } : {}),
        };

        const isEdit = modal === "edit" && editTarget;

        const url = isEdit
          ? `${API_URL}/api/iniciatives/${editTarget.documentId}`
          : `${API_URL}/api/iniciatives`;

        const res = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: payload }),
        });

        if (!res.ok) throw new Error(await extractStrapiError(res));

        toast({
          title: isEdit ? "Iniciativa actualizada ✓" : "Iniciativa creada ✓",
        });

        await fetchInitiatives(foundDocId);
        close();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        toast({ variant: "destructive", title: "Error", description: msg });
      } finally {
        setSaving(false);
      }
    },
    [jwt, form, image, modal, editTarget, fetchInitiatives, close, toast],
  );

  const remove = useCallback(
    async (docId: string, foundDocId: string) => {
      if (!jwt) return;
      setDeleting(docId);

      try {
        const res = await fetch(`${API_URL}/api/iniciatives/${docId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) throw new Error(await extractStrapiError(res));

        toast({ title: "Iniciativa eliminada" });
        await fetchInitiatives(foundDocId);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error al eliminar";
        toast({ variant: "destructive", title: "Error", description: msg });
      } finally {
        setDeleting(null);
      }
    },
    [jwt, fetchInitiatives, toast],
  );

  return {
    initiatives,
    fetch: fetchInitiatives,
    modal,
    editTarget,
    form,
    setForm,
    image,
    setImage,
    saving,
    deleting,
    openCreate,
    openEdit,
    close,
    save,
    remove,
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(jwt: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<"closed" | "create" | "edit">("closed");
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProdForm>(EMPTY_PROD);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // DESPUÉS — foundDocId requerido, siempre filtra
  const fetchProducts = useCallback(
    async (foundDocId: string) => {
      if (!jwt) return;

      const res = await fetch(
        `${API_URL}/api/products` +
          `?filters[foundation][documentId][$eq]=${foundDocId}` +
          `&populate[images][fields][0]=url` +
          `&populate[images][fields][1]=name`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      if (!res.ok) {
        toast({ variant: "destructive", title: "Error al cargar productos" });
        return;
      }

      const data = await res.json();
      setProducts(data.data ?? []);
    },
    [jwt, toast],
  );

  const openCreate = useCallback(() => {
    setForm(EMPTY_PROD);
    setImage(null);
    setEditTarget(null);
    setModal("create");
  }, []);

  const openEdit = useCallback((p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug ?? "",
      shortDescription: p.shortDescription ?? "",
      description: p.description ?? "",
      price: p.price?.toString() ?? "",
      stock: p.stock?.toString() ?? "",
      featured: p.featured ?? false,
    });
    setImage(null);
    setEditTarget(p);
    setModal("edit");
  }, []);

  const close = useCallback(() => {
    setModal("closed");
    setEditTarget(null);
    setForm(EMPTY_PROD);
    setImage(null);
  }, []);

  const save = useCallback(
    async (foundDocId: string) => {
      if (!jwt) return;
      setSaving(true);

      try {
        let imageId: number | undefined;
        if (image) {
          imageId = await uploadFile(jwt, image);
        }

        // CORRECCIÓN: igual que initiatives, el controller de create
        // asigna foundation automáticamente desde el usuario autenticado.
        // No se envía foundation en el payload.
        const payload: Record<string, unknown> = {
          name: form.name,
          slug: form.slug || autoSlug(form.name),
          shortDescription: form.shortDescription,
          description: form.description,
          price: parseFloat(form.price) || 0,
          stock: parseInt(form.stock) || 0,
          featured: form.featured,
          ...(imageId !== undefined ? { images: [imageId] } : {}),
        };

        const isEdit = modal === "edit" && editTarget;

        const url = isEdit
          ? `${API_URL}/api/products/${editTarget.documentId}`
          : `${API_URL}/api/products`;

        const res = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: payload }),
        });

        if (!res.ok) throw new Error(await extractStrapiError(res));

        toast({
          title: isEdit ? "Producto actualizado ✓" : "Producto creado ✓",
        });

        await fetchProducts(foundDocId);
        close();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        toast({ variant: "destructive", title: "Error", description: msg });
      } finally {
        setSaving(false);
      }
    },
    [jwt, form, image, modal, editTarget, fetchProducts, close, toast],
  );

  const remove = useCallback(
    async (docId: string, foundDocId: string) => {
      if (!jwt) return;
      setDeleting(docId);

      try {
        const res = await fetch(`${API_URL}/api/products/${docId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) throw new Error(await extractStrapiError(res));

        toast({ title: "Producto eliminado" });
        await fetchProducts(foundDocId);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error al eliminar";
        toast({ variant: "destructive", title: "Error", description: msg });
      } finally {
        setDeleting(null);
      }
    },
    [jwt, fetchProducts, toast],
  );

  return {
    products,
    fetch: fetchProducts,
    modal,
    editTarget,
    form,
    setForm,
    image,
    setImage,
    saving,
    deleting,
    openCreate,
    openEdit,
    close,
    save,
    remove,
  };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories(jwt: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    if (!jwt) return;

    const res = await fetch(
      `${API_URL}/api/initiatives-categories` +
        `?fields[0]=id&fields[1]=documentId&fields[2]=name`,
      { headers: { Authorization: `Bearer ${jwt}` } },
    );

    if (!res.ok) return;

    const data: StrapiResponse<Category[]> = await res.json();

    setCategories(
      data.data?.map((c) => ({
        id: c.id,
        documentId: c.documentId,
        name: c.name,
      })) ?? [],
    );
  }, [jwt]);

  return { categories, fetch: fetchCategories };
}
