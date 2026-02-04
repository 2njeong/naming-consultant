import * as vscode from "vscode";

/**
 * 네이밍 대상 종류 정의
 */
export type TargetKind =
  | "variable"
  | "function"
  | "boolean"
  | "handler"
  | "component"
  | "constant"
  | "state";

/**
 * 네이밍 룰 인터페이스 (JSON 파일용)
 */
export interface NamingRules {
  booleanPrefixes?: string[];
  handlerPrefixes?: string[];
  disallowWords?: string[];
  allowAbbreviations?: string[];
  preferredCase?: "camelCase" | "PascalCase" | "snake_case";
  maxLength?: number;
}

/**
 * 로드된 룰 (JSON + Markdown)
 */
export interface LoadedRules {
  json: NamingRules;
  markdown: string | null;
}

/**
 * AI Provider 타입
 */
export type AIProvider = "claude" | "openai" | "gemini" | "azure-openai";

/**
 * API 설정 인터페이스
 */
export interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  contextLines: number;
  azureEndpoint?: string;
  azureDeploymentName?: string;
  azureApiVersion?: string;
}

/**
 * AI 이름 생성 파라미터
 */
export interface GenerateNamesParams {
  selectedText: string;
  contextBefore: string;
  contextAfter: string;
  targetKind: TargetKind;
  namingRulesMarkdown: string | null;
}

/**
 * QuickPick용 대상 종류 옵션
 */
export interface TargetKindOption extends vscode.QuickPickItem {
  targetKind: TargetKind;
}
