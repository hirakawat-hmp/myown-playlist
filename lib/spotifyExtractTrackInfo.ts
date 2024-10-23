import { spotifyClient } from "./spotifyClient";
import {
  Track,
  TrackInfo,
  TrackInfoMeta,
  NumericAudioFeatures,
} from "@/interfaces/spotify";

// 楽曲のメタ情報を取得
function extractTrackInfoPhase1(tracks: Track[]): TrackInfoMeta[] {
  return tracks
    .filter((track) => track.preview_url !== null)
    .slice(0, 20)
    .map((track) => ({
      preview_url: track.preview_url as string,
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(", "),
      id: track.id,
      albumImageUrl: track.album.images[0]?.url || "",
    }));
}

// 楽曲の特徴量を取得
async function extractTrackInfoPhase2(
  tracks: TrackInfoMeta[]
): Promise<TrackInfo[]> {
  // Step 1: Extract track IDs
  const trackIds = tracks.map((track) => track.id);

  // Step 2: Fetch audio features from Spotify API
  const response = await spotifyClient.tracks.audioFeatures(trackIds);

  // Step 3 & 4: Combine track info with audio features
  return tracks.map((track, index) => {
    const features = response[index] as NumericAudioFeatures;

    return {
      ...track,
      audioFeatures: features,
    };
  });
}

export async function extractTrackInfo(tracks: Track[]): Promise<TrackInfo[]> {
  return extractTrackInfoPhase2(extractTrackInfoPhase1(tracks));
}
