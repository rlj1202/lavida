import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('submission')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column()
  problemId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 0 })
  time: number;

  @Column({ default: 0 })
  memory: number;

  @Column()
  language: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;
}
