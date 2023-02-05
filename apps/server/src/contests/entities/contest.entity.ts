import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ContestProblem } from './contest-problem.entity';
import { User } from 'src/users/entities/user.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@SubjectClass()
export class Contest {
  static readonly modelName = 'Contest';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column()
  startAt: Date;

  @ApiProperty()
  @Column()
  endAt: Date;

  /** The one who created this contest. */
  @ManyToOne(() => User)
  author: User;

  @ApiProperty()
  @Column()
  authorId: number;

  @ManyToMany(() => User)
  admins: User[];

  @ManyToMany(() => User)
  testers: User[];

  @ManyToMany(() => User)
  participants: User[];

  @ManyToMany(() => ContestProblem)
  contestProblems: ContestProblem[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
