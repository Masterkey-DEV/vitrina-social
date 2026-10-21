import { Product } from "@/types/product";
export function StatsCards({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-3xl font-black text-primary">{products.length}</p>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Productos
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-3xl font-black">
          {products.filter((p) => p.featured).length}
        </p>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Destacados
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-3xl font-black">
          {products.reduce((a, p) => a + (p.stock ?? 0), 0)}
        </p>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Stock total
        </p>
      </div>
    </div>
  );
}
