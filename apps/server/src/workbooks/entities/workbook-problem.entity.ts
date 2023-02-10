import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Problem } from 'src/problems/entities/problem.entity';
import { Workbook } from './workbook.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@Unique(['workbookId', 'order'])
@SubjectClass()
export class WorkbookProblem {
  static readonly modelName = 'WorkbookProblem';

  @ApiProperty()
  @PrimaryColumn()
  workbookId: number;

  @ApiProperty()
  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Workbook, (workbook) => workbook.workbookProblems, {
    onDelete: 'CASCADE',
  })
  workbook: Workbook;

  @ApiProperty()
  @ManyToOne(() => Problem)
  problem: Problem;

  @ApiProperty()
  @Column()
  order: number;
}
