import { NextRequest, NextResponse } from "next/server";
import { runFotografo } from "@/agents/fotografo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const result = await runFotografo();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}