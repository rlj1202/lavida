import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { WorkbookProblem } from './workbook-problem.entity';
import { User } from 'src/users/entities/user.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@ApiExtraModels(WorkbookProblem)
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
  @ManyToOne(() => User)
  author: User;

  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(WorkbookProblem) },
  })
  @ManyToMany(() => WorkbookProblem)
  workbookProblems: WorkbookProblem[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
