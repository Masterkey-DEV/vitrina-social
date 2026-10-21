"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/const/api";
import { ArrowRight, Eye, EyeOff, Building2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  identifier: z.string().min(3, "Ingresa tu usuario o correo"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Credenciales incorrectas");

      // login() fetchea /users/me?populate=role y guarda el usuario con su rol
      await login(data.jwt);

      toast({
        title: "¡Bienvenido!",
        description: `Hola, ${data.user.username}`,
      });
      // dashboard/page.tsx leerá el rol del contexto y redirigirá al subroute correcto
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex flex-col leading-[0.85]">
            <span className="text-2xl font-black tracking-tighter italic">
              VITRINA
            </span>
            <span className="text-2xl font-black tracking-tighter text-primary italic">
              SOCIAL
            </span>
          </Link>
          <p className="text-muted-foreground text-sm pt-3">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Usuario o correo</label>
              <input
                {...register("identifier")}
                placeholder="ejemplo@fundacion.org"
                className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              />
              {errors.identifier && (
                <p className="text-destructive text-xs">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Contraseña</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  ¿La olvidaste?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-10 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl h-12 font-bold gap-2 group"
            >
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  Iniciar sesión{" "}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/user/register"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Soy persona
              </span>
            </Link>
            <Link
              href="/foundations/register"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Soy fundación
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
