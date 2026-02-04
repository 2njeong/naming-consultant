import { getAPIConfig } from "../config";
import { GenerateNamesParams } from "../types";
import { generateNamesWithAzureOpenAI } from "./azure-openai";
import { generateNamesWithClaude } from "./claude";
import { generateNamesWithGemini } from "./gemini";
import { generateNamesWithOpenAI } from "./openai";

/**
 * 설정된 Provider에 따라 적절한 AI 함수 호출
 */
export const generateNamesWithAI = async (
  params: GenerateNamesParams
): Promise<string[]> => {
  const config = await getAPIConfig();

  if (!config.apiKey) {
    throw new Error(
      "API Key가 설정되지 않았습니다. 'Context Naming: Set API Key' 명령어를 실행하거나 환경변수를 설정하세요."
    );
  }

  switch (config.provider) {
    case "claude":
      return generateNamesWithClaude(params, config);
    case "openai":
      return generateNamesWithOpenAI(params, config);
    case "gemini":
      return generateNamesWithGemini(params, config);
    case "azure-openai":
      return generateNamesWithAzureOpenAI(params, config);
    default:
      throw new Error(`지원하지 않는 AI Provider: ${config.provider}`);
  }
};
