import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// 메시지 타입 정의
type Messages = Record<string, string>;

// 캐시된 메시지
let cachedMessages: Messages | null = null;
let cachedLanguage: string | null = null;

/**
 * 현재 설정된 언어 코드 반환
 * - "auto"면 VS Code 시스템 언어 사용
 * - 그 외에는 설정값 사용
 */
const getLanguage = (): string => {
  const config = vscode.workspace.getConfiguration("contextNamingConsultant");
  const language = config.get<string>("language", "auto");

  if (language === "auto") {
    // VS Code 언어에서 기본 언어 코드 추출 (예: "ko" from "ko", "en" from "en-US")
    return vscode.env.language.split("-")[0];
  }

  return language;
};

/**
 * 메시지 파일 로드
 */
const loadMessages = (extensionPath: string): Messages => {
  const language = getLanguage();

  // 캐시 확인
  if (cachedMessages && cachedLanguage === language) {
    return cachedMessages;
  }

  // 언어별 파일 경로 결정
  const nlsFile =
    language === "en"
      ? "package.nls.json"
      : `package.nls.${language}.json`;

  const nlsPath = path.join(extensionPath, nlsFile);
  const fallbackPath = path.join(extensionPath, "package.nls.json");

  let messages: Messages;

  try {
    // 해당 언어 파일 시도
    if (fs.existsSync(nlsPath)) {
      messages = JSON.parse(fs.readFileSync(nlsPath, "utf8"));
    } else {
      // fallback to English
      messages = JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
    }
  } catch {
    // 파일 읽기 실패 시 빈 객체
    messages = {};
  }

  // 캐시 저장
  cachedMessages = messages;
  cachedLanguage = language;

  return messages;
};

// 확장 경로 저장용
let extensionPath: string = "";

/**
 * i18n 초기화 (extension.ts의 activate에서 호출)
 */
export const initI18n = (context: vscode.ExtensionContext): void => {
  extensionPath = context.extensionPath;

  // 설정 변경 시 캐시 초기화
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("contextNamingConsultant.language")) {
      cachedMessages = null;
      cachedLanguage = null;
    }
  });
};

/**
 * 지역화된 메시지 가져오기
 * @param key 메시지 키
 * @param args 치환할 인자들 ({0}, {1} 등)
 */
export const localize = (key: string, ...args: string[]): string => {
  const messages = loadMessages(extensionPath);
  let message = messages[key] || key;

  // {0}, {1} 등의 플레이스홀더 치환
  args.forEach((arg, index) => {
    message = message.replace(`{${index}}`, arg);
  });

  return message;
};
