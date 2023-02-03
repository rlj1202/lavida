import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { GetUser } from 'src/auth/user.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { User } from 'src/users/entities/user.entity';
import { DeleteCommentHandler, UpdateCommentHandler } from './comments.handler';
import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsControler {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const comment = await this.commentsService.create(user, createCommentDto);

    return comment;
  }

  @Patch(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(UpdateCommentHandler)
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.update(id, updateCommentDto);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const comment = await this.commentsService.findById(id);

    return comment;
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(DeleteCommentHandler)
  async delete(@Param('id') id: number) {
    await this.commentsService.delete(id);
  }
}
