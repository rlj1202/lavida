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

export type PolicyHandlerTuple<T extends readonly any[] = readonly any[]> = [
  (
    ability: AppAbility,
    request: RequestWithUser,
    ...args: { [P in keyof T]: InstanceType<T[P]> }
  ) => Promise<boolean>,
  T,
];
export type PolicyHandlerTupleItem = <R>(
  cb: <T extends readonly any[]>(i: PolicyHandlerTuple<T>) => Promise<R>,
) => Promise<R>;
export const policyHandlerTupleItem =
  <T extends readonly any[]>(
    i: PolicyHandlerTuple<T>,
  ): PolicyHandlerTupleItem =>
  (cb) =>
    cb(i);

export type PolicyHandler = Type<IPolicyHandler> | PolicyHandlerTuple;

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
      this.reflector.get<PolicyHandler[]>(
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
    handler: PolicyHandler,
    ability: AppAbility,
    request: RequestWithUser,
    moduleRef: ModuleRef,
  ): Promise<boolean> {
    if (handler instanceof Array) {
      const [handlerFunction, dependencies] = handler;

      const instances = dependencies.map((dep) => moduleRef.get(dep));

      return await handlerFunction(ability, request, ...instances);
    } else {
      const handlerInstance = moduleRef.get(handler);

      return await handlerInstance.handle(ability, request);
    }
  }
}
