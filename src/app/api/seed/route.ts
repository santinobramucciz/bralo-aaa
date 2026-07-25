import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function seed() {
  try {
    const email = "admin@bralo.es";
    const password = "BraLo2024!";

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashed = await bcrypt.hash(password, 12);
      user = await prisma.user.create({
        data: { email, name: "Admin BraLo", password: hashed, role: "admin" },
      });
    }

    return NextResponse.json({
      message: "Base de datos inicializada correctamente",
      admin: { email, password },
      userId: user.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return seed();
}

export async function POST() {
  return seed();
}
