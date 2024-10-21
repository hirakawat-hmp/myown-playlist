import { NextResponse } from "next/server";
import { recommendationsSample } from "@/lib/spotify";

export async function GET() {
  const res = await recommendationsSample();
  return NextResponse.json(res);
}
