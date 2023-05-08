import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

import { User } from '@lavida/core/entities/user.entity';
import { Comment } from '@lavida/core/entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationResponseDto } from '@lavida/server/pagination/pagination-response.dto';
import { ListCommentsOptionsDto } from './dto/list-comments-options.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: TreeRepository<Comment>,
  ) {}

  async paginate(
    dto: ListCommentsOptionsDto,
  ): Promise<PaginationResponseDto<Comment>> {
    const [comments, total] = await this.commentsRepository.findAndCount({
      where: {
        articleId: dto.articleId,
      },
      relations: {
        author: true,
      },
      select: {
        author: {
          id: true,
          username: true,
        },
      },
      skip: dto.offset,
      take: dto.limit,
    });

    return new PaginationResponseDto(comments, total, {
      limit: dto.limit,
      offset: dto.offset,
    });
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentsRepository.find();

    return comments;
  }

  async findById(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return comment;
  }

  async create(
    author: User,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.author = author;
    comment.articleId = createCommentDto.articleId;
    comment.content = createCommentDto.content;
    // TODO:
    // comment.parentId = createCommentDto.parentId;

    await this.commentsRepository.save(comment);

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentsRepository.update(id, { ...updateCommentDto });
  }

  async delete(id: number) {
    await this.commentsRepository.softDelete(id);
  }
}
