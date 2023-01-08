import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProblem } from './user-problem.entity';

@Injectable()
export class UserProblemsService {
  constructor(
    @InjectRepository(UserProblem)
    private userProblemRepository: Repository<UserProblem>,
  ) {}

  async save(
    userId: number,
    problemId: number,
    solved: boolean,
  ): Promise<UserProblem> {
    const userProblem = new UserProblem(userId, problemId, solved);

    await this.userProblemRepository.save(userProblem);

    return userProblem;
  }

  async findByUserId(userId: number): Promise<UserProblem[]> {
    const userProblems = await this.userProblemRepository.find({
      where: {
        userId,
      },
    });

    return userProblems;
  }

  async findByProblemId(problemId: number): Promise<UserProblem[]> {
    const userProblems = await this.userProblemRepository.find({
      where: {
        problemId,
      },
    });

    return userProblems;
  }

  async haveSolved(userId: number, problemId: number): Promise<boolean | null> {
    const userProblem = await this.userProblemRepository.findOneBy({
      userId,
      problemId,
    });

    return userProblem?.solved || null;
  }
}
