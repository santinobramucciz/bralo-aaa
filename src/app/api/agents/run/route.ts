import { NextRequest, NextResponse } from "next/server";
import { runDailyPipeline } from "@/agents";

export async function POST(req: NextRequest) {
  try {
    const result = await runDailyPipeline();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
