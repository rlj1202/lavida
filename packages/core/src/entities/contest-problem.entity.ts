import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Problem } from '@lavida/core/entities/problem.entity';
import { Contest } from '@lavida/core/entities/contest.entity';

import SubjectClass from '@lavida/core/decorators/subject-class.decorator';

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
