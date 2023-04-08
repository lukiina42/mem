export interface User {
  username: string;
  email: string;
  id: string;
}

export interface MemBE {
  content: string;
  id: number;
  createdDate: string;
  updatedDate: string;
  owner: User;
  imageUrl: string;
  heartedByCurrentUser: boolean;
  heartedBy: User[];
}

export interface Mem {
  content: string;
  id: number;
  lastUpdated: string;
  owner: User;
  imageUrl: string;
  heartedByCurrentUser: boolean;
  heartedBy: User[];
}
