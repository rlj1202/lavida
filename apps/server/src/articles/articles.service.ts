import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@lavida/core/entities/user.entity';
import { Article } from '@lavida/core/entities/article.entity';
import { Board } from '@lavida/core/entities/board.entity';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationResponseDto } from '@lavida/server/pagination/pagination-response.dto';
import { ListArticlesOptionsDto } from './dto/list-articles-options.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
  ) {}

  async paginate(
    options: ListArticlesOptionsDto,
  ): Promise<PaginationResponseDto<Article>> {
    const [articles, total] = await this.articlesRepository.findAndCount({
      where: {
        board: {
          name: options.boardName,
        },
      },
      relations: {
        author: true,
      },
    });

    return new PaginationResponseDto(articles, total, options);
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.articlesRepository.find();

    return articles;
  }

  async findById(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return article;
  }

  async create(author: User, dto: CreateArticleDto): Promise<Article> {
    const board = await this.boardsRepository.findOneOrFail({
      where: {
        name: dto.boardName,
      },
    });

    const article = new Article();
    article.author = author;
    article.title = dto.title;
    article.content = dto.content;
    article.board = board;

    await this.articlesRepository.save(article);

    return article;
  }

  async update(id: number, dto: UpdateArticleDto) {
    await this.articlesRepository.update(id, { ...dto });
  }

  async delete(id: number) {
    await this.articlesRepository.softDelete(id);
  }
}
