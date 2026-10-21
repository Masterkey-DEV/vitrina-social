// @/store/useCategoryStore.ts
import { create } from "zustand";

interface CategoryState {
  selectedCategoryName: string | null;
  setCategory: (name: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategoryName: null,
  setCategory: (name) => set({ selectedCategoryName: name }),
}));
