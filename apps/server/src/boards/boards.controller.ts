import { subject } from '@casl/ability';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { Board } from './entities/board.entity';

import { BoardsService } from './boards.service';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import {
  UseAuthPolicies,
  UsePolicies,
} from 'src/decorators/use-policies.decorator';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOkResponse({ type: Board })
  @Get(':id')
  @UsePolicies([async (ability) => ability.can('read', 'Board'), []])
  async findById(@Param('id') id: number) {
    try {
      const board = await this.boardsService.findById(id);

      return board;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  @ApiOkResponse({ type: Board })
  @Get('name/:name')
  @UsePolicies([async (ability) => ability.can('read', 'Board'), []])
  async findByName(@Param('name') name: string) {
    try {
      const board = await this.boardsService.findByName(name);

      return board;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(Board) } },
  })
  @Get()
  @UsePolicies([async (ability) => ability.can('read', 'Board'), []])
  async findAll() {
    const boards = await this.boardsService.findAll();

    return boards;
  }

  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: Board })
  @Post()
  @UseAuthPolicies([async (ability) => ability.can('create', 'Board'), []])
  async create(@Body() createBoardDto: CreateBoardDto) {
    try {
      const board = await this.boardsService.create(createBoardDto);

      return board;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new InternalServerErrorException('Creation failed', {
          cause: err,
        });
      }

      throw err;
    }
  }

  @ApiBody({ type: UpdateBoardDto })
  @Patch(':id')
  @UseAuthPolicies([
    async (ability, request) => {
      const id = parseInt(request.params['id'], 10);
      return ability.can('update', subject('Board', { id }));
    },
    [],
  ])
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @UseAuthPolicies([
    async (ability, request) => {
      const id = parseInt(request.params['id'], 10);
      return ability.can('delete', subject('Board', { id }));
    },
    [],
  ])
  async delete(@Param('id') id: number) {
    await this.boardsService.delete(id);
  }
}
