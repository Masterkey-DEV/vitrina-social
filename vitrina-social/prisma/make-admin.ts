import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Uso: npm run make:admin -- "email@ejemplo.com"');
    process.exit(1);
  }

  const role = await prisma.role.findUnique({ where: { name: "admin" } });
  if (!role) {
    console.error('Rol "admin" no encontrado. Corre primero el seed: npm run db:seed');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    console.error(`No se encontró un usuario con el email "${email}"`);
    process.exit(1);
  }

  await prisma.user.update({ where: { id: user.id }, data: { roleId: role.id } });
  console.log(`✅ "${user.username}" ahora es administrador.`);
}

main().finally(() => prisma.$disconnect());
