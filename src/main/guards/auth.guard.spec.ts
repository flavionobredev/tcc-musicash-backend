import { ExecutionContext } from '@nestjs/common';
import {
  InvalidAppTokenException,
  InvalidUserForTokenException,
} from 'src/@core/application/exception';
import { AuthGuard } from './auth.guard';

describe('AuthGuard unit tests', () => {
  const makeContext = (authorization = 'Bearer Token'): ExecutionContext =>
    jest.fn().mockReturnValue({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization },
          user: null,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    })();

  const makeReflector = (isPublic = false) =>
    ({
      getAllAndOverride: jest.fn().mockReturnValue(isPublic),
    }) as any;

  const makeTokenService = (payload = { sub: '1' }) =>
    ({
      verifyAsync: jest.fn().mockResolvedValue(payload),
    }) as any;

  it('should return true if isPublic is true', async () => {
    const guard = new AuthGuard({} as any, makeReflector(true), {} as any);
    expect(await guard.canActivate(makeContext())).toBe(true);
  });

  it('should throw error if token is not provided', async () => {
    const guard = new AuthGuard({} as any, makeReflector(), {} as any);
    await expect(guard.canActivate(makeContext(null))).rejects.toThrow(
      InvalidAppTokenException,
    );
  });

  it('should throw error if token is invalid', async () => {
    const tokenService = {
      verifyAsync: jest.fn().mockRejectedValue(new Error()),
    } as any;
    const guard = new AuthGuard(tokenService, makeReflector(), {} as any);
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      InvalidAppTokenException,
    );
  });

  it('should throw error if user is not found', async () => {
    const userRepository = {
      findById: jest.fn().mockResolvedValue(null),
    } as any;
    const guard = new AuthGuard(
      makeTokenService(),
      makeReflector(),
      userRepository,
    );
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      InvalidUserForTokenException,
    );
  });

  it('should set user in request', async () => {
    const user = { id: '1' };
    const userRepository = {
      findById: jest.fn().mockResolvedValue(user),
    } as any;
    const guard = new AuthGuard(
      makeTokenService(),
      makeReflector(),
      userRepository,
    );
    const context = makeContext();
    const spy = jest.spyOn(context.switchToHttp(), 'getRequest');
    await guard.canActivate(context);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.results[0].value.user).toEqual(user);
  });
});
