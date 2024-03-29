import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@lavida/core/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {
  Submission,
  SubmissionStatus,
} from '@lavida/core/entities/submission.entity';
import { Problem } from '@lavida/core/entities/problem.entity';
import { UserProblemsService } from '@lavida/server/userProblems/user-problems.service';

// TODO:
const saltRounds = 10;

@Injectable({})
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
    private readonly userProblemService: UserProblemsService,
  ) {}

  /** @throws {EntityNotFoundError} */
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { id },
    });

    return user;
  }

  /** @throws {EntityNotFoundError} */
  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { username },
    });

    return user;
  }

  /** @throws {EntityNotFoundError} */
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email },
    });

    return user;
  }

  async checkUsernameUnique(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    return !!user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      username: createUserDto.username,
      passwordHash: await bcrypt.hash(createUserDto.password, saltRounds),
      email: createUserDto.email,
    });

    await this.usersRepository.save(user);

    return user;
  }

  /** @throws {EntityNotFoundError} */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await this.usersRepository.save(user);

    return user;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateStats(userId: number) {
    const submissions = await this.submissionsRepository.find({
      where: {
        userId,
      },
      select: {
        status: true,
      },
    });

    await this.usersRepository.update(userId, {
      submissionCount: submissions.length,
      acceptCount: submissions.filter(
        (submission) => submission.status === SubmissionStatus.ACCEPTED,
      ).length,
    });
  }
}
