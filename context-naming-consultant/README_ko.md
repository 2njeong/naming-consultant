# Context Naming Consultant

[English](https://github.com/2njeong/naming-consultant/blob/main/context-naming-consultant/README.md)

> 네이밍, 고민되시죠? AI한테 맡기세요.

코드를 선택하면 AI가 앞뒤 맥락을 읽고 이름을 추천해줍니다.

![Demo](https://raw.githubusercontent.com/2njeong/naming-consultant/main/context-naming-consultant/images/demo.gif)

## 어떻게 작동하나요?

1. 코드를 **선택**합니다
2. AI가 앞뒤 맥락을 **분석**합니다
3. 추천 중에서 **선택**합니다
4. **끝** - 이름이 자동으로 적용됩니다

**변수**, **상수**, **함수**, **boolean**, **React 컴포넌트**, **useState 훅**, **이벤트 핸들러** 모두 지원합니다.

---

## 빠른 시작

### 1. 설치

**VS Code 마켓플레이스에서:**
1. VS Code 열기
2. `Cmd+Shift+X` (확장)
3. "Context Naming Consultant" 검색
4. Install 클릭

또는 [마켓플레이스 페이지](https://marketplace.visualstudio.com/items?itemName=slowdreamer.context-naming-consultant) 방문

### 2. API Key 설정

`Cmd+Shift+P` → **"Context Naming: Set API Key"** → key 입력. 끝!

### 3. 사용하기

1. 이름 지을 코드를 **선택**
2. `Cmd+Shift+P` → **"Context Naming: Suggest Name"**
3. 대상 타입 **선택** (변수명, 함수명 등)
4. 추천 중에서 이름 **선택**

---

## 🌐 언어 설정

**이 확장은 한국어와 영어를 지원합니다!**

기본적으로 VS Code 언어 설정을 따라갑니다. 바꾸고 싶다면?

`Cmd+,` (Mac) / `Ctrl+,` (Windows) → **"Context Naming Language"** 검색 → 선택:
- `auto` - VS Code 언어 따라가기 (기본값)
- `en` - English
- `ko` - 한국어

또는 `settings.json`에 직접 추가:
```json
{
  "contextNamingConsultant.language": "en"
}
```

---

## 예시

### React useState
```jsx
// 이 라인을 선택:
const [a, setA] = useState(false);

// "React 상태명" 선택, "isModalOpen" 선택
// 결과:
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 변수
```javascript
// 이 라인을 선택:
const data = users.filter(u => u.age > 18);

// "변수명" 선택, "adultUsers" 선택
// 결과:
const adultUsers = users.filter(u => u.age > 18);
```

---

## API Key 설정 방법

세 가지 방법 중 선택하세요. 권장 순서대로 나열했습니다:

### 방법 1: 보안 저장소 (권장)

`Cmd+Shift+P` → **"Context Naming: Set API Key"** → key 입력

**왜 안전한가요?**

key가 OS의 자격 증명 관리자에 저장됩니다:
- **macOS**: 키체인 (Keychain)
- **Windows**: 자격 증명 관리자 (Credential Manager)
- **Linux**: libsecret

key는 **OS에 의해 암호화**되고 **어떤 파일에도 저장되지 않습니다**. git에 커밋되거나 다른 앱이 읽을 위험이 없습니다.

### 방법 2: 환경 변수 (권장)

`~/.zshrc` 또는 `~/.bashrc`에 추가:

```bash
# Provider에 맞게 선택
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_API_KEY="..."
export AZURE_OPENAI_API_KEY="..."
```

추가 후 VS Code를 재시작하세요.

### 방법 3: 설정 (비권장)

`Cmd+,` → "Context Naming" 검색 → `Api Key` 필드에 입력

**주의**: key가 `settings.json`에 **평문으로** 저장됩니다:
- 실수로 git에 커밋될 수 있음
- 다른 프로그램이 읽을 수 있음
- 클라우드에 동기화될 수 있음

다른 방법이 안 될 때만 사용하세요.

### 우선순위

key는 이 순서로 확인됩니다:
1. 환경 변수 (최우선)
2. 보안 저장소
3. 설정

---

## AI Provider

기본값은 OpenAI입니다. 변경하려면: `Cmd+,` → "Context Naming" 검색 → `Provider` 선택

| Provider | 모델 |
|----------|------|
| **OpenAI** | gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-4, gpt-3.5-turbo |
| **Claude** | claude-sonnet-4, claude-3-5-sonnet, claude-3-5-haiku, claude-3-opus |
| **Gemini** | gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash |
| **Azure OpenAI** | 배포한 모델 |

---

## 지원하는 네이밍 타입

| 타입 | 컨벤션 | 예시 |
|------|--------|------|
| 변수명 | camelCase | `userData`, `itemCount` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 함수명 | camelCase | `fetchUserData`, `calculateTotal` |
| Boolean | camelCase | `isLoading`, `hasPermission` |
| 컴포넌트 | PascalCase | `UserProfile`, `NavigationBar` |
| React 상태 | camelCase | `[count, setCount]` |
| 이벤트 핸들러 | camelCase | `handleClick`, `onSubmit` |

---

## 팀 네이밍 규칙 (선택사항)

팀 전체에서 일관된 네이밍을 원하시나요? 프로젝트 루트에 규칙 파일을 추가하세요.

### `.naming.json` - 자동 필터링 규칙

규칙에 맞지 않는 AI 추천은 자동으로 필터링됩니다:

```json
{
  "booleanPrefixes": ["is", "has", "can", "should"],
  "handlerPrefixes": ["handle", "on"],
  "disallowWords": ["data", "info", "tmp", "temp", "foo", "bar"],
  "allowAbbreviations": ["id", "url", "api", "ui", "db"],
  "preferredCase": "camelCase",
  "maxLength": 30
}
```

### `.naming.md` - 자연어 가이드라인

자연어로 규칙을 작성하세요. AI가 알아서 참고할 거에요:

```markdown
# 네이밍 규칙

## 변수
- 의미 있는 이름 사용
- 반복문 인덱스 외에는 한 글자 변수명 금지

## Boolean
- is/has/can/should 접두사 사용
- 예: isLoading, hasPermission

## 이벤트 핸들러
- handle 또는 on 접두사 사용
- 예: handleClick, onSubmit
```

파일 검색 순서: `NAMING_RULES.md` → `.naming.md` → `docs/NAMING_RULES.md`

---

## 전체 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| `language` | `auto` | UI 언어 (`auto`, `en`, `ko`) |
| `provider` | `openai` | AI provider |
| `apiKey` | - | API key (비권장) |
| `openaiModel` | `gpt-4o` | OpenAI 모델 |
| `claudeModel` | `claude-sonnet-4-20250514` | Claude 모델 |
| `geminiModel` | `gemini-2.0-flash` | Gemini 모델 |
| `customModel` | - | 모델명 직접 입력 |
| `contextLines` | `10` | 선택 영역 앞뒤로 수집할 줄 수 |
| `azureEndpoint` | - | Azure 엔드포인트 URL |
| `azureDeploymentName` | - | Azure 배포 이름 |
| `azureApiVersion` | `2024-02-01` | Azure API 버전 |

---

## 명령어

| 명령어 | 설명 |
|--------|------|
| `Context Naming: Suggest Name` | AI 이름 추천 받기 |
| `Context Naming: Set API Key` | key를 안전하게 저장 |
| `Context Naming: Clear API Key` | 저장된 key 삭제 |

---

## 문제 해결

**"API Key가 설정되지 않았습니다"**
→ [API Key 설정 방법](#api-key-설정-방법) 참고

**"선언부를 찾지 못해 클립보드에 복사되었습니다"**
→ `const`, `let`, `var`, `function`, `useState`가 있는 라인에서 코드를 선택하세요

**"AI 호출 실패"**
→ API key와 provider 설정을 확인하세요

---

## 개발

소스에서 빌드하려는 기여자를 위한 안내:

```bash
git clone https://github.com/2njeong/naming-consultant.git
cd context-naming-consultant
npm install          # 의존성 설치
npm run compile      # 한 번 빌드
npm run watch        # 변경 시 자동 빌드
npm run package      # 프로덕션 빌드 (.vsix)
npm run lint         # 린트
```

VS Code에서 `F5`를 눌러 Extension Development Host를 실행해 테스트하세요.

---

## 기여하기

버그 리포트, 기능 제안, PR 환영합니다!

1. 저장소를 Fork
2. feature 브랜치 생성 (`git checkout -b feature/amazing`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Pull Request 열기

---

## 라이선스

MIT
