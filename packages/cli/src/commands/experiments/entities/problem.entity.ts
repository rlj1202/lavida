import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryColumn()
  problem_id: number;

  @Column()
  title: string;

  /** In seconds */
  @Column()
  time_limit: number;

  /** In MBs */
  @Column()
  memory_limit: number;
}
