# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Context Naming Consultant는 코드 맥락 기반으로 AI가 변수/함수 이름을 추천하는 VS Code 확장입니다. 사용자가 코드를 드래그로 선택하고 명령을 실행하면 QuickPick UI로 이름 후보를 표시합니다.

확장 소스는 `context-naming-consultant/` 하위 디렉토리에 있습니다.

## 개발 명령어

모든 명령어는 `context-naming-consultant/` 디렉토리에서 실행:

```bash
# 의존성 설치
npm install

# 개발용 컴파일
npm run compile

# 워치 모드 (변경 시 자동 재컴파일)
npm run watch

# 린트
npm run lint

# 테스트 실행
npm run test

# 프로덕션 패키징 (.vsix 생성)
npm run package
```

## VS Code에서 테스트

1. VS Code에서 `context-naming-consultant/` 폴더 열기
2. F5로 Extension Development Host 실행
3. 새 VS Code 창에서 코드 선택 후 "Hello World" 명령 실행 (Cmd+Shift+P)

## 아키텍처

### 핵심 파일

- `src/extension.ts` - 메인 확장 로직 (~150줄)
  - `activate()` - 명령 핸들러 등록
  - `applyNameToDeclaration()` - `const/let/var` 선언부의 변수명 교체
  - `generateDummyNames()` - AI 연동 전 임시 더미 이름 생성 함수

### 빌드 시스템

- Webpack이 TypeScript를 `dist/extension.js`로 번들링
- 진입점: `src/extension.ts`
- 타겟: Node.js (VS Code 확장 런타임)

### 설계 원칙 (로드맵 기준)

확장은 **특정 벤더에 종속되지 않는 범용 도구**를 목표로 함:
- **AI Provider Layer** - OpenAI, Azure OpenAI, 사내 서버 등 교체 가능한 추상화
- **Naming Rules** - `.naming.json` 외부 설정으로 팀별 네이밍 규칙 정의

## 현재 구현 상태

완료:
- STEP 1-3: VS Code 확장 뼈대, 선택 영역 기반 실행, QuickPick UI

진행 예정:
- STEP 4: 네이밍 대상 종류 선택 UI (변수명/함수명/boolean/핸들러)
- STEP 5: `.naming.json` 룰 파일 로드
- STEP 6: AI Provider 연동

## 사용된 VS Code API 패턴

- `vscode.window.activeTextEditor` - 현재 에디터 가져오기
- `editor.selection.isEmpty` - 텍스트 선택 여부 확인
- `editor.document.getText(selection)` - 선택된 텍스트 추출
- `vscode.window.showQuickPick()` - 선택 목록 UI 표시
- `editor.edit()` + `editBuilder.replace()` - 문서 내용 수정

## 엔진 호환성

`engines.vscode: ^1.85.0` - Cursor IDE 호환을 위해 낮춤 (Cursor는 VS Code 1.105.x 기반).
