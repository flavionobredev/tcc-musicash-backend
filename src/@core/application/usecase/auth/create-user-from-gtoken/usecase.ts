import { InvalidGoogleTokenException } from 'src/@core/application/exception';
import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { User, UserRepository } from 'src/@core/domain/user';

export class CreateUserFromGoogleTokenUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly googleOa2Verify: FirebaseAuth,
  ) {}
  async execute(token: string) {
    const gUser = await this.googleOa2Verify.verifyIdToken(token);
    if (!gUser) throw new InvalidGoogleTokenException();

    const user = new User({
      email: gUser.email,
      name: gUser.name,
      picture: gUser.picture,
    });

    await this.userRepository.upsertByEmail(user);

    return user;
  }
}
