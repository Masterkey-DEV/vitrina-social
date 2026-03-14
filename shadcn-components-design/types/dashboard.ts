// types/dashboard.ts  ← tipos de UI y Strapi globales

import type { Initiative, Category, StrapiImage } from "./initiative";

// ─── Tab ──────────────────────────────────────────────────────────────────────

export type Tab = "initiatives" | "products";

// ─── Foundation (entidad completa) ────────────────────────────────────────────

export interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
  objective?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  // Relaciones populate
  image?: StrapiImage;
  initiatives?: Initiative[];
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  stock: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  images?: StrapiImage[];
}

// ─── Formularios (estado de modales) ──────────────────────────────────────────

export interface InitForm {
  title: string;
  objective: string;
  description: string;
  categories: number[];
}

export interface ProdForm {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string; // string para el input, se parsea al guardar
  stock: string;
  featured: boolean;
}

// ─── Strapi generic response ───────────────────────────────────────────────────

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: StrapiPagination;
  };
}
