export interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective?: string;
  foundation?: { name: string; siglas: string };
  users_permissions_users?: { id: number }[];
  initiatives_categories?: { name: string }[];
  createdAt: string;
}
