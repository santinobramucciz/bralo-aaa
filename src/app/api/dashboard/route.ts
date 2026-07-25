import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await Promise.all([
    prisma.product.count({ where: { status: "active" } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalEUR: true }, where: { paymentStatus: "paid" } }),
    prisma.agentLog.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.agentLog.count({ where: { status: "error" } }),
    prisma.message.count({ where: { status: "pending" } }),
    prisma.product.findMany({ orderBy: { salesCount: "desc" }, take: 5, select: { name: true, salesCount: true, priceEUR: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { orderNumber: true, customerName: true, totalEUR: true, status: true, createdAt: true } }),
  ]);

  return NextResponse.json({
    totalProducts: stats[0],
    totalOrders: stats[1],
    totalRevenueEUR: stats[2]._sum.totalEUR || 0,
    agentActions24h: stats[3],
    agentErrors: stats[4],
    pendingMessages: stats[5],
    topProducts: stats[6],
    recentOrders: stats[7],
  });
}
