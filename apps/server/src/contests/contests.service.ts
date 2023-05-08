import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@lavida/core/entities/user.entity';
import { Contest } from '@lavida/core/entities/contest.entity';
import { ContestProblem } from '@lavida/core/entities/contest-problem.entity';

import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update.contest.dto';
import { PaginationResponseDto } from '@lavida/server/pagination/pagination-response.dto';
import { ListContestsOptionsDto } from './dto/list-contests-options.dto';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: Repository<Contest>,
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: Repository<ContestProblem>,
  ) {}

  async paginate(
    options: ListContestsOptionsDto,
  ): Promise<PaginationResponseDto<Contest>> {
    const [contests, total] = await this.contestsRepository.findAndCount({
      where: {},
      relations: {
        author: true,
      },
      skip: options.offset,
      take: options.limit,
    });

    return new PaginationResponseDto(contests, total, {
      limit: options.limit,
      offset: options.offset,
    });
  }

  async findAll(): Promise<Contest[]> {
    const contests = await this.contestsRepository.find();

    return contests;
  }

  async findById(id: number): Promise<Contest> {
    const contest = this.contestsRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        author: true,
        contestProblems: {
          problem: true,
        },
      },
    });

    return contest;
  }

  async create(author: User, options: CreateContestDto): Promise<Contest> {
    const contestProblems = options.problemIds.map((problemId, index) => {
      const contestProblem = new ContestProblem();
      contestProblem.problemId = problemId;
      contestProblem.order = index + 1;

      return contestProblem;
    });

    const contest = new Contest();
    contest.title = options.title;
    contest.description = options.description;
    contest.author = author;
    contest.startAt = options.startAt;
    contest.endAt = options.endAt;
    contest.contestProblems = contestProblems;
    // TODO:
    contest.admins = [];
    contest.testers = [];
    contest.participants = [];

    await this.contestsRepository.save(contest);

    return contest;
  }

  async update(id: number, dto: UpdateContestDto) {
    await this.contestsRepository.update(id, dto);
  }

  async delete(id: number) {
    await this.contestsRepository.softDelete(id);
  }

  async getProblems(id: number): Promise<ContestProblem[]> {
    const contestProblems = await this.contestProblemsRepository.find({
      where: {
        contestId: id,
      },
    });

    return contestProblems;
  }

  async addProblems(id: number, problemIds: number[]) {
    const { maxOrder } = (await this.contestProblemsRepository
      .createQueryBuilder('p')
      .select('MAX(p.order)', 'maxOrder')
      .where('p.contestId = :id', { id })
      .getRawOne<{ maxOrder: number }>()) || { maxOrder: 0 };

    const contestProblems = problemIds.map((problemId, index) => {
      const contestProblem = new ContestProblem();
      contestProblem.contestId = id;
      contestProblem.problemId = problemId;
      contestProblem.order = maxOrder + 1 + index;

      return contestProblem;
    });

    await this.contestProblemsRepository.save(contestProblems);
  }

  async removeProblem(contestId: number, problemId: number) {
    await this.contestProblemsRepository.delete({
      contestId,
      problemId,
    });
  }
}
