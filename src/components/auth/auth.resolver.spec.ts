import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'components/users/entities/user.entity';
import * as faker from 'faker';

import { GlobalContext } from 'types/context';
import { MockType } from 'types/testing';
import { COOKIE_NAME } from './auth.const';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: MockType<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useFactory: () => ({
            signIn: jest.fn(),
            signOut: jest.fn(),
            refresh: jest.fn(),
          }),
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthService);
  });

  describe('signIn', () => {
    it('should call auth service, setup cookie and return token', async () => {
      const credentials = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };
      const ctx = { res: { cookie: jest.fn() } };
      const authServiceResponse = {
        token: 'token',
        refreshToken: 'refreshToken',
      };

      authService.signIn.mockResolvedValueOnce(authServiceResponse);

      const result = await authResolver.signIn(
        credentials,
        ctx as unknown as GlobalContext,
      );

      expect(ctx.res.cookie).toHaveBeenCalledWith(
        COOKIE_NAME,
        authServiceResponse.refreshToken,
        { httpOnly: true },
      );
      expect(result).toStrictEqual({ token: authServiceResponse.token });
    });
  });

  describe('signOut', () => {
    it('should call auth service and return boolean', async () => {
      const ctx = { res: { clearCookie: jest.fn() } };
      const user = {} as User;
      const authServiceResponse = false;

      authService.signOut.mockResolvedValueOnce(authServiceResponse);

      const result = await authResolver.signOut(
        ctx as unknown as GlobalContext,
        user,
      );

      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(0);
      expect(result).toBe(authServiceResponse);
    });

    it('should call auth service, clearCokkie and return boolean', async () => {
      const ctx = { res: { clearCookie: jest.fn() } };
      const user = {} as User;
      const authServiceResponse = true;

      authService.signOut.mockResolvedValueOnce(authServiceResponse);

      const result = await authResolver.signOut(
        ctx as unknown as GlobalContext,
        user,
      );

      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(1);
      expect(result).toBe(authServiceResponse);
    });
  });

  describe('refresh', () => {
    it('should call auth service and return token payload', () => {
      const user = {} as User;
      const authServiceResponse = { token: 'token' };

      authService.refresh.mockReturnValueOnce(authServiceResponse);

      const result = authResolver.refresh(user);

      expect(result).toStrictEqual(authServiceResponse);
    });
  });
});
