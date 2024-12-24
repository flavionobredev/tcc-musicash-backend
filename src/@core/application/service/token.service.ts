export type TokenOptions = {
  expiresIn?: string | number;
  issuer?: string;
  audience?: string;
  subject?: string;
};

export type TokenPayload<T> = T & {
  exp: number;
  sub: string;
  iat?: number;
};

export abstract class TokenService {
  abstract signAsync(
    payload: Record<string, any>,
    options?: TokenOptions,
  ): Promise<string>;
  abstract verifyAsync<T = Record<string, any>>(
    token: string,
  ): Promise<TokenPayload<T>>;
}
