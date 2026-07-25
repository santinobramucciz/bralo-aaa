import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name || "Admin BraLo", password: hashed, role: "admin" },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      message: "Usuario BraLo creado correctamente",
    });
  } catch (error) {
    return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
  }
}
