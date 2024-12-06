import { Module } from '@nestjs/common';
import { GoogleAuthController } from './controllers';
import { AppLoginGoogleUsecaseModule } from './usecases/app-login-google.provider';

@Module({
  imports: [AppLoginGoogleUsecaseModule],
  controllers: [GoogleAuthController],
})
export class AuthModule {}
