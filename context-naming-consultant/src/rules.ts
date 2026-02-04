import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { DEFAULT_NAMING_RULES } from "./constants";
import { LoadedRules, NamingRules } from "./types";

/**
 * JSON 룰 파일 로드
 */
const loadJsonRules = (workspaceRoot: string): NamingRules => {
  const jsonPath = path.join(workspaceRoot, ".naming.json");
  if (!fs.existsSync(jsonPath)) {
    return DEFAULT_NAMING_RULES;
  }

  try {
    const content = fs.readFileSync(jsonPath, "utf-8");
    const parsed = JSON.parse(content) as Partial<NamingRules>;
    console.log("✅ .naming.json 로드됨:", jsonPath);
    return { ...DEFAULT_NAMING_RULES, ...parsed };
  } catch (error) {
    console.error("❌ .naming.json 파싱 실패:", error);
    return DEFAULT_NAMING_RULES;
  }
};

/**
 * Markdown 룰 파일 로드
 */
const loadMarkdownRules = (workspaceRoot: string): string | null => {
  const mdPaths = [
    path.join(workspaceRoot, "NAMING_RULES.md"),
    path.join(workspaceRoot, ".naming.md"),
    path.join(workspaceRoot, "docs", "NAMING_RULES.md"),
  ];

  for (const mdPath of mdPaths) {
    if (fs.existsSync(mdPath)) {
      try {
        console.log("✅ Markdown 룰 파일 로드됨:", mdPath);
        return fs.readFileSync(mdPath, "utf-8");
      } catch (error) {
        console.error("❌ Markdown 룰 파일 읽기 실패:", error);
      }
    }
  }
  return null;
};

/**
 * 워크스페이스에서 네이밍 룰 파일 로드
 */
export const loadNamingRules = async (): Promise<LoadedRules> => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return { json: DEFAULT_NAMING_RULES, markdown: null };
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  return {
    json: loadJsonRules(workspaceRoot),
    markdown: loadMarkdownRules(workspaceRoot),
  };
};

/**
 * 이름이 룰을 준수하는지 검증
 */
export const validateName = (name: string, rules: NamingRules): boolean => {
  // 1. 최대 길이 체크
  if (rules.maxLength && name.length > rules.maxLength) {
    return false;
  }

  // 2. 금지 단어 체크 (정확히 일치하는 경우만)
  if (rules.disallowWords) {
    const loweredName = name.toLowerCase();
    if (
      rules.disallowWords.some((word) => loweredName === word.toLowerCase())
    ) {
      return false;
    }
  }

  return true;
};

/**
 * 룰에 따라 이름 후보 필터링
 */
export const filterCandidatesByRules = (
  candidates: string[],
  rules: NamingRules
): string[] => {
  return candidates.filter((name) => validateName(name, rules));
};
