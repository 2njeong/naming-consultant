import * as vscode from "vscode";
import { generateNamesWithAI } from "./ai";
import { clearApiKey, getAPIConfig, globalState, setApiKey } from "./config";
import { getTargetKindOptions } from "./constants";
import { generateDummyNames } from "./dummy";
import { applyNameToDeclaration, getContextAroundSelection } from "./editor";
import { initI18n, localize } from "./i18n";
import { filterCandidatesByRules, loadNamingRules } from "./rules";

// 확장이 활성화될 때 실행되는 함수
export const activate = (context: vscode.ExtensionContext) => {
  console.log('Extension "context-naming-consultant" is now active!');

  // i18n 초기화
  initI18n(context);

  // 전역 상태에 context 저장 (Secret Storage 접근용)
  globalState.context = context;

  // Set API Key 명령어
  const setApiKeyCommand = vscode.commands.registerCommand(
    "context-naming-consultant.setApiKey",
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: localize("apiKey.prompt"),
        password: true,
        placeHolder: localize("apiKey.placeholder"),
      });

      if (apiKey) {
        await setApiKey(apiKey);
        vscode.window.showInformationMessage(localize("apiKey.saved"));
      }
    }
  );

  // Clear API Key 명령어
  const clearApiKeyCommand = vscode.commands.registerCommand(
    "context-naming-consultant.clearApiKey",
    async () => {
      await clearApiKey();
      vscode.window.showInformationMessage(localize("apiKey.cleared"));
    }
  );

  const disposable = vscode.commands.registerCommand(
    "context-naming-consultant.suggestName",
    async () => {
      // 1. 활성 텍스트 에디터 확인 - 텍스트 에디터가 열려있는지
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage(localize("error.noEditor"));
        return;
      }

      // 2. 선택 영역 확인 - 코드가 드래그되어 있는지
      const selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showWarningMessage(localize("error.noSelection"));
        return;
      }

      // 3. 네이밍 대상 종류 선택
      const targetKindSelection = await vscode.window.showQuickPick(
        getTargetKindOptions(),
        {
          placeHolder: localize("targetKind.placeholder"),
          title: localize("targetKind.title"),
        }
      );

      if (!targetKindSelection) {
        return; // 사용자가 취소함
      }

      const targetKind = targetKindSelection.targetKind;

      // 4. 네이밍 룰 로드 및 설정 가져오기
      const rules = await loadNamingRules();
      const { apiKey, contextLines } = await getAPIConfig();

      // 5. 선택된 텍스트와 앞뒤 맥락 가져오기
      const editorContext = getContextAroundSelection(
        editor,
        selection,
        contextLines
      );
      const selectedText = editorContext.selected;

      // 디버깅용 로그
      console.log("=== Context Naming: 수집된 맥락 ===");
      console.log("대상 종류:", targetKind);
      console.log("JSON 룰:", rules.json);
      console.log("Markdown 룰:", rules.markdown ? "로드됨" : "없음");

      // 6. AI로 이름 후보 생성 (API Key 없으면 더미 사용)
      const rawCandidates = apiKey
        ? await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: localize("progress.generating"),
              cancellable: false,
            },
            async () => {
              try {
                return await generateNamesWithAI({
                  selectedText,
                  contextBefore: editorContext.before,
                  contextAfter: editorContext.after,
                  targetKind,
                  namingRulesMarkdown: rules.markdown,
                });
              } catch (error) {
                vscode.window.showErrorMessage(
                  localize("error.aiCallFailed", String(error))
                );
                return generateDummyNames(selectedText, targetKind);
              }
            }
          )
        : generateDummyNames(selectedText, targetKind);

      const nameCandidates = filterCandidatesByRules(rawCandidates, rules.json);

      // 7. QuickPick으로 후보 표시
      const selected = await vscode.window.showQuickPick(nameCandidates, {
        placeHolder: localize("nameSelection.placeholder"),
        title: localize("nameSelection.title"),
      });

      // 8. 선택 결과 처리 - 선언부 변수명 교체/삽입
      if (selected) {
        const success = await applyNameToDeclaration(
          editor,
          selection,
          selected,
          targetKind
        );
        if (success) {
          vscode.window.showInformationMessage(
            localize("success.applied", selected)
          );
        } else {
          // 선언부를 찾지 못한 경우 클립보드에 복사 (fallback)
          await vscode.env.clipboard.writeText(selected);
          vscode.window.showInformationMessage(
            localize("success.copiedToClipboard", selected)
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable, setApiKeyCommand, clearApiKeyCommand);
};

// 확장이 비활성화될 때 실행되는 함수
export const deactivate = () => {};
