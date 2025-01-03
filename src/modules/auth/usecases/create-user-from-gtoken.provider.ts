import { Module, Provider } from '@nestjs/common';
import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { CreateUserFromGoogleTokenUsecase } from 'src/@core/application/usecase/auth/create-user-from-gtoken/usecase';
import { UserRepository } from 'src/@core/domain/user';
import { DatabaseModule } from 'src/infra/database/database.module';

const usecase: Provider = {
  provide: CreateUserFromGoogleTokenUsecase,
  useFactory: (repo, gAuth) =>
    new CreateUserFromGoogleTokenUsecase(repo, gAuth),
  inject: [UserRepository, FirebaseAuth],
};

@Module({
  providers: [usecase],
  exports: [usecase],
})
export class CreateUserFromGoogleTokenUsecaseModule {}
