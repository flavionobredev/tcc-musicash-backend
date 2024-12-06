import { sign, verify } from 'jsonwebtoken';
import { TokenOptions, TokenService } from 'src/@core/application/service';

type JWTTokenServiceOptions = {
  secret: string;
};

export class JWTTokenService implements TokenService {
  constructor(private readonly options: JWTTokenServiceOptions) {}

  signAsync(
    payload: Record<string, any>,
    options?: TokenOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, this.options.secret, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }
  verifyAsync<T = Record<string, any>>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      verify(token, this.options.secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as T);
      });
    });
  }
}
