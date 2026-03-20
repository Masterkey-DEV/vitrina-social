import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2, Loader2, Users, ChevronDown, Mail, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Initiative } from "@/types/initiative";

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
  const [membersOpen, setMembersOpen] = useState(false);
  const members = initiative.users ?? [];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-colors">

      {/* ── Fila principal ── */}
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black">{initiative.title}</h3>
            {initiative.initiatives_categories?.map((c) => (
              <Badge key={c.name} variant="secondary" className="rounded-full text-[10px]">
                {c.name}
              </Badge>
            ))}
          </div>
          {initiative.objective && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {initiative.objective}
            </p>
          )}

          {/* Botón de miembros */}
          <button
            onClick={() => setMembersOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="h-3 w-3" />
            {members.length} {members.length === 1 ? "miembro" : "miembros"}
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                membersOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link href={`/initiatives/${initiative.documentId}`}>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ── Sección expandible de miembros ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          membersOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="border-t border-border px-5 py-4 space-y-1 bg-muted/30">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              Aún no hay miembros en esta iniciativa.
            </p>
          ) : (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Miembros
              </p>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 bg-card rounded-xl px-4 py-2.5 border border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <UserCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{member.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                    >
                      <Mail className="h-3 w-3" />
                      Contactar
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}