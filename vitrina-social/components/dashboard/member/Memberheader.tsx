import Link from "next/link";
import { Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberHeaderProps {
  username: string;
  onLogout: () => void;
}

export function MemberHeader({ username, onLogout }: MemberHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          Panel de miembro
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          Hola, {username} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Estas son las iniciativas en las que participas
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link href="/initiatives">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 hidden sm:flex"
          >
            <Compass className="h-4 w-4" />
            Explorar
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="rounded-xl gap-2 text-destructive hover:text-destructive border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </div>
  );
}
