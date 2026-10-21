// types/initiative.ts
import type { StrapiImage } from "./shared";

export interface Category {
  id: number;
  documentId: string;
  name: string;
}

export interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images?: StrapiImage[];
  foundation?: {
    id: number;
    documentId: string;
    name: string;
    siglas: string | null;
  };
  initiatives_categories?: Category[];
  users?: {
    id: number;
    documentId: string;
    username: string;
    email: string; // ← NUEVO
  }[];
}