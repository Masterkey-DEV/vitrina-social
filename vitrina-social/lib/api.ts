import { NextResponse } from "next/server";

// ─── Respuestas estilo Strapi ────────────────────────────────────────────────

export function apiOk(data: unknown, meta?: unknown) {
  return NextResponse.json({ data, meta: meta ?? undefined });
}

export function apiError(status: number, message: string) {
  return NextResponse.json(
    {
      data: null,
      error: { status, name: "ApplicationError", message },
    },
    { status },
  );
}

// ─── Parseo de parámetros estilo Strapi ──────────────────────────────────────

type RelKind = "one" | "many";

const RELATIONS: Record<string, Record<string, RelKind>> = {
  product: { usuario: "one", product_categories: "many", images: "many" },
  iniciative: {
    foundation: "one",
    initiatives_categories: "many",
    users: "many",
    images: "many",
  },
  foundation: { usuario: "one", iniciatives: "many", image: "one" },
};

function coerceValue(field: string, op: string, value: string): unknown {
  if (op === "$in") {
    return value.split(",").map((s) => coerceValue(field, "$eq", s.trim()));
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (field === "id" || field === "price" || field === "stock") return Number(value);
  return value;
}

function fieldCondition(op: string, value: unknown): unknown {
  switch (op) {
    case "$eq":
      return value;
    case "$ne":
      return { not: value };
    case "$gt":
      return { gt: value };
    case "$gte":
      return { gte: value };
    case "$lt":
      return { lt: value };
    case "$lte":
      return { lte: value };
    case "$contains":
      return { contains: value, mode: "insensitive" };
    case "$in":
      return { in: value };
    case "$null":
      return value ? null : { not: null };
    default:
      return value;
  }
}

function bracketSegments(key: string): string[] | null {
  if (!key.includes("[")) return null;
  const inner = key.slice(key.indexOf("[") + 1, key.lastIndexOf("]"));
  return inner.split("][");
}

export function parseFilters(params: URLSearchParams, model: string): Record<string, any> {
  const where: Record<string, any> = {};
  const relations = RELATIONS[model] ?? {};

  for (const [key, value] of params.entries()) {
    if (!key.startsWith("filters[")) continue;
    const segments = bracketSegments(key);
    if (!segments || segments.length < 2) continue;

    const op = segments[segments.length - 1];
    const path = segments.slice(0, -1);

    if (path.length === 1) {
      const field = path[0];
      where[field] = fieldCondition(op, coerceValue(field, op, value));
    } else {
      const [relName, field] = path;
      const cond = { [field]: fieldCondition(op, coerceValue(field, op, value)) };
      if (relations[relName] === "many") {
        where[relName] = { some: cond };
      } else {
        where[relName] = cond;
      }
    }
  }

  return where;
}

const MODEL_DEFAULT_INCLUDE: Record<string, Record<string, true>> = {
  product: { images: true, product_categories: true, usuario: true },
  iniciative: { foundation: true, images: true, initiatives_categories: true },
  foundation: { image: true },
};

const RELATION_DEFAULT_INCLUDE: Record<string, any> = {
  images: true,
  image: true,
  usuario: true,
  role: true,
  foundation: { image: true },
  iniciatives: { images: true, initiatives_categories: true, users: true },
  initiatives: { images: true, initiatives_categories: true, users: true },
  initiatives_categories: true,
  product_categories: true,
  users: true,
};

function expandPopulate(tree: Record<string, any>, model: string): Record<string, any> {
  const include: Record<string, any> = {};

  for (const [rel, sub] of Object.entries(tree)) {
    if (rel === "*") {
      Object.assign(include, MODEL_DEFAULT_INCLUDE[model] ?? {});
      continue;
    }
    if (sub === true) {
      include[rel] = true;
    } else if (sub === "*") {
      include[rel] = RELATION_DEFAULT_INCLUDE[rel] ?? true;
    } else {
      include[rel] = { include: expandPopulate(sub, rel) };
    }
  }

  return include;
}

export function parsePopulate(params: URLSearchParams, model: string): Record<string, any> {
  const tree: Record<string, any> = {};

  for (const d of params.getAll("populate")) {
    if (!d) continue;
    tree[d] = true;
  }

  for (const [key, value] of params.entries()) {
    if (!key.startsWith("populate[")) continue;
    const segments = bracketSegments(key);
    if (!segments || segments.length < 1) continue;

    const rel = segments[0];
    if (segments[1] === "populate") {
      const nestedRel = segments[2];
      if (tree[rel] === undefined || tree[rel] === true) tree[rel] = {};
      if (value === "*" && !nestedRel) {
        tree[rel] = "*";
      } else if (nestedRel) {
        tree[rel][nestedRel] = true;
      }
    } else {
      if (tree[rel] === undefined) tree[rel] = true;
    }
  }

  return expandPopulate(tree, model);
}

export function parsePagination(params: URLSearchParams): {
  take?: number;
  skip: number;
} {
  const limitRaw = params.get("pagination[limit]") ?? params.get("pagination[pageSize]");
  const start = Number(params.get("pagination[start]") ?? 0);
  const page = Number(params.get("pagination[page]") ?? 1);

  const skip = start > 0 ? start : (page - 1) * (Number(limitRaw) || 0);
  const take = limitRaw ? Number(limitRaw) : undefined;

  return { take, skip };
}
