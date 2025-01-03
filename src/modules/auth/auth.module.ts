import { Global, Module } from '@nestjs/common';
import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { CreateUserFromGoogleTokenUsecase } from 'src/@core/application/usecase/auth/create-user-from-gtoken/usecase';
import { UserRepository } from 'src/@core/domain/user';
import { FirebaseModule } from 'src/infra/firebase/firebase.module';
import { UserAuthController } from './controllers/user-auth.controller';

@Global()
@Module({
  imports: [FirebaseModule],
  controllers: [UserAuthController],
  providers: [
    {
      provide: CreateUserFromGoogleTokenUsecase,
      useFactory: (repo, gAuth) =>
        new CreateUserFromGoogleTokenUsecase(repo, gAuth),
      inject: [UserRepository, FirebaseAuth],
    },
  ],
})
export class AuthModule {}
