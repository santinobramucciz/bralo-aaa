import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
    include: { items: true, logs: true },
  });
  if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, paymentStatus, trackingNumber, trackingUrl, ...rest } = body;

    const updateData: any = { ...rest };
    if (status) {
      updateData.status = status;
      if (status === "shipped") updateData.shippedAt = new Date();
      if (status === "delivered") updateData.deliveredAt = new Date();
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { items: true, logs: true },
    });

    if (status) {
      await prisma.orderLog.create({
        data: {
          orderId: params.id,
          status,
          message: `Estado actualizado a: ${status}`,
          agent: "admin",
        },
      });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
