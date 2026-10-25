// prisma/seed.ts
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db";

async function main() {
  const email = "admin@example.com";
  const password = await bcrypt.hash("Admin@1234", 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Admin", email, password, role: "ADMIN" },
  });

  console.log("✅ Admin seeded:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());