import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.mems)
  owner: User;
}
