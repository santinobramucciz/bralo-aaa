import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creando usuario admin de BraLo...");

  const email = "admin@bralo.es";
  const password = "BraLo2024!";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Usuario admin ya existe:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      name: "Admin BraLo",
      password: hashed,
      role: "admin",
    },
  });

  console.log("Usuario admin creado:");
  console.log("  Email:", email);
  console.log("  Contraseña:", password);
  console.log("  IMPORTANTE: Cambia esta contraseña en producción!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
