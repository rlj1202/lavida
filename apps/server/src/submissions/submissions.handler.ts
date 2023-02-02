import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/casl/policies.guard';

@Injectable()
export class CreateSubmissionHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('create', 'Submission');
  }
}
