import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "authenticated", type: "authenticated" },
    { name: "member", type: "member" },
    { name: "entrepreneur", type: "entrepreneur" },
    { name: "foundation", type: "foundation" },
    { name: "admin", type: "admin" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { type: role.type },
      create: role,
    });
  }

  const productCategories = [
    "Textiles",
    "Cerámica",
    "Tejidos Wayuu",
    "Joyería",
    "Madera",
    "Gastronomía",
  ];

  for (const name of productCategories) {
    await prisma.productCategory.upsert({
      where: { name },
      update: {},
      create: { name, publishedAt: new Date() },
    });
  }

  const initiativeCategories = [
    "Reconciliación",
    "Emprendimiento",
    "Educación",
    "Salud Mental",
    "Cultura",
    "Medio Ambiente",
  ];

  for (const name of initiativeCategories) {
    await prisma.initiativeCategory.upsert({
      where: { name },
      update: {},
      create: { name, publishedAt: new Date() },
    });
  }

  console.log("Seed completado: roles y categorías creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
