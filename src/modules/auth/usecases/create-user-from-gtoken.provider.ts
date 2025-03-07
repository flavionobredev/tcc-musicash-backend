import { Module, Provider } from '@nestjs/common';
import { CreateUserFromGoogleTokenUsecase } from 'src/@core/application/usecase/auth/create-user-from-gtoken/usecase';

const usecase: Provider = {
  provide: CreateUserFromGoogleTokenUsecase,
  useFactory: (repo, gAuth) =>
    new CreateUserFromGoogleTokenUsecase(repo, gAuth),
  // inject: [UserRepository, FirebaseAuth],
};

@Module({
  providers: [usecase],
  exports: [usecase],
})
export class CreateUserFromGoogleTokenUsecaseModule {}
