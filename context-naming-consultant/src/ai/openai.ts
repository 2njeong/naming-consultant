import { APIConfig, GenerateNamesParams } from "../types";
import { buildPrompts, parseNamesFromResponse } from "./prompts";

/**
 * OpenAI API를 통해 이름 후보 생성
 */
export const generateNamesWithOpenAI = async (
  params: GenerateNamesParams,
  config: APIConfig
): Promise<string[]> => {
  const { systemPrompt, userPrompt } = buildPrompts(params);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 256,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return parseNamesFromResponse(data.choices[0]?.message?.content || "[]");
};
