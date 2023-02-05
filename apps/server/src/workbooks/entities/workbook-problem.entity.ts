import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Problem } from 'src/problems/entities/problem.entity';
import { Workbook } from './workbook.entity';

@Entity()
@Unique(['workbookId', 'order'])
export class WorkbookProblem {
  @ApiProperty()
  @PrimaryColumn()
  workbookId: number;

  @ApiProperty()
  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Workbook)
  workbook: Workbook;

  @ManyToOne(() => Problem)
  problem: Problem;

  @ApiProperty()
  @Column()
  order: number;
}
