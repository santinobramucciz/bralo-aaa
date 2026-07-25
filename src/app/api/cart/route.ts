import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, productId, quantity } = await req.json();

    const existing = await prisma.cartItem.findFirst({
      where: { sessionId, productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) },
      });
    } else {
      await prisma.cartItem.create({
        data: { sessionId, productId, quantity: quantity || 1 },
      });
    }

    const cart = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
    });

    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") || "";
  if (!sessionId) return NextResponse.json([]);

  const cart = await prisma.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
  });

  return NextResponse.json(cart);
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId, productId } = await req.json();
    if (productId) {
      await prisma.cartItem.deleteMany({ where: { sessionId, productId } });
    } else {
      await prisma.cartItem.deleteMany({ where: { sessionId } });
    }
    const cart = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
    });
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
