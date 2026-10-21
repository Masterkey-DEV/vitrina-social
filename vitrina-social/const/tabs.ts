export const TABS_CONFIG = [
  { id: "iniciativas", label: "Iniciativas" },
  { id: "emprendimientos", label: "Emprendimientos" },
  { id: "fundaciones", label: "Fundaciones" },
  { id: "nosotros", label: "Nosotros" },
] as const;

export type TabKey = (typeof TABS_CONFIG)[number]["id"];
