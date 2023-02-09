import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AppRawRule } from 'src/casl/casl-factory.factory';

import { Submission } from 'src/submissions/entities/submission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserProblem } from 'src/userProblems/user-problem.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity('user')
@SubjectClass()
export class User {
  static readonly modelName = 'User';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @ApiProperty()
  @Column()
  submissionCount: number;

  @ApiProperty()
  @Column()
  acceptCount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(() => UserProblem, (userProblem) => userProblem.user)
  userProblems: UserProblem[];

  @ManyToOne(() => Role)
  role?: Role;

  @ApiProperty()
  @Column({ nullable: true })
  roleId?: number;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  permissions?: AppRawRule[];
}
