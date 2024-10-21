import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
  NumericAudioFeatures,
  NumericRecommendationsProps,
} from "@/interfaces/spotify";
import QRCode from "qrcode";
import fs from "fs/promises";

interface Track {
  preview_url: string | null;
  name: string;
  artists: Array<{ name: string }>;
  id: string;
  album: {
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

interface ExtractedTrackInfo {
  preview_url: string | null;
  name: string;
  artists: string;
  id: string;
  albumImageUrl: string;
}

interface EnhancedTrackInfo extends ExtractedTrackInfo {
  audioFeatures: NumericAudioFeatures;
}

const spotify = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID || "",
  process.env.SPOTIFY_CLIENT_SECRET || ""
);

function gerRandomNumericAudioFeature(): NumericAudioFeatures {
  const res = {
    acousticness: Math.random(),
    danceability: Math.random(),
    energy: Math.random(),
    instrumentalness: Math.random(),
    liveness: Math.random(),
    loudness: Math.random() * 2 - 1, // loudness can be between -1 and 1
    speechiness: Math.random(),
    tempo: Math.random() * 200, // tempo can be between 0 and 200
    valence: Math.random(),
  } as NumericAudioFeatures;
  return res;
}

function extractTrackInfo(data: { tracks: Track[] }): ExtractedTrackInfo[] {
  return data.tracks
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

async function getEnhancedTrackInfo(
  tracks: ExtractedTrackInfo[]
): Promise<EnhancedTrackInfo[]> {
  // Step 1: Extract track IDs
  const trackIds = tracks.map((track) => track.id);

  // Step 2: Fetch audio features from Spotify API
  const response = await spotify.tracks.audioFeatures(trackIds);

  // Step 3 & 4: Combine track info with audio features
  return tracks.map((track, index) => {
    const features = response[index];
    const relevantFeatures: NumericAudioFeatures = {
      acousticness: features.acousticness,
      danceability: features.danceability,
      energy: features.energy,
      instrumentalness: features.instrumentalness,
      liveness: features.liveness,
      loudness: features.loudness,
      speechiness: features.speechiness,
      tempo: features.tempo,
      valence: features.valence,
    };

    return {
      ...track,
      audioFeatures: relevantFeatures,
    };
  });
}

function getRecommendationsProps(
  props: NumericAudioFeatures
): NumericRecommendationsProps {
  const res = {
    target_acousticness: props.acousticness,
    target_danceability: props.danceability,
    target_energy: props.energy,
    target_instrumentalness: props.instrumentalness,
    target_liveness: props.liveness,
    target_loudness: props.loudness,
    target_speechiness: props.speechiness,
    target_tempo: props.tempo,
    target_valence: props.valence,
  } as NumericRecommendationsProps;
  return res;
}

export async function recommendations(
  numericAudioFeatures: NumericAudioFeatures,
  genres: string[]
) {
  const recommendationsProps = getRecommendationsProps(numericAudioFeatures);
  const items = await spotify.recommendations.get({
    market: "JP",
    limit: 100,
    seed_artists: [""],
    seed_genres: genres,
    seed_tracks: [""],
    min_popularity: 30,
    max_popularity: 100,
    ...recommendationsProps,
  });

  console.log(items);
  return items;
}

export async function recommendationsSample() {
  const numericAudioFeatures = gerRandomNumericAudioFeature();
  const genres = ["j-dance", "j-idol", "j-pop", "j-rock"];
  const items = await recommendations(numericAudioFeatures, genres);
  const res = extractTrackInfo(items);
  const response = getEnhancedTrackInfo(res);

  return response;
}

export async function createPlaylistWithOptionalImageAndQR(
  tracks: ExtractedTrackInfo[],
  userId: string,
  playlistName: string,
  imagePath?: string
): Promise<string> {
  const spotify = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.SPOTIFY_CLIENT_SECRET || ""
  );

  try {
    // Step 1: Create a new playlist
    const playlist = await spotify.playlists.createPlaylist(userId, {
      name: playlistName,
      public: false,
      description: "Playlist created from extracted tracks",
    });

    // Step 2: Add tracks to the playlist
    const trackUris = tracks.map((track) => `spotify:track:${track.id}`);
    await spotify.playlists.addItemsToPlaylist(playlist.id, trackUris);

    // Step 3: Set playlist image (if provided)
    if (imagePath) {
      try {
        const imageData = await fs.readFile(imagePath);
        const base64Image = imageData.toString("base64");
        await spotify.playlists.addCustomPlaylistCoverImageFromBase64String(
          playlist.id,
          base64Image
        );
      } catch (imageError) {
        console.error("Error setting playlist image:", imageError);
        // Continue execution even if image upload fails
      }
    }

    // Step 4: Get the playlist URL
    const playlistUrl = playlist.external_urls.spotify;

    // Step 5: Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(playlistUrl);

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error creating playlist or generating QR code:", error);
    throw error;
  }
}

// Usage example:
// const extractedTracks = extractTrackInfo(responseData);
// const userId = "your_spotify_user_id";
// const playlistName = "My Custom Playlist";
// const imagePath = "/path/to/your/image.jpg"; // Optional
// const qrCodeDataUrl = await createPlaylistWithOptionalImageAndQR(extractedTracks, userId, playlistName, imagePath);
// console.log("QR Code Data URL:", qrCodeDataUrl);
