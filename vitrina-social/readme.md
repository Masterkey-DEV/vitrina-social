# Vitrina Social

Marketplace artesanal que conecta emprendedores víctimas del conflicto con compradores conscientes. Aplicación web completa (frontend + backend) en una sola app **Next.js** desplegable en **Vercel**.

## Stack

- **Next.js 16** (App Router) + React 19 + Tailwind
- **Prisma** ORM + **PostgreSQL** (Neon, serverless)
- **Cloudinary** para almacenamiento de imágenes
- **JWT** (`jose`) + `bcryptjs` para autenticación
- **Bun** como gestor de paquetes

## Requisitos

- [Bun](https://bun.sh) (o Node 20+)
- Una base de datos Postgres gratuita ([Neon](https://neon.tech))
- Una cuenta de [Cloudinary](https://cloudinary.com) (free tier)

## Configuración

Copia `.env.example` a `.env` y completa los valores:

```env
DATABASE_URL="postgresql://usuario:contraseña@host/neondb?sslmode=require"
JWT_SECRET="una-clave-larga-y-aleatoria"
CLOUDINARY_NAME="..."
CLOUDINARY_KEY="..."
CLOUDINARY_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Instalación y arranque

```bash
bun install
bun run db:push      # crea las tablas en la base de datos
bun run db:seed      # crea roles y categorías por defecto
bun run dev          # http://localhost:3000
```

## Roles

| Rol | Acceso |
|-----|--------|
| `member` | Unirse a iniciativas, ver sus inscripciones |
| `entrepreneur` | Gestionar sus productos (`/dashboard/entrepreneur`) |
| `foundation` | Gestionar iniciativas y productos (`/dashboard/foundation`) |
| `admin` | Panel de administración completo (`/admin`) |

## Cómo administrar el contenido

Existe un **panel de administrador** en `/admin` para gestionar productos, fundaciones, iniciativas, categorías y usuarios.

- **Usuarios/fundaciones/emprendedores**: se registran solos desde la web (`/user/register`, `/foundations/register`) y gestionan su contenido desde sus dashboards.
- **Panel de administrador** (`/admin`): permite
  - Ver estadísticas generales.
  - Eliminar/destacar productos, fundaciones e iniciativas.
  - Crear y eliminar categorías (de producto e iniciativa).
  - Cambiar roles y bloquear/eliminar usuarios.
- **Datos en general**: `bun run db:studio` abre un panel visual sobre la base de datos (Prisma Studio) para editar cualquier registro.

### Crear el primer administrador

1. Registra un usuario normal desde la web (o usa uno existente).
2. Promuévelo a admin:

```bash
bun run make:admin -- "email@ejemplo.com"
```

También puedes hacerlo desde Prisma Studio (`bun run db:studio`) cambiando el rol del usuario a `admin`.

## Estructura del backend (dentro de `app/api/`)

| Ruta | Descripción |
|------|-------------|
| `/api/auth/local`, `/api/auth/local/register` | Login y registro (JWT) |
| `/api/users/me`, `/api/users/set-role` | Perfil y asignación de rol |
| `/api/admin/users`, `/api/admin/users/[id]` | Gestión de usuarios (admin) |
| `/api/upload` | Subida de imágenes a Cloudinary |
| `/api/products`, `/api/products/[id]` | CRUD de productos |
| `/api/foundations`, `/api/foundations/[id]` | CRUD de fundaciones |
| `/api/iniciatives`, `/api/iniciatives/[id]` | CRUD de iniciativas |
| `/api/iniciatives/[id]/join`, `/leave`, `/member-count` | Membresía |
| `/api/product-categories`, `/api/initiatives-categories` | Categorías |

El esquema de datos está en `prisma/schema.prisma`.

## Despliegue en Vercel

1. Sube el repo a GitHub/GitLab.
2. En Vercel crea un proyecto y configura:
   - **Root Directory**: la carpeta del proyecto (`vitrina-social`).
   - **Build Command**: `bun run db:migrate && bun run build` (o corre `bun run db:push && bun run db:seed` una vez contra Neon).
   - **Environment Variables**: `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`.
3. Deploy.

> `postinstall` ya ejecuta `prisma generate` automáticamente en cada build.

## Scripts útiles

```bash
bun run dev          # desarrollo
bun run build        # build de producción
bun run db:push      # sincroniza el esquema con la BD
bun run db:seed      # carga roles y categorías
bun run db:migrate   # aplica migraciones
bun run db:studio    # panel visual (Prisma Studio)
bun run make:admin -- "email@ejemplo.com"  # promueve un usuario a admin
```
