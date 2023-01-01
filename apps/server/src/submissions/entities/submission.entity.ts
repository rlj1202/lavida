import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  COMPILE_ERROR = 'COMPILE_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

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

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED,
  })
  status: SubmissionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
