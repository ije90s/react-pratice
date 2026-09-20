export interface Feed {
  id: number;
  title: string;
  content: string;
  images?: string[] | null;
  user_id: number | null;
  challenge_id: number | null;
}

// 피드 작성/수정 폼이 넘기는 값. 이미지는 서버가 multipart(`images` 필드, 최대 3장)로 받는다.
export interface FeedInput {
  title: string;
  content: string;
  images: File[];
}
