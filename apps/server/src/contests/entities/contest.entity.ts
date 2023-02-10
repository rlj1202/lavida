import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  @ApiProperty()
  @ManyToOne(() => User)
  author: User;

  @ApiProperty()
  @Column()
  authorId: number;

  @ApiProperty({ type: User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @ApiProperty({ type: User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  testers: User[];

  @ApiProperty({ type: User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @ApiProperty({ type: ContestProblem, isArray: true })
  @OneToMany(() => ContestProblem, (contestProblem) => contestProblem.contest, {
    cascade: true,
  })
  contestProblems: ContestProblem[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
