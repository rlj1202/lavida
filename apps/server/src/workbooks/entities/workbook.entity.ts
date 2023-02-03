import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WorkbookProblem } from './workbook-problem.entity';
import { User } from 'src/users/entities/user.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@SubjectClass()
export class Workbook {
  static readonly modelName = 'Workbook';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  authorId: number;

  /** The one who created this workbook. */
  @ManyToOne(() => User)
  author: User;

  @ManyToMany(() => WorkbookProblem)
  workbookProblems: WorkbookProblem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
