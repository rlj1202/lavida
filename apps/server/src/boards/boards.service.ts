import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
  ) {}

  async findAll(): Promise<Board[]> {
    const boards = await this.boardsRepository.find();

    return boards;
  }

  async findById(id: number): Promise<Board> {
    const board = await this.boardsRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return board;
  }

  async create(dto: CreateBoardDto): Promise<Board> {
    const board = new Board();
    board.title = dto.title;
    board.description = dto.description;

    await this.boardsRepository.save(board);

    return board;
  }

  async update(id: number, dto: UpdateBoardDto) {
    await this.boardsRepository.update(id, {
      ...dto,
    });
  }

  async delete(id: number) {
    await this.boardsRepository.softDelete(id);
  }
}
