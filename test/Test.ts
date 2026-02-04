/**
 * Context Naming Consultant - 테스트용 예시 파일
 *
 * 아래 코드들을 선택하고 "Context Naming: Suggest Name" 명령을 실행해보세요.
 * 각 주석에 맞는 네이밍 타입을 선택하면 AI가 적절한 이름을 추천해줍니다.
 */

import { useState } from "react";

// ============================================
// 1. 변수명 (Variable)
// ============================================

// 이 라인을 선택하고 "변수명" 선택
const a = users.filter((user) => user.age >= 18);

// 이 라인을 선택하고 "변수명" 선택
const b = products.reduce((sum, p) => sum + p.price, 0);

// 이 라인을 선택하고 "변수명" 선택
const c = new Date().getFullYear() - birthYear;

// ============================================
// 2. 상수 (Constant)
// ============================================

// 이 라인을 선택하고 "상수" 선택
const d = 3;

// 이 라인을 선택하고 "상수" 선택
const e = "https://api.example.com/v1";

// 이 라인을 선택하고 "상수" 선택
const f = 1000 * 60 * 5;

// ============================================
// 3. 함수명 (Function)
// ============================================

// 이 라인을 선택하고 "함수명" 선택
function g(userId: string) {
  return fetch(`/api/users/${userId}`).then((res) => res.json());
}

// 이 라인을 선택하고 "함수명" 선택
const h = (items: number[]) => {
  return items.reduce((a, b) => a + b, 0) / items.length;
};

// 이 라인을 선택하고 "함수명" 선택
async function i(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// ============================================
// 4. Boolean 플래그 (Boolean)
// ============================================

// 이 라인을 선택하고 "Boolean 플래그" 선택
const j = user.role === "admin";

// 이 라인을 선택하고 "Boolean 플래그" 선택
const k = items.length > 0;

// 이 라인을 선택하고 "Boolean 플래그" 선택
const l = user.permissions.includes("edit");

// ============================================
// 5. 컴포넌트명 (Component)
// ============================================

// 이 라인을 선택하고 "컴포넌트명" 선택
const M = ({ user }: { user: User }) => {
  return (
    <div>
      <img src={user.avatar} />
      <span>{user.name}</span>
    </div>
  );
};

// 이 라인을 선택하고 "컴포넌트명" 선택
const N = ({ items }: { items: Product[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// ============================================
// 6. React 상태명 (React State)
// ============================================

// 이 라인을 선택하고 "React 상태명" 선택
const [o, setO] = useState(false);

// 이 라인을 선택하고 "React 상태명" 선택
const [p, setP] = useState<User | null>(null);

// 이 라인을 선택하고 "React 상태명" 선택
const [q, setQ] = useState<string[]>([]);

// ============================================
// 7. 이벤트 핸들러 (Event Handler)
// ============================================

// 이 라인을 선택하고 "이벤트 핸들러" 선택
const r = () => {
  setIsOpen(false);
};

// 이 라인을 선택하고 "이벤트 핸들러" 선택
const s = (e: React.FormEvent) => {
  e.preventDefault();
  submitForm(formData);
};

// 이 라인을 선택하고 "이벤트 핸들러" 선택
const t = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};
