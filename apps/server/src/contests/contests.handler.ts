import { Injectable } from '@nestjs/common';

import { RequestWithUser } from '@lavida/server/auth/request-with-user.interface';
import { AppAbility } from '@lavida/server/casl/casl-factory.factory';
import { IPolicyHandler } from '@lavida/server/casl/policies.guard';
import { ContestsService } from './contests.service';

@Injectable()
export class CreateContestHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('create', 'Contest');
  }
}

@Injectable()
export class UpdateContestHandler implements IPolicyHandler {
  constructor(private readonly contestsService: ContestsService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const contest = await this.contestsService.findById(id);

    return ability.can('update', contest);
  }
}

@Injectable()
export class DeleteContestHandler implements IPolicyHandler {
  constructor(private readonly contestsService: ContestsService) {}

  async handle(
    ability: AppAbility,
    request: RequestWithUser,
  ): Promise<boolean> {
    const id = parseInt(request.params['id'], 10);
    const contest = await this.contestsService.findById(id);

    return ability.can('delete', contest);
  }
}
