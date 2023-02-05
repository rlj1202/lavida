import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class UserProblem {
  constructor(userId: number, problemId: number, solved: boolean) {
    this.userId = userId;
    this.problemId = problemId;
    this.solved = solved;
  }

  @ApiProperty()
  @PrimaryColumn()
  userId: number;

  @ApiProperty()
  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Problem)
  problem: Problem;

  @ApiProperty()
  @Column()
  solved: boolean;
}
