export interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective?: string;
  foundation?: { name: string; siglas: string };
  usuario?: { id: number }[];
  initiatives_categories?: { name: string }[];
  createdAt: string;
}
