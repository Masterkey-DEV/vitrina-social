"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Heart,
  Rocket,
  Building2,
  UserPlus,
  User,
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    name: "Productos",
    href: "/products",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    name: "Iniciativas",
    href: "/initiatives",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    name: "Fundaciones",
    href: "/foundations",
    icon: <Building2 className="h-4 w-4" />,
  },
];

const ROLE_LABEL: Record<string, string> = {
  foundation: "Fundacion",
  entrepreneur: "Emprendedor",
  member: "Miembro",
  authenticated: "Usuario",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  const role = user?.role?.name;
  const initial = user?.username?.[0]?.toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-card">
              <SheetTitle className="text-left mb-8">
                <span className="font-serif text-2xl text-foreground">Vitrina</span>
                <span className="font-serif text-2xl text-primary">Social</span>
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <hr className="my-4 border-border" />
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-1">
                      <p className="font-bold text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_LABEL[role ?? ""] ?? role}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-primary hover:bg-primary/10"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Mi panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/5 transition-all w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Cerrar sesion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/foundations/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-primary hover:bg-primary/10"
                    >
                      <UserPlus className="h-5 w-5" />
                      Registrar Fundacion
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-primary hover:bg-primary/10"
                    >
                      <User className="h-5 w-5" />
                      Registrar Persona
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted"
                    >
                      <LogIn className="h-5 w-5" />
                      Iniciar Sesion
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="font-serif text-xl text-foreground">Vitrina</span>
            <span className="font-serif text-xl text-primary">Social</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          <Link
            href="/apoyo"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <Heart className="h-4 w-4" />
            Apoyar
          </Link>

          {loading ? (
            <div className="hidden md:flex items-center gap-2.5 pl-1 pr-3 py-1">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                <div className="h-2 w-14 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-muted transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {initial}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      {ROLE_LABEL[role ?? ""] ?? role}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Mi panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="hidden md:flex font-medium rounded-xl"
                >
                  Iniciar Sesion
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="font-semibold px-5 rounded-full bg-primary hover:bg-primary/90">
                    Registrarse
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/foundations/register"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Fundacion
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user/register"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Persona Natural
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
