import * as jwt from 'jsonwebtoken';
import { JWTTokenService } from './token.service';

describe('TokenService unit tests', () => {
  describe('signAsync', () => {
    it('should return a token', async () => {
      const payload = { email: 'teste@teste.com' };
      const options = {
        subject: '123',
        audience: 'musicash.app',
        issuer: 'musicash.app',
        expiresIn: '4h',
      };
      const tokenService = new JWTTokenService({ secret: 'hehe' });
      const token = await tokenService.signAsync(payload, options);
      expect(token).toBeDefined();
    });

    it('should throw an error', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const tokenService = new JWTTokenService({ secret: 'hehe' });
      const token = tokenService.signAsync({ test: 'test' });
      await expect(token).rejects.toThrow();
    });
  });

  describe('verifyAsync', () => {
    it('should return a decoded token', async () => {
      const token = jwt.sign({ email: 'teste@teste.com' }, 'hehe');
      const tokenService = new JWTTokenService({ secret: 'hehe' });
      const decoded = await tokenService.verifyAsync(token);
      expect(decoded).toEqual({
        email: 'teste@teste.com',
        iat: expect.any(Number),
      });
    });

    it('should throw an error', async () => {
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const tokenService = new JWTTokenService({ secret: 'hehe' });
      const decoded = tokenService.verifyAsync('token');
      await expect(decoded).rejects.toThrow();
    });
  });
});
