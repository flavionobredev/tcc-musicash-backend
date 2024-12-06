import { InvalidGoogleTokenException } from 'src/@core/application/exception';
import { TokenService } from 'src/@core/application/service';
import { UserRepository } from 'src/@core/domain/user';
import { AppLoginGoogleUsecase } from './app-login-google.usecase';
import { GoogleOauth2API } from './protocols';

describe('AppLoginGoogleUsecase unit tests', () => {
  const makeSut = () => {
    const userRepositorySpy: UserRepository = {
      upsertByEmail: jest.fn(),
    } as any;

    const tokenServiceSpy: TokenService = {
      signAsync: jest.fn(),
    } as any;

    const googleOa2VerifySpy: GoogleOauth2API = {
      validateCode: jest.fn(),
      getAuthUrl: jest.fn(),
    };

    const sut = new AppLoginGoogleUsecase(
      userRepositorySpy,
      tokenServiceSpy,
      googleOa2VerifySpy,
    );

    return { sut, userRepositorySpy, tokenServiceSpy, googleOa2VerifySpy };
  };

  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
  });

  it('should throw InvalidGoogleTokenException when google token is invalid', async () => {
    const { sut, googleOa2VerifySpy } = makeSut();
    (googleOa2VerifySpy.validateCode as jest.Mock).mockResolvedValue(null);

    await expect(sut.execute('any_token')).rejects.toThrow(
      InvalidGoogleTokenException,
    );
  });

  it('should throw domain exception when create user with invalid data', async () => {
    const { sut, googleOa2VerifySpy } = makeSut();
    (googleOa2VerifySpy.validateCode as jest.Mock).mockResolvedValue({
      email: 'any_email',
      name: 'any_name',
      picture: 'any_picture',
    });

    await expect(sut.execute('any_token')).rejects.toThrow();
  });

  it('should call upsertByEmail with correct values', async () => {
    const { sut, googleOa2VerifySpy, userRepositorySpy } = makeSut();
    const testUser = {
      email: 'teste@teste.com',
      name: 'any_name',
    };

    (googleOa2VerifySpy.validateCode as jest.Mock).mockResolvedValue(testUser);

    await sut.execute('any_token');

    expect(userRepositorySpy.upsertByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy.upsertByEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: testUser.email,
        name: testUser.name,
        id: expect.any(String),
        picture: undefined,
        createdAt: expect.any(Date),
        updatedAt: undefined,
      }),
    );
  });

  it('should call signAsync with correct values', async () => {
    const { sut, googleOa2VerifySpy, tokenServiceSpy } = makeSut();
    const testUser = {
      email: 'teste@teste.com',
      name: 'any_name',
    };

    (googleOa2VerifySpy.validateCode as jest.Mock).mockResolvedValue(testUser);

    await sut.execute('any_token');

    expect(tokenServiceSpy.signAsync).toHaveBeenCalledTimes(2);
    expect(tokenServiceSpy.signAsync).toHaveBeenCalledWith(
      {},
      {
        subject: expect.any(String),
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '4h',
      },
    );
    expect(tokenServiceSpy.signAsync).toHaveBeenCalledWith(
      {},
      {
        subject: expect.any(String),
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '10d',
      },
    );
  });

  it('should return correct values', async () => {
    const { sut, googleOa2VerifySpy, tokenServiceSpy } = makeSut();
    const testUser = {
      email: 'teste@teste.com',
      name: 'any_name',
    };

    (googleOa2VerifySpy.validateCode as jest.Mock).mockResolvedValue(testUser);
    (tokenServiceSpy.signAsync as jest.Mock).mockResolvedValueOnce('any_token');
    (tokenServiceSpy.signAsync as jest.Mock).mockResolvedValueOnce(
      'any_refresh_token',
    );

    const response = await sut.execute('any_token');

    expect(response).toEqual({
      token: 'any_token',
      refreshToken: 'any_refresh_token',
      user: {
        id: expect.any(String),
        email: testUser.email,
        name: testUser.name,
        picture: undefined,
      },
    });
  });
});
