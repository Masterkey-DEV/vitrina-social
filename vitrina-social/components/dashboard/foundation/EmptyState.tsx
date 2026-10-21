import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
      <Icon className="h-12 w-12 text-muted-foreground/20 mx-auto" />
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Button onClick={onAction} className="rounded-xl gap-2 font-bold mt-2">
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}
