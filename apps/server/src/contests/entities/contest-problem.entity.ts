import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Problem } from 'src/problems/entities/problem.entity';
import { Contest } from './contest.entity';

@Entity()
@Unique(['contestId', 'order'])
export class ContestProblem {
  @ApiProperty()
  @PrimaryColumn()
  contestId: number;

  @ApiProperty()
  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Contest)
  contest: Contest;

  @ManyToOne(() => Problem)
  problem: Problem;

  @ApiProperty()
  @Column()
  order: number;
}
