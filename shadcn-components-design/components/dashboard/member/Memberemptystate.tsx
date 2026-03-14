import Link from "next/link";
import { Lightbulb, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemberEmptyState() {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
      <Lightbulb className="h-12 w-12 text-muted-foreground/20 mx-auto" />
      <div>
        <p className="font-bold">Aún no te has unido a ninguna iniciativa</p>
        <p className="text-sm text-muted-foreground mt-1">
          Explora y únete a las que más te interesen
        </p>
      </div>
      <Link href="/initiatives">
        <Button className="rounded-xl gap-2 font-bold mt-2">
          <Compass className="h-4 w-4" />
          Explorar iniciativas
        </Button>
      </Link>
    </div>
  );
}
