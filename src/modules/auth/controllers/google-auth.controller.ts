import { Controller, Get, Query, Response as Res } from '@nestjs/common';
import { Response } from 'express';
import {
  AppLoginGoogleUsecase,
  GoogleOauth2API,
} from 'src/@core/application/usecase/auth/app-login-google';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuth: GoogleOauth2API,
    private readonly appLoginGoogleUsecase: AppLoginGoogleUsecase,
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    const authUrl = this.googleAuth.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query() query: Record<string, string>, @Res() res: Response) {
    const { code } = query;
    const result = await this.appLoginGoogleUsecase.execute(code);
    res.redirect(
      `${process.env.EXTERNAL_APP_URL}/auth/google/success?access_token=${result.token}&refresh_token=${result.refreshToken}`,
    );
  }
}
