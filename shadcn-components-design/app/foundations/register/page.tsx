"use client";

import { API_URL } from "@/const/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowRight, Eye, EyeOff, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  foundationName: z.string().min(2, "Nombre requerido"),
  siglas: z.string().min(2, "Siglas requeridas").max(10, "Máximo 10 caracteres"),
});

export default function RegisterFoundationPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      foundationName: "",
      siglas: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // 1. Registrar usuario
      const regRes = await fetch(`${API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        // Strapi v5 sanitiza el error de duplicado como 500
        const isDuplicate =
          regRes.status === 500 ||
          String(regData?.error?.message ?? "").toLowerCase().includes("already taken");

        if (isDuplicate) {
          setError("email", { type: "manual", message: "Usuario o correo en uso" });
          setError("username", { type: "manual", message: "Usuario o correo en uso" });
          setError("foundationName", { type: "manual", message: "Verifica los datos de la fundación puede que ya exista" });
          setError("siglas", { type: "manual", message: "Verifica los datos de la fundación" });
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

      // 2. Asignar rol foundation
      const roleRes = await fetch(`${API_URL}/api/users/set-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ role: "foundation" }),
      });

      const roleData = await roleRes.json();
      if (!roleRes.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: roleData?.error?.message ?? "Error asignando rol",
        });
        return;
      }

      // 3. Subir logo (opcional)
      let imageId: number | null = null;
      if (logoFile) {
        const formData = new FormData();
        formData.append("files", logoFile);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${jwt}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageId = uploadData[0]?.id ?? null;
        }
      }

      // 4. Crear fundación
      const foundRes = await fetch(`${API_URL}/api/foundations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            name: values.foundationName,
            siglas: values.siglas,
            ...(imageId ? { image: imageId } : {}),
          },
        }),
      });

      const foundData = await foundRes.json();
      if (!foundRes.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: foundData?.error?.message ?? "Error al crear la fundación",
        });
        return;
      }

      // 5. Login
      await login(jwt);

      toast({
        title: "¡Fundación registrada!",
        description: `${values.foundationName} ya forma parte de la red.`,
      });

      router.push("/dashboard");

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
      <div className="w-full max-w-2xl space-y-8">

        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex flex-col leading-[0.85]">
            <span className="text-2xl font-black tracking-tighter italic">REINTEGRATION</span>
            <span className="text-2xl font-black tracking-tighter text-primary italic">PORTAL</span>
          </Link>
          <p className="text-muted-foreground text-sm pt-3">Registra tu organización en la red</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">

          <div className="flex items-center gap-3 pb-2 border-b border-border">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-black text-lg">Registro de Fundación</h1>
              <p className="text-muted-foreground text-xs">Crea tu acceso y los datos de tu organización</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Datos de acceso */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Datos de acceso</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Usuario</label>
                  <input
                    {...register("username")}
                    placeholder="juandiaz"
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground",
                      errors.username ? "border-destructive focus:ring-destructive/30" : "border-input"
                    )}
                  />
                  {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Correo</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="contacto@fundacion.org"
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
            </div>

            {/* Datos de la fundación */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Datos de la fundación</p>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nombre oficial</label>
                <input
                  {...register("foundationName")}
                  placeholder="Fundación Esperanza Colombia"
                  className={cn(
                    "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground",
                    errors.foundationName ? "border-destructive focus:ring-destructive/30" : "border-input"
                  )}
                />
                {errors.foundationName && <p className="text-destructive text-xs">{errors.foundationName.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Siglas</label>
                  <input
                    {...register("siglas")}
                    placeholder="ej. FEC"
                    className={cn(
                      "w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground",
                      errors.siglas ? "border-destructive focus:ring-destructive/30" : "border-input"
                    )}
                  />
                  {errors.siglas && <p className="text-destructive text-xs">{errors.siglas.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">
                    Logo <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <label className="flex items-center gap-2 w-full border border-input border-dashed rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {logoFile ? logoFile.name : "Subir imagen"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl h-12 font-bold gap-2 group"
            >
              {loading ? (
                "Registrando..."
              ) : (
                <>
                  Registrar Fundación
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
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