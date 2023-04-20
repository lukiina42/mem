export interface Comment {
  id: number;
  parent_id: number;
  content: string;
  created_date: Date;
  answers: Comment[];
}
