import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EntityNotFoundError } from 'typeorm';

import { GetUser } from 'src/auth/user.decorator';

import {
  UseAuthPolicies,
  UsePolicies,
} from 'src/decorators/use-policies.decorator';

import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';

import { DeleteCommentHandler, UpdateCommentHandler } from './comments.handler';
import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsControler {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBody({ type: CreateCommentDto })
  @ApiOkResponse({ type: Comment })
  @Post()
  @UseAuthPolicies([async (ability) => ability.can('create', 'Comment'), []])
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const comment = await this.commentsService.create(user, createCommentDto);

    return comment;
  }

  @ApiBody({ type: UpdateCommentDto })
  @Patch(':id')
  @UseAuthPolicies(UpdateCommentHandler)
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.update(id, updateCommentDto);
  }

  @ApiOkResponse({ type: Comment })
  @Get(':id')
  @UsePolicies([async (ability) => ability.can('read', 'Comment'), []])
  async findById(@Param('id') id: number) {
    try {
      const comment = await this.commentsService.findById(id);

      return comment;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  @Delete(':id')
  @UseAuthPolicies(DeleteCommentHandler)
  async delete(@Param('id') id: number) {
    await this.commentsService.delete(id);
  }
}
