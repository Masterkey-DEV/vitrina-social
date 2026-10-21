// types/product.ts
import type { StrapiImage } from "./shared";

export interface ProductCategory {
  id: number;
  documentId: string;
  name: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  // ✅ nullable para evitar errores en .toLocaleString() y comparaciones
  price: number | null;
  stock: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images?: StrapiImage[];
  product_categories?: ProductCategory[];
  usuario?: {
    id: number;
    documentId: string;
    username: string;
  };
}