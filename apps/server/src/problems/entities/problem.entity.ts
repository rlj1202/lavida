import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Entity('problem')
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  inputDesc: string;

  @Column()
  outputDesc: string;

  @Column({ nullable: true })
  hint?: string;

  /** In milli seconds */
  @Column()
  timeLimit: number;

  /** In bytes */
  @Column()
  memoryLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}