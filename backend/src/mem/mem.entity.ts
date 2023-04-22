import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Mem {
  constructor(content: string, imageKey?: string) {
    this.content = content;
    if (imageKey) {
      this.imageKey = imageKey;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ unique: true, nullable: true })
  imageKey: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(() => User, (user) => user.heartedMems)
  heartedBy: User[];

  @ManyToOne(() => User, (user) => user.mems)
  owner: User;

  @OneToMany(() => Comment, (comment) => comment.mem, {
    cascade: ['remove'],
  })
  comments: Comment[];
}
