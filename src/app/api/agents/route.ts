import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const logs = await prisma.agentLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  try {
    const { agent, action, input, output, status, durationMs } = await req.json();
    const log = await prisma.agentLog.create({
      data: { agent, action, input: input || "", output: output || "", status: status || "success", durationMs: durationMs || 0 },
    });
    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
