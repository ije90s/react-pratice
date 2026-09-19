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
