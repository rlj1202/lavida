import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { Action, AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/guards/policies.guard';
import { Submission } from './entities/submission.entity';

@Injectable()
export class CreateSubmissionHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can(Action.Create, Submission);
  }
}
