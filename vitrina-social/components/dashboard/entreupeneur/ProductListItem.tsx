import { Product } from "@/types/product";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Eye, Package, Trash2 } from "lucide-react";
import { API_URL } from "@/const/api";
import { Loader2 } from "lucide-react";

export function ProductListItem({
  product,
  onEdit,
  onDelete,
  isDeleting,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (documentId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden shrink-0 relative">
          {product.images?.[0] ? (
            <Image
              src={getMediaUrl(product.images[0].url)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black truncate">{product.name}</h3>
            {product.featured && (
              <Badge className="rounded-full text-[10px] px-2">Destacado</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.shortDescription}
          </p>
          <p className="text-xs font-bold text-primary">
            ${product.price?.toLocaleString("es-CO")} · {product.stock} en stock
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Link href={`/products/${product.slug}`}>
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9"
          onClick={() => onEdit(product)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
          onClick={() => onDelete(product.documentId)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
