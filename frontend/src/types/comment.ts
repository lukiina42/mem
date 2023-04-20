export interface Comment {
  id: number;
  parentId: number;
  content: string;
  createdDate: Date;
  ownerUsername: string;
  ownerId: number;
  answers: Comment[];
}
