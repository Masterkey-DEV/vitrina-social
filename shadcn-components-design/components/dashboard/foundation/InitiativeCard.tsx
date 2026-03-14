import Link from "next/link";
import { Eye, Edit, Trash2, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Initiative } from "@/types/dashboard";

interface InitiativeCardProps {
  initiative: Initiative;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function InitiativeCard({
  initiative,
  deleting,
  onEdit,
  onDelete,
}: InitiativeCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors">
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-black">{initiative.title}</h3>
          {initiative.initiatives_categories?.map((c) => (
            <Badge
              key={c.name}
              variant="secondary"
              className="rounded-full text-[10px]"
            >
              {c.name}
            </Badge>
          ))}
        </div>
        {initiative.objective && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {initiative.objective}
          </p>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" />
          {initiative.users_permissions_users?.length ?? 0} miembros
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link href={`/initiatives/${initiative.documentId}`}>
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
