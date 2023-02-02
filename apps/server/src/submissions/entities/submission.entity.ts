import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import SubjectClass from 'src/casl/subject-class.decorator';

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  JUDGING = 'JUDGING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  COMPILE_ERROR = 'COMPILE_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
}

@Entity('submission')
@SubjectClass()
export class Submission {
  static readonly modelName = 'Submission';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column()
  problemId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @Column({ default: 0 })
  time: number;

  @Column({ default: 0 })
  memory: number;

  @Column()
  language: string;

  @Column({ type: 'text' })
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
