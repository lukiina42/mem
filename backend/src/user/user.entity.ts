import { Mem } from 'src/mem/mem.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Mem, (mem) => mem.owner)
  mems: Mem[];

  @ManyToMany(() => Mem, (mem) => mem.heartedBy, {
    cascade: ['insert'],
  })
  @JoinTable()
  heartedMems: Mem[];
}
