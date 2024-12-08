import { Module, Provider } from '@nestjs/common';
import {
  AppLoginGoogleUsecase,
  GoogleOauth2API,
} from 'src/@core/application/usecase/auth/app-login-google';
import { GoogleOAuth2 } from 'src/@core/infra/api/google';
import { PrismaUserRepository } from 'src/@core/infra/repositories';
import { JWTTokenService } from 'src/@core/infra/services/token.service';
import { DatabaseModule } from 'src/infra/database/database.module';

const usecase: Provider = {
  provide: AppLoginGoogleUsecase,
  useFactory: (repo, gAuth) =>
    new AppLoginGoogleUsecase(
      repo,
      new JWTTokenService({ secret: process.env.APP_JWT_SECRET }),
      gAuth,
    ),
  inject: [PrismaUserRepository, GoogleOauth2API],
};

const googleOauth: Provider = {
  provide: GoogleOauth2API,
  useValue: new GoogleOAuth2({
    clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  }),
};

@Module({
  imports: [DatabaseModule],
  providers: [googleOauth, usecase],
  exports: [googleOauth, usecase],
})
export class AppLoginGoogleUsecaseModule {}
