export interface Challenge {
  id: number;
  type: number;
  mininum_count: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
  author_id: number | null;
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
