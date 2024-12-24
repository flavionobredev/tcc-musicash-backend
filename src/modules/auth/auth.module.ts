import { Global, Module } from '@nestjs/common';
import { TokenService } from 'src/@core/application/service';
import { JWTTokenService } from 'src/@core/infra/services/token.service';
import { GoogleAuthController } from './controllers';
import { AppLoginGoogleUsecaseModule } from './usecases/app-login-google.provider';

@Global()
@Module({
  imports: [AppLoginGoogleUsecaseModule],
  controllers: [GoogleAuthController],
  providers: [
    {
      provide: TokenService,
      useFactory: () =>
        new JWTTokenService({ secret: process.env.APP_JWT_SECRET }),
    },
  ],
  exports: [TokenService],
})
export class AuthModule {}
