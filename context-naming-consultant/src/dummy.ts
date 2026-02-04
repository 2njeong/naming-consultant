import { toUpperSnakeCase } from "./constants";
import { TargetKind } from "./types";

/**
 * 더미 이름 후보 생성 함수
 * TODO: 나중에 AI API 호출로 교체
 */
export const generateDummyNames = (
  selectedText: string,
  targetKind: TargetKind
): string[] => {
  // 선택된 텍스트에서 키워드 추출 (간단한 버전)
  const words = selectedText
    .replace(/[^a-zA-Z가-힣\s]/g, " ") // 특수문자 제거
    .split(/\s+/) // 공백으로 분리
    .filter((word) => word.length > 2) // 2글자 이상만
    .slice(0, 3); // 최대 3개

  const candidates: string[] = [];
  const baseWord =
    words.length > 0
      ? words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()
      : "Data";

  // 대상 종류에 따라 다른 접두사/접미사 사용
  switch (targetKind) {
    case "variable":
      candidates.push(
        `${baseWord.toLowerCase()}Value`,
        `${baseWord.toLowerCase()}Data`,
        `${baseWord.toLowerCase()}Result`,
        `${baseWord.toLowerCase()}Item`,
        `current${baseWord}`,
        `new${baseWord}`,
        `${baseWord.toLowerCase()}Info`
      );
      break;

    case "function":
      candidates.push(
        `get${baseWord}`,
        `set${baseWord}`,
        `create${baseWord}`,
        `update${baseWord}`,
        `fetch${baseWord}`,
        `process${baseWord}`,
        `calculate${baseWord}`
      );
      break;

    case "boolean":
      candidates.push(
        `is${baseWord}`,
        `has${baseWord}`,
        `can${baseWord}`,
        `should${baseWord}`,
        `is${baseWord}Valid`,
        `is${baseWord}Active`,
        `is${baseWord}Enabled`
      );
      break;

    case "handler":
      candidates.push(
        `handle${baseWord}`,
        `on${baseWord}Click`,
        `on${baseWord}Change`,
        `on${baseWord}Submit`,
        `handle${baseWord}Event`,
        `on${baseWord}Select`,
        `handle${baseWord}Action`
      );
      break;

    case "component":
      candidates.push(
        `${baseWord}Component`,
        `${baseWord}Container`,
        `${baseWord}View`,
        `${baseWord}Page`,
        `${baseWord}Section`,
        `${baseWord}Card`,
        `${baseWord}List`
      );
      break;

    case "constant":
      // 더미: AI 연동 시 맥락 기반으로 더 다양한 이름 추천 예정
      candidates.push(
        toUpperSnakeCase(`${baseWord}Value`),
        toUpperSnakeCase(`default${baseWord}`),
        toUpperSnakeCase(`max${baseWord}`)
      );
      break;
  }

  // 중복 제거 후 최대 7개 반환
  return [...new Set(candidates)].slice(0, 7);
};
