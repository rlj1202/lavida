import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Workbook } from './entities/workbook.entity';

import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { UpdateWorkbookDto } from './dto/update-workbook.dto';

@Injectable()
export class WorkbooksService {
  constructor(
    @InjectRepository(Workbook)
    private readonly workbooksRepository: Repository<Workbook>,
  ) {}

  async create(
    author: User,
    createWorkbookDto: CreateWorkbookDto,
  ): Promise<Workbook> {
    const workbook = new Workbook();
    workbook.title = createWorkbookDto.title;
    workbook.description = createWorkbookDto.description;
    workbook.author = author;
    // TODO:
    // workbook.workbookProblems;

    await this.workbooksRepository.save(workbook);

    return workbook;
  }

  async findById(id: number): Promise<Workbook> {
    const workbook = await this.workbooksRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return workbook;
  }

  async update(id: number, updateWorkbookDto: UpdateWorkbookDto): Promise<any> {
    await this.workbooksRepository.update(id, {
      ...updateWorkbookDto,
    });
  }

  async delete(id: number) {
    await this.workbooksRepository.softDelete(id);
  }
}
