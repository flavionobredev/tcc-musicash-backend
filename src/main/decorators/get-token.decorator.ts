import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      Logger.log('Token not found in request. Please check guards', 'Token');
      return null;
    }

    return token;
  },
);
