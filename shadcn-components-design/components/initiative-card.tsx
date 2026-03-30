import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Building2 } from "lucide-react";

interface InitiativeCardProps {
  documentId: string;
  title: string;
  organization: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  category?: string;
}

export function InitiativeCard({
  documentId,
  title,
  organization,
  description,
  imageSrc,
  imageAlt,
  category,
}: InitiativeCardProps) {
  return (
    <Link
      href={`/initiatives/${documentId}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder.jpg"}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-card/90 backdrop-blur-sm text-foreground border-0 text-xs font-medium px-3 py-1 rounded-full">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{organization}</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        <div className="pt-3 border-t border-border">
          <span className="text-sm font-medium text-primary group-hover:underline">
            Ver iniciativa
          </span>
        </div>
      </div>
    </Link>
  );
}
