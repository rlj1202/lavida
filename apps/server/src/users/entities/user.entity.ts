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

import { AppRawRule } from 'src/casl/casl-factory.factory';
import SubjectClass from 'src/casl/subject-class.decorator';

import { Submission } from 'src/submissions/entities/submission.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity('user')
@SubjectClass()
export class User {
  static readonly modelName = 'User';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  submissionCount: number;

  @Column()
  acceptCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @ManyToOne(() => Role)
  role?: Role;

  @Column({ nullable: true })
  roleId?: number;

  @Column({ type: 'json', nullable: true })
  permissions?: AppRawRule[];
}
