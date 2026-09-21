export interface Challenge {
  id: number;
  type: number;
  mininum_count: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
  author_id: number | null;
  // 상세 조회(GET /challenge/:id)에서만 내려온다. null: 미참가, 0: 진행 중, 1: 완료, 2: 포기
  my_status?: number | null;
}

// 생성(POST)/수정(PATCH) 요청 본문. 날짜는 "YYYY-MM-DD" 문자열로 보낸다.
export interface ChallengeInput {
  type: number;
  mininum_count: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
}
