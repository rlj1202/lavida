import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: TreeRepository<Comment>,
  ) {}

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
    comment.parentId = createCommentDto.parentId;

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
