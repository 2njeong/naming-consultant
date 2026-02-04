import * as vscode from "vscode";
import { PROVIDER_ENV_VARS, SECRET_STORAGE_KEY } from "./constants";
import { AIProvider, APIConfig } from "./types";

/**
 * 전역 상태 (ExtensionContext 접근용)
 */
export const globalState: { context: vscode.ExtensionContext | null } = {
  context: null,
};

/**
 * API Key 조회 (우선순위: 환경변수 > Secret Storage > 설정)
 */
export const getApiKey = async (provider: AIProvider): Promise<string> => {
  // 1. 환경변수 확인
  const envVar = PROVIDER_ENV_VARS[provider];
  const envApiKey = process.env[envVar];
  if (envApiKey) {
    return envApiKey;
  }

  // 2. Secret Storage 확인
  if (globalState.context) {
    const secretApiKey =
      await globalState.context.secrets.get(SECRET_STORAGE_KEY);
    if (secretApiKey) {
      return secretApiKey;
    }
  }

  // 3. 설정 파일 확인 (fallback)
  const config = vscode.workspace.getConfiguration("contextNamingConsultant");
  return config.get<string>("apiKey") || "";
};

/**
 * API Key 저장 (Secret Storage)
 */
export const setApiKey = async (apiKey: string): Promise<void> => {
  if (!globalState.context) {
    throw new Error("Extension context not initialized");
  }
  await globalState.context.secrets.store(SECRET_STORAGE_KEY, apiKey);
};

/**
 * API Key 삭제 (Secret Storage)
 */
export const clearApiKey = async (): Promise<void> => {
  if (!globalState.context) {
    throw new Error("Extension context not initialized");
  }
  await globalState.context.secrets.delete(SECRET_STORAGE_KEY);
};

/**
 * VS Code 설정에서 API 설정 로드
 */
export const getAPIConfig = async (): Promise<APIConfig> => {
  const config = vscode.workspace.getConfiguration("contextNamingConsultant");
  const provider = (config.get<string>("provider") || "openai") as AIProvider;
  const customModel = config.get<string>("customModel") || "";

  // customModel이 있으면 우선 사용, 없으면 provider별 모델 사용
  const getModelForProvider = (): string => {
    if (customModel) {
      return customModel;
    }
    switch (provider) {
      case "claude":
        return config.get<string>("claudeModel") || "claude-sonnet-4-20250514";
      case "openai":
        return config.get<string>("openaiModel") || "gpt-4o";
      case "gemini":
        return config.get<string>("geminiModel") || "gemini-2.0-flash";
      case "azure-openai":
        return config.get<string>("azureDeploymentName") || "";
      default:
        return "";
    }
  };

  const apiKey = await getApiKey(provider);

  return {
    provider,
    apiKey,
    model: getModelForProvider(),
    contextLines: config.get<number>("contextLines") ?? 10,
    azureEndpoint: config.get<string>("azureEndpoint") || "",
    azureDeploymentName: config.get<string>("azureDeploymentName") || "",
    azureApiVersion: config.get<string>("azureApiVersion") || "2024-02-01",
  };
};
