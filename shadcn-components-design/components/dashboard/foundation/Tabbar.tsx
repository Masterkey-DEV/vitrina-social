import { Lightbulb, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab } from "@/types/dashboard";

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS = [
  { id: "initiatives" as Tab, label: "Iniciativas", icon: Lightbulb },
  { id: "products" as Tab, label: "Productos", icon: Package },
] as const;

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-card border border-border rounded-2xl p-1.5 w-fit">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
            active === id
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
