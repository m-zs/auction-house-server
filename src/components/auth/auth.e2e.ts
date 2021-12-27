import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from 'app.module';
import { createAuthUserWithToken, generateUser, makeRequest } from 'utils/test';
import { HashService } from 'utils/hash/hash.service';
import { UsersRepository } from 'components/users/users.repository';
import { UsersResolver } from 'components/users/users.resolver';
import { UsersService } from 'components/users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { COOKIE_NAME } from './auth.const';

describe('', () => {
  let app: INestApplication;

  let usersRepository: UsersRepository;
  let usersResolver: UsersResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
      ],
      providers: [
        UsersRepository,
        UsersResolver,
        AuthService,
        UsersService,
        AuthModule,
        ConfigService,
        HashService,
      ],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersResolver = module.get<UsersResolver>(UsersResolver);

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await usersRepository
      .createQueryBuilder()
      .delete()
      .where('1 = 1')
      .execute();

    await app.close();
  });

  describe('signIn', () => {
    it('should return token when valid credentials are provided', async () => {
      const user = generateUser();
      const newUser = await usersResolver.createUser(user);

      if (!newUser) {
        throw new Error('Auth user missing');
      }

      const {
        body: { data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            signIn(credentials: {
              username: "${user.username}",
              password: "${user.password}"
            }) {
              token
            }
          }
        `,
      });

      expect(data.signIn.token).toBeTruthy();
    });

    it('should return an error when invalid credentials are provided', async () => {
      const {
        body: { errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            signIn(credentials: {
              username: "username",
              password: "password"
            }) {
              token
            }
          }
        `,
      });

      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(errors.length).toBe(1);
    });
  });

  describe('signOut', () => {
    it('should return an error when no token is provided', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            signOut
          }
        `,
      });

      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(errors.length).toBe(1);
      expect(data).toBe(null);
    });

    it('should return true for valid request', async () => {
      const { token } = await createAuthUserWithToken(usersResolver, app);

      const {
        body: {
          data: { signOut },
          errors,
        },
      } = await makeRequest({
        app,
        query: `
          mutation {
            signOut
          }
        `,
        token,
      });

      expect(signOut).toBe(true);
      expect(errors).toBeFalsy();
    });
  });

  describe('refresh', () => {
    it('should return an error when no cookie is provided', async () => {
      const { token } = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { data, errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            refresh {
              token
            }
          }
        `,
        token,
      });

      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(errors.length).toBe(1);
      expect(data).toBe(null);
    });

    it('should return an error when no token is provided', async () => {
      const { cookies } = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { data, errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            refresh {
              token
            }
          }
        `,
        cookies: [`${COOKIE_NAME}=${cookies[COOKIE_NAME]}`],
      });

      expect(errors[0].extensions.response.statusCode).toBe(401);
      expect(errors.length).toBe(1);
      expect(data).toBe(null);
    });

    it('should return token for a valid request', async () => {
      const { cookies, token } = await createAuthUserWithToken(
        usersResolver,
        app,
      );

      const {
        body: { data, errors },
      } = await makeRequest({
        app,
        query: `
          mutation {
            refresh {
              token
            }
          }
        `,
        token,
        cookies: [`${COOKIE_NAME}=${cookies[COOKIE_NAME]}`],
      });

      expect(data.refresh).toBeTruthy();
      expect(errors).toBeFalsy();
    });
  });
});
