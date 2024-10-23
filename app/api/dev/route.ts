import { NextResponse } from "next/server";
import { recommendationsSample } from "@/lib/spotify";
import { requestToGemini } from "@/lib/geminiRequest";
import { getRecommendations } from "@/lib/spotifyGetRecommend";
import { extractTrackInfo } from "@/lib/spotifyExtractTrackInfo";

export async function GET() {
  const geminiResponse = await requestToGemini();
  console.log(geminiResponse);
  const spotifyResponse = await getRecommendations(geminiResponse);
  console.log(spotifyResponse);
  const TrackInfo = await extractTrackInfo(spotifyResponse);
  console.log(TrackInfo);
  return NextResponse.json(TrackInfo);
}
