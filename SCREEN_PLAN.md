# 화면 구성 계획

> 작성일: 2026-09-15
> `challenge-api` 백엔드(별도 repo)와 통신할 프론트엔드의 화면/라우트 구조. 시각적 디자인(Figma/목업)은 범위 밖 — 기능 단위 화면 구조만 정리.

## 전제 (백엔드 제약사항)

- **모든 도메인 API가 인증 필요**: `challenge`/`participation`/`feed`가 클래스 단위 `JwtAuthGuard`라 조회(GET)까지 포함해 전부 로그인 필요. 회원가입/로그인 화면 외에는 비로그인 접근 가능한 화면이 없다.
- **회원정보 수정 API 없음**: `POST /user`(가입), `GET /user/me`(조회), `POST /user/login`뿐. 이메일/비밀번호 변경 화면은 백엔드 추가 전까지 없음.
- **참가 포기가 `GET`**: `GET /participation/challenge/:id/giveup`이 실제로는 상태를 변경하는 mutation. 링크가 아니라 버튼 액션으로 처리해야 함.
- **기록 갱신은 절대값이 아니라 증분(increment)**: `PATCH .../participation/challenge/:id`의 `score`/`challenge_count`는 "현재 값에 더할 값"이다(서비스가 SQL `increment`로 처리). "총점 수정" 폼이 아니라 "오늘 +N 기록 추가" 형태여야 함.
- **피드는 항상 챌린지에 종속**: 전체 피드 목록 API가 없고 `GET /feed/challenge/:challengeId/feeds`뿐이라, 피드는 항상 챌린지 상세 하위 화면.

## 최종 라우트 구조

```
(비로그인) /login, /signup
(로그인 후)
  /mypage                        — 내 정보 + 내 참가 챌린지 목록
  /challenges                    — 리스트
  /challenges/new                — 생성 폼
  /challenges/:id/edit           — 수정 폼 (생성과 폼 공용)
  /challenges/:id                — 상세 (탭: 상세 | 랭킹 | 피드)
                                     상세 탭: 참가/포기 버튼, "+기록 추가"(모달)
  /challenges/:id/feeds/new      — 피드 작성 (피드 탭에서 진입)
  /feeds/:feedId                 — 피드 상세 (피드 탭 리스트에서 진입)
  /feeds/:feedId/edit            — 피드 수정 (작성과 폼 공용)
```

8개 라우트 + 1개 모달("기록 추가").

## 화면 ↔ API 매핑

| 라우트 | 화면 | 연동 API |
|---|---|---|
| `/login` | 로그인 | `POST /user/login` |
| `/signup` | 회원가입 | `POST /user` |
| `/mypage` | 내 정보 + 내 참가 챌린지 목록 | `GET /user/me`, `GET /participation/challenge/mine` |
| `/challenges` | 챌린지 목록(페이지네이션) | `GET /challenge` |
| `/challenges/new` | 챌린지 생성 | `POST /challenge` |
| `/challenges/:id/edit` | 챌린지 수정 (본인 글만) | `PATCH /challenge/:id` |
| `/challenges/:id` (상세 탭) | 챌린지 상세, 참가/포기, 기록 추가 진입점 | `GET/DELETE /challenge/:id`, `POST .../participation/challenge/:id`, `GET .../giveup`, `GET .../rank/me` |
| `/challenges/:id` (랭킹 탭) | 랭킹 목록(상위 100) | `GET .../participation/challenge/:id/rank` |
| `/challenges/:id` (피드 탭) | 챌린지 피드 목록 | `GET /feed/challenge/:id/feeds` |
| (모달, 상세 탭에서 진입) | 기록 추가(증분 입력) | `PATCH /participation/challenge/:id` |
| `/challenges/:id/feeds/new` | 피드 작성(이미지 최대 3장) | `POST /feed` |
| `/feeds/:feedId` | 피드 상세 | `GET/DELETE /feed/:feedId` |
| `/feeds/:feedId/edit` | 피드 수정 | `PATCH /feed/:feedId` |

## 설계 결정 근거

- **생성/수정 폼 공용화**: `CreateChallengeDto`/`UpdateChallengeDto`, `CreateFeedDto`/`UpdateFeedDto`가 사실상 같은 shape라 폼 컴포넌트를 하나로 재사용.
- **상세/랭킹/피드를 탭으로 통합**: API가 어차피 각각 별도 엔드포인트라 탭 전환 시 해당 탭만 필요한 데이터를 lazy fetch하면 됨. 라우트 수를 줄이고 "챌린지 하나에 대한 화면"이라는 개념을 명확히 함.
- **기록 추가만 모달, 나머지는 페이지**: 필드가 많고 이미지 업로드가 있는 화면(챌린지/피드 생성·수정)은 페이지로 유지하고, 숫자 하나만 입력하는 짧은 액션(기록 추가)만 모달로 처리 — 화면 전환 비용 대비 입력 복잡도 기준으로 구분.
- **피드 상세/수정은 탭 밖 별도 페이지**: 이미지·삭제 등 정보량이 많아 탭 안에 넣기엔 부적합.

## 진행 체크리스트 (쉬운 순)

> 진행 방식: 매 항목마다 (설계 갈림길 있으면 질문) → 스캐폴딩 + `TODO(human)` → `npm run build`/`npm run lint` 검증 → `LEARNING.md`에 기록. 자세한 배경은 대화 기록 참고.

### Phase 0 — 기반 (모든 화면의 전제조건)
- [x] 라우터 설치 — `react-router` (결정 완료)
- [x] API 클라이언트 공통 모듈 — fetch 래퍼 직접 작성 (결정 완료), base URL은 `challenge-api` 접속 정보 확정 전까지 환경변수 placeholder
- [x] JWT 저장/요청 부착 방식 — Context API로 인증 상태 관리 (신규 개념)
- [x] 공용 레이아웃(헤더) + 인증 가드 — 레이아웃 라우트(`AppLayout`)에서 미로그인 시 `/login` 리다이렉트 (Phase 2 도중 추가)

### Phase 1 — 인증 (폼만 있으면 됨, 의존성 최소)
- [x] `/signup` — `POST /user`
- [x] `/login` — `POST /user/login`, 성공 시 토큰 저장

### Phase 2 — 읽기 전용 화면 (GET만, 상태 단순)
- [x] `/mypage` — `GET /user/me`, `GET participation/mine`
- [x] `/challenges` 목록 — `GET /challenge` (페이지네이션)
- [x] `/challenges/:id` 상세 탭 (읽기만) — `GET /challenge/:id`
- [x] `/challenges/:id` 랭킹 탭 — `GET .../rank`
- [x] `/challenges/:id` 피드 탭 — `GET /feed/challenge/:id/feeds`

### Phase 3 — 쓰기 폼 (공용 컴포넌트)
- [x] 챌린지 생성/수정 공용 폼 — `/challenges/new`, `/challenges/:id/edit`
- [x] 피드 작성/수정 공용 폼 — `/challenges/:id/feeds/new`, `/feeds/:feedId/edit` (이미지 최대 3장이라 폼 중 제일 복잡)

### Phase 4 — 액션 (버튼 기반 mutation)
- [x] 참가/포기 버튼 — `POST participation`, `GET .../giveup` (`GET /challenge/:id`의 `my_status`로 초기 상태 판단)
- [x] 기록 추가 모달 — `PATCH participation` (증분 입력, 네이티브 `<dialog>`)

### Phase 5 — 상세/삭제 마무리
- [ ] `/feeds/:feedId` — `GET/DELETE`
- [x] 챌린지 삭제 — `DELETE /challenge/:id` (본인 글만, 확인 `<dialog>` 후 목록으로 `replace` 이동)

### 보완 과제 (Phase 2 진행 중 발견)
- [x] `useFetch` 훅 추출 — 목록/상세/랭킹 탭/마이페이지 2조각(5곳)에서 반복되는 fetch 골격(`loading` 시작, `error` 초기화, `cancelled` 가드, `finally`)을 한 곳으로. 훅 추출 완료, 피드 탭에서 처음부터 이 훅으로 구현
- [x] 401 공통 처리 — 만료·무효 토큰일 때 `apiFetch`에서 401을 감지해 로그아웃 + `/login` 이동(콜백 등록 방식으로 구현) (현재 가드는 토큰 "존재"만 확인하고 "유효"는 확인 안 함 → 보호 화면에 `Unauthorized`만 표시됨)
- [x] 로그인 성공 이동에 `replace` 적용 — `LoginPage`의 `navigate("/challenges")` → `{ replace: true }` (지금은 로그인 후 뒤로가기 시 로그인 화면이 다시 보임. `QNA.md` 참고)
- [ ] `AuthProvider`의 `logout`을 `useCallback`으로 감싸고 `useEffect` 의존성을 `[logout]`으로 정리 — 지금은 `[token]`이라 동작은 맞지만 `react-hooks/exhaustive-deps` 경고가 남는다(`logout`이 다른 값을 참조하게 바뀌면 옛 값을 쓰는 stale closure 위험). `useCallback`을 배운 뒤 처리
- [x] 상세 화면에 "수정" 버튼 — 내 글일 때만 노출(챌린지 완료, 피드 상세는 Phase 5 `/feeds/:feedId`에서). `GET /user/me`로 내 `id`를 받아 `challenge.author_id`와 비교해야 해서 Phase 5(삭제 버튼)와 함께 처리. 지금은 `/challenges/:id/edit`를 주소창으로만 접근 가능(남의 글은 서버가 403)
- [ ] 피드 상세 화면에서 이미지 표시·이미지 삭제 — 서버가 "새 이미지를 보내면 전체 교체, 안 보내면 유지"만 지원해서 기존 이미지만 지우는 UI는 불가(백엔드 수정 필요). 피드 목록은 지금 "사진 N장" 텍스트만 표시

### 추가 과제 (Phase 4·5 진행 중 발견, 2026-09-21 정리)

> 위 체크리스트에 없던 것들. 우선순위는 위에서부터.

**다음 작업 (이어서 할 것)**
- [ ] `useMutation` 훅 추출 — `submitting`/`error`/`try·catch·finally` 골격이 `ParticipationActions`, `RecordAddModal`, `ChallengeOwnerActions` 세 곳에서 반복된다. 피드 삭제(Phase 5 `/feeds/:feedId`)에서 네 번째로 쓰기 전에 뽑는 것을 추천. 뽑을 때 결정할 것: 반환 형태(`run(fn)` 래퍼 vs `{ mutate, submitting, error }`), 성공 여부를 어떻게 알릴지(`boolean` 반환 vs 콜백), 검증 실패를 훅 밖에서 처리할지. 세 곳을 모두 교체하고 이전 시나리오(참가/포기 16개, 기록 추가, 삭제 12개)를 다시 돌려 회귀 확인.
- [ ] `/feeds/:feedId` 피드 상세·삭제 — 피드 응답에 `user_id`가 이미 있어서(백엔드 수정 불필요) `useMe()`의 `me.id`와 비교해 "내 글일 때만 수정·삭제 버튼"을 만들 수 있다. `ChallengeOwnerActions`와 같은 구조라 공용화 가능성도 검토(작성자 id를 prop으로 받는 `OwnerActions`). 삭제 성공 후 이동 위치는 `/challenges/:id?tab=feed`(피드의 `challenge_id` 필요 — 응답에 있는지 확인).

**개선 (동작에는 문제 없음)**
- [ ] `type`(0/1) 라벨 상수화 — 챌린지 유형 라벨이 폼(점수형/횟수형), 랭킹 탭("점"/"회"), 기록 추가 모달(점수/횟수·점/회), 상세 화면(숫자 그대로)에 흩어져 있다. `STATUS_LABELS`처럼 `types/challenge.ts`에 상수로 모으기(21단계 남겨둔 것 ④).
- [ ] 기록 추가 후 내 기록 표시 — `PATCH`·`POST`·`giveup` 응답에 `score`/`challenge_count`가 있는데 상세 화면에서 "내 기록"으로 보여주지 않아 사용자가 성공 여부를 알 수 없다(완료 시에만 화면이 바뀜). `ParticipationActions`에 `participation` state를 두는 방향(24단계 남겨둔 것 ③④).
- [ ] 상세 화면의 유형·최소 횟수 표시 — 지금 `유형`이 숫자 그대로 나온다(위 라벨 상수화와 함께).
- [ ] 참가/포기·기록 추가·삭제 후 랭킹 탭 등 다른 탭 데이터 동기화 — 탭 전환 시 다시 조회하는 것에 의존한다. `refetch`가 필요해지면 `useFetch`에 재요청 수단 추가(18단계 남겨둔 것 ③).

**알려진 한계 (필요해지면 처리)**
- [ ] `useFetch`가 `path` 변경 시 이전 `data`를 유지 — `UserProvider`는 `loading`으로 가려 두었지만, 토큰이 생긴 직후 한 번의 렌더 동안 `loading=false`이면서 이전 `data`가 남을 수 있다(`loading` 초기값이 마운트 때만 정해짐). 근본 해결은 `path`가 바뀔 때 `data`를 비우는 것인데, `MyParticipationSection`에서 에러 후 재시도 버튼이 사라지는 회귀(18단계)가 있었으므로 `data` 유지 여부를 호출자가 고를 수 있게 하는 방안까지 함께 검토.
- [ ] 컴포넌트가 사라진 뒤 도착한 뮤테이션 응답의 `setState`/`navigate` — `ParticipationActions`, `RecordAddModal`, `ChallengeOwnerActions`, 챌린지·피드 폼 제출 모두 취소 처리를 하지 않는다(21·22·23·24단계 남겨둔 것). `useMutation`으로 뽑을 때 `AbortController` 또는 마운트 여부 가드를 함께 넣을지 결정.
- [ ] 삭제 확인 `<dialog>`의 배경 클릭 닫기 — 네이티브 `<dialog>`는 기본 지원하지 않아 직접 처리해야 한다. 기록 추가 모달과 삭제 확인 모달 둘 다 해당(`QNA.md` 2026-09-21 항목).
- [ ] `<form noValidate>` 검토 — 기록 추가 모달의 입력 오류 안내가 지금은 브라우저 기본 문구다. 문구를 직접 통제하려면 `noValidate`를 켜고 코드 검증(`setError`)만 쓴다.
- [ ] 완료(1) 상태에서 기록 추가 불가 — 서버는 완료 뒤에도 `PATCH`를 허용하지만(포기 상태만 409) 화면은 완료 안내만 보여주고 버튼이 없다. 완료 후에도 기록을 더할 수 있어야 하는지는 기획 결정 필요.

**학습 정리 후보 (`QNA.md`에 아직 없음)**
- [ ] Context로 서버 데이터를 공유하는 이유와 Provider를 나눈 기준(`AuthProvider`/`UserProvider`, 순환 의존 회피)
- [ ] `null`/`undefined`끼리의 `===` 함정과 권한 판단은 "값이 있을 때만 비교" 원칙
- [ ] 뮤테이션 상태 관리를 컴포넌트 안에서 할지 훅으로 뽑을지의 기준("반복이 보이면 추출")

**테스트 데이터 메모 (수동 정리 필요)**
- 테스트 계정 `list-test-17975@example.com`에 참가 기록이 계속 쌓인다(참가 삭제 API 없음, 챌린지 삭제 시 `SET NULL`로 남음). 이번 세션에서 약 8건 추가.
- 세션 중 curl 검증으로 만든 임시 계정 `p4-test-*@example.com` 1개와 참가 기록 1건이 DB에 남아 있다(사용자 삭제 API 없음, DB에서 직접 정리).
- Playwright 검증 스크립트는 스크래치패드에만 있고 저장소에는 없다. 회귀 확인이 자주 필요하면 저장소에 `e2e/` 폴더로 옮길지 결정(테스트 러너는 아직 없음, CLAUDE.md 참고).
