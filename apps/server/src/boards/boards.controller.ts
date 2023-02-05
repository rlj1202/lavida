import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { CreateBoardHandler, UpdateBoardHandler } from './boards.handler';

import { BoardsService } from './boards.service';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOkResponse({ type: Board })
  @Get(':id')
  async findById(@Param('id') id: number) {
    const board = await this.boardsService.findById(id);

    return board;
  }

  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(Board) } },
  })
  @Get()
  async findAll() {
    const boards = await this.boardsService.findAll();

    return boards;
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: Board })
  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateBoardHandler)
  async create(@Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardsService.create(createBoardDto);

    return board;
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateBoardDto })
  @Patch(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(UpdateBoardHandler)
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.update(id, updateBoardDto);
  }
}
