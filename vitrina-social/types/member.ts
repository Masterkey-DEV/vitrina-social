// types/member.ts
import type { Initiative } from "./initiative";

export interface Member {
  id: number;
  documentId: string;
  username: string;
  email: string;
  role?: {
    id: number;
    name: string;
    type: string;
  };
  initiatives?: Pick<Initiative, "id" | "documentId" | "title" | "objective">[];
}