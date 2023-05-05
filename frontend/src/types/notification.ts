import { User } from "./user";

export interface Notification {
  id: number;
  content: string;
  formattedCreatedDate: string;
  notifiedUserId: number;
  trigerredByUserId: number;
  relatesToMemId: number | null;
  trigerredBy: User;
}
