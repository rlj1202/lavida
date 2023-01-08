import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class UserProblem {
  constructor(userId: number, problemId: number, solved: boolean) {
    this.userId = userId;
    this.problemId = problemId;
    this.solved = solved;
  }

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  problemId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column()
  solved: boolean;
}
