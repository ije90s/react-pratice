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