import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/casl/policies.guard';
import { ArticlesService } from './articles.service';

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
