import type { InitForm, ProdForm } from "@/types/dashboard";

export function autoSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const EMPTY_INIT: InitForm = {
  title: "",
  objective: "",
  description: "",
  categories: [], // ← debe estar
};

export const EMPTY_PROD: ProdForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "",
  featured: false,
};

export const inputCls =
  "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background " +
  "focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";
