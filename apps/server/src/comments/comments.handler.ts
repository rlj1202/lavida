import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/casl/policies.guard';
import { CommentsService } from './comments.service';

@Injectable()
export class UpdateCommentHandler implements IPolicyHandler {
  constructor(private readonly commentsService: CommentsService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const comment = await this.commentsService.findById(id);

    return ability.can('update', comment);
  }
}

@Injectable()
export class DeleteCommentHandler implements IPolicyHandler {
  constructor(private readonly commentsService: CommentsService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const comment = await this.commentsService.findById(id);

    return ability.can('delete', comment);
  }
}
