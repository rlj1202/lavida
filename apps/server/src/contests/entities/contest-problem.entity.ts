import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { Contest } from './contest.entity';

@Entity()
@Unique(['contestId', 'order'])
export class ContestProblem {
  @PrimaryColumn()
  contestId: number;

  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Contest)
  contest: Contest;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column()
  order: number;
}
