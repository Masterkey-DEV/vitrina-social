"use client";

import { useState } from "react";
import { API_URL } from "@/const/api";
import type { Initiative } from "@/types/initiative";

export function useMemberInitiatives(jwt: string | null) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch_(userId: number) {
  if (!jwt || !userId) return;
  try {
    // We query the initiatives directly where 'users' contains the current userId
    const res = await fetch(
      `${API_URL}/api/iniciatives?filters[users][id][$eq]=${userId}&populate[foundation][fields][0]=name&populate[foundation][fields][1]=siglas&populate[initiatives_categories][fields][0]=name&populate[initiatives_categories][fields][1]=id`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    if (!res.ok) {
      setInitiatives([]);
      return;
    }

    const { data } = await res.json();
    // In Strapi 5, the response structure usually has a 'data' wrapper
    setInitiatives(data ?? []);
  } catch (err) {
    console.error("[useMemberInitiatives] error:", err);
    setInitiatives([]);
  } finally {
    setLoading(false);
  }
}

  return { initiatives, loading, fetch: fetch_ };
}