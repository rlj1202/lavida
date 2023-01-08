import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Submission } from 'src/submissions/entities/submission.entity';

@Entity('problem')
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  author: User;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
