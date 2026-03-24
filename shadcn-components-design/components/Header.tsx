"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Heart,
  MessageCircle,
  Rocket,
  Building2,
  UserPlus,
  User,
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronDown,
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
    name: "Emprendimientos",
    href: "/products",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    name: "Iniciativas",
    href: "/initiatives",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    name: "Fundaciones aliadas",
    href: "/foundations",
    icon: <Building2 className="h-4 w-4" />,
  },
];

const ROLE_LABEL: Record<string, string> = {
  foundation: "Fundación",
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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetTitle className="text-left font-black text-2xl mb-8 italic">
                VITRINA<span className="text-primary">SOCIAL</span>
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold hover:bg-primary/10 transition-all"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <hr className="my-4" />
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-1">
                      <p className="font-black">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_LABEL[role ?? ""] ?? role}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-primary"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Mi panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-destructive hover:bg-destructive/5 transition-all w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/foundations/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-primary"
                    >
                      <UserPlus className="h-5 w-5" />
                      Registrar Fundación
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-primary"
                    >
                      <User className="h-5 w-5" />
                      Registrar Persona
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold"
                    >
                      <LogIn className="h-5 w-5" />
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex flex-col leading-[0.85] shrink-0">
            <span className="text-lg font-black tracking-tighter italic">
              VITRINA
            </span>
            <span className="text-lg font-black tracking-tighter text-primary/80 italic">
              SOCIAL
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all",
                  pathname === link.href
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
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
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart className="h-4 w-4 fill-current" />
            Apoyar
          </Link>

          {loading ? (
            // Skeleton mientras verifica la sesión
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
                <button className="hidden md:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-muted/60 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-primary">
                      {initial}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold leading-none">
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
                    className="flex items-center gap-2 font-semibold"
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
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="hidden md:flex font-bold rounded-xl"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="font-black px-5 rounded-xl">
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
                      Fundación
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
