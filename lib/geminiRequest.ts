import { fileManager } from "./gemini";
import { model } from "./gemini";
import path from "path";

export async function requestToGemini(imagePath?: string) {
  let filePath = "";
  if (imagePath) {
    filePath = imagePath;
  } else {
    filePath = path.join(process.cwd(), "app", "public", "takeru.jpg");
  }

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "image/jpeg",
    displayName: "Target Image",
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "これがターゲットです。" },
  ]);

  return JSON.parse(result.response.text());
}
