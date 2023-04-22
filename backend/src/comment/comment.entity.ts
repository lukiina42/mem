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
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment {
  constructor(content: string) {
    this.content = content;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Mem, (mem) => mem.comments)
  @JoinColumn({ name: 'mem_id' })
  mem: Mem;

  @OneToMany(() => Comment, (comment) => comment.parent)
  answers: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.answers)
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
