import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'source_code' })
export class Sourcecode {
  @PrimaryColumn()
  solution_id: number;

  @Column()
  source: string;
}
