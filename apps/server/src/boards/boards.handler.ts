import { Injectable } from '@nestjs/common';

import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/casl/policies.guard';

@Injectable()
export class CreateBoardHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('create', 'Board');
  }
}

@Injectable()
export class UpdateBoardHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('update', 'Board');
  }
}
