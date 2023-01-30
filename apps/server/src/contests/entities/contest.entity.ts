import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContestProblem } from './contest-problem.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  /** The one who created this contest. */
  @ManyToOne(() => User)
  author: User;

  @ManyToMany(() => User)
  admins: User[];

  @ManyToMany(() => User)
  testers: User[];

  @ManyToMany(() => User)
  participants: User[];

  @ManyToMany(() => ContestProblem)
  contestProblems: ContestProblem[];

  @CreateDateColumn()
  createdAt: Date;
}
