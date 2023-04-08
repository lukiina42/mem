export interface User {
  username: string;
  email: string;
  id: string;
}

export interface Mem {
  content: string;
  id: number;
  createdDate: Date;
  updatedDate: Date;
  owner: User;
  imageUrl: string;
  heartedByCurrentUser: boolean;
  heartedBy: User[];
}
