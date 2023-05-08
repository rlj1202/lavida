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
import { ApiProperty } from '@nestjs/swagger';

import { WorkbookProblem } from '@lavida/core/entities/workbook-problem.entity';
import { User } from '@lavida/core/entities/user.entity';

import SubjectClass from '@lavida/core/decorators/subject-class.decorator';

@Entity()
@SubjectClass()
export class Workbook {
  static readonly modelName = 'Workbook';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column()
  authorId: number;

  /** The one who created this workbook. */
  @ApiProperty()
  @ManyToOne(() => User)
  author: User;

  @ApiProperty({
    type: WorkbookProblem,
    isArray: true,
  })
  @OneToMany(
    () => WorkbookProblem,
    (workbookProblem) => workbookProblem.workbook,
    { cascade: true },
  )
  workbookProblems: WorkbookProblem[];

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
