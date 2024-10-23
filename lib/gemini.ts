import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { systemPrompt, schema } from "./geminiPrompt";

//
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 画像を送信するためのインスタンス
export const fileManager = new GoogleAIFileManager(
  process.env.GEMINI_API_KEY || ""
);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: systemPrompt,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export async function requestToGemini(imagePath: string) {
  const uploadResponse = await fileManager.uploadFile(imagePath, {
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

// await
// result.responze.text()
