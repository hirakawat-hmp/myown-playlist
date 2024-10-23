import { spotifyClient } from "./spotifyClient";
import { Track, ReccomendationProps } from "@/interfaces/spotify";
import { GeminiResponse } from "@/interfaces/gemini";

// gemini のレスポンスからspotify のrecommendation api の引数を生成
function createRecommendationProps(
  geminiResponse: GeminiResponse
): ReccomendationProps {
  const res = {
    market: "JP",
    limit: 100,
    seed_artists: [""],
    seed_genres: geminiResponse.genre,
    target_acousticness: geminiResponse.acousticness,
    target_danceability: geminiResponse.danceability,
    target_energy: geminiResponse.energy,
    target_instrumentalness: geminiResponse.instrumentalness,
    target_liveness: geminiResponse.liveness,
    target_loudness: geminiResponse.loudness,
    target_speechiness: geminiResponse.speechiness,
    target_tempo: geminiResponse.tempo,
    target_valence: geminiResponse.valence,
  } as ReccomendationProps;
  return res;
}

export async function getRecommendations(
  geminiResponse: GeminiResponse
): Promise<Track[]> {
  const recommendationProps = createRecommendationProps(geminiResponse);
  const items = await spotifyClient.recommendations.get({
    min_popularity: 40,
    ...recommendationProps,
  });
  const spotifyTracks = items.tracks as Track[];
  return spotifyTracks;
}
