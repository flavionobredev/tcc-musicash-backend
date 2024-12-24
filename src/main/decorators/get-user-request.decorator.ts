import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const User = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      Logger.log(
        'User not found in request. Please check guards',
        'UserDecorator',
      );
      return null;
    }

    return field ? user[field] : user;
  },
);
