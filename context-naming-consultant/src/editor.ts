import * as vscode from "vscode";

/**
 * 선택 영역이 포함된 라인에서 변수/함수 선언부를 찾아 이름을 적용
 */
export const applyNameToDeclaration = async (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  newName: string,
  targetKind?: string
): Promise<boolean> => {
  const document = editor.document;
  const line = document.lineAt(selection.start.line);
  const lineText = line.text;

  // 0. useState 패턴 시도 (state 타입일 때)
  // const [stateName, setStateName] = useState(...)
  if (targetKind === "state") {
    const useStatePattern =
      /^(\s*const\s+\[)(\w*)(\s*,\s*)(set\w*)?(\s*\]\s*=\s*useState)/;
    const useStateMatch = lineText.match(useStatePattern);

    if (useStateMatch) {
      const [, prefix, , comma, , suffix] = useStateMatch;
      const setterName = "set" + newName.charAt(0).toUpperCase() + newName.slice(1);
      const newDestructuring = `${prefix}${newName}${comma}${setterName}${suffix}`;

      const patternStartIndex = useStateMatch.index ?? 0;
      const patternEndIndex = patternStartIndex + useStateMatch[0].length;

      const range = new vscode.Range(
        new vscode.Position(line.lineNumber, patternStartIndex),
        new vscode.Position(line.lineNumber, patternEndIndex)
      );

      return await editor.edit((editBuilder) => {
        editBuilder.replace(range, newDestructuring);
      });
    }
  }

  // 1. const/let/var 선언 패턴 시도
  // 그룹1: const/let/var, 그룹2: 변수명(있을 수도 없을 수도), 그룹3: = 이후
  const varPattern = /^(\s*(?:const|let|var)\s+)(\w*)(\s*=)/;
  const varMatch = lineText.match(varPattern);

  if (varMatch) {
    const [, prefix, existingName] = varMatch;
    const nameStartIndex = prefix.length;
    const nameEndIndex = nameStartIndex + existingName.length;

    const nameRange = new vscode.Range(
      new vscode.Position(line.lineNumber, nameStartIndex),
      new vscode.Position(line.lineNumber, nameEndIndex)
    );

    return await editor.edit((editBuilder) => {
      editBuilder.replace(nameRange, newName);
    });
  }

  // 2. function 선언 패턴 시도
  // 그룹1: function 키워드, 그룹2: 함수명(있을 수도 없을 수도), 그룹3: 괄호
  const funcPattern =
    /^(\s*(?:export\s+)?(?:async\s+)?function\s+)(\w*)(\s*\()/;
  const funcMatch = lineText.match(funcPattern);

  if (funcMatch) {
    const [, prefix, existingName] = funcMatch;
    const nameStartIndex = prefix.length;
    const nameEndIndex = nameStartIndex + existingName.length;

    const nameRange = new vscode.Range(
      new vscode.Position(line.lineNumber, nameStartIndex),
      new vscode.Position(line.lineNumber, nameEndIndex)
    );

    return await editor.edit((editBuilder) => {
      editBuilder.replace(nameRange, newName);
    });
  }

  return false; // 선언부가 아님
};

/**
 * 선택 영역 앞뒤로 N줄의 맥락을 수집
 * AI에게 더 풍부한 맥락을 제공하기 위해 사용
 */
export const getContextAroundSelection = (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  contextLines: number = 10
): { before: string; selected: string; after: string } => {
  const document = editor.document;
  const startLine = selection.start.line;
  const endLine = selection.end.line;

  // 앞쪽 맥락 (선택 영역 이전 N줄)
  const beforeStartLine = Math.max(0, startLine - contextLines);
  const beforeRange = new vscode.Range(
    new vscode.Position(beforeStartLine, 0),
    new vscode.Position(startLine, 0)
  );
  const beforeText = document.getText(beforeRange);

  // 선택된 텍스트
  const selectedText = document.getText(selection);

  // 뒤쪽 맥락 (선택 영역 이후 N줄)
  const afterEndLine = Math.min(document.lineCount - 1, endLine + contextLines);
  const afterRange = new vscode.Range(
    new vscode.Position(endLine, document.lineAt(endLine).range.end.character),
    new vscode.Position(
      afterEndLine,
      document.lineAt(afterEndLine).range.end.character
    )
  );
  const afterText = document.getText(afterRange);

  return {
    before: beforeText,
    selected: selectedText,
    after: afterText,
  };
};
