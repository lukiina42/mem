import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Mem {
  constructor(content: string, imageKey: string) {
    this.content = content;
    this.imageKey = imageKey;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ unique: true })
  imageKey: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.mems)
  owner: User;
}
