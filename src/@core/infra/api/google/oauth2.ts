import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';
import { GoogleOauth2API } from 'src/@core/application/usecase/auth/app-login-google/protocols';

export class GoogleOAuth2 implements GoogleOauth2API {
  private readonly googleAuthClient: OAuth2Client;

  constructor(private readonly credentials?: OAuth2ClientOptions) {
    this.googleAuthClient = new OAuth2Client(credentials);
  }

  public getAuthUrl() {
    return this.googleAuthClient.generateAuthUrl({
      access_type: 'online',
      scope: ['email', 'profile'],
    });
  }

  public async validateCode(gCode: string) {
    try {
      const token = await this.googleAuthClient.getToken(gCode);
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: token.tokens.id_token,
      });

      const payload = ticket.getPayload();

      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (err) {
      return null;
    }
  }
}
