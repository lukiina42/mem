import { Comment } from 'src/comment/comment.entity';
import { Mem } from 'src/mem/mem.entity';
import { Notification } from 'src/notifications/notification.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { Role } from './roles/role.enum';

@Entity()
export class User {
  constructor(
    username: string,
    email: string,
    password: string,
    roles: Role[],
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, default: [] })
  roles: string[];

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: '', name: 'avatar_image_key' })
  avatarImageKey: string;

  avatarImageUrl?: string;

  @OneToMany(() => Mem, (mem) => mem.owner)
  mems: Mem[];

  @ManyToMany(() => Mem, (mem) => mem.heartedBy, {
    cascade: ['insert'],
  })
  @JoinTable()
  heartedMems: Mem[];

  @ManyToMany(() => User, (user) => user.followedBy, { cascade: false })
  @JoinTable()
  following: User[];

  @RelationId((user: User) => user.following)
  followingids: number[];

  @ManyToMany(() => User, (user) => user.following)
  followedBy: User[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.notifiedUser)
  notifications: Notification[];
}

