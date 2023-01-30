import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';
import { Action, AppAbility } from 'src/casl/casl-factory.factory';
import { IPolicyHandler } from 'src/guards/policies.guard';
import { ContestsService } from './contests.service';
import { Contest } from './entities/contest.entity';

@Injectable()
export class CreateContestHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can(Action.Create, Contest);
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

    return ability.can(Action.Delete, contest);
  }
}
