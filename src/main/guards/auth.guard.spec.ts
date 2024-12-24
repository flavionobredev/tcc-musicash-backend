import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard unit tests', () => {
  const makeContext = (authorization = 'Bearer Token'): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    }) as any;

  it('should return true if isPublic is true', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as any;
    const guard = new AuthGuard({} as any, reflector);
    expect(await guard.canActivate(makeContext())).toBe(true);
  });

  it('should throw error if token is not provided', async () => {
    const guard = new AuthGuard({} as any, {} as any);
    await expect(guard.canActivate(makeContext())).rejects.toThrow();
  });

  it('should throw error if token is invalid', async () => {
    const tokenService = {
      verifyAsync: jest.fn().mockRejectedValue(new Error()),
    } as any;
    const guard = new AuthGuard(tokenService, {} as any);
    await expect(guard.canActivate(makeContext())).rejects.toThrow();
  });
});
