import type { Prisma } from "@prisma/client";

// ── Tipos intermedios (resultados de Prisma con includes opcionales) ─────────
type AnyRecord = Record<string, any>;

export function serializeMedia(m: AnyRecord) {
  if (!m) return null;
  return {
    id: m.id,
    documentId: m.documentId,
    name: m.name,
    url: m.url,
    alternativeText: m.alternativeText ?? null,
    width: m.width ?? null,
    height: m.height ?? null,
    mime: m.mime ?? null,
    provider: m.provider,
  };
}

export function serializeCategory(c: AnyRecord) {
  return {
    id: c.id,
    documentId: c.documentId,
    name: c.name,
  };
}

export function serializeUserBrief(u: AnyRecord) {
  if (!u) return undefined;
  return {
    id: u.id,
    documentId: u.documentId,
    username: u.username,
    email: u.email,
  };
}

export function serializeUser(u: AnyRecord) {
  return {
    id: u.id,
    documentId: u.documentId,
    username: u.username,
    email: u.email,
    provider: u.provider,
    confirmed: u.confirmed,
    blocked: u.blocked,
    fullName: u.fullName,
    phone: u.phone,
    whatsapp: u.whatsapp,
    address: u.address,
    city: u.city,
    department: u.department,
    bio: u.bio,
    receiveNewsletter: u.receiveNewsletter,
    receiveUpdates: u.receiveUpdates,
    role: u.role
      ? { id: u.role.id, name: u.role.name, type: u.role.type }
      : undefined,
    foundation: u.foundation ? serializeFoundation(u.foundation) : undefined,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export function serializeFoundation(f: AnyRecord) {
  if (!f) return undefined;
  return {
    id: f.id,
    documentId: f.documentId,
    name: f.name,
    siglas: f.siglas,
    objective: f.objective,
    description: f.description,
    whatsapp: f.whatsapp,
    facebook: f.facebook,
    instagram: f.instagram,
    website: f.website,
    twitter: f.twitter,
    linkedin: f.linkedin,
    department: f.department,
    city: f.city,
    location: f.location,
    phone: f.phone,
    image: f.image ? serializeMedia(f.image) : undefined,
    usuario: f.usuario ? serializeUserBrief(f.usuario) : undefined,
    iniciatives: f.iniciatives ? f.iniciatives.map(serializeInitiative) : undefined,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    publishedAt: f.publishedAt,
  };
}

export function serializeInitiative(i: AnyRecord) {
  return {
    id: i.id,
    documentId: i.documentId,
    title: i.title,
    objective: i.objective,
    description: i.description,
    foundation: i.foundation
      ? {
          id: i.foundation.id,
          documentId: i.foundation.documentId,
          name: i.foundation.name,
          siglas: i.foundation.siglas,
        }
      : undefined,
    images: i.images ? i.images.map(serializeMedia) : undefined,
    initiatives_categories: i.initiatives_categories
      ? i.initiatives_categories.map(serializeCategory)
      : undefined,
    users: i.users
      ? i.users.map((u: AnyRecord) => ({
          id: u.id,
          documentId: u.documentId,
          username: u.username,
          email: u.email,
        }))
      : undefined,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
    publishedAt: i.publishedAt,
  };
}

export function serializeProduct(p: AnyRecord) {
  return {
    id: p.id,
    documentId: p.documentId,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price != null ? Number(p.price) : null,
    stock: p.stock,
    featured: p.featured,
    images: p.images ? p.images.map(serializeMedia) : undefined,
    product_categories: p.product_categories
      ? p.product_categories.map(serializeCategory)
      : undefined,
    usuario: p.usuario ? serializeUserBrief(p.usuario) : undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishedAt: p.publishedAt,
  };
}
