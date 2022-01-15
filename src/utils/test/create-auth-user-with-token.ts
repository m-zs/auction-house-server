import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import { UsersResolver } from 'components/users/users.resolver';
import { makeRequest } from './make-request';
import { User } from 'components/users/entities/user.entity';

const buildCookiesObject = (cookies: string[]) =>
  cookies.reduce((acc, curr) => {
    const [name, value] = curr.split('=');

    acc[name] = value;

    return acc;
  }, {});

export const generateUser = () =>
  ({
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  } as User);

export const createAuthUserWithToken = async (
  usersResolver: UsersResolver,
  app: INestApplication,
) => {
  const user = generateUser();
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
    id: newUser.id,
    username: user.username,
    cookies: buildCookiesObject(headers['set-cookie']),
  };
};
