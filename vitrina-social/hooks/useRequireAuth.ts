"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Protege una página: redirige a /login si no hay sesión,
 * o a /dashboard si el rol no coincide con el requerido.
 *
 * @returns { user, jwt, loading } del AuthContext
 */
export function useRequireAuth(requiredRole: string) {
  const { user, jwt, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user || !jwt) {
      router.replace("/login");
      return;
    }

    if (user.role?.name !== requiredRole) {
      // Tiene sesión pero es otro rol — ir al dashboard correcto
      router.replace("/dashboard");
    }
  }, [user, jwt, loading, requiredRole, router]);

  return { user, jwt, loading };
}
