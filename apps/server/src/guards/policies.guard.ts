import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/auth/request-with-user.interface';

import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-factory.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility, request: RequestWithUser): Promise<boolean>;
}

export type PolicyHandlerCallback = (
  ability: AppAbility,
  request: RequestWithUser,
) => Promise<boolean>;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<Type<PolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException();
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    const results = await Promise.all(
      policyHandlers.map((handler) =>
        this.execPolicyHandler(handler, ability, request, this.moduleRef),
      ),
    );

    const allowed = results.every((value) => value);

    return allowed;
  }

  private async execPolicyHandler(
    handler: Type<PolicyHandler>,
    ability: AppAbility,
    request: RequestWithUser,
    moduleRef: ModuleRef,
  ): Promise<boolean> {
    const handlerInstance = moduleRef.get(handler);

    if (typeof handlerInstance === 'function') {
      return await handlerInstance(ability, request);
    }

    return await handlerInstance.handle(ability, request);
  }
}
