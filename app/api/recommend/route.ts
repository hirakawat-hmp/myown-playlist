import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requestToGemini } from "@/lib/gemini";
import path from "path";
import { NumericRecommendationsProps } from "@/interfaces/spotify";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "app", "public", "takeru.jpg");
  console.log(filePath);
  const res = await requestToGemini(filePath);

  const props: NumericRecommendationsProps = {
    target_acousticness: res.acousticness,
    target_danceability: res.danceability,
    target_energy: res.energy,
    target_instrumentalness: res.instrumentalness,
    target_liveness: res.liveness,
    target_loudness: res.loudness,
    target_speechiness: res.speechiness,
    target_tempo: res.tempo,
    target_valence: res.valence,
    seed_genres: res.genre,
  };
}
