import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import { UsersResolver } from 'components/users/users.resolver';
import { makeRequest } from './make-request';

export const generateUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

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
  } = await makeRequest(
    app,
    `
      mutation {
        signIn(credentials: {
          username: "${user.username}",
          password: "${user.password}"
        }) {
          token
        }
      }
    `,
  );

  return { token, id: newUser.id, username: user.username };
};
