// types/dashboard.ts  ← tipos de UI y Strapi globales

import type { Initiative } from "./initiative";
import type { StrapiImage, StrapiPagination, StrapiResponse } from "./shared";

export type { StrapiImage, StrapiPagination, StrapiResponse };

// ─── Tab ──────────────────────────────────────────────────────────────────────

export type Tab = "initiatives" | "products";

// ─── Foundation ───────────────────────────────────────────────────────────────

export interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
  objective?: string | null;
  description?: string | null;
  location?: string | null;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: StrapiImage;
  // ✅ "initiatives" — nombre correcto del campo en Strapi
  initiatives?: Initiative[];
  usuario?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
  };
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
  product_categories?: { id: number; name: string }[];
  usuario?: {
    id: number;
    documentId: string;
    username: string;
  };
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
  price: string;  // string para el input, se parsea al guardar
  stock: string;
  featured: boolean;
  product_category_ids: number[];
}

// ─── Dashboard por rol ────────────────────────────────────────────────────────

export interface DashboardStats {
  initiativeCount: number;
  productCount: number;
  memberCount?: number;
}

export interface FoundationDashboard {
  foundation: Foundation | null;
  initiatives: Initiative[];
  products: Product[];
  tab: Tab;
}

export interface EntrepreneurDashboard {
  products: Product[];
}

export interface MemberDashboard {
  initiatives: Initiative[];
}