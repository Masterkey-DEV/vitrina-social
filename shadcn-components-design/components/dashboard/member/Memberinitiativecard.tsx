import Link from "next/link";
import { Building2, Users, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Initiative } from "@/types/member";

interface MemberInitiativeCardProps {
  initiative: Initiative;
}

export function MemberInitiativeCard({
  initiative: init,
}: MemberInitiativeCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-primary/30 transition-colors">
      <div className="space-y-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-black truncate">{init.title}</h3>
          {init.initiatives_categories?.map((cat) => (
            <Badge
              key={cat.name}
              variant="secondary"
              className="rounded-full text-[10px]"
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {init.objective && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {init.objective}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {init.foundation && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {init.foundation.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {init.users_permissions_users?.length ?? 0} miembros
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(init.createdAt).toLocaleDateString("es-CO", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <Link href={`/initiatives/${init.documentId}`} className="shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
