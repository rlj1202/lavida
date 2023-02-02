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

import { User } from 'src/users/entities/user.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import SubjectClass from 'src/casl/subject-class.decorator';

@Entity('problem')
@SubjectClass()
export class Problem {
  static readonly modelName = 'Problem';

  @PrimaryGeneratedColumn()
  id: number;

  @Index({ fulltext: true, parser: 'ngram' })
  @Column()
  title: string;

  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  author?: User;

  @Column({ nullable: true })
  authorId: number;

  @ManyToMany(() => User)
  testers: User[];

  @Column({ type: 'text' })
  inputDesc: string;

  @Column({ type: 'text' })
  outputDesc: string;

  @Column({ type: 'text', nullable: true })
  hint?: string;

  @Column({ type: 'json', nullable: true })
  samples?: { input: string; output: string }[];

  /** Lagacy field from previous lavida platform */
  @Column({ type: 'text', nullable: true })
  source: string;

  /** In milli seconds */
  @Column()
  timeLimit: number;

  /** In bytes */
  @Column()
  memoryLimit: number;

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @Column()
  submissionCount: number;

  @Column()
  acceptCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
