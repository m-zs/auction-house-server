import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import { UsersResolver } from 'components/users/users.resolver';
import { makeRequest } from './make-request';
import { User } from 'components/users/entities/user.entity';
import { USER_ROLE } from 'components/users/user.types';

const buildCookiesObject = (cookies: string[]) =>
  cookies.reduce((acc, curr) => {
    const [name, value] = curr.split('=');

    acc[name] = value;

    return acc;
  }, {});

export const generateUser = (user?: Partial<User>): User =>
  ({
    username: user?.username || faker.internet.userName(),
    email: user?.email || faker.internet.email(),
    password: user?.password || faker.internet.password(),
    role: user?.role || USER_ROLE.USER,
  } as User);

export interface AuthUserWithToken {
  token: string;
  user: Partial<User>;
  cookies: Record<string, string>;
}

export const createAuthUserWithToken = async (
  usersResolver: UsersResolver,
  app: INestApplication,
  userData?: Partial<User>,
): Promise<AuthUserWithToken> => {
  const user = generateUser(userData);
  const newUser = await usersResolver.createUser(user);

  if (!newUser) {
    throw new Error('Auth user missing');
  }

  const {
    body: {
      data: {
        signIn: { token },
      },
    },
    headers,
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

  return {
    token,
    user: { ...newUser, ...user },
    cookies: buildCookiesObject(headers['set-cookie']),
  };
};
