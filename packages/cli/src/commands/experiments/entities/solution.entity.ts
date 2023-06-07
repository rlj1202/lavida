import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Problem } from './Problem.entity';
import { Sourcecode } from './sourcecode.entity';

@Entity()
export class Solution {
  @PrimaryColumn()
  solution_id: number;

  @Column()
  problem_id: number;

  @Column()
  time: number;

  @Column()
  memory: number;

  @Column()
  in_date: Date;

  @Column()
  result: number;

  @Column()
  language: number;

  @OneToOne(() => Sourcecode)
  @JoinColumn({ name: 'solution_id' })
  source: Sourcecode;

  @ManyToOne(() => Problem)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
