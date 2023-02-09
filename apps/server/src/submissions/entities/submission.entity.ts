import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Problem, (problem) => problem.submissions)
  problem: Problem;

  @ApiProperty()
  @Column()
  problemId: number;

  @ManyToOne(() => User, (user) => user.submissions)
  user: User;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column({ default: 0 })
  time: number;

  @ApiProperty()
  @Column({ default: 0 })
  memory: number;

  @ApiProperty()
  @Column()
  language: string;

  @ApiProperty()
  @Column({ type: 'text' })
  code: string;

  @ApiProperty({ enum: SubmissionStatus })
  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED,
  })
  status: SubmissionStatus;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
