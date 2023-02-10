import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Problem } from 'src/problems/entities/problem.entity';
import { Contest } from './contest.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@Unique(['contestId', 'order'])
@SubjectClass()
export class ContestProblem {
  static readonly modelName = 'ContestProblem';

  @ApiProperty()
  @PrimaryColumn()
  contestId: number;

  @ApiProperty()
  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => Contest, (contest) => contest.contestProblems, {
    onDelete: 'CASCADE',
  })
  contest: Contest;

  @ManyToOne(() => Problem)
  problem: Problem;

  @ApiProperty()
  @Column()
  order: number;
}
