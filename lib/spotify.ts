import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
  NumericAudioFeatures,
  NumericRecommendationsProps,
} from "@/interfaces/spotify";

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

export const availableGenres = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "black-metal",
  "bluegrass",
  "blues",
  "bossanova",
  "brazil",
  "breakbeat",
  "british",
  "cantopop",
  "chicago-house",
  "children",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "dancehall",
  "death-metal",
  "deep-house",
  "detroit-techno",
  "disco",
  "disney",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "emo",
  "folk",
  "forro",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "goth",
  "grindcore",
  "groove",
  "grunge",
  "guitar",
  "happy",
  "hard-rock",
  "hardcore",
  "hardstyle",
  "heavy-metal",
  "hip-hop",
  "holidays",
  "honky-tonk",
  "house",
  "idm",
  "indian",
  "indie",
  "indie-pop",
  "industrial",
  "iranian",
  "j-dance",
  "j-idol",
  "j-pop",
  "j-rock",
  "jazz",
  "k-pop",
  "kids",
  "latin",
  "latino",
  "malay",
  "mandopop",
  "metal",
  "metal-misc",
  "metalcore",
  "minimal-techno",
  "movies",
  "mpb",
  "new-age",
  "new-release",
  "opera",
  "pagode",
  "party",
  "philippines-opm",
  "piano",
  "pop",
  "pop-film",
  "post-dubstep",
  "power-pop",
  "progressive-house",
  "psych-rock",
  "punk",
  "punk-rock",
  "r-n-b",
  "rainy-day",
  "reggae",
  "reggaeton",
  "road-trip",
  "rock",
  "rock-n-roll",
  "rockabilly",
  "romance",
  "sad",
  "salsa",
  "samba",
  "sertanejo",
  "show-tunes",
  "singer-songwriter",
  "ska",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
  "swedish",
  "synth-pop",
  "tango",
  "techno",
  "trance",
  "trip-hop",
  "turkish",
  "work-out",
  "world-music",
];
