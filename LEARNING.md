# React 학습 기록

Vite + React + TypeScript 프로젝트로 React 핵심 개념을 단계별로 학습한 기록. 각 단계마다 배운 개념과 실습 내용을 정리한다.

## 진행 상황

| # | 단계 | 상태 |
|---|------|------|
| 1 | JSX & 함수 컴포넌트 | ✅ 완료 |
| 2 | Props로 데이터 전달 | ⬜ 예정 |
| 3 | State (`useState`) | ⬜ 예정 |
| 4 | 이벤트 핸들링 | ⬜ 예정 |
| 5 | 조건부 렌더링 & 리스트 렌더링 | ⬜ 예정 |
| 6 | `useEffect`와 부수효과 | ⬜ 예정 |
| 7 | Form 다루기 | ⬜ 예정 |
| 8 | 컴포넌트 합성 & 커스텀 훅 | ⬜ 예정 |

---

## 1단계: JSX & 함수 컴포넌트

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) 함수 컴포넌트란?**
컴포넌트는 그냥 **JSX를 반환하는 함수**. 특별한 문법이 아니라 평범한 JS/TS 함수다.

```tsx
function Profile() {
  return <div>안녕하세요</div>;
}
```

- 함수 이름은 반드시 **대문자로 시작** (`Profile` O / `profile` X). React가 `<Profile />`을 만나면 대문자니까 사용자 컴포넌트로, `<div>`처럼 소문자면 HTML 태그로 해석한다. 소문자로 쓰면 브라우저 태그로 오인해서 제대로 안 나온다.
- `export default Profile;`로 내보내야 다른 파일에서 `import Profile from './components/Profile'`로 가져다 쓸 수 있다.

**2) JSX는 사실 함수 호출이다**

```tsx
<div className="box">hello</div>
```
컴파일되면 실제로 이렇게 바뀐다.
```js
React.createElement('div', { className: 'box' }, 'hello')
```
태그처럼 생겼지만 **함수 호출**이라는 걸 기억하면 아래 규칙들이 자연스럽게 이해된다.

**3) 핵심 문법 규칙**

① 최상위 요소는 하나만 반환 (함수는 값을 하나만 return할 수 있으므로)
```tsx
// ❌ 에러 - 두 개를 동시에 반환할 수 없음
return (
  <div>A</div>
  <div>B</div>
);

// ✅ 하나로 감싸기
return (
  <div>
    <div>A</div>
    <div>B</div>
  </div>
);

// ✅ 껍데기 div가 필요 없으면 Fragment (DOM에 흔적 안 남김)
return (
  <>
    <div>A</div>
    <div>B</div>
  </>
);
```

② `class` 대신 `className` — `class`는 JS 예약어라서 못 쓴다.
```tsx
<div className="profileDetail">...</div>
```

③ 속성은 camelCase — HTML의 `onclick`, `tabindex` → JSX의 `onClick`, `tabIndex`.

④ 모든 태그는 self-close 필수 — JSX는 XML 기반이라 HTML과 달리 안 닫으면 에러.
```tsx
<img src="..." />   // ✅
<img src="...">      // ❌ 에러
```

⑤ `{}` 안에는 "표현식"만, "문장"은 안 됨 — `{}`도 결국 `createElement`의 인자 자리로 컴파일되기 때문에 값으로 평가되는 것만 들어갈 수 있다.
```tsx
const name = "임씨";

<div>{name}</div>               // ✅ 변수
<div>{1 + 1}</div>              // ✅ 연산 결과
<div>{name.toUpperCase()}</div> // ✅ 함수 호출 결과
<div>{ if (true) {...} }</div>  // ❌ if는 값이 아니라 문장(statement)
```
그래서 조건부 렌더링은 `if` 대신 **삼항 연산자**나 **`&&`**를 쓴다.
```tsx
<div>{isLoggedIn ? "환영합니다" : "로그인하세요"}</div>
<div>{hasError && "에러 발생!"}</div>
```
리스트는 `for` 대신 배열의 **`.map()`**을 쓰고, 각 항목에 고유한 `key` prop을 붙인다 (자세한 이유는 리스트 렌더링 단계에서 다시 다룰 예정).
```tsx
const skills = ["node", "react", "typescript"];

<ul>
  {skills.map((skill) => (
    <li key={skill}>{skill}</li>
  ))}
</ul>
```
`<li>`는 반드시 `<ul>`/`<ol>` 같은 리스트 컨테이너 안에 있어야 한다 — 없어도 브라우저가 렌더링은 해주지만(에러 없음) 시맨틱상 잘못된 마크업.

⑥ 인라인 스타일은 CSS 문자열이 아니라 JS 객체로, 속성명도 camelCase.
```tsx
<div style={{ margin: 0, padding: 0, backgroundColor: 'red' }}>...</div>
```
바깥 `{}`는 "여기 JS 표현식 들어감"이라는 뜻이고, 안쪽 `{ margin: 0, ... }`이 실제 JS 객체 리터럴이라 중괄호가 두 번 겹친다.

**실습 내용:** 정적인(하드코딩된) 이름/한줄소개/기술스택 목록을 렌더링하는 `Profile` 함수 컴포넌트 작성. 기술스택은 배열 + `.map()`으로 `<ul><li>` 리스트를 그림.

**메모:** 인라인 스타일 객체를 컴포넌트 함수 몸통 안에서 정의하면 리렌더링마다 새로 생성됨 — 3단계(State)에서 실제 리렌더링을 다루며 다시 짚어볼 주제.

**흔한 실수 (직접 겪음):** 함수 몸통에서 JSX를 변수/표현식으로만 써두고 `return`을 빠뜨리면, JS는 조용히 `undefined`를 반환한다. TypeScript + JSX 조합에서는 이게 `Type 'void' is not assignable to type 'ReactNode'` 같은 컴파일 에러로 바로 잡힌다 — 순수 JS였다면 빈 화면만 보고 원인 찾기 어려웠을 상황.

---

## 2단계: Props로 데이터 전달

**배운 개념:**
- Props는 부모 → 자식으로 데이터를 전달하는 단방향 통로. 컴포넌트는 사실 "props 객체 하나를 인자로 받는 함수"와 같음 (`<Profile name="임씨" />` → `Profile({ name: "임씨" })`).
- TypeScript에서는 `interface`로 props 타입을 정의하고 함수 파라미터에서 구조분해 할당으로 꺼내 쓰는 패턴이 일반적.
- Props는 읽기 전용(read-only) — 자식이 직접 수정할 수 없음. 값이 바뀌어야 한다면 State 영역.

**실습 내용:** (진행 중 — `Profile`이 `name`, `bio`를 하드코딩 대신 props로 받도록 리팩터링 예정)
