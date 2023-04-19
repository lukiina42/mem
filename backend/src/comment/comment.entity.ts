import { Optional } from '@nestjs/common';
import { Mem } from 'src/mem/mem.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  constructor(content: string) {
    this.content = content;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  owner: User;

  @ManyToOne(() => Mem, (mem) => mem.comments)
  @Optional()
  mem: Mem;

  @OneToMany(() => Comment, (comment) => comment.parent)
  answers: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.answers)
  parent: Comment;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
