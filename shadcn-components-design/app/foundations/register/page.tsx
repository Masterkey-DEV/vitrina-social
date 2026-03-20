// app/foundations/register/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_URL } from "@/const/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formSchema, FormValues } from "@/schemas/foundation";
import { StepIndicator } from "@/components/register/form-steps";
import { Step1Credentials } from "@/components/register/foundation/Step1Credentials";
import { Step2Profile } from "@/components/register/foundation/Step2Profile";
import { Step3Social } from "@/components/register/foundation/Step3Social";

const TOTAL_STEPS = 3;

// Campos que se validan en cada paso antes de avanzar
const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["username", "email", "password"],
  2: ["foundationName", "siglas"],
  // Paso 3: todos opcionales, no requiere validación
};

export default function RegisterFoundationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "", email: "", password: "",
      foundationName: "", siglas: "",
      objective: "", description: "", location: "",
      department: "", city: "",
      whatsapp: "", website: "",
      instagram: "", facebook: "", twitter: "", linkedin: "",
    },
  });

  // Valida los campos del paso actual y avanza si son válidos
  const nextStep = async () => {
    const fields = STEP_FIELDS[step];
    const isValid = fields ? await form.trigger(fields) : true;
    if (isValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // 1. Registrar usuario en Strapi
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
          form.setError("email", { type: "manual", message: "Este correo ya está registrado" });
          form.setError("username", { type: "manual", message: "Este usuario ya está registrado" });
          // Regresamos al paso 1 para que el usuario vea los errores en los campos
          setStep(1);
          toast({ variant: "destructive", title: "Cuenta ya existente", description: "El correo o usuario ya están en uso." });
          return;
        }

        toast({ variant: "destructive", title: "Error al registrar", description: regData?.error?.message ?? "Error desconocido" });
        return;
      }

      const jwt = regData.jwt;

      // 2. Asignar rol "foundation"
      const roleRes = await fetch(`${API_URL}/api/users/set-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ role: "foundation" }),
      });

      const roleData = await roleRes.json();
      if (!roleRes.ok) {
        toast({ variant: "destructive", title: "Error", description: roleData?.error?.message ?? "Error asignando rol" });
        return;
      }

      // 3. Subir logo si se proporcionó (completamente opcional)
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

      // 4. Crear fundación — solo se envían los campos opcionales que tienen valor
      const foundRes = await fetch(`${API_URL}/api/foundations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          data: {
            name: values.foundationName,
            siglas: values.siglas,
            ...(values.objective?.trim()   ? { objective: values.objective.trim() }     : {}),
            ...(values.description?.trim() ? { description: values.description.trim() } : {}),
            ...(values.location?.trim()    ? { location: values.location.trim() }       : {}),
            ...(values.department?.trim()  ? { department: values.department.trim() }   : {}),
            ...(values.city?.trim()        ? { city: values.city.trim() }               : {}),
            ...(values.whatsapp?.trim()    ? { whatsapp: values.whatsapp.trim() }       : {}),
            ...(values.website?.trim()     ? { website: values.website.trim() }         : {}),
            ...(values.instagram?.trim()   ? { instagram: values.instagram.trim() }     : {}),
            ...(values.facebook?.trim()    ? { facebook: values.facebook.trim() }       : {}),
            ...(values.twitter?.trim()     ? { twitter: values.twitter.trim() }         : {}),
            ...(values.linkedin?.trim()    ? { linkedin: values.linkedin.trim() }       : {}),
            ...(imageId                    ? { image: imageId }                         : {}),
          },
        }),
      });

      const foundData = await foundRes.json();
      if (!foundRes.ok) {
        toast({ variant: "destructive", title: "Error", description: foundData?.error?.message ?? "Error al crear la fundación" });
        return;
      }

      // 5. Login automático con el JWT del registro
      await login(jwt);

      toast({ title: "¡Fundación registrada!", description: `${values.foundationName} ya forma parte de la red.` });
      router.push("/dashboard/foundation");

    } catch {
      toast({ variant: "destructive", title: "Error inesperado", description: "Verifica la conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h2 className="text-2xl font-black tracking-tighter italic">
              VITRINA <span className="text-primary">SOCIAL</span>
            </h2>
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <StepIndicator current={step} total={TOTAL_STEPS} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <Step1Credentials form={form} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <Step2Profile form={form} logoFile={logoFile} onLogoChange={setLogoFile} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <Step3Social form={form} />
                </motion.div>
              )}

            </AnimatePresence>

            {/* ── NAVEGACIÓN ── */}
            <div className="flex gap-3 pt-6 border-t border-slate-100">
              {step > 1 && (
                <Button type="button" variant="ghost" onClick={prevStep} className="rounded-xl h-12 px-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
              )}

              
              {step < TOTAL_STEPS && (
                <Button type="button" onClick={nextStep} className="flex-1 rounded-xl h-12 font-bold shadow-md">
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) }
              {step === TOTAL_STEPS && (
                <Button type="submit" className="flex-1 rounded-xl h-12 font-bold shadow-md">
                  {loading ? "Registrando..." : (
                    <>
                      Finalizar
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest font-medium">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 underline">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}