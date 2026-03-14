"use client";

import { useState } from "react";
import { API_URL } from "@/const/api";
import type { Initiative } from "@/types/member";

export function useMemberInitiatives(jwt: string | null) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch_(userId: number) {
    if (!jwt) return;
    try {
      // URL pattern verified from working MemberDashboard:
      // filters by user id (numeric) via users_permissions_users relation
      const res = await fetch(
        `${API_URL}/api/iniciatives` +
          `?filters[users_permissions_users][id][$eq]=${userId}` +
          `&populate[foundation][fields][0]=name` +
          `&populate[foundation][fields][1]=siglas` +
          `&populate[initiatives_categories][fields][0]=name` +
          `&populate[users_permissions_users][fields][0]=id`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      const data = await res.json();
      setInitiatives(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  return { initiatives, loading, fetch: fetch_ };
}
