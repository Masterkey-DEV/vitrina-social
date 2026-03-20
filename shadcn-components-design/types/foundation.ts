// types/foundation.ts
import type { StrapiImage } from "./shared";
import type { Initiative } from "./initiative";

export interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
  objective?: string | null;
  description?: string | null;
  location?: string | null;
  memberCount?: number;
  department?: string | null;
  city?: string | null;
  // ── Contacto y redes ──
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: StrapiImage;
  iniciatives?: Initiative[];
  usuario?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
  };
}