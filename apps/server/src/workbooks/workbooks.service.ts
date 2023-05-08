import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from '@lavida/core/entities/user.entity';
import { Workbook } from '@lavida/core/entities/workbook.entity';
import { WorkbookProblem } from '@lavida/core/entities/workbook-problem.entity';

import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { UpdateWorkbookDto } from './dto/update-workbook.dto';
import { PaginationResponseDto } from '@lavida/server/pagination/pagination-response.dto';
import { ListWorkbooksOptionsDto } from './dto/list-workbooks-options.dto';

@Injectable()
export class WorkbooksService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Workbook)
    private readonly workbooksRepository: Repository<Workbook>,
    @InjectRepository(WorkbookProblem)
    private readonly workbookProblemsRepository: Repository<WorkbookProblem>,
  ) {}

  async paginate(
    options: ListWorkbooksOptionsDto,
  ): Promise<PaginationResponseDto<Workbook>> {
    const [workbooks, total] = await this.workbooksRepository.findAndCount({
      where: {},
      relations: {
        author: true,
      },
      skip: options.offset,
      take: options.limit,
    });

    return new PaginationResponseDto(workbooks, total, {
      limit: options.limit,
      offset: options.offset,
    });
  }

  async findAll(): Promise<Workbook[]> {
    const workbooks = await this.workbooksRepository.find();

    return workbooks;
  }

  async findById(id: number): Promise<Workbook> {
    const workbook = await this.workbooksRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        workbookProblems: {
          problem: true,
        },
        author: true,
      },
    });

    return workbook;
  }

  async create(
    author: User,
    createWorkbookDto: CreateWorkbookDto,
  ): Promise<Workbook> {
    const workbookProblems = createWorkbookDto.problemIds.map(
      (problemId, index) => {
        const workbookProblem = new WorkbookProblem();
        workbookProblem.problemId = problemId;
        workbookProblem.order = index + 1;

        return workbookProblem;
      },
    );

    const workbook = new Workbook();
    workbook.title = createWorkbookDto.title;
    workbook.description = createWorkbookDto.description;
    workbook.author = author;
    workbook.workbookProblems = workbookProblems;

    await this.workbooksRepository.save(workbook);

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

  async getProblems(id: number): Promise<WorkbookProblem[]> {
    const workbook = await this.workbooksRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        workbookProblems: true,
      },
      select: {
        workbookProblems: true,
      },
    });

    return workbook.workbookProblems;
  }

  async addProblems(workbookId: number, problemIds: number[]) {
    const { maxOrder } = (await this.workbookProblemsRepository
      .createQueryBuilder('p')
      .select('MAX(p.order)', 'maxOrder')
      .where('p.workbookId = :workbookId', { workbookId })
      .getRawOne<{ maxOrder: number }>()) || { maxOrder: 0 };

    const workbookProblems = problemIds.map((problemId, index) => {
      const workbookProblem = new WorkbookProblem();
      workbookProblem.workbookId = workbookId;
      // Should I check the existance of the problem corresponding to the given id?
      workbookProblem.problemId = problemId;
      workbookProblem.order = maxOrder + 1 + index;

      return workbookProblem;
    });

    await this.workbookProblemsRepository.save(workbookProblems);
  }

  async removeProblem(workbookId: number, problemId: number) {
    await this.workbookProblemsRepository.delete({
      workbookId,
      problemId,
    });
  }
}
