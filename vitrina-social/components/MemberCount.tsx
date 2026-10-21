// @/components/MemberCount.tsx
"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { API_URL } from "@/const/api";

interface Props {
  initiativeId: string;
  // Permite recibir un conteo inicial del servidor como fallback
  initialCount?: number;
}

export function MemberCount({ initiativeId, initialCount = 0 }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch(
          `${API_URL}/api/iniciatives/${initiativeId}/member-count`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const { count } = await res.json();
        setCount(count);
      } catch {
        // mantiene initialCount como fallback
      }
    }

    fetchCount();
  }, [initiativeId]);

  return (
    <>
      {/* Badge en el hero — se usa igual que el anterior */}
      <span data-member-count className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
        <Users className="h-3.5 w-3.5" />
        {count} {count === 1 ? "miembro" : "miembros"}
      </span>
    </>
  );
}

// Variante para el card del aside
export function MemberCountCard({ initiativeId, initialCount = 0 }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch(
          `${API_URL}/api/iniciatives/${initiativeId}/member-count`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        setCount(data.count);
      } catch {}
    }

    fetchCount();
  }, [initiativeId]);

  return (
    <div className="p-6 rounded-3xl border bg-muted/30 space-y-3">
      <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
        <Users className="h-4 w-4" />
        Comunidad
      </h3>
      <p className="text-3xl font-black text-foreground">{count}</p>
      <p className="text-xs text-muted-foreground">
        {count === 1 ? " una persona se ha unido" : "personas unidas"} a esta iniciativa
      </p>
    </div>
  );
}