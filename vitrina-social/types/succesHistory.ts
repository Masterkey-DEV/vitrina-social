// types/success-story.ts
import type { StrapiImage } from "./shared";

export interface SuccessStory {
  id: number;
  documentId: string;
  quote: string;
  author: string;
  location: string;
  image?: StrapiImage;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}