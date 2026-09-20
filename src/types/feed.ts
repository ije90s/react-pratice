export interface Feed {
  id: number;
  title: string;
  content: string;
  images?: string[] | null;
  user_id: number | null;
  challenge_id: number | null;
}
