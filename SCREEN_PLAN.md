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

### Phase 1 — 인증 (폼만 있으면 됨, 의존성 최소)
- [ ] `/signup` — `POST /user`
- [ ] `/login` — `POST /user/login`, 성공 시 토큰 저장

### Phase 2 — 읽기 전용 화면 (GET만, 상태 단순)
- [ ] `/mypage` — `GET /user/me`, `GET participation/mine`
- [ ] `/challenges` 목록 — `GET /challenge` (페이지네이션)
- [ ] `/challenges/:id` 상세 탭 (읽기만) — `GET /challenge/:id`
- [ ] `/challenges/:id` 랭킹 탭 — `GET .../rank`
- [ ] `/challenges/:id` 피드 탭 — `GET /feed/challenge/:id/feeds`

### Phase 3 — 쓰기 폼 (공용 컴포넌트)
- [ ] 챌린지 생성/수정 공용 폼 — `/challenges/new`, `/challenges/:id/edit`
- [ ] 피드 작성/수정 공용 폼 — `/challenges/:id/feeds/new`, `/feeds/:feedId/edit` (이미지 최대 3장이라 폼 중 제일 복잡)

### Phase 4 — 액션 (버튼 기반 mutation)
- [ ] 참가/포기 버튼 — `POST participation`, `GET .../giveup`
- [ ] 기록 추가 모달 — `PATCH participation` (증분 입력)

### Phase 5 — 상세/삭제 마무리
- [ ] `/feeds/:feedId` — `GET/DELETE`
- [ ] 챌린지 삭제 — `DELETE /challenge/:id` (본인 글만)
