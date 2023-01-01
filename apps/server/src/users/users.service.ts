import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// TODO:
const saltRounds = 10;

@Injectable({})
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user)
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException(
        'A user with this username does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        'A user with this email does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
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
}
