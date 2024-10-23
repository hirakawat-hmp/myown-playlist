import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { spotifyClient } from "@/lib/spotifyClient";
import { TrackInfo } from "@/interfaces/spotify";
import * as fs from "fs/promises";

export async function createQrCode(
  userID: string,
  tracks: TrackInfo[],
  imagePath: string | null
): Promise<string> {
  // Step 1: Create a new playlist
  const playlist = await spotifyClient.playlists.createPlaylist(userID, {
    name: uuidv4(),
    public: true,
    description:
      "Generated by Tomoya Hirakawa / Powered by Spotify API and Gemini.",
  });

  // Step 2: Add tracks to the playlist
  const trackUris = tracks.map((track) => `spotify:track:${track.id}`);
  await spotifyClient.playlists.addItemsToPlaylist(playlist.id, trackUris);

  // Step 3: Set playlist image (if provided)
  if (imagePath) {
    try {
      const imageData = await fs.readFile(imagePath);
      const base64Image = imageData.toString("base64");
      await spotifyClient.playlists.addCustomPlaylistCoverImageFromBase64String(
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

  // Step 5: Generate QR code as URL
  const qrCodeDataUrl = await QRCode.toDataURL(playlistUrl);

  return qrCodeDataUrl;
}