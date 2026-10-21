// app/user/register/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { API_URL } from "@/const/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { StepIndicator } from "@/components/register/form-steps";
import { Step1Credentials } from "@/components/register/user/Step1Credentials";
import { Step2PersonalInfo } from "@/components/register/user/Step2PersonalInfo";
import { Step3Preferences } from "@/components/register/user/Step3Preferences";
import { completeUserFormSchema, CompleteUserFormValues } from "@/schemas/user";

// --- Tipos auxiliares ---
type RoleType = "member" | "entrepreneur";
type UserUpdatePayload = Partial<
  Pick<
    CompleteUserFormValues,
    | "fullName"
    | "phone"
    | "whatsapp"
    | "address"
    | "city"
    | "department"
    | "bio"
    | "receiveNewsletter"
    | "receiveUpdates"
  >
>;

const TOTAL_STEPS = 3;
const STEP_FIELDS: Record<number, (keyof CompleteUserFormValues)[]> = {
  1: ["username", "email", "password", "confirmPassword"],
  2: ["phone", "whatsapp", "city", "department"],
  3: [],
};

// --- Servicios (podrían ir en otro archivo) ---
async function registerUser(values: CompleteUserFormValues) {
  const { confirmPassword, ...payload } = values; // omitimos confirmPassword
  const res = await fetch(`${API_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Error al registrar");
  return { jwt: data.jwt, user: data.user };
}

async function assignRole(jwt: string, role: RoleType) {
  const res = await fetch(`${API_URL}/api/users/set-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "Error al asignar rol");
  return data;
}

async function updateUserProfile(jwt: string, payload: UserUpdatePayload) {
  if (Object.keys(payload).length === 0) return;
  const res = await fetch(`${API_URL}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    console.warn("No se pudo actualizar el perfil", data);
  }
}

// --- Componentes pequeños ---
function RoleCard({
  role,
  title,
  description,
  perks,
  isSelected,
  onSelect,
}: {
  role: string;
  title: string;
  description: string;
  perks: string[];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
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
      <h3 className="font-black text-base mb-1">{title}</h3>
      <p className="text-muted-foreground text-xs leading-relaxed mb-3">
        {description}
      </p>
      <ul className="space-y-1">
        {perks.map((perk) => (
          <li
            key={perk}
            className="text-[10px] text-muted-foreground flex items-center gap-1.5"
          >
            <div
              className={cn(
                "h-1 w-1 rounded-full",
                isSelected ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
            {perk}
          </li>
        ))}
      </ul>
    </button>
  );
}

function RoleSelector({
  selectedRole,
  onSelect,
}: {
  selectedRole: RoleType | null;
  onSelect: (role: RoleType) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black">Elige tu rol</h3>
        <p className="text-muted-foreground">
          ¿Cómo quieres participar en la plataforma?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RoleCard
          role="member"
          title="Miembro"
          description="Únete a iniciativas y programas comunitarios"
          perks={["Unirte a iniciativas", "Red de apoyo", "Acceso a programas"]}
          isSelected={selectedRole === "member"}
          onSelect={() => onSelect("member")}
        />
        <RoleCard
          role="entrepreneur"
          title="Emprendedor"
          description="Publica y gestiona tus productos"
          perks={[
            "Publicar productos",
            "Gestionar tienda",
            "Vinculación opcional a fundación",
          ]}
          isSelected={selectedRole === "entrepreneur"}
          onSelect={() => onSelect("entrepreneur")}
        />
      </div>
    </div>
  );
}

// --- Componente principal ---
export default function UserRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<CompleteUserFormValues>({
    resolver: zodResolver(completeUserFormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      department: "",
      bio: "",
      receiveNewsletter: false,
      receiveUpdates: false,
    },
  });

  const nextStep = async () => {
    const fields = STEP_FIELDS[step];
    if (fields?.length) {
      const isValid = await form.trigger(fields);
      if (!isValid) return;
    }
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const onSubmit = async (values: CompleteUserFormValues) => {
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Selecciona un rol para continuar",
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Registrar usuario con TODOS los datos (excepto confirmPassword)
      const { jwt, user } = await registerUser(values); // <--- pasamos 'values' completo

      // 2. Asignar rol
      await assignRole(jwt, selectedRole);

      // 3. Login automático (ya no necesitamos updateUserProfile)
      await login(jwt);
      toast({
        title: "¡Bienvenido!",
        description: "Tu cuenta fue creada correctamente.",
      });

      // 4. Redirigir según rol
      router.push(
        selectedRole === "entrepreneur"
          ? "/dashboard/entrepreneur"
          : "/initiatives",
      );
    } catch (error) {
      console.error("Error en registro:", error);
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error inesperado",
        description: message,
      });
      if (message.toLowerCase().includes("already taken")) {
        form.setError("email", {
          type: "manual",
          message: "Usuario o correo ya están en uso",
        });
        form.setError("username", {
          type: "manual",
          message: "Usuario o correo ya están en uso",
        });
        setStep(1);
      }
    } finally {
      setLoading(false);
    }
  };
  const roleLabels = { member: "Miembro", entrepreneur: "Emprendedor" };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <h2 className="text-2xl font-black tracking-tighter italic">
              VITRINA <span className="text-primary">SOCIAL</span>
            </h2>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          {!selectedRole ? (
            <>
              <RoleSelector
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
              <p className="mt-6 text-center text-xs text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </>
          ) : (
            <>
              <StepIndicator current={step} total={TOTAL_STEPS} />
              <div className="mt-2 mb-4 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Registro como {roleLabels[selectedRole]}
                </span>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="ml-2 text-xs text-muted-foreground hover:text-primary underline"
                >
                  Cambiar rol
                </button>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Step1Credentials form={form} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Step2PersonalInfo form={form} />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Step3Preferences form={form} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="rounded-xl h-12 px-6"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Atrás
                    </Button>
                  )}
                  {step < TOTAL_STEPS && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 rounded-xl h-12 font-bold shadow-md"
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  {step === TOTAL_STEPS && (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl h-12 font-bold shadow-md"
                    >
                      {loading ? "Registrando..." : "Finalizar registro"}
                      {!loading && <Check className="h-4 w-4 ml-2" />}
                    </Button>
                  )}
                </div>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
