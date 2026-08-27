# React 학습 기록

Vite + React + TypeScript 프로젝트로 React 핵심 개념을 단계별로 학습한 기록. 각 단계마다 배운 개념과 실습 내용을 정리한다.

## 진행 상황

| # | 단계 | 상태 |
|---|------|------|
| 1 | JSX & 함수 컴포넌트 | ✅ 완료 |
| 2 | Props로 데이터 전달 | ✅ 완료 |
| 3 | State (`useState`) | ✅ 완료 |
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

**실습 내용:** `Profile`에 "좋아요" 버튼을 추가. `useState(0)`으로 `likes` 상태를 만들고, `onClick`으로 `setLikes(likes + 1)`을 호출해 클릭할 때마다 화면의 숫자가 올라가는 걸 확인.
