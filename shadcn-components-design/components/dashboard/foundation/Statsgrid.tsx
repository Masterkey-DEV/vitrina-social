import { Lightbulb, Package, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Foundation, Initiative, Product } from "@/types/dashboard";

interface StatsGridProps {
  foundation: Foundation | null;
  initiatives: Initiative[];
  products: Product[];
}

export function StatsGrid({
  foundation,
  initiatives,
  products,
}: StatsGridProps) {
  const totalMembers = initiatives.reduce(
    (a, i) => a + (i.users_permissions_users?.length ?? 0),
    0,
  );

  const stats = [
    {
      icon: Lightbulb,
      value: initiatives.length,
      label: "Iniciativas",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      value: totalMembers,
      label: "Miembros",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Package,
      value: products.length,
      label: "Productos",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: Building2,
      value: foundation ? 1 : 0,
      label: "Fundación",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, value, label, color, bg }) => (
        <div
          key={label}
          className="bg-card border border-border rounded-2xl p-5 space-y-3"
        >
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              bg,
            )}
          >
            <Icon className={cn("h-5 w-5", color)} />
          </div>
          <div>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
