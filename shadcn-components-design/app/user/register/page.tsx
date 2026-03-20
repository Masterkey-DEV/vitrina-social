"use client";

import { API_URL } from "@/const/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Rocket, Check, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoleType = "member" | "entrepreneur";

const formSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

const ROLES = [
  {
    id: "member" as RoleType,
    label: "Miembro",
    description: "Únete a iniciativas y programas comunitarios",
    icon: Users,
    perks: ["Unirte a iniciativas", "Red de apoyo", "Acceso a programas"],
  },
  {
    id: "entrepreneur" as RoleType,
    label: "Emprendedor",
    description: "Publica y gestiona tus productos",
    icon: Rocket,
    perks: [
      "Publicar productos",
      "Gestionar tienda",
      "Vinculación opcional a fundación",
    ],
  },
];

export default function UserRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedRole) {
      toast({ variant: "destructive", title: "Selecciona un rol para continuar" });
      return;
    }

    setLoading(true);

    try {
      const regRes = await fetch(`${API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        const isDuplicate =
          regRes.status === 500 ||
          String(regData?.error?.message ?? "").toLowerCase().includes("already taken");

        if (isDuplicate) {
          setError("email", { type: "manual", message: "Usuario o correo ya están en uso" });
          setError("username", { type: "manual", message: "Usuario o correo ya están en uso" });
          toast({
            variant: "destructive",
            title: "Cuenta ya existente",
            description: "El correo o usuario ya están en uso.",
          });
          return;
        }

        toast({
          variant: "destructive",
          title: "Error al registrar",
          description: regData?.error?.message ?? "Error desconocido",
        });
        return;
      }

      const jwt = regData.jwt;

      const roleRes = await fetch(`${API_URL}/api/users/set-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const roleData = await roleRes.json();

      if (!roleRes.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: roleData?.error?.message ?? "Error al asignar rol",
        });
        return;
      }

      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(regData.user));

      toast({ title: "¡Bienvenido!", description: "Tu cuenta fue creada correctamente." });
      router.push(selectedRole === "entrepreneur" ? "/products" : "/initiatives");

    } catch {
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: "Verifica la conexión con el servidor",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">

        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex flex-col leading-[0.85]">
            <span className="text-2xl font-black tracking-tighter italic">REINTEGRATION</span>
            <span className="text-2xl font-black tracking-tighter text-primary italic">PORTAL</span>
          </Link>
          <p className="text-muted-foreground text-sm pt-3">Elige cómo quieres participar</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "relative text-left p-5 rounded-2xl border-2 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/50",
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", isSelected ? "bg-primary/10" : "bg-muted")}>
                    <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <h3 className="font-black text-base mb-1">{role.label}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">{role.description}</p>
                  <ul className="space-y-1">
                    {role.perks.map((perk) => (
                      <li key={perk} className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <div className={cn("h-1 w-1 rounded-full shrink-0", isSelected ? "bg-primary" : "bg-muted-foreground/40")} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Usuario</label>
                <input
                  {...register("username")}
                  placeholder="juanperez"
                  className={cn(
                    "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground",
                    errors.username ? "border-destructive focus:ring-destructive/30" : "border-input"
                  )}
                />
                {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="tu@email.com"
                  className={cn(
                    "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground",
                    errors.email ? "border-destructive focus:ring-destructive/30" : "border-input"
                  )}
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Contraseña</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className={cn(
                    "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-10 placeholder:text-muted-foreground",
                    errors.password ? "border-destructive focus:ring-destructive/30" : "border-input"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full rounded-xl h-12 font-bold gap-2 group"
            >
              {loading ? (
                "Creando cuenta..."
              ) : selectedRole ? (
                <>
                  Registrarme como {selectedRole === "member" ? "Miembro" : "Emprendedor"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                "Selecciona un rol para continuar"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}