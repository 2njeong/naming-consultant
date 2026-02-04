import { APIConfig, GenerateNamesParams } from "../types";
import { buildPrompts, parseNamesFromResponse } from "./prompts";

/**
 * Gemini API를 통해 이름 후보 생성
 */
export const generateNamesWithGemini = async (
  params: GenerateNamesParams,
  config: APIConfig
): Promise<string[]> => {
  const { systemPrompt, userPrompt } = buildPrompts(params);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 256,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  return parseNamesFromResponse(
    data.candidates[0]?.content?.parts[0]?.text || "[]"
  );
};
