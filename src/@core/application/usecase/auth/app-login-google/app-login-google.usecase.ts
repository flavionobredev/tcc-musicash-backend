import { InvalidGoogleTokenException } from 'src/@core/application/exception';
import { TokenService } from 'src/@core/application/service';
import { User, UserRepository } from 'src/@core/domain/user';
import { GoogleOauth2API } from './protocols';

export class AppLoginGoogleUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly googleOa2Verify: GoogleOauth2API,
  ) {}

  async execute(gCode: string) {
    const gUser = await this.googleOa2Verify.validateCode(gCode);
    if (!gUser) throw new InvalidGoogleTokenException();

    const user = new User({
      email: gUser.email,
      name: gUser.name,
      picture: gUser.picture,
    });

    await this.userRepository.upsertByEmail(user);

    const token = await this.tokenService.signAsync(
      {},
      {
        subject: user.id,
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '4h',
      },
    );

    const refreshToken = await this.tokenService.signAsync(
      {},
      {
        subject: user.id,
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '10d',
      },
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  }
}
