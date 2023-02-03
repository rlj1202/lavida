import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Article } from './entities/article.entity';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

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
    const article = new Article();
    article.author = author;
    article.title = dto.title;
    article.content = dto.content;

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
