"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/const/api";
import { useRouter } from "next/navigation";

interface Props {
  initiativeId: string;
}

type State = "loading" | "unauthenticated" | "not-member-role" | "ready";

export function JoinInitiativeButton({ initiativeId }: Props) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const [state, setState] = useState<State>("loading");
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setState("unauthenticated");
      return;
    }

    async function checkMembership() {
      try {
        // 1. Obtener usuario y su rol
        const userRes = await fetch(`${API_URL}/api/users/me?populate=role`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const user = await userRes.json();

        if (!user?.id) {
          setState("unauthenticated");
          return;
        }

        // 2. Solo miembros pueden unirse/salir
        if (user.role?.name !== "member") {
          setState("not-member-role");
          return;
        }

        // 3. Verificar membresía actual
        const initRes = await fetch(
          `${API_URL}/api/iniciatives/${initiativeId}?populate=users`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        const initData = await initRes.json();
        const members: { id: number }[] = initData?.data?.users ?? [];
        const joined = members.some((m) => Number(m.id) === Number(user.id));

        setIsMember(joined);
        setState("ready");
      } catch (err) {
        console.error(err);
        setState("unauthenticated");
      }
    }

    checkMembership();
  }, [initiativeId]);

  async function handleJoin() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/api/iniciatives/${initiativeId}/join`,
        {
          method: "POST", // ✅ POST según el router del backend
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (!res.ok) {
        const body = await res.json();
        setError(body?.error?.message ?? "Error al unirte");
        return;
      }

      setIsMember(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Error de red al unirte");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/api/iniciatives/${initiativeId}/leave`,
        {
          method: "DELETE", // ✅ DELETE según el router del backend
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (!res.ok) {
        const body = await res.json();
        setError(body?.error?.message ?? "Error al salir");
        return;
      }

      setIsMember(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Error de red al salir");
    } finally {
      setActionLoading(false);
    }
  }

  // ── Estados de renderizado ──────────────────────────────────────────────

  if (state === "loading") {
    return (
      <Button disabled className="w-full rounded-full py-6">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (state === "unauthenticated") {
    return (
      <Button asChild variant="outline" className="w-full rounded-full py-6 font-semibold text-base">
        <a href="/login">Inicia sesión para unirte</a>
      </Button>
    );
  }

  if (state === "not-member-role") {
    return null; // Las fundaciones no ven este botón
  }

  return (
    <div className="flex flex-col gap-2">
      {isMember ? (
        <Button
          onClick={handleLeave}
          disabled={actionLoading}
          variant="outline"
          className="w-full rounded-full py-6 font-semibold text-base gap-2.5 border-destructive text-destructive hover:bg-destructive/10"
        >
          {actionLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              Salir de esta iniciativa
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleJoin}
          disabled={actionLoading}
          className="w-full rounded-full py-6 font-semibold text-base gap-2.5"
        >
          {actionLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Users className="h-5 w-5" />
              Unirme a esta iniciativa
            </>
          )}
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}