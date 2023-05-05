import { Mem } from 'src/mem/mem.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Notification {
  constructor(content: string) {
    this.content = content;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdDate: Date;

  formattedCreatedDate: string;

  @ManyToOne(() => User, (user) => user.notifications)
  notifiedUser: User;

  @RelationId((notification: Notification) => notification.notifiedUser)
  notifiedUserId: number;

  @ManyToOne(() => User)
  trigerredBy: User;

  @RelationId((notification: Notification) => notification.trigerredBy)
  trigerredByUserId: number;

  @ManyToOne(() => Mem)
  relatesTo: Mem;

  @RelationId((notification: Notification) => notification.relatesTo)
  relatesToMemId: number;
}
