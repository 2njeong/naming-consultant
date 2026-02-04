import { APIConfig, GenerateNamesParams } from "../types";
import { buildPrompts, parseNamesFromResponse } from "./prompts";

/**
 * Claude API를 통해 이름 후보 생성
 */
export const generateNamesWithClaude = async (
  params: GenerateNamesParams,
  config: APIConfig
): Promise<string[]> => {
  const { systemPrompt, userPrompt } = buildPrompts(params);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 256,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  return parseNamesFromResponse(data.content[0]?.text || "[]");
};
