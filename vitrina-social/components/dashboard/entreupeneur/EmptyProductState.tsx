import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
export function EmptyProductsState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
      <Package className="h-12 w-12 text-muted-foreground/20 mx-auto" />
      <div>
        <p className="font-bold">Aún no tienes productos</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crea tu primer producto para aparecer en el catálogo
        </p>
      </div>
      <Button onClick={onCreate} className="rounded-xl gap-2 font-bold mt-2">
        <Plus className="h-4 w-4" />
        Crear producto
      </Button>
    </div>
  );
}
