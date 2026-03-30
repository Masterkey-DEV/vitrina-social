import { Building2 } from "lucide-react";

export function FoundationsHeader() {
  return (
    <div className="text-center mb-12 space-y-4">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
        <Building2 className="h-4 w-4" />
        Nuestros aliados
      </span>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground">
        Fundaciones que transforman vidas
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Organizaciones comprometidas con el acompanamiento, la formacion y el 
        empoderamiento economico de comunidades resilientes.
      </p>
    </div>
  );
}
