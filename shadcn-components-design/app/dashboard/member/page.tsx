"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import { MemberHeader } from "@/components/dashboard/member/Memberheader";
import { MemberStatsGrid } from "@/components/dashboard/member/Memberstatsgrid";
import { MemberInitiativeCard } from "@/components/dashboard/member/Memberinitiativecard";
import { MemberEmptyState } from "@/components/dashboard/member/Memberemptystate";
import { useMemberInitiatives } from "@/hooks/member";

export default function MemberDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const {
    initiatives,
    loading: dataLoading,
    fetch: fetchInitiatives,
  } = useMemberInitiatives(jwt);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) {
      router.replace("/login");
      return;
    }
    if (user.role?.name !== "member") {
      router.replace("/dashboard");
      return;
    }

    fetchInitiatives(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, jwt]);

  function handleLogout() {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <MemberHeader username={user.username} onLogout={handleLogout} />

        <MemberStatsGrid initiatives={initiatives} />

        <section className="space-y-3">
          <h2 className="font-black text-lg">Mis iniciativas</h2>
          {initiatives.length === 0 ? (
            <MemberEmptyState />
          ) : (
            <div className="grid gap-3">
              {initiatives.map((init) => (
                <MemberInitiativeCard key={init.id} initiative={init} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
