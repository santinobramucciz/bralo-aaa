import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendNewOrderEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status") || "";

  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, logs: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerLastName, customerEmail, customerPhone, address, city, postalCode, country, notes, items } = body;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.priceEUR * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 4.99;
    const total = subtotal + shipping;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerLastName,
        customerEmail,
        customerPhone,
        address,
        city,
        postalCode,
        country: country || "España",
        notes: notes || null,
        status: "pending",
        paymentStatus: "pending",
        totalEUR: total,
        subtotalEUR: subtotal,
        shippingEUR: shipping,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage || null,
            quantity: item.quantity,
            priceEUR: item.priceEUR,
            totalEUR: item.priceEUR * item.quantity,
          })),
        },
        logs: {
          create: {
            status: "pending",
            message: "Pedido creado",
            agent: "sistema",
          },
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: item.quantity }, stock: { decrement: item.quantity } },
        });
      }
    }

    await prisma.notification.create({
      data: {
        type: "new_order",
        title: "Nuevo pedido",
        message: `${customerName} ${customerLastName} ha hecho un pedido por ${total.toFixed(2)} EUR (${orderNumber}). Tienes que comprar el producto en el proveedor.`,
        orderId: order.id,
      },
    });

    try {
      await sendNewOrderEmail({
        orderNumber,
        customerName,
        customerLastName,
        customerEmail,
        customerPhone,
        address,
        city,
        postalCode,
        items: order.items.map((i) => ({ name: i.productName, qty: i.quantity, priceEUR: i.priceEUR })),
        totalEUR: total,
      });
    } catch (e) {
      console.error("Error enviando email:", e);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error creando pedido" }, { status: 500 });
  }
}
