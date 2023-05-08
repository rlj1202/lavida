import { subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { RequestWithUser } from '@lavida/server/auth/request-with-user.interface';
import { AppAbility } from '@lavida/server/casl/casl-factory.factory';
import { IPolicyHandler } from '@lavida/server/casl/policies.guard';

import { ArticlesService } from './articles.service';

import { Article } from '@lavida/core/entities/article.entity';

import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class CreateArticleHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const body = plainToInstance(CreateArticleDto, request.body);
    await validateOrReject(body);

    return ability.can(
      'create',
      subject('Article', <Partial<Article>>{
        board: { name: body.boardName },
      }),
    );
  }
}

@Injectable()
export class UpdateArticleHandler implements IPolicyHandler {
  constructor(private readonly articlesService: ArticlesService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const article = await this.articlesService.findById(id);

    return ability.can('update', article);
  }
}

@Injectable()
export class DeleteArticleHandler implements IPolicyHandler {
  constructor(private readonly articlesService: ArticlesService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const article = await this.articlesService.findById(id);

    return ability.can('delete', article);
  }
}
