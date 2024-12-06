import { OAuth2Client } from 'google-auth-library';
import { GoogleOAuth2 } from './oauth2';

describe('GoogleOAuth2 unit tests', () => {
  it('should return auth url', () => {
    jest
      .spyOn(OAuth2Client.prototype, 'generateAuthUrl')
      .mockReturnValue('auth_url');
    const sut = new GoogleOAuth2();
    const result = sut.getAuthUrl();
    expect(result).toBe('auth_url');
  });

  it('should return user data', async () => {
    jest
      .spyOn(OAuth2Client.prototype, 'getToken')
      .mockImplementationOnce(() =>
        Promise.resolve({ tokens: { id_token: 'id_token' } }),
      );
    jest
      .spyOn(OAuth2Client.prototype, 'verifyIdToken')
      .mockImplementationOnce(() => {
        return {
          getPayload: jest.fn().mockReturnValue({
            email: 'email',
            name: 'name',
            picture: 'picture',
          }),
        };
      });
    const sut = new GoogleOAuth2();
    const result = await sut.validateCode('code');
    expect(result).toEqual({
      email: 'email',
      name: 'name',
      picture: 'picture',
    });
  });

  it('should return null if error', async () => {
    jest
      .spyOn(OAuth2Client.prototype, 'getToken')
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const sut = new GoogleOAuth2();
    // jest.spyOn(sut, 'validateCode').mockRejectedValueOnce(new Error());
    const result = await sut.validateCode('code');
    expect(result).toBeNull();
  });
});
