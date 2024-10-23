import { NextResponse } from "next/server";
import { requestToGemini } from "@/lib/gemini";
import path from "path";
export async function GET() {
  const filePath = path.join(process.cwd(), "app", "public", "takeru.jpg");
  console.log(filePath);
  const res = await requestToGemini(filePath);
  console.log(res);
  return NextResponse.json(res);
}
