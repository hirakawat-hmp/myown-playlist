import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotify = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID || "",
  process.env.SPOTIFY_CLIENT_SECRET || ""
);

export async function sample() {
  const items = await spotify.search("The Beatles", ["artist"]);
  return items;
}
