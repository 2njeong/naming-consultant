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
 * QuickPick용 대상 종류 옵션
 */
export const TARGET_KIND_OPTIONS: TargetKindOption[] = [
  {
    label: "$(symbol-variable) 변수명",
    description: "일반 변수 (camelCase)",
    targetKind: "variable",
  },
  {
    label: "$(symbol-constant) 상수",
    description: "불변 값 (UPPER_SNAKE_CASE)",
    targetKind: "constant",
  },
  {
    label: "$(symbol-method) 함수명",
    description: "함수/메서드 (camelCase)",
    targetKind: "function",
  },
  {
    label: "$(symbol-boolean) Boolean 플래그",
    description: "is/has/can/should 접두사 (camelCase)",
    targetKind: "boolean",
  },
  {
    label: "$(symbol-class) 컴포넌트명",
    description: "React/Vue 컴포넌트 (PascalCase)",
    targetKind: "component",
  },
  {
    label: "$(symbol-field) React 상태명",
    description: "useState [state, setState] (camelCase)",
    targetKind: "state",
  },
  {
    label: "$(symbol-event) 이벤트 핸들러",
    description: "handle/on 접두사 (camelCase)",
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
