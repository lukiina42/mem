import { User } from './user.entity';

export type PotentialFriend =
  | (User & {
      commonFollowersPresent: true;
      commonFollowersAmount: number;
    })
  | (User & {
      commonFollowersPresent: false;
      followersAmount: number;
    });

