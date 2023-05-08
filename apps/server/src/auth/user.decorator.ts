import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '@lavida/server/auth/request-with-user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return user;
  },
);
