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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { GetUser } from 'src/auth/user.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

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

  @ApiBearerAuth()
  @ApiBody({ type: CreateCommentDto })
  @ApiOkResponse({ type: Comment })
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

  @ApiBearerAuth()
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(UpdateCommentHandler)
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.update(id, updateCommentDto);
  }

  @ApiOkResponse({ type: Comment })
  @Get(':id')
  async findById(@Param('id') id: number) {
    const comment = await this.commentsService.findById(id);

    return comment;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(DeleteCommentHandler)
  async delete(@Param('id') id: number) {
    await this.commentsService.delete(id);
  }
}
