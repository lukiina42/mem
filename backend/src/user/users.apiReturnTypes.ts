import { User } from './user.entity';

export interface PotentialFriend extends User {
  commonFollowersAmount: number;
}

