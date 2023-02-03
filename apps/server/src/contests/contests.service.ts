import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { CreateContestDto } from './dto/create-contest.dto';
import { Contest } from './entities/contest.entity';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: Repository<Contest>,
  ) {}

  async create(
    author: User,
    createContestDto: CreateContestDto,
  ): Promise<Contest> {
    const contest = new Contest();
    contest.title = createContestDto.title;
    contest.description = createContestDto.descrption;
    contest.author = author;

    await this.contestsRepository.save(contest);

    return contest;
  }

  async findById(id: number) {
    const contest = this.contestsRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return contest;
  }

  async delete(id: number) {
    await this.contestsRepository.softDelete(id);
  }
}
