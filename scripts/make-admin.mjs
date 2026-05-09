import { PrismaClient } from "@prisma/client";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const db = new PrismaClient();

const user = await db.user.findUnique({ where: { email } });
if (!user) {
  console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
  await db.$disconnect();
  process.exit(1);
}

await db.user.update({ where: { email }, data: { role: "ADMIN" } });
console.log(`✅ ${email} est maintenant ADMIN.`);
await db.$disconnect();
