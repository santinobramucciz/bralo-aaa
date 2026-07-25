import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (id) {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    } else {
      await prisma.notification.updateMany({ data: { read: true } });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
