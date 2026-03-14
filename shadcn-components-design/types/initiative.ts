// types/initiative.ts  ← tipos del dominio

// ─── Media ───────────────────────────────────────────────────────────────────

export interface StrapiImageFormats {
  medium?: { url: string; width: number; height: number };
  small?: { url: string; width: number; height: number };
  thumbnail?: { url: string; width: number; height: number };
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: StrapiImageFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────
// Strapi: initiatives-category → { id, documentId, name }

export interface Category {
  id: number;
  documentId: string;
  name: string;
}

// ─── Foundation (referencia desde Initiative) ─────────────────────────────────

export interface FoundationRef {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
}

// ─── Initiative ───────────────────────────────────────────────────────────────
// Campo real en Strapi: initiatives_categories (manyToMany, array)
// Campo imagen: images (Multiple Media, array)

export interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  // Relaciones — solo presentes cuando se usa populate
  foundation?: FoundationRef;
  initiatives_categories?: Category[]; // manyToMany — siempre array
  images?: StrapiImage[];
}
