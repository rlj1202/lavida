import { Injectable } from '@nestjs/common';
import { RequestWithUser } from '@lavida/server/auth/request-with-user.interface';
import { AppAbility } from '@lavida/server/casl/casl-factory.factory';
import { IPolicyHandler } from '@lavida/server/casl/policies.guard';

@Injectable()
export class ReadRoleHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('read', 'Role');
  }
}

@Injectable()
export class CreateRoleHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    _request: RequestWithUser,
  ): Promise<boolean> {
    return ability.can('create', 'Role');
  }
}
