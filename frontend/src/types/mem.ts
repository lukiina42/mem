import { User } from './user';

export interface MemDto {
  content: string;
  id: number;
  createdDate: string;
  updatedDate: string;
  owner: User;
  imageUrl: string;
  heartedByCurrentUser: boolean;
  heartedBy: User[];
  lastUpdateDate: string;
}

export interface Mem {
  content: string;
  id: number;
  lastUpdateDate: string;
  owner: User;
  imageUrl: string;
  heartedByCurrentUser: boolean;
  heartedBy: User[];
}
