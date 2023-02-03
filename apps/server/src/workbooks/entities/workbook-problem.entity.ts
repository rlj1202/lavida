import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { Workbook } from './workbook.entity';

@Entity()
@Unique(['workbookId', 'order'])
export class WorkbookProblem {
  @PrimaryColumn()
  workbookId: number;

  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Workbook)
  workbook: Workbook;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column()
  order: number;
}
