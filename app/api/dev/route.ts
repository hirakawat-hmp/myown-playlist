import { NextResponse } from "next/server";
import { sample } from "@/lib/spotify";

export async function GET() {
  const res = await sample();
  return NextResponse.json(res);
}
