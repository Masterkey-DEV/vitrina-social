// @/types/product.ts

export interface ProductImage {
  url: string;
  alternativeText?: string;
}

export interface ProductCategory {
  id: number; // ✅ number, no string
  name: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  images?: ProductImage[];
  product_categories?: ProductCategory[];
}