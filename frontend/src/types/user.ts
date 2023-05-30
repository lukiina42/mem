import { Mem } from "./mem";

export interface User {
  username: string;
  email: string;
  id: number;
  mems: Mem[];
  heartedMems?: Mem[];
  avatarImageUrl?: string;
  isBanned: false;
}
