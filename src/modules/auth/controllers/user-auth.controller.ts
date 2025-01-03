import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserFromGoogleTokenUsecase } from 'src/@core/application/usecase/auth/create-user-from-gtoken/usecase';
import { User as UserEntity } from 'src/@core/domain/user';
import { Token, User } from 'src/main/decorators';
import { AuthGuard, Public } from 'src/main/guards';

@Controller('auth/user')
@UseGuards(AuthGuard)
export class UserAuthController {
  constructor(
    private readonly createUserFromGoogleToken: CreateUserFromGoogleTokenUsecase,
  ) {}

  @Get('info')
  async getUserInfo(@User() user: UserEntity) {
    return user.toJSON();
  }

  @Public()
  @Post('register')
  async registerUser(@Token() token: string) {
    const user = await this.createUserFromGoogleToken.execute(token);
    return user.toJSON();
  }
}
