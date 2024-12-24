import { Module, Provider } from '@nestjs/common';
import { TokenService } from 'src/@core/application/service';
import {
  AppLoginGoogleUsecase,
  GoogleOauth2API,
} from 'src/@core/application/usecase/auth/app-login-google';
import { UserRepository } from 'src/@core/domain/user';
import { GoogleOAuth2 } from 'src/@core/infra/api/google';
import { DatabaseModule } from 'src/infra/database/database.module';

const usecase: Provider = {
  provide: AppLoginGoogleUsecase,
  useFactory: (repo, tokenService, gAuth) =>
    new AppLoginGoogleUsecase(repo, tokenService, gAuth),
  inject: [UserRepository, TokenService, GoogleOauth2API],
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
