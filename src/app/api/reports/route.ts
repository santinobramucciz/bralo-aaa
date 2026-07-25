import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (date) {
    const report = await prisma.dailyReport.findUnique({ where: { date } });
    return NextResponse.json(report);
  }

  const reports = await prisma.dailyReport.findMany({
    orderBy: { date: "desc" },
    take: 30,
  });
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const today = new Date().toISOString().split("T")[0];

    const existing = await prisma.dailyReport.findUnique({ where: { date: today } });
    if (existing) {
      const report = await prisma.dailyReport.update({
        where: { date: today },
        data: { ...body, details: JSON.stringify(body.details || {}) },
      });
      return NextResponse.json(report);
    }

    const report = await prisma.dailyReport.create({
      data: {
        date: today,
        summary: body.summary || "",
        productsFound: body.productsFound || 0,
        productsApproved: body.productsApproved || 0,
        productsPublished: body.productsPublished || 0,
        totalSalesEUR: body.totalSalesEUR || 0,
        totalOrders: body.totalOrders || 0,
        messagesHandled: body.messagesHandled || 0,
        marketingPosts: body.marketingPosts || 0,
        incidents: body.incidents || 0,
        details: JSON.stringify(body.details || {}),
      },
    });
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
