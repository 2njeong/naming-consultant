import { APIConfig, GenerateNamesParams } from "../types";
import { buildPrompts, parseNamesFromResponse } from "./prompts";

/**
 * Azure OpenAI API를 통해 이름 후보 생성
 */
export const generateNamesWithAzureOpenAI = async (
  params: GenerateNamesParams,
  config: APIConfig
): Promise<string[]> => {
  if (!config.azureEndpoint || !config.azureDeploymentName) {
    throw new Error(
      "Azure OpenAI 설정이 완료되지 않았습니다. endpoint와 deployment name을 확인하세요."
    );
  }

  const { systemPrompt, userPrompt } = buildPrompts(params);
  const url = `${config.azureEndpoint}/openai/deployments/${config.azureDeploymentName}/chat/completions?api-version=${config.azureApiVersion}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      max_tokens: 256,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Azure OpenAI API error: ${response.status} - ${errorText}`
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return parseNamesFromResponse(data.choices[0]?.message?.content || "[]");
};
