"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // todavía verificando — no hacer nada

    if (!user) {
      router.replace("/login");
      return;
    }

    const role = user.role?.name.toLowerCase();
    console.log("User role:", role); // Para depuración
    if (role === "foundation") router.replace("/dashboard/foundation");
    else if (role === "entrepreneur") router.replace("/dashboard/entrepreneur");
    else if (role === "member") router.replace("/dashboard/member");
    else if (role === "admin") router.replace("/admin");
    else router.replace("/login");
  }, [user, loading, router]);

  // Muestra spinner mientras loading === true o mientras redirige
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
