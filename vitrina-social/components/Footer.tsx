import Link from "next/link";
import { Mail, Instagram, Facebook, MapPin, Heart } from "lucide-react";

const FOOTER_LINKS = {
  plataforma: [
    { label: "Como funciona", href: "/about" },
    { label: "Productos", href: "/products" },
    { label: "Fundaciones", href: "/foundations" },
    { label: "Iniciativas", href: "/initiatives" },
  ],
  legal: [
    { label: "Politica de privacidad", href: "#" },
    { label: "Terminos de servicio", href: "#" },
    { label: "Preguntas frecuentes", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Mail, href: "mailto:contacto@vitrinasocial.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Columna 1: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl text-foreground">Vitrina</span>
              <span className="font-serif text-2xl text-primary">Social</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Conectamos el talento de comunidades resilientes de Colombia con personas 
              que valoran lo autentico. Cada compra transforma vidas y construye paz.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Colombia</span>
            </div>
          </div>

          {/* Columna 2: Plataforma */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Plataforma
            </h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.plataforma.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Legal y Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-3 mb-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Siguenos
            </h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separador con patron decorativo */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {new Date().getFullYear()} Vitrina Social. Impulsando la reconciliacion economica.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Hecho con <Heart className="h-3.5 w-3.5 text-accent fill-accent" /> en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
