import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';

import SubjectClass from '@lavida/core/decorators/subject-class.decorator';

@Entity('problem')
@SubjectClass()
export class Problem {
  static readonly modelName = 'Problem';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column()
  title: string;

  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  author?: User;

  @ApiProperty()
  @Column({ nullable: true })
  authorId: number;

  @ManyToMany(() => User)
  testers: User[];

  @ApiProperty()
  @Column({ type: 'text' })
  inputDesc: string;

  @ApiProperty()
  @Column({ type: 'text' })
  outputDesc: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  hint?: string;

  @ApiProperty({
    type: 'array',
    items: {
      properties: { input: { type: 'string' }, output: { type: 'string' } },
    },
  })
  @Column({ type: 'json', nullable: true })
  samples?: { input: string; output: string }[];

  /** Lagacy field from previous lavida platform */
  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  source: string;

  /** In milli seconds */
  @ApiProperty()
  @Column()
  timeLimit: number;

  /** In bytes */
  @ApiProperty()
  @Column()
  memoryLimit: number;

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @ApiProperty()
  @Column()
  submissionCount: number;

  @ApiProperty()
  @Column()
  acceptCount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
