import { localize } from "./i18n";
import { AIProvider, NamingRules, TargetKind, TargetKindOption } from "./types";

/**
 * 대상 종류별 선호 케이스
 */
export const TARGET_KIND_CASE: Record<
  TargetKind,
  "camelCase" | "PascalCase" | "UPPER_SNAKE_CASE"
> = {
  variable: "camelCase",
  function: "camelCase",
  boolean: "camelCase",
  handler: "camelCase",
  component: "PascalCase",
  constant: "UPPER_SNAKE_CASE",
  state: "camelCase",
};

/**
 * 기본 네이밍 룰
 */
export const DEFAULT_NAMING_RULES: NamingRules = {
  booleanPrefixes: ["is", "has", "can", "should"],
  handlerPrefixes: ["handle", "on"],
  disallowWords: ["data", "info", "tmp", "temp", "foo", "bar"],
  allowAbbreviations: ["id", "url", "api", "ui", "db"],
  preferredCase: "camelCase",
  maxLength: 30,
};

/**
 * Provider별 환경변수 이름 매핑
 */
export const PROVIDER_ENV_VARS: Record<AIProvider, string> = {
  claude: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GOOGLE_API_KEY",
  "azure-openai": "AZURE_OPENAI_API_KEY",
};

/**
 * Secret Storage 키
 */
export const SECRET_STORAGE_KEY = "contextNamingConsultant.apiKey";

/**
 * QuickPick용 대상 종류 옵션 (i18n 적용)
 */
export const getTargetKindOptions = (): TargetKindOption[] => [
  {
    label: localize("targetKind.variable.label"),
    description: localize("targetKind.variable.description"),
    targetKind: "variable",
  },
  {
    label: localize("targetKind.constant.label"),
    description: localize("targetKind.constant.description"),
    targetKind: "constant",
  },
  {
    label: localize("targetKind.function.label"),
    description: localize("targetKind.function.description"),
    targetKind: "function",
  },
  {
    label: localize("targetKind.boolean.label"),
    description: localize("targetKind.boolean.description"),
    targetKind: "boolean",
  },
  {
    label: localize("targetKind.component.label"),
    description: localize("targetKind.component.description"),
    targetKind: "component",
  },
  {
    label: localize("targetKind.state.label"),
    description: localize("targetKind.state.description"),
    targetKind: "state",
  },
  {
    label: localize("targetKind.handler.label"),
    description: localize("targetKind.handler.description"),
    targetKind: "handler",
  },
];

/**
 * camelCase를 UPPER_SNAKE_CASE로 변환
 */
export const toUpperSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toUpperCase();
};
