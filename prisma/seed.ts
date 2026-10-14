import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@tabungsans.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin12345", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin TabungSans",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Admin dibuat: admin@tabungsans.com / admin12345");
  } else {
    console.log("Admin sudah ada.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
