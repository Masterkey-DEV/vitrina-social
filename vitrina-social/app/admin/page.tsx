"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  LogOut,
  Package,
  Building2,
  Lightbulb,
  Tags,
  Users,
  Trash2,
  Star,
  Plus,
  LayoutDashboard,
} from "lucide-react";

type Tab = "overview" | "products" | "foundations" | "initiatives" | "categories" | "users";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Resumen", icon: LayoutDashboard },
  { key: "products", label: "Productos", icon: Package },
  { key: "foundations", label: "Fundaciones", icon: Building2 },
  { key: "initiatives", label: "Iniciativas", icon: Lightbulb },
  { key: "categories", label: "Categorías", icon: Tags },
  { key: "users", label: "Usuarios", icon: Users },
];

const ROLE_OPTIONS = ["authenticated", "member", "entrepreneur", "foundation", "admin"];

async function apiFetch(url: string, jwt: string, method = "GET", body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
  }
  return data;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function AdminPage() {
  const { user, jwt, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (loading) return;
    if (!user || !jwt) {
      router.replace("/login");
      return;
    }
    if (user.role?.name !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, jwt, router]);

  if (loading) return <Spinner />;
  if (!user || !jwt) return null;
  if (user.role?.name !== "admin") return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Panel de administración
            </p>
            <h1 className="text-3xl font-black tracking-tight">
              Hola, {user.username}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl gap-2 text-destructive border-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                tab === t.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab jwt={jwt} onGo={setTab} />}
        {tab === "products" && <ProductsTab jwt={jwt} toast={toast} />}
        {tab === "foundations" && <FoundationsTab jwt={jwt} toast={toast} />}
        {tab === "initiatives" && <InitiativesTab jwt={jwt} toast={toast} />}
        {tab === "categories" && <CategoriesTab jwt={jwt} toast={toast} />}
        {tab === "users" && <UsersTab jwt={jwt} toast={toast} />}
      </div>
    </div>
  );
}

function OverviewTab({ jwt, onGo }: { jwt: string; onGo: (t: Tab) => void }) {
  const [stats, setStats] = useState<{ label: string; value: number; tab: Tab }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, foundations, initiatives, users] = await Promise.all([
          apiFetch("/api/products?pagination[limit]=1", jwt),
          apiFetch("/api/foundations?pagination[limit]=1", jwt),
          apiFetch("/api/iniciatives?pagination[limit]=1", jwt),
          apiFetch("/api/admin/users", jwt),
        ]);
        setStats([
          { label: "Productos", value: products?.meta?.pagination?.total ?? (products?.data?.length ?? 0), tab: "products" },
          { label: "Fundaciones", value: foundations?.meta?.pagination?.total ?? (foundations?.data?.length ?? 0), tab: "foundations" },
          { label: "Iniciativas", value: initiatives?.meta?.pagination?.total ?? (initiatives?.data?.length ?? 0), tab: "initiatives" },
          { label: "Usuarios", value: users?.data?.length ?? 0, tab: "users" },
        ]);
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jwt]);

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <button
          key={s.label}
          onClick={() => onGo(s.tab)}
          className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors text-left"
        >
          <p className="text-3xl font-black text-foreground">{s.value}</p>
          <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
        </button>
      ))}
    </div>
  );
}

function ProductsTab({ jwt, toast }: { jwt: string; toast: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/products?populate=*", jwt);
      setItems(res.data ?? []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  }, [jwt, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFeatured(p: any) {
    try {
      await apiFetch(`/api/products/${p.documentId}`, jwt, "PUT", {
        data: { featured: !p.featured },
      });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  async function remove(p: any) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    try {
      await apiFetch(`/api/products/${p.documentId}`, jwt, "DELETE");
      toast({ title: "Producto eliminado" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay productos.</p>
      ) : (
        items.map((p) => (
          <div
            key={p.documentId}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-black truncate">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.usuario?.username ?? "—"} · ${Number(p.price ?? 0).toLocaleString("es-CO")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFeatured(p)}
                className={cn("rounded-xl gap-1", p.featured && "text-primary")}
              >
                <Star className={cn("h-4 w-4", p.featured && "fill-current")} />
                {p.featured ? "Destacado" : "Destacar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(p)}
                className="rounded-xl text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FoundationsTab({ jwt, toast }: { jwt: string; toast: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/foundations?populate=*", jwt);
      setItems(res.data ?? []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  }, [jwt, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(f: any) {
    if (!confirm(`¿Eliminar "${f.name}"?`)) return;
    try {
      await apiFetch(`/api/foundations/${f.documentId}`, jwt, "DELETE");
      toast({ title: "Fundación eliminada" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay fundaciones.</p>
      ) : (
        items.map((f) => (
          <div
            key={f.documentId}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-black truncate">{f.name}</p>
              <p className="text-sm text-muted-foreground">
                {f.siglas} · {[f.city, f.department].filter(Boolean).join(", ") || "Sin ubicación"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/foundations/${f.siglas}`}>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Ver
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(f)}
                className="rounded-xl text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function InitiativesTab({ jwt, toast }: { jwt: string; toast: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/iniciatives?populate=*", jwt);
      setItems(res.data ?? []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  }, [jwt, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(i: any) {
    if (!confirm(`¿Eliminar "${i.title}"?`)) return;
    try {
      await apiFetch(`/api/iniciatives/${i.documentId}`, jwt, "DELETE");
      toast({ title: "Iniciativa eliminada" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay iniciativas.</p>
      ) : (
        items.map((i) => (
          <div
            key={i.documentId}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-black truncate">{i.title}</p>
              <p className="text-sm text-muted-foreground">
                {i.foundation?.name ?? "—"} · {i.users?.length ?? 0} miembros
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              className="rounded-xl text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

function CategoriesTab({ jwt, toast }: { jwt: string; toast: any }) {
  const [productCats, setProductCats] = useState<any[]>([]);
  const [initiativeCats, setInitiativeCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"product" | "initiative">("product");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, i] = await Promise.all([
        apiFetch("/api/product-categories", jwt),
        apiFetch("/api/initiatives-categories", jwt),
      ]);
      setProductCats(p.data ?? []);
      setInitiativeCats(i.data ?? []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  }, [jwt, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function addCategory() {
    if (!newName.trim()) return;
    const url = newType === "product" ? "/api/product-categories" : "/api/initiatives-categories";
    try {
      await apiFetch(url, jwt, "POST", { data: { name: newName.trim() } });
      setNewName("");
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  async function removeCategory(type: "product" | "initiative", docId: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const url =
      type === "product"
        ? `/api/product-categories/${docId}`
        : `/api/initiatives-categories/${docId}`;
    try {
      await apiFetch(url, jwt, "DELETE");
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading) return <Spinner />;

  function CategoryList({
    title,
    cats,
    type,
  }: {
    title: string;
    cats: any[];
    type: "product" | "initiative";
  }) {
    return (
      <div>
        <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <span
              key={c.documentId}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium"
            >
              {c.name}
              <button
                onClick={() => removeCategory(type, c.documentId)}
                className="text-destructive hover:text-destructive/70"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {cats.length === 0 && (
            <span className="text-sm text-muted-foreground">Sin categorías</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <p className="font-black">Nueva categoría</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 border border-input rounded-xl px-4 py-2 text-sm bg-background"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as "product" | "initiative")}
            className="border border-input rounded-xl px-4 py-2 text-sm bg-background"
          >
            <option value="product">Producto</option>
            <option value="initiative">Iniciativa</option>
          </select>
          <Button onClick={addCategory} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>

      <CategoryList title="Categorías de producto" cats={productCats} type="product" />
      <CategoryList title="Categorías de iniciativa" cats={initiativeCats} type="initiative" />
    </div>
  );
}

function UsersTab({ jwt, toast }: { jwt: string; toast: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/users", jwt);
      setUsers(res.data ?? []);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  }, [jwt, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(u: any, role: string) {
    try {
      await apiFetch(`/api/admin/users/${u.documentId}`, jwt, "PUT", { role });
      toast({ title: "Rol actualizado" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  async function toggleBlocked(u: any) {
    try {
      await apiFetch(`/api/admin/users/${u.documentId}`, jwt, "PUT", { blocked: !u.blocked });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  async function remove(u: any) {
    if (!confirm(`¿Eliminar a "${u.username}"?`)) return;
    try {
      await apiFetch(`/api/admin/users/${u.documentId}`, jwt, "DELETE");
      toast({ title: "Usuario eliminado" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div
          key={u.documentId}
          className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="min-w-0">
            <p className="font-black truncate">
              {u.username}{" "}
              {u.blocked && (
                <span className="text-xs font-bold text-destructive">(bloqueado)</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{u.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={u.role?.name ?? "authenticated"}
              onChange={(e) => changeRole(u, e.target.value)}
              className="border border-input rounded-xl px-3 py-1.5 text-sm bg-background"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleBlocked(u)}
              className="rounded-xl"
            >
              {u.blocked ? "Desbloquear" : "Bloquear"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(u)}
              className="rounded-xl text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
