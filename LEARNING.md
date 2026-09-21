# React 학습 기록

Vite + React + TypeScript 프로젝트로 React 핵심 개념을 단계별로 학습한 기록. 각 단계마다 배운 개념과 실습 내용을 정리한다.

## 진행 상황

| # | 단계 | 상태 |
|---|------|------|
| 1 | JSX & 함수 컴포넌트 | ✅ 완료 |
| 2 | Props로 데이터 전달 | ✅ 완료 |
| 3 | State (`useState`) | ✅ 완료 |
| 4 | 이벤트 핸들링 | ✅ 완료 |
| 5 | 조건부 렌더링 & 리스트 렌더링 | ✅ 완료 |
| 6 | `useEffect`와 부수효과 | ✅ 완료 |
| 7 | Form 다루기 | ✅ 완료 |
| 8 | 컴포넌트 합성 & 커스텀 훅 | ✅ 완료 |
| 9 | Todo List — 배열 중간 항목의 불변적 토글/삭제 | ✅ 완료 |
| 9-1 | Todo List 확장 ① — 파생 값(남은 개수 표시) | ✅ 완료 |
| 9-2 | Todo List 확장 ② — 완료 항목 필터링 | ✅ 완료 |
| 9-3 | Todo List 확장 ③ — `localStorage` 저장/복원 | ✅ 완료 |
| 9-4 | Todo List 확장 ④ — 컴포넌트 분리(`TodoItem`) | ✅ 완료 |
| 10 | challenge-api 연동 ① — 인증 상태 관리 (Context API) | ✅ 완료 |
| 11 | challenge-api 연동 ② — 회원가입/로그인 폼 (첫 실제 API 연동) | ✅ 완료 |
| 12 | challenge-api 연동 ③ — 응답 envelope 언래핑 | ✅ 완료 |

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

**1) Props = 함수의 매개변수**
`<Profile name="임씨" />`라고 쓰면 내부적으로는 `Profile({ name: "임씨" })`가 호출되는 것과 같다. JSX 속성들이 하나의 객체로 묶여서 함수의 첫 번째 인자로 들어간다. 데이터는 항상 **부모 → 자식**으로만 흐르고(단방향), 자식은 props를 직접 수정할 수 없다(읽기 전용) — 값이 바뀌어야 한다면 그건 State 영역.

**2) 부모/자식 관계, 그리고 인터페이스는 누가 정의하나**
`App`이 `<Profile />`을 렌더링하고 있으므로 `App`이 부모, `Profile`이 자식이다 (JSX 자체가 아니라 "누가 누구를 렌더링하는가"가 부모/자식 관계를 결정).

`interface ProfileProps`는 **자식(`Profile.tsx`)**이 정의한다 — "나는 이런 모양의 데이터가 필요해"라는 계약을 받는 쪽이 선언하는 것. 부모(`App`)는 그 인터페이스를 import하거나 알 필요 없이 그냥 값을 채워 넘기기만 하면 되고, TypeScript가 "부모가 넘긴 값 ↔ 자식이 요구하는 타입"을 자동으로 비교해준다.

| | 누가 | 하는 일 |
|---|---|---|
| 부모 | `App` | `<Profile />`을 렌더링하며 실제 값을 채워 넘김 |
| 자식 | `Profile` | `interface ProfileProps`로 "필요한 데이터 모양"을 선언하고, 그 값을 받아 화면에 그림 |

함수로 비유하면 `Profile`이 함수 선언(파라미터 타입 정의), `App`이 그 함수를 호출하며 인자를 넘기는 쪽.

**3) TypeScript 패턴 — interface로 props 타입 정의**
```ts
interface ProfileProps {
  name: string;
  intro: string;
  stack: string[];
}

function Profile({ name, intro, stack }: ProfileProps) {
  return <div>{name}</div>;
}
```
부모는 이렇게 값을 내려준다.
```tsx
<Profile name="임씨" intro="Hello World" stack={["node", "react"]} />
```

**4) interface 작성 규칙**
- **기본 문법:** `필드명: 타입;` 형태로 나열.
- **네이밍:** PascalCase 필수. 컴포넌트 props는 관례적으로 `컴포넌트이름 + Props` (`ProfileProps`, `ButtonProps`) — 강제 규칙은 아니지만 널리 쓰이는 관습.
- **선택적(optional) 프로퍼티:** `?`를 붙이면 없어도 됨.
  ```ts
  interface ProfileProps {
    name: string;
    avatarUrl?: string;   // string | undefined
  }
  ```
- **함수 타입 프로퍼티:** 이벤트 핸들러 등을 props로 받을 때.
  ```ts
  interface ButtonProps {
    onClick: () => void;
    onSelect: (id: string) => void;
  }
  ```
- **readonly:** 재할당 방지 (props는 어차피 읽기 전용이라 실무에서 잘 안 붙임).
  ```ts
  interface ProfileProps {
    readonly id: string;
  }
  ```
- **확장(extends):** 공통 필드 재사용.
  ```ts
  interface BaseProps {
    className?: string;
  }
  interface ProfileProps extends BaseProps {
    name: string;
  }
  ```
- **children을 받을 때:** React의 `ReactNode` 타입 사용.
  ```ts
  import type { ReactNode } from 'react';
  interface CardProps {
    children: ReactNode;
  }
  ```

**5) interface vs type**
지금처럼 단순한 객체 모양을 표현할 땐 `interface`와 `type`이 사실상 동일하게 동작한다.
```ts
type ProfileProps = {
  name: string;
  intro: string;
  stack: string[];
};
```
차이는 나중에 필요할 때 드러남 — `interface`는 `extends`로 이어붙이거나 같은 이름으로 여러 번 선언하면 자동 병합(declaration merging)되지만 `type`은 안 됨. 반대로 유니온 타입(`type Status = "loading" | "success" | "error"`)은 `type`만 가능. React 커뮤니티는 관습적으로 props에 `interface`를 많이 쓰지만 강제는 아님.

**6) Props는 여러 단계로도 전달된다 (prop drilling)**
부모→자식 관계는 트리처럼 계속 이어질 수 있다. 자식이 또 다른 컴포넌트의 부모가 되어 props를 그대로(또는 가공해서) 내려줄 수 있음.
```tsx
function App() {
  return <Profile name="임씨" />;
}
function Profile({ name }: ProfileProps) {
  return (
    <div>
      <div>이름: {name}</div>
      <Badge label={name} />   {/* Profile은 Badge의 부모가 됨 */}
    </div>
  );
}
function Badge({ label }: BadgeProps) {
  return <span className="badge">{label}</span>;
}
```
`App → Profile → Badge` 순서로 값이 계속 내려감. 단, 중간 컴포넌트(`Profile`)가 `label` 값을 **자기는 안 쓰면서 다음 자식에게 전달만 하는** 상황이 여러 단계 반복되면 이를 **prop drilling**이라 부르며 실무에서 피하는 패턴이다 (코드 읽을 때 "이 값이 왜 여기 껴있지?" 하게 됨). 1~2단계 정도의 정상적인 UI 계층 분리(`App → Layout → Header`)와는 구분해야 함 — 그건 문제 없는 구조.

**피하는 대안** (지금 당장 쓸 건 아니고, 나중에 필요성을 체감하며 배울 개념들):
- **컴포넌트 합성(composition)** — 값을 뚫어 내려주는 대신 완성된 컴포넌트를 `children`으로 감싸서 넘김 (8단계 예정).
- **State를 필요한 곳 가까이 두기** — 최상위가 아니라 실제로 값을 쓰는 컴포넌트 근처에서 상태 관리.
- **Context API** — 트리 구조와 무관하게 필요한 곳에서 바로 값을 꺼내 씀 (로드맵엔 없지만 State/useEffect 이후 다뤄볼 만한 주제).

**7) JSX 반환은 즉시 함수 호출이 아니다 (렌더링 모델)**
`<Profile name="x" />`는 `Profile()` 함수를 그 자리에서 바로 호출하는 게 아니다. 컴파일되면 `React.createElement(Profile, { name: "x" })`가 되는데, 이건 "나중에 `Profile`을 이 props로 그려줘"라는 **설명 객체(가상 DOM 노드)**를 만드는 것뿐 — 실제 함수 몸체는 아직 실행되지 않는다.

실제 순서:
1. `App()` 호출 → 즉시 설명 객체를 반환하고 끝남 (자식을 기다리지 않음).
2. React가 그 반환값을 받아서 그제서야 `Profile()`을 호출.
3. `Profile()`도 자기 자식의 설명 객체를 반환하고 끝남 → React가 또 그 자식을 호출.

일반적인 중첩 함수 호출(부모가 자식이 끝날 때까지 기다렸다가 리턴)이 아니라, **React가 트리를 한 단계씩 순회하며 각 컴포넌트 함수를 나중에 따로 호출**하는 구조다.

**리렌더링 시 실제로 일어나는 일** — "가상 DOM 안에서 값이 바뀐다"가 아니라 "매번 새 트리를 통째로 다시 만들고 이전 트리와 비교한다"가 더 정확한 표현:
1. 값이 바뀜 (State 변경 — 3단계에서 다룰 내용)
2. React가 관련 컴포넌트 함수를 처음부터 다시 실행해서 **완전히 새로운** 가상 DOM 트리를 생성 (기존 트리를 고쳐 쓰는 게 아님)
3. **이전 트리 vs 새 트리**를 비교(diffing)해서 달라진 부분을 찾음
4. 달라진 부분만 골라 진짜 브라우저 DOM에 최소한으로 반영(patching)

이 비교 알고리즘을 **reconciliation(재조정)**이라 부른다. React가 빠른 이유는 "값이 하나라서"가 아니라 "메모리 위의 JS 객체(가상 DOM)끼리 비교하는 게 실제 DOM을 직접 건드리는 것보다 훨씬 싸고, 바뀐 부분만 최소로 반영하기 때문". 가상 DOM 자체는 렌더링마다 버려지고 새로 만들어지는 일회용 객체.

**실습 내용:** `App`이 `name`/`intro`/`stack` props를 `<Profile />`에 내려주도록 바꾸고, `Profile`은 `ProfileProps` interface를 정의해 구조분해 할당으로 받아 렌더링하도록 리팩터링.

**메모:** props 타입이 안 맞으면 (`Profile`이 아직 인자를 안 받는데 `App`이 값을 넘기는 경우 등) 런타임이 아니라 컴파일 시점에 `IntrinsicAttributes` 타입 에러로 바로 잡힌다 — 컴파일 시점에 "부모-자식 간 데이터 계약"을 검증해주는 셈.

---

## 3단계: State (`useState`)

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) Props vs State**
Props는 부모가 내려주는 읽기 전용 값이라 컴포넌트 스스로는 못 바꾼다. 하지만 "버튼을 누르면 숫자가 올라간다"처럼 **컴포넌트 자신이 시간에 따라 바꿔야 하는 값**이 필요할 때가 있는데, 이걸 위한 게 State다.

**2) `useState`는 "리렌더링을 유발하는 변수"**
그냥 `let count = 0`을 쓰면 값은 바뀌어도 화면이 다시 그려지지 않는다. `useState`로 관리하는 값은 바뀔 때마다 React에게 "다시 렌더링해줘"라고 알린다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // [현재값, 값을 바꾸는 함수] = useState(초기값)

  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 횟수: {count}
    </button>
  );
}
```
- `useState(0)`은 배열 `[현재값, setter함수]`를 반환한다 — 구조분해 할당으로 이름을 원하는 대로 짓는다.
- `setCount(...)`를 호출하면 React가 그 값을 기억해뒀다가 컴포넌트를 다시 실행(리렌더링)해서 새 값으로 화면을 갱신한다.

**3) Hook 규칙 (Rules of Hooks)**
`useState` 같은 Hook은 반드시 컴포넌트 함수 **최상위**에서만 호출해야 한다 (`if`/`for`/중첩 함수 안에서 호출 금지). 이 프로젝트의 `.oxlintrc.json`에도 `react/rules-of-hooks`가 error로 켜져 있어 어기면 바로 린트 에러가 뜬다.

**4) 함수형 업데이트 (`setState(prev => ...)`)**
`setLikes(likes + 1)`처럼 "현재 렌더링 시점의 값 + 1"을 계산해서 넘기는 방식은 대부분 잘 동작하지만, 같은 렌더링 안에서 `setLikes`를 연달아 여러 번 호출하면 `likes`가 그 순간엔 아직 안 바뀐 옛날 값이라 의도한 만큼 안 올라가는 함정이 있다.
```tsx
setLikes(prev => prev + 1);  // 이전 값을 받아서 다음 값을 계산 — 항상 최신값 기준
```
클릭 한 번에 setter를 한 번만 호출하는 경우엔 차이가 없지만, 실무에서는 안전하게 함수형 업데이트를 기본으로 쓰는 편.

**5) Hook이란 무엇인가 — "이벤트 구간"이 아니라 "React 기능에 연결하는 함수"**
Hook은 시간/구간을 가리키는 말이 아니라, **`use`로 시작하는 특별한 함수들**을 부르는 이름이다. 함수 컴포넌트가 클래스 컴포넌트 없이도 State, 생명주기 같은 React의 내부 기능에 갈고리를 걸듯이(hook into) 접근할 수 있게 해준다는 뜻.
```tsx
useState(0)      // State 기능에 연결
useEffect(...)   // 생명주기(마운트/업데이트/언마운트) 기능에 연결 — 6단계에서 다룸
useContext(...)  // Context 기능에 연결
```

**호출 시점 — 이벤트가 아니라 렌더링 시점**
`useState` 자체는 이벤트에 반응해서 호출되는 게 아니라, **컴포넌트 함수가 실행(렌더링)될 때마다 매번 호출**된다.
```tsx
function Profile() {
  const [likes, setLikes] = useState(0);
  //    ^ Profile()이 실행될 때마다(=렌더링될 때마다) 항상 실행됨

  return (
    <button onClick={() => setLikes(likes + 1)}>
      {/*        ^ setLikes 호출은 "클릭 이벤트"에 반응해서 일어남 */}
      좋아요: {likes}
    </button>
  );
}
```
- `useState(0)` **호출 자체**는 렌더링될 때마다 항상 일어남 (이벤트와 무관).
- `setLikes(...)` **호출**은 클릭이라는 이벤트에 반응해서 일어남 (4단계에서 자세히 다룰 부분).

**Hook 규칙이 있는 이유** — React는 매 렌더링마다 Hook들을 **항상 같은 순서로** 호출한다고 가정하고 내부적으로 값을 순서(인덱스)로 추적한다. `if`/반복문 안에서 조건부로 호출하면 그 순서가 흐트러져서 어떤 State가 어떤 값인지 추적이 꼬인다 — 그래서 최상위에서만 호출해야 함.

**6) Hook 순서 추적 vs 가상 DOM diffing — 서로 다른 매커니즘**
Hook 순서 보장이 "가상 DOM에서 뭐가 바뀌었는지 파악하기 위한 것"이라고 오해하기 쉬운데, 사실 완전히 다른 두 시스템이다.

React는 컴포넌트마다 Hook 값들을 **연결 리스트(linked list)**로 저장하고, 각 Hook을 이름이 아니라 **호출된 순서(인덱스)**로 구분한다.
```tsx
function Profile() {
  const [likes, setLikes] = useState(0);   // 1번째 Hook
  const [name, setName] = useState("");     // 2번째 Hook
}
// 내부 저장 형태 (개념적으로): [ {value: 0}, {value: ""} ]
//                                 ↑ 1번째        ↑ 2번째
```
`useState`를 호출하면 React는 "몇 번째 Hook 호출이냐"만 보고 리스트에서 맞는 자리를 찾아 값을 돌려준다 — **변수명이 아니라 순서로 매칭**. 그래서 조건부로 Hook을 호출하면(`if (likes > 0) { useState(...) }`) 렌더링마다 몇 번째 자리에 어떤 값이 들어있는지가 뒤바뀌어서 추적이 꼬인다. 이건 순수하게 "한 컴포넌트의 State/Effect 값을 어디서 꺼내올지"의 문제다.

반면 **가상 DOM diffing(reconciliation)**은 `Profile()`이 반환한 **JSX 엘리먼트 트리**를 이전 트리와 비교해서 화면의 어느 부분이 바뀌었는지 찾는 별개의 작업이다. `useState` 호출 순서가 아니라 `<div>`, `<button>` 같은 엘리먼트 타입과 `key`로 매칭한다.

| | 관리 대상 | 매칭 기준 |
|---|---|---|
| Hook 순서 | 컴포넌트 하나의 State/Effect 값들 | 호출 순서(인덱스) |
| 가상 DOM diffing | 렌더링된 엘리먼트 트리 전체 | 엘리먼트 타입 + `key` |

Hook 순서가 흐트러지면 diffing이 잘못되는 게 아니라, 애초에 `likes` 같은 값 자체를 잘못된 자리에서 읽어와버린다 — 화면에 엉뚱한 값이 찍히거나 `Rendered fewer hooks than expected` 같은 런타임 에러가 나는 이유. 리스트 렌더링의 `key`도 "이 항목이 이전 렌더링의 어떤 항목과 같은 놈인지" 식별하는 용도이지만, 이는 diffing 쪽 매칭 문제라 Hook 순서 문제와는 원리가 다르다 (5단계에서 다시 다룰 주제).

**실습 내용:** `Profile`에 "좋아요" 버튼을 추가. `useState(0)`으로 `likes` 상태를 만들고, `onClick`으로 `setLikes(likes + 1)`을 호출해 클릭할 때마다 화면의 숫자가 올라가는 걸 확인.

---

## 4단계: 이벤트 핸들링

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) 제어 컴포넌트(controlled input)**
`<input value={state값} onChange={...} />`처럼 입력창의 표시값을 React State가 소유하도록 만드는 패턴. 일반 HTML `<input>`은 브라우저가 알아서 자기 값을 들고 있지만, `value` prop을 지정하는 순간 input은 "내가 뭘 보여줄지" 결정할 권한을 잃고 오직 그 값만 표시한다.

타이핑 한 글자마다 실제로 일어나는 일:
```
① onChange 이벤트 발생 → e.target.value에 새 글자 포함된 값이 담김
② setComment(e.target.value) 호출 → comment state 갱신
③ React가 컴포넌트 리렌더링
④ <input value={comment} />가 새 값으로 다시 그려짐
⑤ 화면에 반영
```
"타이핑하니까 보인다"가 아니라 "state가 바뀌고 → 리렌더링되고 → 그 결과로 input이 새 값을 표시하도록 다시 그려진다"가 정확한 표현. 만약 `onChange`에서 `setComment`를 호출하지 않으면, `value`가 매 렌더링마다 이전 state로 고정돼있어서 **타이핑 자체가 안 먹히는 input**이 된다.

```tsx
const [comment, setComment] = useState("");

<input value={comment} onChange={(e) => setComment(e.target.value)} />
```

**2) SyntheticEvent와 `preventDefault`**
React가 핸들러에 넘겨주는 이벤트 객체(`e`)는 브라우저 네이티브 이벤트가 아니라 **SyntheticEvent** — 브라우저마다 다른 이벤트 API를 통일된 인터페이스로 감싼 래퍼. `preventDefault()`, `target` 등은 네이티브와 동일하게 동작.

`<form>`의 기본 동작은 제출 시 `action` 속성(없으면 현재 URL)으로 HTTP 요청을 보내고 **문서 전체를 새로 로드**하는 것 — URL이 안 바뀌어도 브라우저 입장에선 "기존 문서를 버리고 새로 로드"하는 내비게이션이다. SPA(Single Page Application)는 최초 1회만 HTML/JS를 받고 그 이후엔 React가 메모리에서 DOM을 직접 patching하는 방식으로 새로고침 없이 화면을 갱신하는데, form의 기본 제출 동작이 일어나면 그 순간 메모리에 있던 모든 React state(지금까지의 `likes`, `comment` 등)가 통째로 사라지고 앱이 처음부터 재마운트된다. 그래서 `onSubmit` 핸들러 안에서 `e.preventDefault()`로 이 기본 동작을 막는다.

```tsx
function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();       // form의 기본 제출(=페이지 새로고침) 막기
  setSubmittedComment(comment);
}
```

"브라우저 기본 동작"은 폼 제출에 국한된 개념이 아니라, 브라우저가 특정 이벤트에 대해 자동으로 처리하는 모든 행동을 가리키는 일반 용어다 (`<a href>` 클릭 시 이동, 우클릭 시 컨텍스트 메뉴, 체크박스 클릭 시 토글 등). 반대로 `<button type="button">`처럼 막을 기본 동작 자체가 없는 경우엔 `preventDefault`가 필요 없다.

**3) (곁가지) `preventDefault`로 새로고침을 막으면 메모리가 계속 쌓이지 않나?**
State 값을 `setX(새값)`으로 교체할 때, 더 이상 참조되지 않는 이전 값은 자바스크립트의 **가비지 컬렉터(GC)**가 자동으로 회수한다 — 새로고침 없이 오래 켜둔다고 그 자체로 메모리가 쌓이는 건 아니다. 진짜 메모리 누수는 "계속 커지기만 하고 안 지워지는 것들" 때문에 생긴다: 끝없이 자라는 배열, 정리 안 된 `setInterval`/이벤트 리스너, 해제 안 된 구독 등. 이런 정리(cleanup) 로직을 어디서 작성하는지가 6단계 `useEffect`의 핵심 주제 — `useEffect`가 반환하는 정리 함수를 React가 컴포넌트 소멸 시점(혹은 effect 재실행 직전)에 자동 호출해준다.

**실습 내용:** `Profile`에 댓글 입력 폼 추가. `comment` state로 입력창을 제어 컴포넌트로 만들고, `handleCommentSubmit`에서 `e.preventDefault()`로 새로고침을 막은 뒤 `setSubmittedComment(comment)`로 제출된 값을 별도 state에 반영해 화면에 표시.

**흔한 실수 (직접 겪음):**
- `submittedComment = ...`처럼 state를 직접 대입 — `const [submittedComment, setSubmittedComment] = useState(...)`의 `submittedComment`는 `const`라서 재할당이 컴파일 에러(`TS2588`). state는 반드시 setter 함수로만 바꿔야 함.
- `e.target.value`로 값을 읽으려 한 것 — `onChange`의 `e.target`은 그 input 자신이지만, `onSubmit`의 `e.target`은 **폼 전체**를 가리켜서 `.value`라는 속성 자체가 없음(`TS2339`). 필요한 값은 이미 `comment` state에 들어있으므로 그걸 그대로 쓰면 됨.
- `() => setSubmittedComment(comment)`처럼 화살표 함수로 감싸버린 것 — `onChange={(e) => ...}`처럼 "나중에 이벤트 발생 시 실행할 함수"를 React에 넘겨줄 때와 달리, 함수 몸통 안에서는 이미 실행되는 중이므로 화살표 함수로 감싸면 함수를 만들기만 하고 호출은 안 해서 아무 동작도 안 함 (컴파일 에러 없이 조용히 무효화되는 버그라 발견하기 까다로움).
- `setSubmittedComment(submittedComment)`처럼 엉뚱한 변수를 넘긴 것 — "방금 입력된 값"은 `submittedComment`가 아니라 `comment`에 들어있는데 변수명이 비슷해서 헷갈리기 쉬움.

---

## 5단계: 조건부 렌더링 & 리스트 렌더링

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) 조건부 렌더링 — `&&`의 falsy 함정**
`{조건 && <JSX>}`는 `조건`이 falsy일 때 **그 값 자체를 렌더링**한다. `undefined`/`false`/`null`은 React가 알아서 안 그리지만, **`0`은 화면에 그대로 찍히는 유일한 예외**다.
```tsx
const count = 0;
<div>{count && <span>항목 있음</span>}</div>  // 화면에 "0"이 찍힘
<div>{count > 0 && <span>항목 있음</span>}</div>  // 명시적으로 boolean으로 바꿔서 안전하게
```
값이 두 갈래로 나뉘는 경우(빈 상태 vs 채워진 상태)엔 `&&`보다 **삼항 연산자**가 더 명확하다.
```tsx
{comments.length === 0 ? (
  <div>아직 댓글이 없어요</div>
) : (
  <ul>{comments.map((item, index) => (<li key={index}>{item}</li>))}</ul>
)}
```

**2) 리스트 렌더링과 `key` — 가상 DOM diffing과의 연결**
3단계에서 다룬 가상 DOM diffing(reconciliation)이 배열을 그릴 때 실제로 작동하는 지점이 `key`다. React는 리렌더링마다 새 트리를 만들어 이전 트리와 비교하는데, 배열 항목끼리는 **`key`로 "이전 트리의 몇 번째 항목과 새 트리의 몇 번째 항목이 같은 항목인지"**를 판단한다.

배열 인덱스를 `key`로 쓰면(`key={index}`), 항목이 삭제/삽입되거나 순서가 바뀔 때 "인덱스 0번은 원래도 인덱스 0번이었으니 같은 항목"이라고 착각해서 엉뚱한 DOM(과 그 안의 로컬 state)을 재사용해버리는 버그가 생길 수 있다. 지금 `comments` 배열은 항목을 끝에 추가만 하고 삭제/재정렬 기능이 없어서 `key={index}`를 써도 당장은 문제가 없지만, 나중에 댓글 삭제 기능이 생기면 인덱스가 밀리면서 이 문제가 그대로 드러난다 — 그때는 각 댓글에 고유 id를 부여해서 `key`로 써야 안전하다.

**실습 내용:** `comments` state를 문자열 배열로 바꾸고, 폼 제출마다 `setComments([...comments, comment])`로 배열 끝에 추가. 화면에는 `comments.length === 0`일 때 안내 문구, 아닐 때 `.map()`으로 `<li>` 목록을 조건부+리스트 렌더링 조합으로 표시.

**흔한 실수 (직접 겪음):** `<ul>comments.map(...)</ul>`처럼 `{}` 없이 JSX 자식 자리에 JS 표현식을 그냥 텍스트로 써버림 — 1단계 규칙 ⑤("JSX `{}` 안에는 표현식만")을 다시 확인시켜준 사례. `{}`로 감싸지 않으면 TS/React가 이를 JS 코드가 아니라 그냥 문자로 해석하려다 `item`, `index` 같은 변수를 못 찾는 에러가 남.

---

## 6단계: `useEffect`와 부수효과

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) 부수효과(side effect)란 — "렌더링"과 분리해야 하는 것**
컴포넌트 함수는 기본적으로 **props/state(입력)를 받아 JSX(출력)를 계산하는 순수 함수**여야 한다. 하지만 `document.title` 변경, `fetch`, `setTimeout`, 이벤트 리스너 등록, 구독처럼 **컴포넌트 함수 바깥 세상과 상호작용하는 처리**들이 실무에선 필요한데, 이걸 부수효과라 부른다. 렌더링 함수 본문에 직접 쓰면 "같은 입력엔 같은 출력, 여러 번 호출해도 안전"이라는 순수성 가정이 깨지므로, `useEffect`로 명시적으로 분리한다.

```tsx
useEffect(() => {
  document.title = likes > 0 ? `${name} (좋아요 ${likes})` : name;
}, [likes, name]);
```

**2) 실행 타이밍 — 렌더링 → 화면 반영(commit) → 그 다음에 effect**
`useEffect`에 넘긴 함수는 렌더링 도중이 아니라, React가 계산한 결과를 **실제 브라우저 DOM에 반영한 뒤**에 실행된다. 그래서 effect 안에서는 이미 갱신된 실제 DOM을 안전하게 다룰 수 있다.

**3) 의존성 배열(두 번째 인자) — 실행 빈도 제어**
```tsx
useEffect(() => { ... });          // 매 렌더링마다 실행
useEffect(() => { ... }, []);      // 최초 마운트 시 1번만 실행
useEffect(() => { ... }, [a, b]);  // a 또는 b가 이전 렌더링과 다를 때만 실행
```
- 배열엔 **effect 본문에서 실제로 읽는 값**(state, props, 그로부터 파생된 변수)을 개발자가 직접 나열한다 — React가 자동으로 분석해서 채워주지 않는다.
- 비교는 **하나라도 다르면 실행**(OR 조건)이지 전부 바뀌어야 하는 게 아니다. 각 값을 이전 렌더링 값과 `Object.is`로 비교한다.
- 비교는 **위치(인덱스)별**로 이뤄진다 (이름이 아니라 자리로 매칭) — 3단계에서 다룬 "Hook은 이름이 아니라 호출 순서로 추적한다"는 패턴과 같은 원리. 같은 코드가 매 렌더링 그대로 재실행되는 거라 배열 안 값들의 순서가 렌더링마다 바뀔 일이 없어서, 실질적으로 "순서를 신경 써야 하나?"라는 질문 자체가 성립하지 않는다.

**4) Cleanup 함수 — 선택 사항, 필요할 때만 반환**
effect 함수가 **함수를 반환**하면 React는 그걸 "이 effect를 정리하는 방법"으로 기억해뒀다가 정해진 타이밍에 대신 호출해준다. 강제가 아니라 "등록해두면 누군가 명시적으로 해제해야 하는" 리소스(타이머, 이벤트 리스너, 구독)에만 필요하다.

```tsx
useEffect(() => {
  const timer = setTimeout(() => setShowSaved(false), 2000);
  return () => clearTimeout(timer);  // cleanup
}, [comments]);
```

Cleanup이 호출되는 시점은 정확히 두 가지:

| 시점 | 설명 |
|---|---|
| ① 같은 effect가 재실행되기 직전 | 의존성이 바뀌어 effect가 다시 돌기 전에, 이전 실행이 남긴 걸 먼저 정리 |
| ② 컴포넌트가 화면에서 사라질 때(unmount) | 마지막으로 살아있던 리소스를 정리 |

`[]`(빈 배열)만 있는 effect라도 cleanup을 반환했다면, 그 함수는 재실행 없이도 **언마운트 시점까지 대기**하다가 그때 호출된다 — 의존성 배열의 내용물과는 무관하게, React가 반환된 cleanup 함수 참조를 내부에 저장해두기 때문.

**5) 클래스 컴포넌트 생명주기와의 대응**
`useEffect`는 클래스 컴포넌트의 세 가지 생명주기 메서드를 "effect 함수(마운트+업데이트) + cleanup 함수(업데이트 전 정리+언마운트)"라는 하나의 패턴으로 통합한 것이다.

| 시점 | 클래스 컴포넌트 | `useEffect` |
|---|---|---|
| 처음 그려질 때 | `componentDidMount` | effect 함수 실행 |
| 의존성 바뀌어 다시 그려질 때 | `componentDidUpdate` | cleanup(이전 것 정리) → effect 함수 재실행 |
| 사라질 때 | `componentWillUnmount` | cleanup 함수 실행 |

**6) "여러 번 호출될 수 있다"는 가정 — 리렌더링과는 다른 얘기**
State가 바뀌어 리렌더링되는 것은 당연히 정상 동작(입력이 달라졌으니 새 결과)이다. 여기서 말하는 "여러 번 호출"은 **같은 입력(같은 state/props)인데도 React가 의도적으로 한 번 더 호출**하는 예외적인 상황을 가리킨다.
- **개발 모드 Strict Mode**: 컴포넌트 함수를 두 번 연달아 호출하고, effect는 마운트 시 "실행 → 즉시 cleanup → 다시 실행"을 왕복시킨다 — cleanup이 effect가 한 일을 제대로 되돌리는지 미리 검증하려는 목적. 프로덕션 빌드에선 사라진다.
- **Concurrent 렌더링**: 진행 중이던 렌더링을 더 급한 업데이트가 끼어들어 버리고 재시작할 수 있다.

두 경우 다 "여러 번 불려도 안전한(순수한) 코드"를 강제하기 위한 장치이지, 최종적으로 화면에 반영되는 결과가 이상해지는 건 아니다.

**7) Stale closure — TypeScript로는 못 잡는다**
의존성 배열에 실제로 쓰는 값을 빠뜨리면, effect 안 함수가 그 값의 **옛날 값을 계속 기억**하는 stale closure 버그가 생긴다. 이건 "타입이 맞냐"의 문제가 아니라 "실행 시점에 어떤 값을 캡처했냐"의 문제라서 TypeScript 컴파일러가 잡아줄 수 없다. 이걸 잡아주는 건 `eslint-plugin-react-hooks`의 `exhaustive-deps` 같은 **린트** 규칙인데, 확인해보니 이 프로젝트의 `.oxlintrc.json`엔 `react/rules-of-hooks`만 켜져 있고 `exhaustive-deps`는 없다 — 의존성 배열은 지금 당장은 직접 주의해서 챙겨야 하는 부분.

**실습 내용:** `Profile`에 `useEffect` 두 개를 추가.
1. `likes`/`name`이 바뀔 때마다 `document.title`을 동기화 — 의존성 배열이 있는 기본 패턴.
2. 댓글이 등록되면(`comments` 변경) "저장되었습니다" 알림을 띄웠다가 1초 후 `setTimeout`으로 자동으로 끄고, 연달아 제출 시 이전 타이머를 `clearTimeout`으로 정리하는 cleanup까지 직접 작성 (`TODO(human)`).

```tsx
useEffect(() => {
  if (comments.length === 0) return; // 마운트 시점(빈 배열)엔 알림 안 띄움
  setShowSaved(true);
  const timer = setTimeout(() => setShowSaved(false), 1000);
  return () => clearTimeout(timer);  // 연달아 제출 시 이전 타이머 정리
}, [comments]);
```

**흔한 실수 (직접 겪음):**
- `setTimeout`과 `clearTimeout`의 시그니처를 혼동 — `clearTimeout(() => setShowSaved(false), 3000)`처럼 `setTimeout`의 형태(콜백+지연시간)를 `clearTimeout`에 그대로 써버림. `clearTimeout`은 타이머 ID 1개만 받는 "취소" 함수라 컴파일 에러(`TS2554: Expected 1 arguments, but got 2`)로 바로 드러났다. 게다가 이 상태로는 애초에 `setTimeout` 호출 자체가 없어서 `showSaved`를 되돌릴 예약이 걸리지도 않았음.
- 마운트 가드를 `comments.length > 0 && setShowSaved(true);`처럼 JSX 밖(statement 자리)에서 `&&`로 작성 — 동작은 하지만 oxlint가 `no-unused-expressions` 경고를 냄. JSX `{}` 안에서는 `&&`가 "렌더링할 값"으로 평가되는 표현식이라 자연스럽지만, statement 자리에서 조건부 실행이 목적이라면 `if (comments.length === 0) return;`처럼 `if`를 쓰는 게 정석 — 1단계 규칙 ⑤("JSX `{}` 안엔 표현식만")의 반대 케이스로, "표현식 자리가 아닌 곳에 표현식만 써도 문제"라는 걸 보여준 사례.

---

## 7단계: Form 다루기

**실습 파일:** `src/components/Profile.tsx`

**배운 개념:**

**1) 여러 input을 하나의 state 객체로 관리하기**
4단계에서는 input 하나(`comment`)마다 `useState`를 하나씩 따로 뒀다. input이 여러 개로 늘어나면 그 방식은 `useState`와 전용 핸들러가 계속 늘어나는 구조가 된다. 대신 폼 전체를 **객체 하나**로 묶고, 각 input에 HTML 표준 속성인 `name`을 지정하면 핸들러 함수 하나가 모든 input을 처리할 수 있다.

```tsx
interface CommentFormState {
  author: string;
  text: string;
}

const [form, setForm] = useState<CommentFormState>({ author: "", text: "" });

<input name="author" value={form.author} onChange={handleFormChange} />
<input name="text" value={form.text} onChange={handleFormChange} />
```

**2) 하나의 핸들러가 여러 필드를 처리하는 법 — computed property name**
핸들러가 어느 input에서 호출됐는지는 `e.target.name`(문자열 하나)으로 알 수 있다. 여기서 핵심은 **필드 이름별로 분기(`if`)하지 않는 것** — `if (e.target.name === "author") { ... }`처럼 나누면 필드가 늘어날 때마다 분기도 늘어나고, 새 필드를 처리하는 걸 깜빡하기 쉽다. 대신 객체 리터럴의 **computed property name**(`{ [변수]: 값 }`) 문법으로 필드 이름이 뭐든 상관없이 동일한 코드로 처리한다.

```tsx
function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
  const obj = { [e.target.name]: e.target.value };
  setForm({ ...form, ...obj });
}
```
- `{ [e.target.name]: e.target.value }` — `e.target.name`이 평가된 **값**("author" 또는 "text")을 키로 사용. `[]` 없이 `{ e.target.name: ... }`이라 쓰면 JS가 `e.target.name`이라는 글자 그대로를 키로 해석하려다 문법 에러가 난다.
- `{ ...form, ...obj }` — 3단계에서 배운 대로 state는 직접 변형하면 안 되므로, 기존 `form`을 스프레드로 복사한 뒤 바뀐 필드만 덮어쓴 **새 객체**를 만들어 `setForm`에 넘긴다.

**3) 스프레드는 "펼치는 위치"에 따라 의미가 다르다**
```tsx
setForm(...form, obj);        // ❌ 함수 호출 인자 자리 — form을 "여러 인자"로 펼치려는 시도인데, 객체는 인자 목록으로 못 폄
setForm({ ...form, ...obj }); // ✅ 객체 리터럴 `{}` 안 — 객체의 속성들을 병합
```
배열/함수 인자 목록에서의 스프레드(여러 값으로 펼치기)와 객체 리터럴 안에서의 스프레드(속성 병합)는 문법은 비슷해 보여도 완전히 다른 자리에서, 다른 걸 하는 연산이다.

**4) 기본적인 폼 검증과 리셋**
```tsx
function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!form.author.trim() || !form.text.trim()) return;
  setComments([...comments, `${form.author}: ${form.text}`]);
  setForm({ author: "", text: "" });
}
```
`disabled={!form.author.trim() || !form.text.trim()}`로 두 필드가 비어있으면 제출 버튼 자체를 비활성화하고, `handleCommentSubmit` 안에서도 한 번 더 같은 조건을 검사한다(버튼이 비활성화돼도 `Enter` 키로 제출을 시도할 수 있으므로 이중 방어). 제출 성공 시 `setForm({ author: "", text: "" })`으로 폼을 초기 상태로 되돌린다.

**실습 내용:** 댓글 폼을 "작성자 이름 + 한마디" 두 필드로 확장. `form` state를 `{ author, text }` 객체로 바꾸고, 두 input이 `name` 속성과 `handleFormChange` 핸들러 하나를 공유하도록 구현 (`TODO(human)`). 제출 시 두 필드 모두 비어있지 않은지 검증한 뒤 `"${author}: ${text}"` 형태로 댓글 목록에 추가하고 폼을 초기화.

**흔한 실수 (직접 겪음) — computed property를 체화하기까지 3번의 시도:**
- **1차 시도:** `for (let key of e.target.name)`처럼 반복문을 씀 — `e.target.name`은 `"author"` 같은 문자열 하나일 뿐인데 이걸 순회 대상으로 착각. 이 핸들러는 input 하나당 1번씩 호출되므로 애초에 "여러 필드를 한 번에 순회"할 필요가 없다는 걸 놓친 경우. 같은 시도에서 `newForm.add(...)`도 씀 — `.add()`는 `Set`/`Map`의 메서드고 일반 객체엔 없음.
- **2차 시도:** `if (e.target.name.match("auther"))`처럼 특정 필드 이름으로 분기 — 오타(`auther`)는 둘째치고, 이렇게 분기하면 조건에 안 걸리는 다른 필드(`text`)는 아예 처리가 안 돼서 "하나의 핸들러로 모든 필드 처리"라는 애초의 목적이 깨짐.
- **공통 문법 실수:** `{ e.target.name: e.target.value }`처럼 대괄호 없이 변수를 객체 키로 사용 — computed property name(`{ [expr]: value }`)의 `[]`를 빠뜨리면 파서가 `e.target.name`을 리터럴 키로 해석하려다 실패.
- **최종적으로 해결한 형태:** 분기 없이 `{ [e.target.name]: e.target.value }`로 통일하고, `setForm({ ...form, ...obj })`로 병합.

---

## 8단계: 컴포넌트 합성 & 커스텀 훅

**실습 파일:** `src/components/Section.tsx`(신규), `src/hooks/useAutoHide.ts`(신규), `src/components/Profile.tsx`

**배운 개념:**

**1) 컴포넌트 합성 — `children` prop**
2단계에서 "나중에 다룰 대안"으로 미리 언급했던 패턴. 완성된 JSX를 통째로 다른 컴포넌트에 넘겨서, 그 컴포넌트가 레이아웃만 제공하고 내용물은 신경 안 쓰게 만드는 방식이다.

```tsx
interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

**2) `children`도 그냥 props다 — App→Profile과 동일한 메커니즘**
```tsx
// App → Profile
<Profile name="ㅇㅈㅇ" intro="Hello World" stack={[...]} />
// 컴파일: Profile({ name: "ㅇㅈㅇ", intro: "Hello World", stack: [...] })

// Profile → Section
<Section title="댓글">...JSX...</Section>
// 컴파일: Section({ title: "댓글", children: ...JSX... })
```
둘 다 "부모가 자식을 호출하며 props 객체 하나를 넘긴다"는 동일한 구조다. `children`은 이름이 정해진 특별한 prop일 뿐 — 여는 태그와 닫는 태그 **사이에 쓴 내용**을 JSX 컴파일러가 자동으로 그 값으로 채워준다는 점만 다르고, 전달 메커니즘 자체는 다르지 않다.

**3) `App → Profile → Section` — 부모/자식 관계는 맞지만 "누가 만들었는지"는 구분해야 한다**
| 컴포넌트 | 역할 |
|---|---|
| `App` | `Profile`을 렌더링, `name`/`intro`/`stack`만 내려줌 (`Section`엔 관여 안 함) |
| `Profile` | 댓글 관련 JSX(`<form>`, 알림, 목록)를 **직접 작성**해서 `<Section title="댓글">...</Section>`로 감싸 렌더링 |
| `Section` | `children` prop을 **받아서** `<h2>{title}</h2>` 옆에 그대로 꽂아 넣기만 함 (내용물이 뭔지는 모름) |

`Section`의 내용물은 `App`이 내려준 게 아니라 `Profile`이 자기 렌더링 로직 안에서 직접 구성한 것. 진짜 "prop drilling 회피용 합성"(바깥 컴포넌트가 내용을 결정해서 안쪽 레이아웃 컴포넌트에 넘기는 패턴, 예: `App`이 `<Layout><Profile /></Layout>`처럼 감싸는 경우)과는 활용 목적이 살짝 다르다 — 지금 `Section`은 `Profile` 내부에서만 쓰는 재사용 가능한 레이아웃 조각.

**4) `ReactNode` 타입과 `createElement` 컴파일은 서로 다른 레이어**
- **런타임(JS 컴파일)**: `<Section title="댓글">여러 형제 태그들</Section>`을 쓰면, `ReactNode` 타입 유무와 무관하게 **1단계에서 배운 JSX 컴파일**이 각 형제 태그를 개별 `createElement` 호출로 바꾸고, 그 결과들을 배열로 묶어 `children`에 담아준다.
- **컴파일 시점(타입 검사)**: `ReactNode`는 그냥 TypeScript **타입**이다. "children 자리엔 렌더링 가능한 값이면 뭐든 와도 된다"는 검사 기준일 뿐, 뭔가를 실행해서 만들어내는 코드가 아니다.

1단계 규칙("컴포넌트의 `return`은 최상위 요소 하나만")이 `children`엔 안 걸리는 이유도 여기서 나온다 — `return`은 함수의 반환값 제약이고, `children`은 이미 만들어진 값(배열 포함)을 **prop으로 전달**하는 것뿐이라 별개의 제약이다.

**5) 커스텀 훅 — 반복되는 state+effect 로직을 함수로 추출**
6단계에서 `Profile.tsx` 안에 직접 썼던 "저장 알림 자동 숨김" `useEffect`를 재사용 가능한 형태로 뽑아냄.

```tsx
function useAutoHide(items: unknown[], delay: number): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (items.length === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, [items, delay]);
  return visible;
}

// 사용하는 쪽
const showSaved = useAutoHide(comments, 1000);
```
- `use`로 시작하는 이름은 스타일 취향이 아니라 **린터(`react/rules-of-hooks`)가 "이 함수가 Hook인지"를 판단하는 실제 기준**이다 — `use` + 대문자로 시작하는 카멜케이스 이름이어야 도구가 내부의 `useState`/`useEffect` 호출에 Hook 규칙(최상위에서만 호출 등)을 적용해준다.
- 새로운 메커니즘이 추가된 게 아니라, `comments`/`showSaved`/`1000`처럼 컴포넌트에 하드코딩됐던 이름들을 `items`/`visible`(내부)/`delay`라는 매개변수·내부 state로 바꿔서 별도 함수로 옮긴 것뿐 — 로직은 6단계와 100% 동일.

**실습 내용:** `Section` 컴포넌트(합성 예시)는 직접 작성해서 제공. `useAutoHide` 커스텀 훅은 `TODO(human)`으로 남겨 6단계 로직을 일반화해서 작성하도록 진행. `Profile.tsx`는 `showSaved` state+effect를 제거하고 `const showSaved = useAutoHide(comments, 1000)`로 교체, 댓글 관련 JSX 전체를 `<Section title="댓글">...</Section>`로 감쌈.

**흔한 실수 (직접 겪음):**
- **의존성 배열 누락:** 첫 시도에서 `useEffect(() => {...})`처럼 두 번째 인자를 아예 빠뜨림 — `items`가 안 바뀌어도(예: `likes` 버튼 클릭, 입력창 타이핑 등 무관한 리렌더링에도) effect가 매번 재실행되는 문제. `oxlint`의 `exhaustive-deps` 경고로 바로 드러남 — 6단계 Q&A에서 "이 프로젝트엔 이 규칙이 없다"고 잘못 안내했던 걸 여기서 정정: `.oxlintrc.json`에 명시돼 있진 않아도 `react` 플러그인이 기본으로 켜주는 규칙이었다.
- **`return clearTimeout(timer);` — cleanup 함수를 반환한 게 아니라 즉시 실행해버림:** `return 표현식;`은 그 표현식을 그 자리에서 바로 평가한다. `clearTimeout(timer)`가 effect 실행 중 **즉시 호출**되면서 방금 예약한 타이머를 스스로 취소해버리고, `clearTimeout`의 반환값(`undefined`)이 "cleanup 없음"으로 인식됨 — 결과적으로 `setVisible(false)`가 예약은 되지만 실행되기 전에 취소돼서 영원히 안 꺼지는 버그. `return () => clearTimeout(timer);`처럼 화살표 함수로 감싸야 "나중에 실행할 함수"로 전달된다. 이 타입 오류는 TypeScript로는 못 잡는다 — `clearTimeout`의 반환 타입(`void`)이 effect 콜백이 허용하는 반환 타입(`void | cleanup함수`) 중 하나라 컴파일은 통과해버림. 4단계에서 겪었던 "화살표 함수로 안 감싸서 실행이 안 됨" 실수의 정반대 방향(감싸야 하는데 안 감겨서 너무 일찍 실행됨) 버전.
- **`delay`를 의존성 배열에서 빠뜨림:** effect 본문에서 `delay`를 쓰면서 `[items]`만 넣음 — 지금 호출부(`useAutoHide(comments, 1000)`)는 `delay`가 항상 고정값이라 당장 버그로 안 이어지지만, `exhaustive-deps`가 "쓰는 값은 다 배열에 넣어라"고 경고해서 `[items, delay]`로 수정. 5번 Q&A에서 얘기했던 stale closure 예방 원칙이 실전에서 적용된 사례.

---

## 다음 계획: 복습 퀴즈 & 할 일 목록(Todo List) 프로젝트

8단계까지 로드맵을 완주한 뒤 나눈 대화 정리. 아직 실습 코드는 없고, 다음 세션에 이어갈 계획만 기록.

**1) 컴포넌트를 나누는 기준 (Q&A)**

정답 공식은 없지만 실무에서 쓰는 신호 다섯 가지:
1. **재사용성** — 같은 UI 패턴이 반복되거나 반복될 조짐이 있으면 분리 (`Section`이 예시)
2. **단일 책임** — "이 JSX 덩어리가 하는 일을 한 문장으로 설명 가능한가?" 여러 문장이 필요하면 분리 후보
3. **state 소유권 경계** — 특정 state가 JSX의 일부에서만 쓰이고 나머지와 안 얽히면, 그 부분을 state와 함께 독립 컴포넌트로 분리 가능 (`Profile`의 `likes`는 댓글 쪽과 무관 → `LikeButton` 분리 후보)
4. **크기/가독성** — 컴포넌트 함수가 스크롤해야 다 보일 정도로 길어지면 분리 신호
5. **props 개수** — 계속 늘어나면 그 컴포넌트가 너무 많은 역할을 맡고 있다는 신호

**분리 축이 두 개라는 점이 핵심** — "화면 구조로 나누기(컴포넌트)"와 "로직으로 나누기(커스텀 훅)"는 서로 다른 기준이다. `Section`은 시각적 레이아웃 블록이라 컴포넌트로, `useAutoHide`는 화면 모양과 무관한 상태/로직이라 커스텀 훅으로 뽑아낸 것이 이 구분을 보여주는 예시. `Profile`을 더 쪼갠다면 `LikeButton`/`CommentSection`으로 나눌 수 있다는 얘기까지 나눴지만, 지금 당장 리팩토링하진 않기로 함 — "결국 리팩토링 얘기라 여기까진 안 들어가겠다"는 결론.

**2) 다음 프로젝트: 할 일 목록(Todo List)**

8단계 개념(state, 조건부/리스트 렌더링, 폼, `useEffect`, 합성/커스텀 훅)만으로 간단한 앱을 직접 만들어보고, 부족한 개념(라우팅, 데이터 페칭, 전역 상태 등)은 필요할 때 그때그때 채워나가기로 함.

- 데이터 모양: `{ id, text, completed }`
- 새로 다룰 개념: 배열 항목을 **불변적으로 토글**(`.map()`으로 새 배열 만들며 해당 항목만 새 객체로 교체)하고 **불변적으로 삭제**(`.filter()`)하는 패턴 — 지금까지는 배열 끝에 추가만 해봤지, 중간 항목을 수정/제거해본 적은 없음
- 5단계에서 "`key={index}`는 삭제 기능이 생기면 위험해진다"고 미리 경고해뒀던 상황이 여기서 실제로 발생 — Todo에 삭제 기능이 들어가므로 `key`는 반드시 `todo.id` 같은 고유값을 써야 함
- 착수 직전 복습 퀴즈를 먼저 풀기로 하고 이번 세션은 여기서 마무리. `TodoList` 컴포넌트 파일은 아직 만들지 않은 상태(다음 세션에 처음부터 시작)

**3) 복습 퀴즈 (다음 세션에 풀 것 — 1~8단계 각 1문항, 아직 미응답)**

- **Q1 (1단계)** 다음 코드는 왜 컴파일 에러가 날까?
  ```tsx
  function Bad() {
    return (
      <div>A</div>
      <div>B</div>
    );
  }
  ```
  리턴값은 한개의 값으로 리턴해야 하기 때문에, 지금 현재 두개 div를 전달하고 있다. 그래서 <> / <div> 로 감싸서 리턴해야 한다.
- **Q2 (2단계)** `interface ProfileProps`는 `App.tsx`가 아니라 `Profile.tsx`에서 정의한다. 왜 자식 쪽이 정의하는 게 맞을까?
부모쪽에서는 단순히 인자값을 전달할 뿐, 자식쪽에서 인터페이스를 이용하여 필수값들을 정의해서 렌더링하기 때문
- **Q3 (3단계)** 아래 두 코드의 차이는? 버튼을 눌렀을 때 화면이 실제로 달라지는 건 어느 쪽인가?
  ```tsx
  // A
  let count = 0;
  <button onClick={() => count++}>{count}</button>

  // B
  const [count, setCount] = useState(0);
  <button onClick={() => setCount(count + 1)}>{count}</button>
  ```
  B쪽이다. useState를 이용하여 count가 계속 변경되나, A는 이벤트 클릭이 없다면, 계속 0인 상태로 있는다.
  **피드백 반영:** "클릭이 없어서"가 아니라 "리렌더링 트리거가 없어서"가 핵심이다. A도 클릭하면 `count++`는 실제로 실행되어 변수 값 자체는 올라가지만, `useState`가 아니므로 React가 리렌더링을 하지 않는다. 그래서 클릭을 몇 번을 하든 화면에 찍힌 숫자는 최초 렌더링 시점 값(0)에 그대로 박제된다.
- **Q4 (4단계)** `<form onSubmit={handleSubmit}>`에서 `handleSubmit` 안에 `e.preventDefault()`를 안 쓰면 어떤 일이 일어날까?
form의 기본 동작은 서브밋되고 나서, 서버에 값을 전달하고, action에 명시한 페이지로 이동하는 것이다. 다만, 여기서는 action에 대한 페이지 이동을 명시하기 않았기 때문에, 해당 페이지 get으로 새로고침된다.
- **Q5 (5단계)** 리스트를 렌더링할 때 `key={index}`를 쓰면 위험해지는 상황은 구체적으로 언제일까?
배열 중간에 키가 삭제, 삽입, 재정렬이 일어나는 경우에, 이전의 값들과 맞지 않아서, 원하는 렌더링대로 출력되지 않는다.
- **Q6 (6단계)** 다음 코드에 버그가 있다. 뭐가 문제일까?
  ```tsx
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return clearTimeout(timer);
  }, [items]);
  ```
return 자체가 그 즉시 실행이기 때문에, effect가 끝나자마자 방금 만든 타이머를 바로 취소해버린다.
- **Q7 (7단계)** `author`/`text` 두 input이 핸들러 하나(`handleFormChange`)를 공유하려면 어떤 문법이 꼭 필요할까? 그 문법이 왜 필요한지도 설명해보라.
computed property name을 활용하여 키와 값들을 받는다. 둘 중에 어느값이 실행되는지 알 수 없기 때문에
**피드백 반영:** 실행 전엔 `e.target.name`이 `"author"`인지 `"text"`인지 알 수 없으므로 객체 키를 하드코딩할 수 없고, `[e.target.name]`처럼 대괄호로 감싸 **동적으로 평가**해야 한다 — 이게 computed property name이 필요한 이유다.
- **Q8 (8단계)** 커스텀 훅(`useAutoHide` 같은)이 일반 함수와 다른 점은 뭘까? 왜 이름이 꼭 `use`로 시작해야 할까?
내부에서 다른 훅을 호출하는 평범한 함수. use 접두사는 스타일이 아니라 린터가 Hook 규칙 저용 대상을 판별하는 용

---

## 9단계: Todo List — 배열 중간 항목의 불변적 토글/삭제

**실습 파일:** `src/components/TodoList.tsx`(신규), `src/App.tsx`

**배운 개념:**

**1) "끝에 추가"와 "중간 항목 수정/삭제"는 다른 문제다**
4~7단계에서 다룬 `comments` 배열은 항상 `[...comments, 새값]`처럼 **끝에 추가만** 했다. Todo List는 처음으로 배열 **중간의 특정 항목**(`id`로 식별)을 건드려야 하는데, `todos[index].completed = true`처럼 직접 대입하면 안 된다 — state를 직접 mutate하면 React가 "이전 렌더링과 같은 배열 참조"로 착각해 리렌더링을 건너뛸 수 있다. 그래서 매번 **완전히 새로운 배열**을 만들어 `setTodos`에 넘겨야 한다.

**2) `.map()`은 콜백의 반환값으로 새 배열을 만든다 — 반환을 빠뜨리면 전부 `undefined`**
```tsx
// ❌ if만 있고 else/반환이 없음 → 매 항목이 undefined가 됨 (TS가 void[]로 추론해 컴파일 에러)
todos.map((item) => {
  if (item.id === id) {
    item.completed = !item.completed;  // 대입문일 뿐 반환이 아님, 게다가 직접 mutate
  }
});

// ✅ 일치하면 새 객체, 아니면 원본 그대로 — 모든 분기에서 값을 반환
todos.map((item) =>
  item.id === id ? { ...item, completed: !item.completed } : item
);
```
"조건에 안 걸리는 항목은 그냥 둔다"는 생각으로 `else`(또는 반대 케이스의 반환)를 빠뜨리기 쉬운데, `.map()`은 매 항목마다 빠짐없이 반환값을 책임져야 하는 함수다. 부수효과만 필요하고 새 배열이 필요 없는 경우엔 애초에 `.map()`이 아니라 반환값을 안 모으는 `.forEach()`를 써야 한다.

**3) `.filter()`로 얻은 원소는 원본과 같은 참조 — 직접 대입하면 mutate**
```tsx
const matched = todos.filter(t => t.id === id);
matched[0].completed = true;  // ❌ todos 배열 안의 실제 객체를 직접 건드림
```
`.filter()`는 조건에 맞는 원소들을 **새 배열에 담아 반환**하지만, 원소 자체는 원본과 동일한 객체 참조다. 새 값이 필요하면 `{ ...item, ... }`로 새 객체를 만들어야지, 필터링된 참조를 직접 대입하면 원본 state를 몰래 mutate하는 셈이 된다.

**4) 객체 리터럴 안에서 배열 스프레드는 "인덱스로" 합쳐진다 — 그리고 TypeScript는 이걸 컴파일 에러로 못 잡는다**
```tsx
setTodos({ ...todos, ...newTodo });  // ❌
```
`{...배열}`은 배열 원소를 `{0: 값, 1: 값, ...}` 형태의 **일반 객체**로 풀어버린다. 그래서 `id` 기준이 아니라 **배열 인덱스** 기준으로 값이 덮어써지고, 결과물은 배열이 아닌 일반 객체가 된다. Node로 직접 실행해서 확인한 실제 결과:
```
{ '0': {토글된 항목}, '1': {토글된 항목(잘못 덮어씀)}, '2': {...} }
Array.isArray(결과)  // false
결과.map(...)         // TypeError: map is not a function
```
더 위험한 건, TypeScript(6.0.3)는 이 패턴을 `Todo[]`와 구조적으로 호환된다고 판단해서 **컴파일 에러를 내지 않는다** — `tsc --noEmit`으로 직접 검증해봐도 통과한다. 타입 검사가 통과했다고 런타임에도 올바르게 동작하는 건 아니라는 걸 보여준 사례. 다음 렌더링에서 `todos.map()`을 호출하는 순간 실제로 `"todos.map is not a function"` 런타임 에러가 난다.

**5) 5단계에서 미리 경고했던 상황이 실제로 발생 — `key`는 반드시 고유 id**
Todo에 삭제 기능이 생기면서 5단계 Q&A("배열 중간 항목이 삭제되면 `key={index}`가 위험해진다")가 실제로 적용되는 지점이 됐다. `<li key={todo.id}>`처럼 각 항목의 고유 `id`(`crypto.randomUUID()`로 생성)를 `key`로 사용해, 중간 항목이 삭제돼도 나머지 항목들의 매칭이 밀리지 않도록 함.

**실습 내용:** `todos: { id, text, completed }[]` state와 추가 폼(제어 컴포넌트)은 미리 작성해서 제공. `toggleTodo`/`deleteTodo` 두 함수를 `TODO(human)`으로 남겨 불변적 토글(`.map()`)과 불변적 삭제(`.filter()`) 패턴을 직접 구현하도록 진행. `deleteTodo`는 첫 시도부터 정확했고, `toggleTodo`는 세 번의 시도 끝에 완성.

**흔한 실수 (직접 겪음) — `toggleTodo`를 완성하기까지 3번의 시도:**
- **1차 시도:** `.filter()`로 일치하는 항목만 골라낸 뒤 `{...todos, ...newTodo}`로 원본과 합치려 함 — 위 4번 항목의 버그(인덱스 기준 병합, 배열이 객체로 변함) 그대로 재현됨. 동시에 `.filter()`로 얻은 참조를 `.map()` 콜백 안에서 직접 mutate(`item.completed = ...`)하기도 함.
- **2차 시도:** `.map()`으로 전체 배열을 순회하는 올바른 방향으로 바꿨지만, `if` 블록 안에서 `item.completed = !item.completed`라는 **대입문**만 쓰고 `return`을 빠뜨림 — 콜백이 모든 항목에서 `undefined`를 반환해 `newTodo`가 `[undefined, undefined, undefined]`가 됨. TypeScript가 이를 `void[]`로 정확히 추론해 `setTodos(newTodo)`에서 컴파일 에러(`TS2345`)로 잡아줌 — 3번(런타임 mutate) 실수와 달리 이번엔 컴파일 단계에서 바로 드러난 경우.
- **최종 해결:** `if`/`else` 양쪽 분기 모두에서 값을 `return`하도록 수정 — 일치하면 `{ ...item, completed: !item.completed }`(새 객체), 아니면 `item`(원본 그대로). `tsc`/`oxlint` 통과 확인 및 Node로 직접 실행해 `a`/`c`는 원본 참조 그대로, `b`만 새 객체로 교체되고 결과가 여전히 배열임을 검증.

---

## 다음 계획: Todo List 확장

`toggleTodo`/`deleteTodo` 완성 후 세션을 마무리하며 정한 다음 확장 순서. 아직 실습 코드는 없고 계획만 기록.

추천 순서와 이유 — **파생 값 계산 → 조건부 렌더링 확장 → 부수효과** 순으로 난이도가 자연스럽게 올라가도록 배치:

1. **남은 개수 표시** (`todos.filter(t => !t.completed).length`개 남음) — 별도 `useState` 없이 렌더링 시점에 계산하는 파생 값(derived state) 감각을 기르는 게 목적. "이 값을 굳이 state로 관리해야 하나?"를 스스로 판단해보는 게 핵심 질문.
2. **완료 항목 필터링** (`전체`/`진행중`/`완료`) — `filter` state 하나 추가 + 렌더링 직전 `todos.filter(...)`. 지금까지 배운 조건부 렌더링 + `.filter()`를 재사용하는 낮은 난이도의 확장.
3. **`useEffect`로 `localStorage` 저장/복원** — 지금은 새로고침하면 목록이 사라지는 상태. 6단계에서 배운 `useEffect`를 처음으로 "브라우저 저장소와 동기화"하는 실전 용도로 써보는 단계.
4. **컴포넌트 분리 (`TodoItem`)** — 8단계 이후 정리했던 "컴포넌트 분리 기준"(재사용성/단일 책임/state 소유권/크기/props 개수)을 적용해 `<li>` 부분을 독립 컴포넌트로 쪼개보는 리팩터링 실습.

---

## 9-1단계: 파생 값(derived value) — 남은 개수 표시

**실습 파일:** `src/components/TodoList.tsx`

**배운 개념:**

**1) 파생 값은 별도 state가 필요 없다**
`remainingCount`(완료 안 된 항목 개수)는 `todos` 배열만 있으면 항상 계산해낼 수 있는 값이다. 이런 값을 `useState`로 따로 관리하면 `toggleTodo`/`deleteTodo`/`handleAddSubmit` 등 `todos`를 바꾸는 모든 곳에서 매번 그 state도 같이 갱신해줘야 하고, 하나라도 빠뜨리면 `todos`와 `remainingCount`가 서로 안 맞는 버그가 생긴다. 대신 컴포넌트 함수 몸통에서 렌더링마다 다시 계산하면(`const remainingCount = todos.filter(...).length;`) `todos`가 바뀔 때 항상 자동으로 최신값이 되어 동기화 버그 자체가 생길 여지가 없다.

```tsx
const remainingCount = todos.filter((todo) => !todo.completed).length;
```

**2) `!조건` vs `조건 === false`**
둘 다 지금 코드에서는 동일하게 동작하지만(`completed: boolean`으로 타입이 고정돼있으므로), 만약 나중에 `completed`가 `boolean | undefined`처럼 느슨해지면 결과가 갈린다 — `!undefined`는 `true`(카운트에 포함)지만 `undefined === false`는 `false`(카운트에서 제외)라서다. 값이 정확히 뭔지 모를 때는 `!조건`이, 정확히 특정 값인지 따질 때는 `=== 특정값`이 더 안전하다는 감각. 실무 관례상으로도 boolean엔 `!`가 더 짧고 흔히 쓰이는 표현이라 최종적으로 `!todo.completed`로 정리.

**실습 내용:** `<p>{remainingCount}개 남음</p>`을 추가하고, `TODO(human)`으로 `remainingCount` 계산 로직을 직접 작성 — 첫 시도는 `todo.completed === false`로 정확하게 구현했고, 이후 `!todo.completed`로 바꿔봄.

**메모:** 이번엔 코드량이 2줄 정도로 작아 처음엔 어시스턴트가 직접 작성했으나, 사용자가 "내가 쳐야 하는 거 아니냐"고 요청해 원복 후 `TODO(human)`으로 다시 진행 — 짧은 코드라도 핵심 개념(파생 값)이 걸려 있으면 직접 타이핑하고 싶다는 선호를 확인.

다음 세션은 2번(완료 항목 필터링)부터 시작.

---

## 9-2단계: 완료 항목 필터링

**실습 파일:** `src/components/TodoList.tsx`

**배운 개념:**

**1) `visibleTodos`도 파생 값 — `filter` state는 "무엇을 보여줄지"만 기억한다**
`filter: "all" | "active" | "completed"` state 하나를 새로 두고, 실제로 화면에 그릴 목록(`visibleTodos`)은 `todos`와 `filter` 두 값으로부터 렌더링 시점에 계산한다. `todos` 자체는 필터와 무관하게 항상 전체 데이터를 그대로 갖고 있고, "지금 어떤 항목만 보여줄지"는 순전히 화면 표시 방식의 문제라서 별도 state(`filteredTodos` 같은)로 중복 저장하지 않는다 — 9-1단계의 `remainingCount`와 같은 원리.

```tsx
const visibleTodos = todos.filter((todo) =>
  filter === "active" ? !todo.completed : filter === "completed" ? todo.completed : todo
);
```

**2) 타입 시스템이 못 잡는 로직 버그 — `active`/`completed` 조건이 뒤바뀜**
첫 시도에서 `active` 분기에 `todo.completed`를, `completed` 분기에 `!todo.completed`를 반대로 씀 — "진행중" 버튼을 누르면 완료된 항목이, "완료" 버튼을 누르면 진행중인 항목이 보이는 버그. `Array.prototype.filter`의 콜백 반환 타입은 `unknown`으로 선언돼 있어서(boolean이 아닌 값을 반환해도 truthy/falsy로만 판단) `tsc`/`oxlint` 둘 다 통과했다 — 9단계에서 겪은 "타입은 맞지만 런타임 로직이 틀린" 패턴의 반복. dev 서버를 띄워 브라우저에서 버튼을 직접 눌러보고서야 발견해 두 조건을 맞바꿔 수정.

**실습 내용:** `filter` state와 "전체"/"진행중"/"완료" 버튼 3개는 미리 작성해서 제공. `TODO(human)`으로 `visibleTodos` 계산 로직을 직접 작성하고, 목록의 빈 상태 체크(`todos.length === 0`)와 `.map()` 대상을 `todos`에서 `visibleTodos`로 교체.

**흔한 실수 (직접 겪음):** `active`/`completed` 분기 조건이 서로 뒤바뀜 — 컴파일은 통과했지만 실제 버튼 클릭 결과가 반대로 나와 브라우저 테스트로 직접 발견하고 수정.

다음 세션은 3번(`useEffect`로 `localStorage` 저장/복원)부터 시작.

---

## 9-3단계: `localStorage` 저장/복원

**실습 파일:** `src/components/TodoList.tsx`

**배운 개념:**

**1) "복원"엔 `useEffect`가 아니라 `useState`의 지연 초기화(lazy initializer)를 쓴다**
계획 단계에선 "`useEffect`로 저장/복원"이라 뭉뚱그렸지만, 실제로 두 작업의 성격이 다르다는 게 드러났다. **저장**은 `todos`가 바뀔 때마다 반응해야 하는 전형적인 부수효과라 `useEffect(() => {...}, [todos])`가 맞다. 반면 **복원**을 `useEffect(() => {...}, [])`(마운트 시 1회)로 만들면, 같은 첫 커밋에서 저장 effect와 복원 effect가 둘 다 실행되는데 — `setTodos(복원값)`은 그 즉시 `todos`를 바꾸는 게 아니라 다음 렌더링을 예약할 뿐이라, 같은 커밋에서 실행되는 저장 effect는 여전히 초기값(빈 배열)을 보고 그대로 `localStorage`에 덮어써버린다. 이 순서 문제를 피하려면 `useState(초기값)` 대신 **초기값을 계산하는 함수**를 넘긴다 — 이 함수는 컴포넌트가 처음 렌더링될 때 딱 한 번만 실행되고, effect보다도 먼저(렌더링 도중) 값이 확정되므로 순서 문제 자체가 생기지 않는다.

```tsx
const [todos, setTodos] = useState<Todo[]>(() => {
  try {
    const getTodo = localStorage.getItem(STORAGE_KEY);
    if (getTodo === null) {
      return [];
    } else {
      return JSON.parse(getTodo);
    }
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}, [todos]);
```

**2) `try`/`catch` — 처음 배운 예외 처리 문법**
`JSON.parse`는 인자가 유효한 JSON 형식이 아니면 에러를 던진다(`localStorage`에 저장된 값이 수동으로 깨졌거나 형식이 안 맞는 경우). `try` 블록을 위에서부터 실행하다 에러가 던져지면 남은 코드를 건너뛰고 즉시 `catch` 블록으로 넘어간다 — 이 프로젝트에서 처음 다룬 예외 처리 문법. `getTodo === null`(애초에 저장된 값이 없는 경우)과 `catch`(저장된 값은 있지만 파싱이 실패하는 경우)는 서로 다른 실패 상황을 처리하는 것이라 둘 다 필요하다.

**실습 내용:** `useEffect` import와 `STORAGE_KEY` 상수는 미리 준비해서 제공. `TODO(human)`으로 ① `useState`의 지연 초기화로 `localStorage`에서 복원하는 로직, ② `todos` 변경 시 `localStorage`에 저장하는 `useEffect`를 직접 작성. dev 서버(`npm run dev`)를 띄워 할 일을 추가한 뒤 새로고침해서 실제로 유지되는지 브라우저에서 직접 확인.

**흔한 실수 (직접 겪음):**
- **API 혼동:** `localStorage.getItem(STORAGE_KEY)`(키로 저장된 값 조회) 대신 `localStorage.key(index)`(인덱스로 저장된 키 이름 조회)를 씀 — 완전히 다른 메서드라 숫자를 기대하는 자리에 문자열을 넘겨 타입 에러(`TS2345`)로 바로 드러남.
- **미완성 삼항 연산자:** `조건 ? : []`처럼 참일 때 값을 빠뜨려 문법 자체가 성립하지 않음.
- **`return` 누락 (반복):** `useState(() => { ... })`의 화살표 함수도 `{}` 블록 본문이라 `return`이 필요한데, if/else 각 분기에서 값만 계산하고 반환을 빠뜨려 `undefined`가 되는 실수 — 1단계·9단계에서 이미 겪었던 패턴이 새 문맥(지연 초기화 함수)에서 재발.
- **미완성 메서드 체이닝:** `localStorage.getItem(STORAGE_KEY).`처럼 점(`.`)만 찍고 뒤를 안 붙여 컴파일 에러(`Identifier expected`)로 바로 드러남.

다음 세션은 4번(컴포넌트 분리 — `TodoItem`)부터 시작.

---

## 9-4단계: 컴포넌트 분리 — `TodoItem`

**실습 파일:** `src/components/TodoItem.tsx`(신규), `src/components/TodoList.tsx`

**배운 개념:**

**1) 분리된 컴포넌트는 부모의 지역 함수를 공유하지 않는다 — props로만 연결된다**
`toggleTodo`/`deleteTodo`는 `TodoList` 함수 몸통 안에 정의된 지역 함수라서, 별도 파일·별도 함수인 `TodoItem`에서는 이름만으로 접근할 수 없다(스코프가 다름). 8단계에서 배운 "`children`도 그냥 props"라는 원리의 연장선 — 함수도 값이라서, 부모가 가진 함수를 자식이 쓰려면 `onChange`/`onSubmit`처럼 **props로 전달**해야 한다. `TodoItemProps`에 `onToggle: (id: string) => void` / `onDelete: (id: string) => void`를 선언하고, `TodoList`가 실제 함수(`toggleTodo`, `deleteTodo`)를 값으로 채워 넘겨줌.

**2) props를 "낱개 필드"로 펼칠지 "객체 하나"로 받을지**
첫 시도는 `{ id, text, completed }`처럼 `Todo`의 필드를 낱개로 펼쳐서 받았는데, `TodoList`의 호출부는 `<TodoItem todo={todo} .../>`처럼 객체 하나를 통째로 넘기고 있어서 타입이 안 맞았다(`Property 'todo' does not exist`). 최종적으로 `todo: Todo`(이미 정의된 타입을 그대로 필드 타입으로 재사용)로 통일 — 2단계에서 다룬 "인터페이스는 필요한 데이터 모양을 선언하는 계약"이라는 개념이, 이번엔 원시값이 아니라 다른 인터페이스(`Todo`)를 필드 타입으로 품는 형태로 확장된 사례.

**3) 타입을 다른 파일에서 재사용하기 — `export`/`import type`**
`Todo` 인터페이스는 원래 `TodoList.tsx`에 있었는데, `TodoItem.tsx`도 이 타입이 필요해서 `export interface Todo`로 내보내고 `import type { Todo } from "./TodoList"`로 가져다 씀. 컴포넌트(`export default TodoList`)를 내보내던 것과 같은 `export` 문법이 타입에도 그대로 적용된다는 걸 확인.

**실습 내용:** `TodoList.tsx`의 `<li key={todo.id}>...</li>` 블록(텍스트 클릭 토글 + 삭제 버튼)을 독립된 `TodoItem` 컴포넌트로 분리. `Todo` 타입 export, `TodoItem.tsx` 신규 작성, `TodoList.tsx`에서 `.map()` 안을 `<TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />`로 교체하는 작업을 `TODO(human)`으로 진행. dev 서버에서 추가/토글/삭제/필터/새로고침 전체 동작이 분리 전과 동일한지 확인.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** `TodoItemProps`에 `id`/`text`/`completed`를 낱개 필드로, `onToggle`/`onDelete` 없이 컴포넌트 본문에서 `toggleTodo(id)`/`deleteTodo(id)`를 직접 호출 — 두 문제가 겹침: ① 스코프 밖의 함수를 직접 참조해 `Cannot find name 'toggleTodo'`(`TS2304`), ②애초에 콜백을 props로 받지 않음. 컴파일 에러로 스코프 문제가 먼저 드러남.
- **2차 시도:** `onToggle`/`onDelete`는 추가했지만 여전히 `id`/`text`/`completed` 낱개 필드 방식 유지 — `TodoList.tsx`의 호출부(`todo={todo}`)와 안 맞아 `Property 'todo' does not exist on type 'TodoItemProps'`(`TS2322`) 에러.
- **최종 해결:** `TodoItemProps`를 `{ todo: Todo; onToggle: (id: string) => void; onDelete: (id: string) => void }`로 통일하고, 컴포넌트 본문도 `todo.id`/`todo.text`/`todo.completed`로 접근하도록 수정.

이번 세션으로 Todo List 확장 계획(9-1~9-4) 전 항목 완료. 다음 세션 계획은 아직 미정 — 새 세션에서 다음 학습 주제를 정하는 것부터 시작.

---

## 10단계: challenge-api 연동 ① — 인증 상태 관리 (Context API)

**실습 파일:** `src/context/AuthContext.tsx`(신규)

**배경:** `challenge-api`(별도 repo) 백엔드와 통신하는 화면들을 `SCREEN_PLAN.md` 계획대로 만들기 시작. 모든 도메인 API가 `JwtAuthGuard`로 막혀 있어서, 로그인 토큰을 `/mypage`·`/challenges`·`/feeds/:id` 등 서로 무관한 8개 페이지 전부가 필요로 함 — prop drilling으로 풀기엔 트리 구조와 무관하게 필요한 곳이 너무 많아, 2단계에서 "나중에 다룰 대안"으로만 언급됐던 **Context API**를 처음 도입.

**배운 개념:**

**1) Context API — prop drilling을 안 거치고 값을 공유하는 법**
`createContext`로 "값을 담을 그릇"을 만들고, `<AuthContext.Provider value={...}>`로 감싼 트리 안 어디서든 `useContext(AuthContext)`로 바로 꺼내 쓸 수 있다. `App → Layout → Header`처럼 몇 단계만 거치는 게 아니라, 트리 상에서 멀리 떨어진 컴포넌트끼리 값을 공유해야 할 때 쓰는 도구.

```tsx
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY));
  // ...
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
```
`createContext(undefined)` + `useAuth()`에서 `undefined`면 에러를 던지는 패턴은 "Provider 밖에서 실수로 호출했을 때 조용히 깨지는 대신 즉시 명확한 에러로 드러내기" 위한 관용구.

**2) `useState`/`localStorage` 지식을 새 문맥(Context)에 옮겨 적용**
`token` state의 지연 초기화(`useState(localStorage.getItem(STORAGE_KEY))`)와 `login`/`logout`에서 state·`localStorage`를 함께 갱신하는 방식은 9-3단계(Todo List `localStorage` 저장/복원)와 원리가 같다. 차이는 그 값을 컴포넌트 하나가 아니라 `useAuth()`를 호출하는 트리 전체가 공유한다는 것.

**3) 함수 타입 호환성 — 매개변수가 적은 함수는 "그냥 허용"된다**
TypeScript는 `(token: string) => void` 자리에 매개변수가 없는 `() => void`도 에러 없이 허용한다 — 호출하는 쪽이 인자를 안 써도 되니까 "더 적게 받는 함수"는 안전하다고 보는 규칙. 그래서 `login()`이 매개변수를 빠뜨려도 컴파일은 통과했지만, 실제로는 로그인 API가 응답으로 준 새 토큰을 받을 방법이 없어 아무 의미 없는 함수가 되는 논리 버그였다 — **타입 체커가 못 잡아주는 종류의 실수**라는 걸 확인한 사례.

**4) `const`/`let`의 TDZ(Temporal Dead Zone)**
`function` 선언과 달리 `const`/`let`은 선언되기 전 줄에서 참조하면 "선언은 됐지만 아직 초기화 전이라 접근 불가"한 상태로 취급되어 에러가 난다. `const value = { token, ... }`을 `const [token, setToken] = useState(...)`보다 먼저 써서 겪은 문제.

**실습 내용:** `AuthProvider` 내부에 `TODO(human)`으로 남겨진 세 가지 — ① `localStorage`에서 복원하는 `token` state, ② 새 토큰을 받아 state·`localStorage`를 함께 갱신하는 `login(newToken)`, ③ 둘 다 초기화하는 `logout()` — 를 직접 작성.

**흔한 실수 (직접 겪음) — 3번의 시도:**
- **1차 시도:** `const value = { token, login, logout }`을 `useState` 선언보다 위에 둬서 `token` TDZ 에러(`TS2448`/`TS2454`), `login`/`logout`도 아직 없어 `TS18004` 추가 발생.
- **2차 시도:** 순서는 고쳤지만 `setToken()`을 "새 값을 반환해주는 함수"로 오해해 `const newToken: string = setToken()`처럼 사용 (`useState`의 setter는 항상 `void` 반환이라 `TS2322`/`TS2554`). 같은 시도에서 `login`이 매개변수 없이 기존 state의 `token`을 재사용하도록 고쳐졌는데, 이건 타입 에러 없이 통과했지만 앞서 3)에서 정리한 논리 버그였음.
- **최종 해결:** `login(newToken: string)`이 매개변수를 받아 `setToken(newToken)` + `localStorage.setItem(STORAGE_KEY, newToken)`을 호출하고, `logout()`은 `localStorage.removeItem(STORAGE_KEY)` + `setToken(null)`로 state와 저장소를 함께 초기화하도록 정리.

**남겨둔 것:** `AuthContext.tsx`가 컴포넌트(`AuthProvider`)와 훅(`useAuth`)을 한 파일에서 같이 export하고 있어 oxlint가 `react/only-export-components`(Fast Refresh 경고)를 띄운다 — 지금 단계에서는 무시하고 진행, 파일이 커지면 `useAuth`를 별도 파일로 분리하는 걸 고려.

다음은 `SCREEN_PLAN.md` 체크리스트의 Phase 1(`/login`, `/signup` 폼)로 이어감.

---

## 11단계: challenge-api 연동 ② — 회원가입/로그인 폼 (첫 실제 API 연동)

**실습 파일:** `src/pages/LoginPage.tsx` (`src/pages/SignupPage.tsx`는 동일 구조의 완성된 참고용으로 미리 제공)

**배경:** `POST /user`(가입)와 `POST /user/login`(로그인)은 둘 다 body가 `{email, password}`로 같아서 폼 자체(제어 컴포넌트, `handleChange`)는 7단계 패턴을 그대로 재사용. 다른 점은 성공했을 때의 후속 처리뿐 — 가입은 응답에 토큰이 없어 `/login`으로 리다이렉트, 로그인은 응답의 `access_token`을 10단계에서 만든 `AuthContext`에 반영해야 함.

**배운 개념:**

**1) `catch` 절 안의 `err`는 기본적으로 `unknown`이다**
```tsx
try {
  await apiFetch(...);
} catch (err) {
  setError(err instanceof ApiError ? err.message : "로그인에 실패했습니다.");
}
```
`try` 블록 안에서 뭐가 던져질지 컴파일러는 알 수 없기 때문에, `catch`로 받는 값의 타입은 항상 `unknown`(또는 `any`) 취급된다. 그래서 `err.message`처럼 바로 접근할 수 없고, `instanceof`로 "이건 우리가 정의한 `ApiError`가 맞다"는 걸 좁혀준 뒤에야 안전하게 꺼낼 수 있다. TypeScript는 아예 `catch (err: ApiError)`처럼 `any`/`unknown` 이외의 타입 annotation을 문법적으로 금지한다(`TS1196`) — "무엇이 던져질지 모른다"는 전제를 타입 시스템 차원에서 강제하는 것.

**2) Hook은 "값을 미리 꺼내두는 함수"지, 나중에 인자를 넘겨 다시 부르는 함수가 아니다**
```tsx
function LoginPage() {
  const { login } = useAuth();   // 렌더링 시점에 미리 꺼내둔 함수
  // ...
  async function handleSubmit() {
    login(accessToken);          // 나중에, 여기서 "그 함수"를 호출
  }
}
```
3단계에서 다룬 "Hook은 렌더링마다 컴포넌트 최상위에서 호출된다"는 규칙이 실제로 왜 중요한지 보여준 사례. `useAuth()`가 반환하는 `{ token, login, logout }`은 렌더링 시점에 스냅샷처럼 꺼내와 변수에 담아두는 것이고, 나중에 이벤트 핸들러 안에서 실제로 실행하는 건 그 변수(`login`)이지 `useAuth` 자신이 아니다. `handleSubmit` 안에서 `useAuth(token)`처럼 다시 호출하려 한 시도는 이 구분을 헷갈린 경우.

**3) 응답 파싱 실패와 네트워크/서버 에러를 구분해서 메시지 통일**
`ApiError`가 아닌 예외(네트워크 단절 등 `fetch` 자체가 던지는 에러)까지 고려해서, `SignupPage`와 동일하게 `instanceof` 삼항식으로 항상 사용자에게 보여줄 메시지가 있도록 통일. `if (err instanceof ApiError) { setError(...) }`만 쓰면 그 외의 경우엔 아무 메시지도 안 뜨고 조용히 실패하는 것과의 차이.

**실습 내용:** `handleSubmit` 안에서 ① `apiFetch<LoginResponse>("/user/login", { method: "POST", body: form })` 호출, ② 응답의 `access_token`을 `login()`에 전달, ③ 성공 시 `navigate("/challenges")`, ④ 실패 시 `ApiError` 메시지를 `setError`로 표시하는 로직을 `TODO(human)`으로 작성. `SignupPage.tsx`를 참고용으로 옆에 두고 구조를 비교하며 작성.

**흔한 실수 (직접 겪음) — 4번의 시도:**
- **1차 시도:** `useAuth(loginInfo.access_token)`처럼 Hook 자체를 나중에 인자와 함께 다시 호출하려 함 — Hook과 "Hook이 반환한 값(함수)"을 혼동한 경우. 같은 시도에서 `catch(){}`(괄호 안 식별자 없음)도 문법 에러(`TS1003: 식별자가 필요합니다`).
- **2차 시도:** `catch (apiError: ApiError)`처럼 catch 변수에 구체 타입을 직접 지정 — `TS1196`으로 차단됨(catch 변수는 `any`/`unknown`만 허용).
- **3차 시도:** 컴파일은 통과했지만 `navigate("/challengs")`에 오타(`e` 누락) — 타입 체커가 못 잡는 종류의 실수라 `App.tsx`의 실제 라우트(`/challenges`)와 대조해서 직접 발견.
- **4차 다듬기:** `if (err instanceof ApiError) { setError(...) }`만 있어 그 외 에러 케이스에서 메시지가 안 뜨던 것을, `SignupPage`와 같은 `err instanceof ApiError ? ... : "로그인에 실패했습니다."` 삼항식으로 통일.

**남겨둔 것:** 아직 `challenge-api` 백엔드를 로컬에서 띄우지 않아서, 이 두 폼은 실제 요청으로 브라우저에서 끝까지 확인하지는 못한 상태 — 백엔드 접속 정보가 정해지면 `npm run dev`로 직접 가입/로그인까지 확인 필요.

---

## 12단계: challenge-api 연동 ③ — 응답 envelope 언래핑

**실습 파일:** `src/api/client.ts`

**배경:** `challenge-api`가 로컬에서 이미 떠 있어서(`docker`로 mariadb, `npm run start:dev`로 서버) `curl`로 실제 회원가입/로그인 요청을 직접 보내봤다. 그 결과 `LoginResponse`가 기대한 `{ access_token }`이 아니라 `{ success: true, data: { access_token } }` 형태로 온다는 걸 발견 — 백엔드의 `src/common/interceptor/response.interceptor.ts`가 **모든** 컨트롤러 응답을 전역으로 감싸고 있었다. 타입을 아무리 정확히 선언해도, 실제 서버가 그 모양으로 응답한다는 보장은 타입 시스템이 해주지 않는다는 걸 실제 요청으로 확인한 사례 — 11단계에서 "남겨둔 것"으로 미뤄뒀던 실제 검증이 여기서 값을 발휘함.

**배운 개념:**

**1) 제네릭 인터페이스로 "감싸는 모양" 자체를 타입으로 표현**
```ts
interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
}
```
`ApiFetchOptions`처럼 이미 알고 있던 `interface`에 타입 매개변수(`<T>`)를 붙이면, "무엇을 담고 있는지는 모르지만 이런 뼈대로 감싸져 있다"는 걸 표현할 수 있다. `apiFetch<LoginResponse>(...)`를 호출하면 이 `T`가 `LoginResponse`로 채워져서, `ApiResponseEnvelope<LoginResponse>`는 곧 `{ success: boolean; data: { access_token: string } }`가 된다.

**2) `res.json()`에 타입을 미리 지정하면 이후 캐스팅이 필요 없어진다**
```ts
const envelope: ApiResponseEnvelope<T> = await res.json();
return envelope.data;  // 이미 T로 추론됨 — as T 불필요
```
`res.json()`의 반환 타입은 원래 `any`라 아무 값이나 될 수 있는데, 변수 선언에 타입을 명시하면 그 시점부터 TypeScript가 `envelope`을 그 타입으로 취급한다. 그러면 `envelope.data`도 자동으로 `T`로 추론되어, 뒤에서 `as T`로 강제 변환할 필요가 사라진다 — "어디서 타입을 지정하느냐"에 따라 이후 코드에서 캐스팅이 필요한지 아닌지가 갈린다는 걸 보여준 사례.

**3) 한 곳만 고치면 되는 이유 — 공통 모듈의 역할**
이 수정은 `client.ts` 한 파일에만 있고, `LoginPage.tsx`/`SignupPage.tsx`는 전혀 손대지 않았다. `apiFetch`를 호출하는 모든 곳이 "봉투를 벗기는 방법"을 몰라도 되게 만든 게 애초에 API 클라이언트를 공통 모듈로 분리해둔 이유(Phase 0)라는 걸 실감한 부분 — 앞으로 만들 챌린지/피드 API 호출도 이 봉투 문제를 신경 쓸 필요가 없다.

**실습 내용:** `apiFetch`의 마지막 줄, `TODO(human)`으로 남겨진 부분을 `ApiResponseEnvelope<T>` 타입을 정의해 `res.json()` 결과에서 `data`만 꺼내 반환하도록 수정. 이후 dev 서버(`npm run dev`)와 로컬 `challenge-api`(`localhost:3000`)를 함께 띄운 상태로 브라우저에서 `/signup` → `/login` 흐름을 직접 확인해 `localStorage`에 순수 토큰 문자열이 저장되는 것까지 검증.

**흔한 실수 (직접 겪음) — 3번의 시도:**
- **1차 시도:** `ApiResponseEnvelope<T>` 인터페이스를 정의는 했지만 실제로는 안 쓰고, `res.json()`(타입 `any`)의 결과를 그대로 `envelope`에 담은 뒤 `envelope.data as T`로 캐스팅 — 컴파일은 통과하지만 `as T`가 타입 검사 없이 "믿고 넘어가는" 연산이라 애써 만든 인터페이스가 아무 역할을 못 함. oxlint가 `'ApiResponseEnvelope'이(가) 선언되었지만 사용되지 않았습니다` 경고로 알려줌.
- **2차 시도:** `res.json()`의 결과 자체를 `const envelope: ApiResponseEnvelope<T> = await res.json();`로 타입 지정해서 인터페이스를 실제로 활용하도록 수정.
- **3차 다듬기:** `envelope.data`가 이미 `T`로 추론되므로 마지막 `return envelope.data as T;`의 `as T`가 불필요해짐 — 제거.

다음은 `SCREEN_PLAN.md` 체크리스트의 Phase 2(읽기 전용 화면들)로 이어감.

---

## 13단계: challenge-api 연동 ④ — 챌린지 목록 (첫 GET 화면 + 페이지네이션)

**실습 파일:** `src/pages/ChallengeListPage.tsx`

**배경:** Phase 2(읽기 전용 화면)의 첫 항목. 백엔드 `GET /challenge?page=&limit=`는 12단계의 envelope를 벗기고 나면 `{ items, meta: { total, page, limit, totalPages } }` 형태를 돌려준다. `limit`은 서버 검증상 최소 10이고, 서버가 `end_date >= 오늘`인 챌린지만 돌려주므로 종료된 챌린지는 목록에 나오지 않는다(프론트 버그가 아니라 서버 정책).

**배운 개념:**

**1) 목록 응답 모양을 제네릭으로 표현 — `PagingResponse<T>`**
```ts
interface PagingResponse<T> {
  items: T[];
  meta: PagingMeta;
}
apiFetch<PagingResponse<Challenge>>(`/challenge?page=${page}&limit=${LIMIT}`, { token });
```
12단계의 `ApiResponseEnvelope<T>`와 같은 방식이다. 랭킹·피드 목록도 같은 모양이라 이 타입을 그대로 재사용할 수 있다.

**2) `useEffect` + 로딩/에러/데이터 세 가지 상태**
`useEffect`의 콜백 자체는 `async`가 될 수 없어서 안에서 async 함수를 따로 정의해 호출한다. 의존성 배열에 `page`를 넣으면 "이전/다음" 버튼은 `setPage`만 호출하고, 데이터를 다시 가져오는 일은 이펙트가 맡는다. 성공·실패 양쪽에서 로딩이 꺼지도록 `setLoading(false)`는 `finally`에 둔다.

**3) 비동기 이펙트의 경쟁 상태와 cleanup — 요청을 "취소"하는 게 아니라 결과를 "무시"한다**
```tsx
useEffect(() => {
  let cancelled = false;
  async function fetchChallenges() {
    try {
      const response = await apiFetch(...);
      if (cancelled) return;
      setChallenges(response.items);
    } catch (err) {
      if (cancelled) return;
      setError(...);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }
  fetchChallenges();
  return () => { cancelled = true; };
}, [page, token]);
```
이펙트가 실행될 때마다 `cancelled`는 별개의 변수로 만들어지고, cleanup은 "바로 이전 실행이 붙잡고 있던 변수"만 `true`로 바꾼다. 그래서 먼저 보낸 요청의 응답이 나중에 도착해도 그 응답은 상태를 덮어쓰지 못한다. 요청 자체는 서버까지 가서 처리되고 응답도 도착한다(취소가 아니라 무시). 요청까지 끊으려면 `AbortController`를 `apiFetch`에 넘기는 확장이 필요하다. `await` 이후의 `set*`은 성공·`catch`·`finally` 세 곳 모두에 가드가 필요하다.

**4) 경쟁 상태는 대조군과 함께 검증해야 의미가 있다**
Playwright(스크래치패드에 `playwright-core`만 설치, 시스템 Chrome 사용)로 `page=2` 응답만 3초 지연시키고 "다음"을 연속 클릭했다.
- 대조군(cleanup 제거): 최종 화면 `2 / 3` — page 3을 요청했는데 늦게 온 page 2 응답이 덮어씀.
- 현재 코드(cleanup 있음): 최종 화면 `3 / 3`.

방어를 끈 버전에서 버그가 재현돼야 "테스트가 버그를 잡을 수 있다"와 "현재 코드가 막는다"를 함께 증명할 수 있다. 한편 현재 UI는 `if (loading) return ...` 때문에 요청 중 버튼이 사라져서 실제로는 연타 자체가 불가능하다. 검증할 때만 이 게이트를 임시로 완화했고 끝난 뒤 되돌렸다. 즉 cleanup은 지금 당장 필요한 방어라기보다 UI가 바뀌어도 안전하도록 걸어둔 것이다.

**실습 내용:** `useEffect` 안에 ① `page` 변경 시 `apiFetch<PagingResponse<Challenge>>` 호출, ② `loading`/`error` 초기화와 `finally`에서 로딩 해제, ③ `ApiError` 여부로 메시지 분기(`LoginPage`와 동일 패턴), ④ 경쟁 상태 방어용 `cancelled` cleanup을 `TODO(human)`으로 작성. 이후 로컬 `challenge-api`와 dev 서버를 띄워 `/signup` → `/login` → `/challenges`를 브라우저로 확인했다.

**흔한 실수 (직접 겪음) — 4번의 시도:**
- **1차 시도:** 로딩·에러 처리까지 포함해 기본 fetch 로직은 처음부터 맞게 작성.
- **2차 시도:** cleanup(`cancelled`)을 추가했지만 가드가 `try`의 성공 경로에만 있어서, `catch`(오래된 요청의 에러 표시)와 `finally`(로딩 조기 해제)는 여전히 무방비.
- **3차 시도:** `catch`/`finally`에 가드를 추가하면서 `finally` 안에 `setLoading(false);`를 조건 없이 한 줄 더 남김 — 문법적으로 유효해서 빌드·린트가 못 잡았고, 코드 리뷰로 발견. 이 줄 때문에 `if (!cancelled)` 조건이 무력화되어 있었다.
- **4차 다듬기:** 중복 줄 삭제 후 Playwright로 실제 동작 검증.

**남겨둔 것:** 로그아웃 상태(토큰 없음)에서 `/challenges`에 들어가면 401 에러 메시지만 표시하고 `/login`으로 보내지 않는다. 인증 가드(보호된 라우트)는 별도 주제로 다룰 것. 다음은 Phase 2의 `/mypage`, 그리고 `/challenges/:id` 상세·랭킹·피드 탭으로 이어감.


---

## 14단계: challenge-api 연동 ⑤ — 챌린지 상세 탭 (`useParams`, `data: null` 처리)

**실습 파일:** `src/pages/ChallengeDetailPage.tsx` (공용 타입 `src/types/challenge.ts` 신설)

**배경:** Phase 2의 두 번째 화면. 목록과 골격(`useEffect` + 로딩/에러/데이터 + `cancelled` cleanup)은 같지만, 이번엔 URL 파라미터로 어떤 리소스를 가져올지 결정하고, 백엔드가 **존재하지 않는 id에도 404가 아니라 `200 OK` + `data: null`로 응답**한다는 새 조건이 있다. 탭(상세 | 랭킹 | 피드)은 `useState<Tab>`으로 전환하며, 이번 단계에서는 상세 탭만 구현하고 나머지는 자리 표시만 둔다.

**배운 개념:**

**1) `useParams()`는 항상 `string | undefined`를 돌려준다**
```tsx
const { id } = useParams(); // /challenges/:id 의 id
```
라우트 정의(`/challenges/:id`)와 타입 시스템은 연결돼 있지 않아서, 파라미터는 무조건 문자열(또는 `undefined`)이다. 그래서 `id`가 없는 경우를 직접 걸러야 하고, 숫자여야 한다는 제약도 프론트가 스스로 검증하거나 서버 에러(`/challenges/abc` → 400 `Validation failed (numeric string is expected)`)에 맡겨야 한다. 이번에는 빈 값만 프론트에서 걸러 "잘못된 접근입니다."를 보여주고, 형식 오류는 서버 메시지를 그대로 노출했다(영어 원문이 보이는 점은 나중에 다룰 주제).

**2) 성공 응답(`200`) 안에 숨은 "없음" — `ApiError`로는 잡히지 않는다**
```tsx
const response = await apiFetch<Challenge | null>(`/challenge/${id}`, { token });
if (cancelled) return;
if (!response) { setError("존재하지 않는 챌린지입니다."); return; }
setChallenge(response);
```
`apiFetch`는 `!res.ok`일 때만 `ApiError`를 던지므로, 서버가 `200 + data: null`을 돌려주면 그냥 성공으로 통과한다. 제네릭을 `Challenge | null`로 주면 `null` 체크를 빼먹을 때 타입 오류로 알려주는 것까지가 타입 시스템이 해주는 일이고, 서버가 그 모양으로 응답한다는 보장은 12단계와 마찬가지로 실제 요청으로만 확인할 수 있다(`curl`로 `/challenge/999999`를 쳐서 발견).

**3) 경쟁 상태 가드는 `await` 직후 가장 먼저 — 가드 앞에 상태를 건드리는 분기를 두면 그게 새 구멍이 된다**
`null` 분기를 `cancelled` 확인보다 앞에 두면, `/challenges/999999` → `/challenges/411`로 이동했을 때 늦게 도착한 999999의 `null` 응답이 `setError`를 호출해 정상 화면을 "존재하지 않는 챌린지입니다."로 덮어쓴다. 순서만 `if (cancelled) return;` → `if (!response) ...`로 바꾸면 막힌다. 13단계의 `catch`/`finally` 가드 누락과 같은 유형이다.

**4) 경쟁 상태를 SPA 내비게이션으로 재현하기**
Playwright로 `999999` 응답만 3초 지연시키고, 새로고침 없이 클라이언트 라우팅(`history.pushState` + `popstate`)으로 `411`로 이동했다.
- 대조군(`null` 분기가 가드보다 앞): 최종 화면 "존재하지 않는 챌린지입니다." — 오래된 응답이 덮어씀.
- 현재 코드(가드가 먼저): 411의 상세 정보가 유지됨.

13단계와 마찬가지로 대조군에서 먼저 버그가 재현돼야 검증의 의미가 있다. 다만 이번엔 "같은 컴포넌트가 다른 `id`로 다시 실행되는" 경우라 페이지 전체 새로고침(`goto`)으로는 재현되지 않고, 클라이언트 내비게이션이 필요했다.

**5) 공용 타입 분리 — `src/types/challenge.ts`**
목록과 상세가 같은 `Challenge` 모양을 쓰므로 한 파일로 뽑아 어긋남을 막았다. `type` 필드는 값의 의미(점수형/횟수형 등)가 백엔드 코드에 정의돼 있지 않아 원본 숫자 그대로 표시한다.

**실습 내용:** `useEffect` 안에 ① `id` 유효성 검사(빈 값 → "잘못된 접근입니다."), ② `apiFetch<Challenge | null>` 호출, ③ `null`이면 "존재하지 않는 챌린지입니다." 에러 세팅, ④ `cancelled` cleanup과 `catch`/`finally` 가드를 `TODO(human)`으로 작성. `/challenges/411`(정상), `/challenges/999999`(없음), `/challenges/abc`(형식 오류), 탭 전환을 브라우저로 확인.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** 목록 화면에서 배운 `catch`/`finally` 가드, `id` 검증, `null` 처리는 모두 반영했으나 `null` 분기를 `cancelled` 확인보다 앞에 둠 — 문법·타입·린트 모두 통과하고 단일 요청에서는 정상 동작해서, 이동 중 늦게 도착한 응답이라는 특수한 타이밍에서만 드러나는 버그.
- **2차 다듬기:** `if (cancelled) return;`을 `null` 분기보다 앞으로 옮기고 Playwright로 재현·검증.

**남겨둔 것:** `abc` 같은 형식 오류 메시지가 서버의 영어 원문 그대로 노출됨(프론트에서 `Number(id)` 검증으로 걸러 한국어 메시지를 보여줄지는 미정). 랭킹·피드 탭은 자리 표시만 있음. 다음은 랭킹 탭(`GET .../participation/challenge/:id/rank`)과 피드 탭(`GET /feed/challenge/:id/feeds`), 그리고 `/mypage`.


---

## 15단계: challenge-api 연동 ⑥ — 랭킹 탭 (탭 컴포넌트 분리, 표시용 변환 함수)

**실습 파일:** `src/components/ChallengeRankTab.tsx` (`ChallengeDetailPage.tsx`에서 `tab === "rank"`일 때 마운트). 공용 타입 `src/types/paging.ts`(목록 화면에서 이동), `src/types/participation.ts` 신설.

**배경:** 상세 화면의 두 번째 탭. 백엔드 `GET /participation/challenge/:id/rank`는 목록과 같은 `{ items, meta }` 모양이지만 몇 가지 특징이 있다. ① **참가자만 조회 가능**(미참가 시 `403 "참가하지 않았습니다."`), ② 항목에 **사용자 정보가 없고**(`id`, `score`, `challenge_count`, `status`, `complete_date`뿐) **순위도 서버가 주지 않는다**, ③ 챌린지 `type`이 `0`이면 `score`, 아니면 `challenge_count` 기준으로 정렬, ④ 서버가 상위 100위까지만 노출(`meta.total`은 최대 100). `status`는 `0` 진행 중 / `1` 완료 / `2` 포기.

**배운 개념:**

**1) 탭 = 조건부 렌더링 = 공짜 lazy fetch**
```tsx
{tab === "rank" && <ChallengeRankTab challengeId={challenge.id} type={challenge.type} />}
```
탭 컴포넌트는 그 탭을 처음 열 때 마운트되어 그때 요청하고, 다른 탭으로 가면 언마운트된다. 따로 "탭이 열렸을 때만 요청"하는 로직을 짤 필요가 없다. 대신 탭을 오갈 때마다 다시 요청하므로, 캐싱이 필요하면 별도로 설계해야 한다.

**2) 페이지 안의 fetch 골격을 컴포넌트로 옮겨도 그대로 재사용된다**
`useEffect` + `loading`/`error`/데이터 + `cancelled` cleanup + `catch`/`finally` 가드는 13·14단계와 같은 골격이다. 의존성 배열이 `[challengeId, page, token]`으로 늘었을 뿐이다. 세 번째 복붙이므로, 한 화면(피드 탭이나 `/mypage`)을 더 만들면 `useFetch` 같은 커스텀 훅으로 뽑을 신호다.

**3) 서버가 주지 않는 값(순위)은 프론트가 페이지 위치로 계산한다 — 1-based 페이지의 오프셋은 `page - 1`**
```ts
rank: (meta.page - 1) * meta.limit + index + 1
```
서버도 `(page - 1) * limit`로 오프셋을 계산하므로 같은 공식을 써야 화면 순위와 서버 순위가 일치한다. `meta.page`(서버 응답)를 쓴 이유는, 컴포넌트 상태 `page`는 요청을 보낸 시점에 이미 바뀌었을 수 있지만 `meta.page`는 지금 화면의 `items`와 항상 같은 응답에서 온 값이기 때문이다.

**4) 화면 표시용 변환은 하나의 순수 함수로 — 그리고 한 조건은 한 곳에서 분기**
`toRankRow(item, index, meta, type)`이 `RankRow`(순위·값·단위·상태 라벨)를 돌려준다. `value`와 `unit` 모두 `type === 0`으로 분기하는데, 두 분기가 따로 놀면 어긋날 수 있다(이번에 실제로 그랬다 — 아래 참고). 상태 라벨은 `Record<number, string>` 매핑에 `?? ""` 폴백을 두어 서버가 예상 밖의 값을 주더라도 화면이 깨지지 않게 했다.

**5) 실제 데이터로 화면을 봐야 드러나는 버그 — 검증용 데이터는 "값이 서로 달라야" 의미가 있다**
테스트 계정을 점수형(410)·횟수형(411) 챌린지에 참가시키고 `score=7`, `challenge_count=3`처럼 **일부러 서로 다른 값**을 넣었다. 부하 테스트 데이터로 이미 참가자 100명(10페이지)이 있어 1·2페이지 경계를 확인하기 좋았다. 미참가 챌린지(409)는 서버 메시지 "참가하지 않았습니다."가 그대로 표시되고 탭 UI는 유지되는 것도 확인했다.

**실습 내용:** `toRankRow`를 `TODO(human)`으로 작성 — ① 페이지가 넘어가도 이어지는 순위, ② 챌린지 유형에 따라 `score`("점") 또는 `challenge_count`("회") 선택, ③ `status` 0/1/2 → "진행 중"/"완료"/"포기" 변환. `Playwright`로 410·411의 1·2페이지 첫/끝 항목을 확인.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** 빌드·린트·타입 모두 통과했지만 화면에서 두 가지 버그가 드러남. (a) `meta.page * meta.limit + index + 1` — `page`가 1부터 시작해서 1페이지 첫 항목이 `1위`가 아니라 `11위`로 나옴(`page - 1` 누락). (b) `value`는 항상 `item.score`인데 `unit`만 `type`으로 분기 — 횟수형 챌린지에서 `1위 500회`가 아니라 `11위 0회`로 표시됨(값과 단위의 분기 불일치).
- **2차 다듬기:** `(meta.page - 1)`로 수정하고 `value`도 `type === 0 ? item.score : item.challenge_count`로 통일, 상태 라벨에 `?? ""` 폴백 추가. Playwright로 재확인해 410은 `1위 10000점`~, 411은 `1위 500회`~, 2페이지는 `11위`부터 시작하는 것까지 확인.

**남겨둔 것:** 미참가 시 안내가 서버 메시지(`403`)뿐이고 "참가하기" 버튼은 없다(Phase 4에서 참가/포기 버튼 추가 예정). 내 순위(`GET .../rank/me`)는 아직 표시하지 않는다. 폴백 `?? ""`는 빈 라벨을 만들 뿐이라 "알 수 없음" 같은 명시적 표시로 바꿀지는 미정. 다음은 피드 탭(`GET /feed/challenge/:id/feeds`)과 `/mypage`.


---

## 16단계: challenge-api 연동 ⑦ — 마이페이지 (병렬 요청 → 조각 분리 + 페이지네이션)

**실습 파일:** `src/pages/MyPage.tsx`(조합 전용), `src/components/MyProfileSection.tsx`, `src/components/MyParticipationSection.tsx`. 공용 타입 `src/types/user.ts` 신설, `STATUS_LABELS`를 `src/types/participation.ts`로 이동(랭킹 탭과 공유).

**배경:** Phase 2의 마지막 화면 중 하나. `GET /user/me`는 `{ id, email }`로 단순하지만, `GET /participation/challenge/mine`은 항목이 `{ id, score, challenge_count, status, complete_date }`뿐이라 **어느 챌린지의 참가 기록인지 알 수 있는 필드(`challenge_id`, 제목)가 없다**(백엔드가 `challenge` 관계를 조회하지도, DTO에 담지도 않음). 그래서 "내 참가 챌린지 목록"은 제목·상세 링크 없이 점수/횟수/상태만 표시하는 형태로 만들었다. 백엔드까지 고칠지 물었고, 이 프로젝트의 범위(프론트)를 지키기로 해서 **백엔드 수정 요청 항목으로만 남겼다.**

**배운 개념:**

**1) 서로 의존하지 않는 요청은 `Promise.all`로 동시에 — 하지만 꼭 필요한 건 아니다**
```tsx
const [userResponse, participationResponse] = await Promise.all([
  apiFetch<User>("/user/me", { token }),
  apiFetch<PagingResponse<Participation>>(`/participation/challenge/mine?page=1&limit=${LIMIT}`, { token }),
]);
```
`await`를 차례로 걸면 응답 시간이 합산되지만 `Promise.all`은 둘을 동시에 보내 더 느린 쪽 시간만큼만 걸린다(브라우저에서 두 요청의 시작 시각 차이가 0ms인 것으로 확인). 배열의 각 결과는 구조 분해로 받고, 각 요소의 타입도 `apiFetch<T>`의 `T`로 따로 추론된다. 대신 하나라도 실패하면 즉시 거부되어 화면 전체가 에러가 된다. 그러나 이 화면의 두 조각은 독립적이라 이 정책은 과하다.

**2) 독립적인 화면 조각은 컴포넌트로 분리하면 상태 소유가 구조로 드러난다**
`MyProfileSection`(내 정보)과 `MyParticipationSection`(참가 기록)이 각자 fetch와 `loading`/`error`를 갖는다. 이렇게 하면
- 한쪽이 실패해도 다른 쪽은 그대로 보인다(부분 성공이 별도 코드 없이 생긴다).
- `page`는 참가 기록 조각만의 상태라, 페이지를 넘겨도 `/user/me`는 다시 요청되지 않는다(페이지를 두 번 이동한 뒤 추가 `/user/me` 요청 0건으로 확인).
- 병렬 요청에 `Promise.all`이 필수는 아니다. 두 이펙트는 각자 실행되므로 요청은 여전히 동시에 나간다.
한 컴포넌트에 합쳐 두면 "무엇이 무엇을 다시 요청하게 하는가"를 의존성 배열로 일일이 통제해야 한다.

**3) `useEffect` 안의 fetch는 "처음 실행"과 "재실행"의 초기화 요구가 다르다**
```tsx
try {
  setLoading(true);   // 재실행 때 로딩을 다시 켠다
  setError("");       // 이전 에러를 지운다
  const response = await apiFetch(...);
```
처음에는 `useState(true)`가 로딩을 대신 켜 주지만, `page`가 바뀌어 재실행될 때는 이펙트가 직접 되돌려야 한다. 빠지면 두 가지가 생긴다. ① 페이지 이동 중 로딩 표시가 없고 이전 페이지 목록이 그대로 보이다가 갑자기 바뀐다(이전/다음 버튼도 계속 보여서 연타 보호도 사라진다). ② 한 번 세팅된 `error`가 지워지지 않고, 렌더링이 `error`를 `items`보다 먼저 검사하므로 이후 요청이 성공해도 에러 화면이 남는다. 새로고침 말고는 회복 불가.

**4) StrictMode(개발 모드)의 이중 실행이 `cancelled` cleanup을 실제로 검증해 준다**
`main.tsx`가 `<StrictMode>`라서 개발 모드에서는 이펙트가 "실행 → cleanup → 재실행"된다. 그래서 초기 로드에서 `/user/me`와 `mine`이 각각 두 번씩 나갔다. 첫 실행은 `cancelled = true`로 결과가 무시되고 두 번째 실행의 결과만 반영된다. 운영 빌드에서는 한 번만 나간다.

**5) 값이 서로 다른 검증 데이터와 참가 기록 여러 건이 필요한 화면은 테스트 데이터를 직접 만든다**
페이지 이동을 보려면 참가 기록이 11건 이상이어야 해서, 테스트 챌린지 `[mypage-test]` 10개(id 1163~1172)를 만들고 참가시켰다(총 12건, 2페이지). 로딩 표시와 에러 회복은 `page.route`로 응답을 지연시키거나 한 번만 `abort`시켜 재현했다.

**실습 내용:** 처음에는 `MyPage` 한 컴포넌트에서 `Promise.all`로 두 요청을 동시에 보내는 `useEffect`를 `TODO(human)`으로 작성 → 이후 "하나라도 성공하면 보여주는 게 낫지 않은가", "페이지가 항상 1이어야 하는가"라는 질문에서 출발해 조각 분리 + 참가 기록 페이지네이션(옵션 C)으로 재구성. `MyParticipationSection`의 `page`에 반응하는 fetch를 `TODO(human)`으로 작성.

**흔한 실수 (직접 겪음) — 3번의 시도:**
- **1차 시도(`Promise.all` 한 컴포넌트):** 동작은 맞았지만 `LIMIT`을 선언만 하고 쓰지 않아 빌드가 실패(`TS6133`). 이를 고치다 URL이 `?page=&limit=${LIMIT}`로 **`page` 값이 빠지는 실수**가 생김 — 서버는 빈 값을 `0`으로 변환해 `@Min(1)`에서 400을 돌려줄 것. URL을 문자열로 조립하면 값 누락이 타입 검사에 안 걸린다.
- **2차 시도(조각 분리 후):** `cancelled` 가드와 `catch`/`finally`는 정확했지만 시작 부분의 `setLoading(true)`/`setError("")`가 빠짐. 빌드·린트·타입 통과, 첫 페이지 로딩도 정상이라 "다른 페이지로 이동"과 "에러 뒤 회복"을 실제로 해 봐야만 드러남.
- **3차 다듬기:** 두 줄 추가 후 같은 브라우저 시나리오 재실행 — 응답 대기 중 "불러오는 중..." 표시, 에러 뒤 정상 응답 시 목록 회복, 페이지 이동 시 `/user/me` 추가 요청 0건 확인.

**남겨둔 것:** ① 참가 기록에 챌린지 제목·링크가 없음(백엔드가 `challenge_id`/제목을 응답에 담아야 해결 — 백엔드 수정 요청 항목). ② 로그아웃 후(토큰 `null`) 화면에 `Unauthorized`만 표시되고 `/login`으로 이동하지 않음(인증 가드는 별도 주제). ③ 목록·상세·랭킹·마이페이지가 같은 fetch 골격을 반복함 — 이번 세션에서 겪은 실수 유형(`finally` 중복, 분기 순서, 시작 초기화 누락)이 모두 이 반복에서 나왔으므로 `useFetch` 훅 추출을 다음 후보로. ④ 테스트 계정(`list-test-17975@example.com`)에 참가 기록 12건이 남아 있음(참가 삭제 API 없음). 다음은 피드 탭(`GET /feed/challenge/:id/feeds`).


---

## 17단계: 공용 헤더 + 인증 가드 — 레이아웃 라우트와 `<Navigate>`

**실습 파일:** `src/components/AppLayout.tsx`(신규), `src/App.tsx`(라우트 재구성). 헤더로 옮기면서 `MyProfileSection`의 로그아웃 버튼과 `MyPage`의 `← 챌린지 목록` 링크를 삭제.

**배경:** 마이페이지까지 만들고 나니 화면마다 `← 목록` 링크가 따로 있고 마이페이지로 가는 링크는 어디에도 없었으며, 토큰이 없으면 목록과 마이페이지 모두 `Unauthorized`만 표시하고 `/login`으로 보내지 않았다(11~16단계 내내 "남겨둔 것"이었던 문제). 헤더에서 "챌린지 / 마이페이지"를 나누자는 제안에서 출발해, 그 헤더를 담는 레이아웃 라우트가 인증 가드를 넣기에 가장 자연스러운 자리라는 점을 함께 해결(범위 B).

**배운 개념:**

**1) 레이아웃 라우트 — `path` 없는 부모 라우트 + `<Outlet />`**
```tsx
<Route path="/login" element={<LoginPage />} />
<Route element={<AppLayout />}>
  <Route path="/mypage" element={<MyPage />} />
  <Route path="/challenges" element={<ChallengeListPage />} />
  ...
</Route>
```
부모에 `path`가 없으면 URL에는 영향을 주지 않고, 자식 라우트가 매칭될 때 부모의 `<Outlet />` 자리에 그려진다. 헤더는 `AppLayout` 한 곳에만 있고, 화면을 이동해도 다시 마운트되지 않는다. `/login`·`/signup`은 레이아웃 밖에 두어 헤더가 나오지 않게 했다.

**2) `NavLink` — 현재 위치 강조를 공짜로**
`style={({ isActive }) => ...}`로 활성 링크만 굵게 표시. `/challenges/411`처럼 하위 경로에서도 "챌린지"가 활성으로 유지된다(경로 접두사 매칭). 로그인 상태에서 `/challenges`와 `/challenges/411` 모두 "챌린지" 700 / "마이페이지" 400, 헤더 링크로 마이페이지 이동 시 "마이페이지" 700으로 확인.

**3) 가드는 각 화면이 아니라 레이아웃 한 곳에 — 그리고 Hook보다 아래에**
```tsx
const { token, logout } = useAuth();   // Hook은 조건문보다 위
if (!token) {
  return <Navigate to="/login" replace />;
}
```
가드가 자식(`<Outlet />`)을 렌더링하기 전에 막으므로, 보호 화면이 마운트조차 되지 않는다. 그래서 토큰 없이 `/mypage`에 직접 들어가도 보호 화면이 보낸 API 요청이 0건이고 `Unauthorized`도 뜨지 않는다. 로그아웃하면 `token`이 `null`이 되는 순간 자동으로 `/login`으로 이동한다(헤더의 로그아웃 버튼에 별도 `navigate`가 필요 없다). 12단계에서 `apiFetch`가 응답 봉투를 한 곳에서 벗기던 것과 같은 "한 곳만 고치면 되는" 구조.

**4) `<Navigate replace>` — 히스토리를 쌓지 않는다**
`replace`가 없으면 리다이렉트가 히스토리에 새 항목을 추가해서 뒤로가기가 보호 화면으로 되돌아가고, 가드가 다시 튕겨내는 루프에 갇힌다. `replace`가 있으면 보호 화면 항목이 `/login`으로 대체된다. 대조군(`replace` 제거)과 비교하면 히스토리 길이가 시작 2 → 리다이렉트 후 **5**(대조군)와 **3**(`replace`)으로 갈렸다. 뒤로가기 1회 후 URL은 두 경우 모두 `/login`인데, 가드가 보호 화면 복귀를 다시 튕겨내기 때문 — 차이는 URL이 아니라 히스토리에 쌓이는 항목 수에서 드러난다. 개발 모드의 `StrictMode`가 이펙트를 두 번 실행해서 `replace` 없는 `Navigate`는 항목을 두 번 쌓는다.

**5) 기능이 옮겨가면 원래 자리의 중복을 지운다**
로그아웃 버튼은 `MyProfileSection`에서 헤더로, `MyPage`의 `← 챌린지 목록`은 삭제. 화면의 액션(`새 챌린지`)과 상위로 돌아가기 성격의 링크(상세 화면의 `← 목록`)는 남겼다.

**실습 내용:** `AppLayout`의 `TODO(human)` — `useAuth()`에서 `token`을 꺼내 없으면 `<Navigate to="/login" replace />`를 반환. Playwright로 ① 토큰 없이 `/mypage` 직접 접근 시 `/login` 이동 + API 요청 0건, ② 로그인 상태의 헤더 강조·이동, ③ 로그아웃 시 `/login` 이동 + 토큰 삭제 + 로그인 화면에 헤더 없음, ④ `replace` 유무에 따른 히스토리 길이 차이를 확인.

**흔한 실수 (직접 겪음) — 1번의 시도:** 첫 시도부터 정확했다. `token`을 구조 분해에 추가, `Hook` 아래에서 조건 분기, `replace` 옵션까지 모두 반영. 지난 단계들과 달리 이번에는 검증에서 추가 수정이 필요한 결함이 없었다. (검증 스크립트 쪽에서는 목록 화면의 `새 챌린지` 링크가 "챌린지"로 매칭되는 셀렉터 모호성 오류가 있었으나 코드 문제가 아니라 테스트 문제.)

**남겨둔 것:** ① 로그인 성공 후 이동 위치가 `/challenges` 고정 — 원래 가려던 주소로 되돌리기(`state={{ from: location }}`)는 다루지 않음. ② 이미 로그인한 사용자가 `/login`에 오면 그대로 로그인 화면을 보여줌(반대 방향 가드 없음). ③ 토큰이 만료·무효인 경우 보호 화면에서 서버가 401을 돌려줄 때는 여전히 화면에 `Unauthorized`만 표시됨(토큰 존재 여부만 확인하고 유효성은 확인하지 않음). ④ 헤더는 최소한의 인라인 스타일만 적용 — 시각적 디자인은 범위 밖. 다음은 `useFetch` 훅 추출과 피드 탭.


---

## 18단계: `useFetch` 커스텀 훅 추출 — 다섯 번 반복한 fetch 골격을 한 곳으로

**실습 파일:** `src/hooks/useFetch.ts`(신규). 이 훅으로 바꾼 곳: `ChallengeListPage`, `ChallengeDetailPage`, `ChallengeRankTab`, `MyProfileSection`, `MyParticipationSection`.

**배경:** 13~16단계에서 `useEffect` + `loading`/`error`/데이터 + `cancelled` 가드 + `finally` 골격을 다섯 번 손으로 썼고, 그때마다 같은 종류의 실수를 반복했다(13단계 `finally`의 중복 `setLoading(false)`, 14단계 `null` 분기가 `cancelled` 가드보다 앞에 놓임, 16단계 시작 초기화 `setLoading(true)`/`setError("")` 누락). 8단계에서 배운 커스텀 훅(`useAutoHide`)의 개념을 "반복되는 상태 + 이펙트 묶음"에 적용한 것. 훅이 "시작 초기화 → `await` 직후 `cancelled` → `catch`/`finally` 가드"를 한 곳에서 보장하면 이런 실수가 구조적으로 사라진다.

**배운 개념:**

**1) 훅의 입력은 원시값(`string`) 하나 — 변수는 호출자가 경로에 녹여 넘긴다**
```ts
function useFetch<T>(path: string | null): { data: T | null; loading: boolean; error: string }

const { data, loading, error } = useFetch<PagingResponse<Challenge>>(
  `/challenge?page=${page}&limit=${LIMIT}`,
);
```
문자열은 값이 같으면 같은 것으로 비교되므로 의존성 배열(`[path, token]`)에 그대로 넣을 수 있다. 객체나 함수를 인자로 받으면 매 렌더링마다 새로 만들어져 무한 재요청이 생기기 쉽다. `token`은 훅이 `useAuth()`에서 직접 꺼내므로 호출자가 매번 `{ token }`을 넘기지 않아도 되고, 나중에 401 공통 처리를 넣을 때도 이 훅과 `apiFetch` 두 곳만 손보면 된다.

**2) 제네릭 `T`에 `null`을 포함하면 "서버가 성공 응답으로 돌려준 없음"을 표현할 수 있다**
```ts
const { data: challenge, loading, error } = useFetch<Challenge | null>(id ? `/challenge/${id}` : null);
if (!challenge) return <p>존재하지 않는 챌린지입니다.</p>;  // loading·error가 아닌데 null
```
"아직 로딩 전이라 `null`"과 "서버가 `data: null`을 돌려줘서 `null`"은 `loading`으로 구분된다(로딩이 끝났고 에러가 없는데 `null`이면 후자). 14단계에서 이펙트 안에서 `if (!response) setError(...)`로 처리하던 것을 화면 쪽 분기로 옮겼고, 이 경우 `null` 응답에서 `setError`를 호출할 일이 없으니 "가드 앞 상태 변경" 실수가 생길 여지도 사라진다.

**3) `path === null` — "아직 요청할 수 없는 상태"를 값으로 표현**
`null`이면 요청 없이 `loading`을 `false`로 끝낸다(`loading`의 초기값도 `path !== null`). Hook은 조건부로 호출할 수 없으므로 "요청하지 않을 때"를 인자 값으로 표현하는 방식이다. `ChallengeDetailPage`에서는 `id`가 없을 때 `null`을 넘기고 `if (!id)`로 안내 문구를 보여준다. (라우트가 항상 `:id`를 주므로 브라우저로 이 경로를 직접 재현하지는 못했다.)

**4) 이전 `data`를 남길지 비울지 — 정답은 호출자의 UI가 데이터에 얼마나 기대는가에 달려 있다**
훅 안에서 요청 시작 시 `setData(null)`로 비우는 버전으로 5곳을 바꿨더니, `MyParticipationSection`에서만 회귀가 났다. 이 화면은 제목의 전체 건수와 이전/다음 버튼을 `meta`(=`data`)에 의존하는데, 요청이 실패하면 `data`가 `null`이라 버튼이 사라져서 사용자가 재시도할 방법이 없었다(페이지 이동 중 제목의 `(12)`도 깜빡임). 지난번 16단계에서 고친 "에러 뒤 회복"이 다시 깨진 것. `setData(null)` 한 줄을 지워 "요청 중·실패 후에도 마지막 성공 데이터를 유지"하는 방식으로 바꾸자 해결됐다(데이터 페칭 라이브러리에서 stale-while-revalidate라고 부르는 발상과 같다). 나머지 화면은 `if (loading)`, `if (error)`를 먼저 검사해서 이전 데이터가 잘못 보이지 않는다.

**5) 리팩터링 뒤에는 이전 동작을 재현하는 회귀 테스트를 다시 돌린다**
지금까지 만든 Playwright 시나리오(상세 411/999999/abc, 상세 경쟁 상태, 랭킹 값·순위·403, 마이페이지 페이지 이동·로딩·에러 회복·요청 수, 가드·헤더)를 전부 다시 돌려 리팩터링 전과 같은 결과인지 확인했다. 4곳은 그대로였고, 회귀는 이 방법으로만 잡혔다(빌드·린트·타입은 모두 통과했다).

**실습 내용:** `useFetch`의 `useEffect` 본문을 `TODO(human)`으로 작성 — `path`가 `null`이면 요청 없이 종료, 시작 초기화(`loading`, `error`), `await` 직후 `cancelled`, `catch`/`finally` 가드, `ApiError` 분기. 이후 5곳을 훅으로 교체.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** 훅의 골격(시작 초기화, `cancelled` 가드 순서, `finally`, `path === null` 처리)은 모두 정확했고, "이전 `data`를 비울지" 결정에서 `setData(null)`로 비우는 쪽을 택함. 5곳 교체 후 회귀 테스트에서 `MyParticipationSection`의 에러 후 재시도 불가(이전/다음 버튼 사라짐) 발견. 빌드·린트·타입은 통과.
- **2차 다듬기:** `setData(null)` 삭제 후 같은 시나리오로 재확인 — 에러 뒤에도 버튼이 남고 정상 응답이 오면 목록이 회복됨.

**남겨둔 것:** ① `path`가 `null`로 바뀔 때 이전 `data`/`error`가 그대로 남는다(호출자가 `!id` 같은 조건을 먼저 검사해서 지금은 문제없음). ② 뮤테이션(POST/PATCH/DELETE)은 이 훅이 다루지 않음 — 참가/포기, 기록 추가 등 Phase 4에서 별도 패턴이 필요할 것. ③ 재요청(수동 새로고침)을 하는 방법이 없음 — 필요해지면 `refetch` 반환값이나 키 증가 방식을 고려. 다음은 피드 탭을 처음부터 이 훅으로 만들고, 그다음 401 공통 처리와 `LoginPage`의 `replace`(SCREEN_PLAN 보완 과제).

---

## 19단계: 로그인 `replace` + 피드 탭 — 히스토리 스택과 `useFetch` 첫 적용

**실습 파일:** `src/pages/LoginPage.tsx`(수정), `src/components/ChallengeFeedTab.tsx`(신규), `src/types/feed.ts`(신규), `src/pages/ChallengeDetailPage.tsx`(피드 탭 연결). 검증용으로 `playwright`를 devDependency에 추가.

**배경:** 18단계 끝에 남겨둔 순서대로, SCREEN_PLAN의 보완 과제 중 `replace`를 먼저 처리(워밍업)하고, `useFetch`를 처음부터 써서 만드는 첫 화면인 피드 탭을 구현했다. 17단계에서 인증 가드에만 붙였던 `replace`를 로그인 성공 이동에도 적용한 것.

**배운 개념:**

**1) `replace: true`는 히스토리에 새 항목을 쌓지 않고 현재 항목을 덮어쓴다**
```ts
navigate("/challenges", { replace: true });
// push(기본):    [/login] → [/login, /challenges]  → 뒤로가기 = /login
// replace: true: [/login] → [/challenges]          → 뒤로가기 = 로그인 이전 페이지
```
"그 화면에 다시 돌아올 이유가 없는 이동"(로그인 성공, 가드 리다이렉트)에 쓴다. 목록 → 상세처럼 뒤로가기로 돌아와야 하는 이동에는 쓰지 않는다. `true`는 "replace를 켠다"는 뜻이고 기본값 `false`가 push다.

**2) 히스토리 동작은 "이전 항목이 있는 상태"를 만들어야 검증된다**
Playwright에서 `about:blank`를 먼저 거친 뒤 `/login`으로 이동하고 로그인했다. 결과는 `history.length === 2`, 뒤로가기 후 `about:blank`(로그인 화면으로 돌아가지 않음). 시작 페이지가 없으면 `replace` 유무의 차이가 드러나지 않는다.

**3) 같은 응답 형태면 같은 컴포넌트 구조 — `useFetch` 한 줄로 fetch 골격이 사라진다**
```ts
const { data, loading, error } = useFetch<PagingResponse<Feed>>(
  `/feed/challenge/${challengeId}/feeds?page=${page}&limit=${LIMIT}`,
);
const items = data?.items ?? [];
const meta = data?.meta ?? null;
```
피드 API도 `PagingResponse<T>`로 응답하므로 페이지 state와 이전/다음 버튼은 랭킹 탭과 같다. 다른 점은 제네릭 타입뿐이고, 서버 필드(`title`, `content`, `images`)를 그대로 써서 `toRankRow` 같은 변환 함수는 필요 없다. 정렬(최신순)과 페이지 분할은 서버 책임이라 클라이언트는 계산하지 않는다. `page`가 바뀌면 `path` 문자열이 바뀌어 자동으로 재요청된다.

**4) dev에서 요청이 두 번 찍히는 것은 `StrictMode` 때문이다**
`main.tsx`의 `StrictMode`가 이펙트를 마운트 → 정리 → 재마운트로 실행한다. 첫 요청은 `cancelled`로 무시되어 화면에는 영향이 없고, 프로덕션 빌드에서는 한 번만 나간다. `useFetch`의 cleanup이 동작한다는 확인이기도 하다.

**실습 내용:** ① `LoginPage`의 `navigate("/challenges")`에 `{ replace: true }`를 붙이는 것을 `TODO(human)`으로 작성. ② `ChallengeFeedTab`의 `useFetch` 호출과 `items`/`meta` 파생을 `TODO(human)`으로 작성(뼈대·렌더링·탭 연결은 제공). Playwright로 ① 로그인 후 뒤로가기, ② 피드 411 1·2페이지 이동, 410 빈 상태를 확인. 피드가 한 건도 없어서 `POST /feed`로 12건을 넣어 검증하고 `DELETE`로 정리했다.

**흔한 실수 (직접 겪음):**
- **에디터 자동 import:** `{replace: true}`를 입력하다 react-router의 별개 함수 `replace`가 import에 자동으로 붙었다. 옵션 키는 import가 필요 없는 문자열이다. `npm run build`가 `TS6133`(미사용)으로 잡아줬다(`noUnusedLocals`).
- **잔여물:** `TODO(human)` 주석, import 뒤에 남은 쉼표(`{ PagingResponse, }`)는 동작에는 지장이 없지만 커밋 전에 정리.

**남겨둔 것:** ① 피드의 `images`는 지금 "사진 N장" 텍스트만 표시한다. 실제 이미지 표시는 이미지 URL 규칙(업로드 경로)을 확인하고 피드 작성 폼(Phase 3)과 함께 다룬다. ② 피드 항목 클릭 시 `/feeds/:feedId` 상세 이동은 Phase 5. ③ 다음은 401 공통 처리 — `apiFetch`(React 바깥 함수)가 `AuthContext`(React 상태)를 어떻게 바꿀지 설계가 갈림길이다.

---

## 20단계: 401 공통 처리 — React 바깥 함수(`apiFetch`)와 React 상태(`AuthContext`) 잇기

**실습 파일:** `src/api/client.ts`(콜백 등록 함수 + 401 감지), `src/context/AuthContext.tsx`(`AuthProvider`에서 등록). 설계 논의는 `QNA.md` "401 공통 처리는 어디에 두는 게 좋은가?" 참고.

**배경:** 가드는 토큰 "존재"만 확인하고 "유효"는 모른다. 토큰이 무효·만료면 서버가 401을 주지만 화면에는 `Unauthorized`만 떴다. 백엔드는 이미 401을 주므로(만료 1년, 리프레시 없음) 프론트만의 작업이다.

**배운 개념:**

**1) 정책은 한 곳에 — 전송 계층은 알리고, 인증 계층이 결정한다**
```ts
// client.ts — 모든 요청이 지나가는 곳에서 감지만
let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) { unauthorizedHandler = handler; }
if (res.status === 401 && token) unauthorizedHandler?.();

// AuthContext.tsx — 인증 상태를 아는 곳에서 결정
useEffect(() => {
  setUnauthorizedHandler(logout);
  return () => setUnauthorizedHandler(null);
}, [token]);
```
`useFetch`에서 처리하면 GET만 덮이고 뮤테이션마다 다시 붙여야 한다. `apiFetch`에서 감지하면 앞으로의 뮤테이션도 자동으로 덮인다. 토큰을 지우면 17단계의 가드가 `/login`으로 보내므로 `navigate`를 따로 부를 필요가 없다.

**2) 전역에 들어가는 것은 토큰이 아니라 "실행할 함수"다**
토큰은 그대로 `AuthContext` state에 있고, 모듈 변수에는 콜백만 등록한다. 약점(등록 시점, 숨은 결합, 옛 `token`을 물고 있는 콜백)은 cleanup 해제, `[token]` 재등록, 등록 지점을 한 곳으로 제한하는 것으로 완화했다.

**3) 로그인 실패도 401이다 — `token`을 보낸 요청일 때만 "세션 만료"로 본다**
잘못된 비밀번호는 토큰 없이 보낸 요청이므로 콜백이 호출되지 않아 로그인 화면의 에러 메시지("비밀번호가 잘못되었습니다.")가 그대로 표시된다.

**4) cleanup은 이펙트가 한 일을 되돌리는 곳이다 — 대칭이 맞아야 한다**
등록(`set...(logout)`)의 짝은 해제(`set...(null)`)다.

**실습 내용:** `AuthProvider` 안에 `setUnauthorizedHandler`로 `logout`을 등록하는 `useEffect`를 `TODO(human)`으로 작성. Playwright로 ① 정상 로그인 + 새로고침 유지, ② 무효 토큰으로 `/challenges` 진입 시 토큰 삭제 + `/login` 이동, ③ 잘못된 비밀번호 시 에러 메시지 표시를 확인.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** cleanup에 `setToken(null)`을 넣고 의존성 배열을 생략. `StrictMode`가 마운트 직후 cleanup을 실행해 토큰 state가 `null`이 되었고, 로그인 후에도 `/login`에 머물고 새로고침해도 `/login`으로 튕겼다(`localStorage`에는 토큰이 남아 있음). 빌드·린트·타입은 통과해서 브라우저(Playwright)에서만 잡혔다.
- **2차 수정:** cleanup을 `setUnauthorizedHandler(null)`로, 의존성을 `[token]`으로 바꿔 세 시나리오 모두 통과.

**남겨둔 것:** ① `react-hooks/exhaustive-deps` 경고(`logout`이 의존성에 없음) — `[token]`이라 동작은 맞지만 `logout`이 다른 값을 참조하도록 바뀌면 옛 값을 쓰는 stale closure가 생길 수 있다. `useCallback`으로 감싸고 `[logout]`으로 바꾸는 것을 보완 과제로 등록(`SCREEN_PLAN.md`). ② 401이 나면 `useFetch`가 잠깐 `Unauthorized` 에러를 표시한 뒤 가드가 이동시킨다(깜빡임 가능). ③ 동시 요청이 여러 개 401을 받아도 `logout`은 `token`이 있을 때만 동작해 결과는 같다. 다음은 Phase 3 — 챌린지 생성/수정 공용 폼.

---

## 21단계: 챌린지 생성/수정 공용 폼 — 첫 쓰기 화면 (제어 폼 + POST/PATCH + 서버 검증 에러 표시)

**실습 파일:** `src/components/ChallengeForm.tsx`(신규), `src/pages/ChallengeFormPage.tsx`(구현), `src/types/challenge.ts`(`ChallengeInput` 추가). 라우트(`/challenges/new`, `/challenges/:id/edit`)와 목록의 "새 챌린지" 링크는 기존 것을 사용.

**배경:** Phase 2까지는 읽기(GET)만 했다. Phase 3의 첫 항목으로, 같은 폼을 생성(`POST /challenge`)과 수정(`PATCH /challenge/:id`)에 함께 쓴다. `SCREEN_PLAN`의 진행 방식대로 갈림길 두 개를 먼저 정했다: 수정 모드의 초기값 로딩은 "페이지가 로딩, 폼은 초기값을 받는다", 제출 성공 후에는 "상세로 `replace` 이동".

**배운 개념:**

**1) 폼 state는 전부 `string`, 제출할 때만 숫자로 변환**
```ts
interface ChallengeFormValues { type: string; mininum_count: string; ...; start_date: string; }
onSubmit({ type: Number(form.type), mininum_count: Number(form.mininum_count), ... });
```
`<input>`의 값은 항상 문자열이라 `""` 같은 입력 중간 상태를 그대로 담을 수 있다. 변환은 제출 시점 한 곳에서만 한다. 하나의 `handleChange`가 `name`으로 필드를 구분하는 패턴은 7단계와 같다(`input`/`textarea`/`select`를 하나의 이벤트 타입으로 묶음).

**2) 생성/수정 공용 폼 — 모드는 "초기값이 있는가"로 구분**
```tsx
<ChallengeForm key={id ?? "new"} initialValues={challenge ? toFormValues(challenge) : undefined} onSubmit={handleSubmit} />
```
페이지(`ChallengeFormPage`)가 `useFetch`로 로딩하고, 로딩이 끝난 뒤에야 폼을 렌더링하므로 폼은 `initialValues`를 `useState` 초기값으로만 쓴다. `useEffect`로 폼을 덮어쓰는 코드가 필요 없다. `key`는 다른 챌린지로 이동했을 때 폼 state를 새로 시작시킨다. `useFetch(null)`(생성 모드)은 요청을 보내지 않는다(18단계의 `path === null`).

**3) 폼은 화면, 저장은 페이지 — `onSubmit`이 던지면 폼이 메시지를 보여준다**
```ts
// 페이지: 성공/실패 판단 없이 그대로 던진다
const response = await apiFetch<Challenge>(path, { method, token, body: input });
navigate(`/challenges/${isEdit ? id : response.id}`, { replace: true });
// 폼: catch에서 ApiError면 서버 메시지를 그대로 표시
```
날짜 오류("날짜 설정이 잘못되었습니다"), 중복 제목("중복된 제목입니다."), 권한 오류("작성자만 접근 가능합니다")를 서버가 판단하고 프론트는 메시지만 보여준다. 클라이언트 검증은 "빈 값 제출 방지"까지만 한다.

**4) 두 종류의 경로를 구분한다 — API 경로와 프론트 라우트**
API는 `/challenge`(단수), 프론트 라우트는 `/challenges`(복수)다. 이동에 API 경로를 쓰면 저장은 되지만 빈 화면이 된다.

**5) 날짜는 `<input type="date">`가 다루는 형식으로 맞춘다**
서버 응답은 ISO 문자열이라 `slice(0, 10)`으로 `YYYY-MM-DD`만 폼에 넣고, 요청은 `"2026-10-01"` 그대로 보낸다(서버의 `@Type(() => Date)`가 변환). 자정 근처에서는 타임존에 따라 하루 어긋날 수 있다는 점은 남겨둔다.

**실습 내용:** `handleSubmit`을 `TODO(human)`으로 작성 — `isEdit`으로 `path`/`method`를 정하고 `apiFetch` 한 번으로 저장, 성공하면 상세로 `replace` 이동, 실패는 그대로 throw. Playwright로 ① 빈 폼 제출 비활성, ② 날짜 오류 400 메시지, ③ 생성 후 이동과 뒤로가기, ④ 중복 제목 409, ⑤ 수정 초기값과 저장, ⑥ 남의 글(411) 수정 403(원본 불변), ⑦ 없는 챌린지를 확인. 테스트로 만든 챌린지는 `DELETE`로 정리.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** `handleSubmit`의 로직(모드 분기, `token` 전달, throw)은 정확했지만 `navigate`가 API 경로(`/challenge/...`)로 향했다. 빌드·린트·타입은 통과해 코드 리뷰에서 잡았다. `TODO(human)` 주석도 남아 있었다.
- **2차 수정:** `/challenges/...`로 고쳐 7개 시나리오 모두 통과.

**남겨둔 것:** ① 상세 화면에 "수정" 버튼이 없다. 내 글일 때만 보이려면 `GET /user/me`로 내 `id`를 알아야 해서 Phase 5(삭제 버튼)와 함께 처리한다(SCREEN_PLAN에 등록). ② 제출 후 상세로 이동할 때 잠깐 로딩이 보인다. ③ 제출 중 뒤로가기 등으로 화면을 떠나면 늦게 온 응답의 `navigate`가 실행될 수 있다(취소 처리는 안 함). ④ `type` 값(0/1)의 라벨이 폼(점수형/횟수형), 랭킹 탭(점/회), 상세 화면(숫자 그대로)에 흩어져 있다 — 상수로 모을지 고민할 것. 다음은 피드 작성/수정 폼(이미지 최대 3장, multipart).

---

## 22단계: 피드 작성/수정 폼 + 탭을 URL 쿼리로 — `FormData` 전송과 `useSearchParams`

**실습 파일:** `src/components/FeedForm.tsx`(신규), `src/pages/FeedFormPage.tsx`(구현), `src/api/client.ts`(FormData 지원), `src/types/feed.ts`(`FeedInput`), `src/components/ChallengeFeedTab.tsx`("피드 작성" 링크), `src/pages/ChallengeDetailPage.tsx`(탭을 `?tab=`으로).

**배경:** Phase 3의 마지막 폼. 챌린지 폼과 구조는 같지만 이미지(최대 3장, 파일당 5MB, jpg/png)를 multipart로 보내야 해서 `apiFetch`가 JSON만 가정하던 부분을 손봤다. 저장 후에는 `/challenges/:id?tab=feed`로 이동하도록 정해서, 챌린지 상세의 탭을 URL 쿼리로 옮기는 작업까지 이어졌다. 백엔드 규칙: 작성은 `POST /feed`(`challenge_id` 필수), 수정은 `PATCH /feed/:feedId`(`challenge_id` 허용 안 함), 수정 시 새 이미지를 보내면 전체 교체·안 보내면 기존 유지.

**배운 개념:**

**1) `FormData`를 보낼 때는 `Content-Type`을 직접 지정하지 않는다**
```ts
...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
```
브라우저가 파일 경계(boundary)를 포함한 헤더를 자동으로 넣는다. `apiFetch`의 한 곳만 바꿨는데도 401 공통 처리(20단계)는 그대로 재사용됐다. 모든 요청이 지나가는 곳에 정책을 둔 이점.

**2) `FormData`는 타입이 없어서 "필수 필드 누락"과 "허용 안 되는 필드"를 컴파일러가 못 잡는다**
JSON 본문에 `ChallengeInput` 타입을 쓰던 챌린지 폼과 다른 점이다. 작성에서 `challenge_id`를 빼먹으면 서버가 400을 주고, 수정에서 `challenge_id`를 보내면 서버가 `property challenge_id should not exist`(400)를 준다(백엔드가 `forbidNonWhitelisted`). 그래서 이런 요청은 브라우저로 실제로 보내보는 검증이 중요하다.

**3) 공용 폼은 한 모드를 고치다 다른 모드가 깨지기 쉽다 — 검사는 값이 필요한 곳에 붙인다**
`if (!challengeId) throw` 같은 검사를 앞쪽에 두고 `challenge_id`를 항상 보내게 했다가 수정 모드가 깨졌다. 작성 모드에서만 `challenge_id`를 붙이고, 그 안에서 `id`를 검사해 타입을 좁힌다.
```ts
if (!isEdit) {
  if (!id) throw new Error("챌린지 정보를 찾을 수 없습니다.");
  form.append("challenge_id", id);
}
```

**4) TypeScript의 타입 좁히기는 "그 변수에 직접 건 검사"에만 반응한다**
`!isEdit`(= `feedId === undefined`)는 `id`가 `string`이라는 정보를 컴파일러에게 주지 못한다. `useParams()`의 `id`는 항상 `string | undefined`라서, 라우트가 보장해도 `id` 자체를 검사해 좁혀야 한다. `id!` 단언은 틀리면 `"undefined"` 문자열이 서버로 가는 조용한 버그가 된다.

**5) 미리보기용 blob URL은 cleanup에서 해제한다**
```ts
useEffect(() => {
  const urls = files.map((file) => URL.createObjectURL(file));
  setPreviews(urls);
  return () => urls.forEach((url) => URL.revokeObjectURL(url));
}, [files]);
```
`URL.createObjectURL`은 브라우저 메모리에 파일 참조를 잡아둔다. cleanup이 "구독 해제"가 아니라 "자원 해제"로 쓰인 첫 사례. 클라이언트에서 개수(3장)·크기(5MB)를 먼저 검사하고, 서버 규칙과 일치시켰다.

**6) 탭 상태를 URL 쿼리로 — 저장하지 말고 URL에서 파생한다**
```ts
const [searchParams, setSearchParams] = useSearchParams();
const value = searchParams.get("tab");
const tab: Tab = value === "detail" || value === "rank" || value === "feed" ? value : "detail";
function setTab(next: Tab) { setSearchParams({ tab: next }); }
```
URL은 사용자가 직접 바꿀 수 있는 입력이라 `string | null`을 `Tab`으로 검증해서 좁힌다(`as Tab` 단언은 이상한 값이 통과). 원본이 URL 하나라서 `useState`와 어긋날 일이 없다(8단계 파생 값과 같은 원리). `replace`를 주지 않아서 탭 이동이 히스토리에 쌓이고 뒤로가기가 탭을 되돌린다.

**7) 렌더링 중에 부수 효과(URL 변경)를 하지 않는다**
`if (!searchParams.get("tab")) setSearchParams(...)`처럼 기본값을 쿼리에 써넣는 코드는 렌더링 중 부수 효과다(QNA의 "렌더링 중 `navigate()` 금지"와 같은 문제). 기본값은 "없으면 detail로 취급"하는 파생으로 처리한다.

**실습 내용:** ① `FeedFormPage`의 `handleSubmit`(FormData 조립, 모드별 `POST`/`PATCH`, 성공 시 `?tab=feed`로 `replace` 이동)을 `TODO(human)`으로 작성. ② `ChallengeDetailPage`의 탭을 `useSearchParams`로 옮기는 것을 `TODO(human)`으로 작성. Playwright로 이미지 4장/5MB 초과 에러, 2장 작성(미리보기·서버 저장·이미지 URL 200), 중복 제목, 수정 초기값·제목만 수정(이미지 유지)·새 이미지로 교체, 없는 피드, `?tab=` 쿼리 처리(없음/이상한 값/`feed`/`rank`), 새로고침 유지, 뒤로가기, 작성 후 `?tab=feed` 이동과 새 피드 표시를 확인. 테스트 피드는 `DELETE`로, 업로드된 테스트 이미지 파일은 직접 삭제해 정리.

**흔한 실수 (직접 겪음) — 폼 3번 + 탭 2번의 시도:**
- **폼 1차:** `challenge_id`를 아예 빼먹음(작성이 400이 될 상태), `response` 미사용으로 빌드 에러(`TS6133`), TODO 주석 잔여.
- **폼 2차:** `challenge_id`를 모든 모드에 보내서 수정이 400(`should not exist`), `challengeId` 타입(`string | number | null | undefined`) 때문에 `TS2769`. dev 서버(Vite)는 타입 검사를 안 해서 브라우저에서는 타입 에러가 안 보였다.
- **폼 3차:** 작성 모드에서만 `challenge_id`를 붙이고 `id`를 검사해 좁힘 → 모든 시나리오 통과.
- **탭 1차:** `useState`를 그대로 두고 `useSearchParams`를 덧붙이며, 렌더링 중에 `setSearchParams`를 호출하고 검증이 없었다(원본이 둘이라 어긋남).
- **탭 2차:** 쿼리에서 읽어 검증한 파생 값 + `setTab`이 쿼리만 바꾸도록 정리 → 통과.

**남겨둔 것:** ① 서버가 "새 이미지를 보내면 전체 교체, 안 보내면 유지"만 지원해서 기존 이미지만 지우는 UI는 불가(백엔드 수정 필요). ② 피드 목록은 "사진 N장" 텍스트만 표시하고 이미지는 폼의 미리보기와 수정 화면의 기존 이미지 표시에만 쓴다. ③ 남의 피드 수정(403)은 계정이 하나뿐이라 확인하지 못했다(서버 코드는 챌린지와 같은 방식). ④ 수정·작성 화면의 "내 글이 아니면 버튼 숨김"은 Phase 5에서 `GET /user/me`와 함께. 다음은 Phase 4 — 참가/포기 버튼과 기록 추가(뮤테이션).

---

## 23단계: 참가/포기 버튼 — 첫 뮤테이션(클릭 시 요청)과 서버가 주는 초기 상태

**실습 파일:** `src/components/ParticipationActions.tsx`(신규), `src/pages/ChallengeDetailPage.tsx`(상세 탭에 버튼 배치), `src/types/challenge.ts`(`my_status`). 백엔드(`challenge-api`)는 `GET /challenge/:id` 응답에 `my_status`를 추가했다.

**배경:** Phase 4의 첫 항목. 버튼이 "참가하기"인지 "포기하기"인지 알려면 내 참가 상태가 필요한데, `GET .../rank/me`는 `{ myRank }`만 주고(status 없음) 미참가를 403 에러로 알려준다. 그래서 상세 응답에 `my_status`(null: 미참가, 0: 진행 중, 1: 완료, 2: 포기)를 얹는 쪽으로 정했다(직접 낸 아이디어).

**배운 개념:**

**1) 뮤테이션은 마운트가 아니라 클릭이 트리거다 — `useFetch`를 쓰지 않는다**
`useFetch`는 "화면이 열릴 때 조회"용이다. 클릭 시 요청은 컴포넌트 안에서 `submitting`/`error` state와 `try/catch/finally`로 직접 관리한다. `finally`에서 `submitting`을 끄는 이유는 `useFetch`의 `finally`와 같다. `submitting` 중 버튼을 `disabled`로 두어 중복 요청을 막는다.

**2) 서버가 준 값은 초기값으로만 쓰고, 이후에는 응답으로 갱신한다**
```ts
const [status, setStatus] = useState<number | null>(initialStatus);
const response = await apiFetch<Participation>(path, { method, token });
setStatus(response.status);
```
`POST`/`giveup` 응답에 갱신된 `status`가 있어서 재조회(`refetch`) 없이 화면을 바꾼다. 초기값은 첫 렌더에서만 반영되므로 `key={challenge.id}`로 챌린지가 바뀌면 새로 마운트시킨다(21단계 `ChallengeForm`과 같은 이유).

**3) `giveup`은 토글이다 — 라벨은 화면 상태에서 계산한다**
`GET .../giveup`이 0 ↔ 2를 오간다(완료 1이면 409). "포기하기"/"다시 참여하기"는 같은 요청이고 라벨만 다르다. 미참가는 `null`이라 `POST`, 그 외는 `giveup`으로 분기한다.

**4) 미참가를 에러가 아니라 값(`null`)으로 표현한다**
403으로 미참가를 알리면 프론트가 에러 문자열이나 status 코드로 상태를 추측해야 한다(`useFetch`는 에러를 문자열만 돌려준다). 화면이 필요로 하는 정보를 응답에 얹으면 그 문제가 사라진다.

**실습 내용:** `handleClick`을 `TODO(human)`으로 작성 — 경로/메서드 분기, `submitting`·`error` 초기화, 응답 `status`로 `setStatus`, `ApiError` 메시지 표시, `finally`에서 해제. 백엔드는 `ResponseChallengeDetailDto`(상속), `ChallengeModule`에 `Participation` 리포지토리 등록(모듈 순환 회피). Playwright로 16개 시나리오 통과: 미참가 라벨, 참가 후 상태 변화와 `POST` 1건, 새로고침 유지(0/2), `giveup` 토글, 요청 중 비활성화, 409 에러 표시와 라벨 유지, 다음 성공 시 에러 제거, 다른 챌린지 상태 누수 없음, 완료 상태(응답 모킹). 테스트 챌린지는 `DELETE`로 정리(참가 기록은 삭제 API가 없어 남음).

**흔한 실수:** 이번에는 빌드·린트·시나리오 모두 1차에 통과했다. 다만 뼈대에 넣어둔 `TODO(human)` 안내 주석은 커밋 전에 지워야 한다.

**남겨둔 것:** ① 컴포넌트가 사라진 뒤 도착한 응답으로 `setState`가 실행될 수 있다(취소 처리 안 함). ② 뮤테이션 골격(`submitting`/`error`/`finally`)이 기록 추가 모달에서 반복되면 `useMutation` 훅으로 추출할지 판단한다. ③ 참가/포기 후 랭킹 탭의 내 순위 등 다른 화면과의 동기화는 하지 않는다(탭 전환 시 다시 조회). 다음은 기록 추가 모달(`PATCH`, 증분 입력).

---

## 24단계: 기록 추가 모달 — 네이티브 `<dialog>`와 `useRef`, 증분 입력

**실습 파일:** `src/components/RecordAddModal.tsx`(신규), `src/components/ParticipationActions.tsx`(모달 연결, `type` prop), `src/pages/ChallengeDetailPage.tsx`(`type` 전달).

**배경:** Phase 4의 마지막 항목. `PATCH /participation/challenge/:id`의 `score`/`challenge_count`는 총점이 아니라 **현재 값에 더할 값**(서버가 SQL `increment`)이라서 "오늘 +N 추가" 입력으로 만들었다. 유형이 0이면 `score`, 아니면 `challenge_count`만 보낸다. 0 이상만 허용되고 뺄 수는 없다. 목표(`mininum_count`)를 채우면 서버가 `status`를 1로 바꿔 응답한다.

**배운 개념:**

**1) 네이티브 `<dialog>`는 `useRef`로 DOM을 직접 부른다**
```ts
const dialogRef = useRef<HTMLDialogElement>(null);
dialogRef.current?.showModal(); // 열기 — 배경 차단·Esc 닫기·포커스 가둠은 브라우저가 처리
dialogRef.current?.close();
```
열림 상태를 `useState`로 들지 않고 브라우저에 맡긴다. React의 선언형 흐름에서 벗어나 DOM 메서드를 직접 부르는 첫 사례.

**2) 닫히는 경로가 여럿이면 정리는 `close` 이벤트 한 곳에서 한다**
Esc, 취소 버튼, `close()` 호출 모두 `dialog`가 `close` 이벤트를 낸다. `<dialog onClose={handleClosed}>`에서 입력값·에러를 비우면 Esc로 닫았을 때 값이 남는 버그를 피한다.

**3) 성공 결과는 콜백으로 부모에 올린다**
`onRecorded(response)`로 갱신된 `status`를 `ParticipationActions`에 넘기면, 목표를 채워 1(완료)이 되는 순간 화면이 완료 안내로 바뀐다. 모달이 참가 상태를 직접 들지 않는다. 진행 중(0)일 때만 모달을 렌더링한다(포기 상태는 서버가 409).

**4) 브라우저 기본 폼 검증이 `onSubmit`보다 먼저다**
`<input type="number" min={1} step={1}>`이면 `1.5`, `0`, `-2`는 브라우저가 제출 자체를 막아서 `handleSubmit`이 호출되지 않는다(메시지는 브라우저 기본 안내). 그래서 코드의 `!Number.isInteger(n) || n < 1` 검사는 화면 조작으로는 닿기 어려운 이중 방어다. 안내 문구를 직접 통제하려면 `<form noValidate>`를 쓴다. 서버 검증(`@Min(0)`)이 최종 방어선이다.

**5) 검증 조건은 "허용 조건"을 먼저 적고 부정한다**
거절 조건을 `A || B`로 적으면 부정 하나를 빠뜨렸을 때 정상 입력이 전부 막힌다(아래 실수).

**실습 내용:** `handleSubmit`을 `TODO(human)`으로 작성 — 입력값을 숫자로 바꿔 1 이상의 정수 검사, 유형별 본문 분기, `PATCH` 후 `onRecorded`와 `close()`, 실패 시 `ApiError` 메시지, `finally`에서 `submitting` 해제. Playwright로 모달 열림, 유효 입력의 `PATCH` 본문과 닫힘, 잘못된 입력(`1.5`/`0`/`-2`)이 요청 없이 막힘, Esc 후 초기화, 409 표시와 모달 유지, 처리 중 비활성화, 3+2=5로 목표 달성 시 완료 전환과 서버 누적값(`score=5`, `status=1`), 횟수형 본문, 포기 상태에서 버튼 숨김을 확인. 완료 상태와 409 응답은 모킹.

**흔한 실수 (직접 겪음) — 2번의 시도:**
- **1차 시도:** 검증을 `Number.isInteger(n) || n < 1`로 적어 정상 입력(`3`)이 전부 거절됐다(`!` 누락). 빌드·린트·타입은 통과했고 브라우저에서 PATCH가 나가지 않는 것으로 발견했다.
- **2차 수정:** `!Number.isInteger(n) || n < 1`로 고쳐 통과. 이어서 잘못된 입력 3건의 "커스텀 에러 표시" 기대가 틀렸다는 것도 확인(위 4번).

**남겨둔 것:** ① 참가/포기(`handleClick`)와 기록 추가(`handleSubmit`)가 `submitting`/`error`/`try·catch·finally` 골격을 반복한다 — `useMutation` 훅으로 뽑을지 판단할 시점. ② 컴포넌트가 사라진 뒤 도착한 응답의 `setState`는 막지 않는다. ③ 기록 추가 성공 시 화면에 새 총점 표시나 완료 외의 피드백이 없다(랭킹 탭은 탭 전환 시 다시 조회). ④ 참가/포기 응답과 기록 추가 응답에 `score`/`challenge_count`가 있지만 상세 화면에서 내 기록으로 보여주지 않는다. 다음은 Phase 5 — `/feeds/:feedId` 상세·삭제와 챌린지 삭제, 내 글일 때만 수정·삭제 버튼 노출(`GET /user/me`).
