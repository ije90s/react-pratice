export interface Participation {
  id: number;
  score: number;
  challenge_count: number;
  status: number; // 0: 진행 중, 1: 완료, 2: 포기
  complete_date?: string | null;
}
