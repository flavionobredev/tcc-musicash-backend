import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  InvalidAppTokenException,
  InvalidUserForTokenException,
} from 'src/@core/application/exception';
import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { UserRepository } from 'src/@core/domain/user';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository,
    private readonly firebaseAuth: FirebaseAuth,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new InvalidAppTokenException();
    }

    const firebaseUser = await this.firebaseAuth
      .verifyIdToken(token)
      .catch((err) => {
        throw new InvalidAppTokenException(err);
      });

    const user = await this.userRepository.findByEmail(firebaseUser.email);
    if (!user) {
      throw new InvalidUserForTokenException();
    }

    request.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
