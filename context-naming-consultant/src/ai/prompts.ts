import { TARGET_KIND_CASE } from "../constants";
import { GenerateNamesParams } from "../types";

/**
 * 공통 프롬프트 생성
 */
export const buildPrompts = (
  params: GenerateNamesParams
): { systemPrompt: string; userPrompt: string } => {
  const {
    selectedText,
    contextBefore,
    contextAfter,
    targetKind,
    namingRulesMarkdown,
  } = params;
  const preferredCase = TARGET_KIND_CASE[targetKind];

  const systemPrompt = `You are a naming consultant for code. Generate exactly 7 name suggestions.
Rules:
- Target: ${targetKind}
- Case style: ${preferredCase}
- Return ONLY a JSON array of 7 strings, nothing else
${namingRulesMarkdown ? `\nTeam naming rules:\n${namingRulesMarkdown}` : ""}`;

  const userPrompt = `Generate 7 ${targetKind} names for the following code:

Context before:
\`\`\`
${contextBefore}
\`\`\`

Selected code (name this):
\`\`\`
${selectedText}
\`\`\`

Context after:
\`\`\`
${contextAfter}
\`\`\`

Return ONLY a JSON array like: ["name1", "name2", "name3", "name4", "name5", "name6", "name7"]`;

  return { systemPrompt, userPrompt };
};

/**
 * 응답에서 JSON 배열 추출
 */
export const parseNamesFromResponse = (text: string): string[] => {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    const names = JSON.parse(jsonMatch[0]) as string[];
    return names.slice(0, 7);
  }
  return [];
};
